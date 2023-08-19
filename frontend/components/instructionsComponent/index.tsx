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
      <div>
        <Mint></Mint>
      </div>
    </div>
  );
}

function Mint() {
  const { address, isDisconnected, isConnecting, isConnected } = useAccount();

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();

  const mint = async () => {
    setLoading(true);

    fetch(`${API_URL}/token/mint/${address}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode === 429) {
          throw new Error(data.message);
        }

        setMessage(data.explorerURL);
        setSuccess(true);
      })
      .catch((err) => {
        setError(true);
        setMessage(err.message);
      })
      .finally(() => setLoading(false));
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
    <div className={styles.mint}>
      <button className={styles.mintbutton} disabled={loading} onClick={mint}>
        {loading && "Loading..."}
        {isConnecting && "Connecting..."}
        {!loading && isConnected && "Mint Token"}
      </button>
      <div className={styles.message}>{messageStatus()}</div>
    </div>
  );
}

function FetchProposals() { // TODO: Bring in actual proposals from API
  const [loading, setLoading] = useState<boolean>(true);
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [error, setError] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>()

  useEffect(() => {
    fetch(`${API_URL}/ballot/proposals`)
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 500) {
          throw new Error(data.message);
        }

        setProposals(data.proposals);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setError(true);
        setErrMessage(err.message);
      });
  }, []);

  // TODO: Implement voting and delegate functions to the buttons in Lines 73 and 76
  if (loading) return <>loading..</>
  if (error) return errMessage
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
            <th>Delegate</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map(({name, index, voteCount}) => (
            <tr key={index}>
              <td>{name}</td>
              <td>{voteCount}</td>
              <td>
                <button onClick={() => {}}>Vote</button>
              </td>
              <td>
                <button onClick={() => {}}>Delegate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
