import React, { useState } from "react";
import styles from "../../styles/instructionsComponent.module.css";

import { useAccount, useContractReads } from "wagmi";
import { BigNumberish, ethers, formatEther, parseEther } from "ethers";
import { ballotContract, walletClient } from "@/network";

import Ballot from "../../abi/ballot.json";
import Token from "../../abi/token.json";

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
  onChangeMessage: (msg: string, status: Status) => void;
}

interface MessageProps {
  message: string;
  status: Status;
}

enum Status {
  NONE = "none",
  SUCCESS = "success",
  ERROR = "error",
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

  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<Status>(Status.NONE);

  const onChangeMessage = (msg: string, status: Status) => {
    setMessage(msg);
    setStatus(status);
  };

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
      <body className={styles.body}>
        <FetchProposals
          {...props}
          queryResults={data as QueryResult[]}
          onChangeMessage={onChangeMessage}
        />
        <Action {...props} onChangeMessage={onChangeMessage} />
        <Message message={message} status={status} />
        <RecentVotes {...props} />
      </body>
    </div>
  );
}

function Action(props: Props) {
  const { apiURL, onChangeMessage } = props;
  const { address, isDisconnected, isConnected, isConnecting } = useAccount();

  const [account, setAccount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDelegate] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>();

  const mint = async () => {
    setLoading(true);

    fetch(`${apiURL}/token/mint/${address}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode === 429) {
          throw new Error(data.message);
        }

        if (data.statusCode === 400) {
          throw new Error(data.message);
        }

        onChangeMessage(data.explorerURL, Status.SUCCESS);
      })
      .catch((err) => onChangeMessage(err.message, Status.ERROR))
      .finally(() => setLoading(false));
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
            className={!loading ? styles.actionbutton : styles.actiondisabled}
            disabled={loading}
            onClick={mint}
          >
            {loading && "Loading..."}
            {!loading && isConnected && "Mint Token"}
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
    </React.Fragment>
  );
}

function FetchProposals(props: Props) {
  const { proposals, queryResults } = props;

  const { isConnected } = useAccount();
  const [voteAmount, setVoteAmount] = useState<string>("");

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setVoteAmount(value);
  };

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
            <th style={{ textAlign: "center" }}>Name</th>
            <th style={{ textAlign: "center" }}>Total Votes</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map(({ name, index, voteCount }, idx) => (
            <tr
              key={index}
              style={idx === 0 ? { backgroundColor: "gold" } : {}}
            >
              <td>{name}</td>
              <td style={{ textAlign: "center" }}>
                {ethers.formatUnits(voteCount)}
              </td>
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

function Message(props: MessageProps) {
  const { message, status } = props;
  if (status === Status.SUCCESS) {
    return (
      <div className={styles.message}>
        <a className={styles.explorerurl} href={message}>
          {message}
        </a>
      </div>
    );
  }

  if (status === Status.ERROR) {
    return (
      <div className={styles.message}>
        <p className={styles.errormessage}>{message}</p>
      </div>
    );
  }

  return <React.Fragment />;
}
