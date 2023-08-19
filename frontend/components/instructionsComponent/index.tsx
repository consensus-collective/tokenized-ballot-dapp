import styles from "./instructionsComponent.module.css";
import { useAccount } from "wagmi";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3001/api";

interface Proposal {
  index: number;
  name: string;
  voteCount: number;
}

export default function InstructionsComponent() {
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
      <div>
        <FetchProposals></FetchProposals>
      </div>
      <Action />
    </div>
  );
}

function Action() {
  const { address, isDisconnected, isConnected } = useAccount();

  const [account, setAccount] = useState<`0x${string}` | undefined>();
  const [loadingMint, setLoadingMint] = useState<boolean>(false);
  const [loadingDelegate, setLoadingDelegate] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(true);
  const [message, setMessage] = useState<string>();

  const mint = async () => {
    setLoadingMint(true);

    fetch(`${API_URL}/token/mint/${address}`, { method: "POST" })
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
    const targetAddress = account ?? address;
    console.log(targetAddress);
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

  if (isDisconnected) return <React.Fragment />;
  return (
    <React.Fragment>
      <div className={styles.action}>
        <div>
          <button
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
        <div>
          <button
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
      <div className={styles.message}>{messageStatus()}</div>
    </React.Fragment>
  );
}

function FetchProposals() {
  const { address, isConnected } = useAccount();

  const [loading, setLoading] = useState<boolean>(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>();

  useEffect(() => {
    fetch(`${API_URL}/ballot/proposals`)
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode === 500) {
          throw new Error(data.message);
        }

        setProposals(data.proposals);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        setErrMessage(err.message);
      });
  }, []);

  if (loading) return <>Loading...</>;
  if (error) return errMessage;
  return (
    <div>
      <div className={styles.tableHeader}>
        <h1>Proposal List</h1>
      </div>
      <table className={styles.proposalTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Votes</th>
            <th>Vote</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map(({ name, index, voteCount }) => (
            <tr key={index}>
              <td>{name}</td>
              <td>{voteCount}</td>
              <td>
                <button
                  className={isConnected ? styles.vote : styles.disabled}
                  onClick={() => {}}
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
