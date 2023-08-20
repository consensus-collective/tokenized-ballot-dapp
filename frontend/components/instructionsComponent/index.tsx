import styles from "../../styles/instructionsComponent.module.css";
import { useAccount, useContractRead, useContractReads } from "wagmi";
import React, { useEffect, useState } from "react";
import { BigNumberish, ethers, formatEther, parseEther } from "ethers";
import { ballotContract, walletClient } from "@/network";
import Ballot from "../../abi/ballot.json";
import Token from "../../abi/token.json";
import { BALLOT_ADDRESS } from "@/network/constant";

interface Proposal {
  index: number;
  name: string;
  voteCount: string;
}

interface Vote {
  voter: string;
  proposalIndex: number;
  proposalName: string;
  amount: string;
  createdAt: string;
}

interface QueryResult {
  result: any;
  status: string;
}

interface Props {
  apiURL: string;
  token: `0x${string}`;
  ballot: `0x${string}`;
  votes: Vote[];
  proposals: Proposal[];
  queryResults?: QueryResult[];
}

export async function vote(proposalId: number, voteAmount: BigNumberish) {
  const [signer] = await walletClient.getAddresses();

  try {
    console.debug(
      `Voting to ${proposalId}, amount: ${formatEther(voteAmount)}`,
    );
    await ballotContract.write.vote([proposalId, voteAmount], {
      account: signer,
    });
  } catch (e) {
    console.log(e);
  }
}

export async function delegateTo(proposalId: number, voteAmount: BigNumberish) {
  const [signer] = await walletClient.getAddresses();

  try {
    console.debug(
      `Voting to ${proposalId}, amount: ${formatEther(voteAmount)}`,
    );
    await ballotContract.write.vote([proposalId, voteAmount], {
      account: signer,
    });
  } catch (e) {
    console.log(e);
  }
}

const DefaultQueryResult: QueryResult[] = [
  { result: "0", status: "" },
  { result: "0", status: "" },
];

export default function InstructionsComponent(props: Props) {
  const { token, ballot } = props;
  const { address } = useAccount();

  const { data } = useContractReads({
    contracts: [
      {
        address: ballot,
        abi: Ballot.abi as any,
        functionName: "votingPower",
        args: [address ?? ethers.ZeroAddress],
      },
      {
        address: token,
        abi: Token.abi as any,
        functionName: "balanceOf",
        args: [address ?? ethers.ZeroAddress],
      },
    ],
  });

  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            Tokenized<span>-Ballot-dapp</span>
          </h1>
          <h3>Group 6 Homework 4</h3>
        </div>
      </header>
      <FetchProposals {...props} queryResults={data as QueryResult[]} />
      <Action {...props} />
      <RecentVotes {...props} />
    </div>
  );
}

function Action(props: Props) {
  const { apiURL } = props;
  const { address, isDisconnected, isConnected, isConnecting } = useAccount();

  const [account, setAccount] = useState<string>("");
  const [loadingMint, setLoadingMint] = useState<boolean>(false);
  const [loadingDelegate, setLoadingDelegate] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(true);
  const [message, setMessage] = useState<string>();
  const [showInput, setShowInput] = useState<boolean>();

  const mint = async () => {
    setLoadingMint(true);

    fetch(`${apiURL}/token/mint/${address}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode === 429) {
          throw new Error(data.message);
        }

        if (data.statusCode === 400) {
          throw new Error(data.message);
        }

        setMessage(data.explorerURL);
        setSuccess(true);
      })
      .catch((err) => {
        setError(true);
        setMessage(err.message);
      })
      .finally(() => setLoadingMint(false));
  };

  const delegate = () => {
    if (!showInput) {
      return setShowInput(!showInput);
    }

    const targetAddress = account ?? address;
    console.log(targetAddress);
    setShowInput(undefined);
    setAccount("");
  };

  const messageStatus = () => {
    if (success) {
      return (
        <a className={styles.explorerurl} href={message}>
          {message}
        </a>
      );
    }

    if (error) {
      return <p className={styles.errormessage}>{message}</p>;
    }

    return <React.Fragment />;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAccount(value);
  };

  if (isDisconnected || isConnecting) return <React.Fragment />;
  return (
    <React.Fragment>
      <div className={styles.action}>
        <div
          onMouseEnter={() => setShowInput(false)}
          onMouseLeave={() => setShowInput(undefined)}
        >
          <button
            style={
              showInput === undefined
                ? {}
                : showInput
                ? { width: "80px" }
                : { width: "280px" }
            }
            className={
              !loadingMint ? styles.actionbutton : styles.actiondisabled
            }
            disabled={loadingMint}
            onClick={mint}
          >
            {loadingMint && "Loading..."}
            {!loadingMint && isConnected && "Mint Token"}
          </button>
        </div>
        <div onMouseEnter={() => setShowInput(true)}>
          <button
            style={
              showInput === undefined
                ? {}
                : showInput
                ? { width: "280px" }
                : { width: "20px" }
            }
            className={
              !loadingDelegate ? styles.actionbutton : styles.actiondisabled
            }
            disabled={loadingDelegate}
            onClick={delegate}
          >
            {loadingDelegate && "Loading..."}
            {!loadingDelegate && isConnected && "Delegate"}
          </button>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        {showInput && (
          <>
            <label>Address: </label>
            <input type="text" value={account} onChange={handleChange} />
          </>
        )}
      </div>
      <div className={styles.message}>{messageStatus()}</div>
    </React.Fragment>
  );
}

function FetchProposals(props: Props) {
  const { proposals, queryResults } = props;

  const { address, isConnected } = useAccount();
  const [voteAmount, setVoteAmount] = useState<string>("");

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setVoteAmount(value);
  };

  const { data } = useContractRead({
    address: BALLOT_ADDRESS,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "votingPower",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "votingPower",
    args: [address],
  });

  const [balance, setBalance] = useState<string>("0");

  const [votingPower, tokenBalance] = queryResults ?? DefaultQueryResult;

  return (
    <div>
      <div className={styles.tableHeader}>
        <h1>Proposal List</h1>
        {isConnected ? (
          <React.Fragment>
            <p>
              Token balance: {ethers.formatUnits(tokenBalance.result ?? "0")}
            </p>
            <p>Voting power: {ethers.formatUnits(votingPower.result ?? "0")}</p>
            <p>Voting Amount: {voteAmount ?? "0"}</p>
            <>
              <input
                type="text"
                value={voteAmount}
                onChange={handleAmountChange}
              />
            </>
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
      </div>
      <table className={styles.proposalTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Votes</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map(({ name, index, voteCount }, idx) => (
            <tr
              key={index}
              style={idx === 0 ? { backgroundColor: "gold" } : {}}
            >
              <td>{name}</td>
              <td>{ethers.formatUnits(voteCount)}</td>
              <td>
                <button
                  className={isConnected ? styles.vote : styles.disabled}
                  onClick={async () => {
                    await vote(index, parseEther(voteAmount));
                  }}
                >
                  Vote
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecentVotes(props: Props) {
  const { apiURL, votes } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [voteData, setVoteData] = useState<Vote[]>(votes);

  const handleRefresh = async () => {
    setLoading(true);
    fetch(`${apiURL}/ballot/vote/latest`)
      .then((res) => res.json())
      .then((data) => setVoteData([...data]))
      .catch(() => [])
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <h3>Recent votes:</h3>
        <button
          className={loading ? styles.disabled : styles.recentvote}
          disabled={loading}
          onClick={handleRefresh}
        >
          {loading ? "Fetching..." : "Refresh"}
        </button>
      </div>
      <table className={styles.proposalTable}>
        <thead>
          <tr>
            <th>Sender</th>
            <th>Proposal</th>
            <th>Amount</th>
            <th>Voted At</th>
          </tr>
        </thead>
        <tbody>
          {voteData.map(
            ({ voter, proposalName, amount, createdAt, proposalIndex }) => (
              <tr key={proposalIndex}>
                <td>{voter}</td>
                <td>{proposalName}</td>
                <td>{ethers.formatUnits(amount)}</td>
                <td>{createdAt}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
