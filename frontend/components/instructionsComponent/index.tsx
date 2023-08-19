import styles from "./instructionsComponent.module.css";
import { useAccount } from "wagmi";
import React, { useState } from "react";

const API_URL = "http://localhost:3001/api";

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
  const { address, isDisconnected, isConnecting } = useAccount();

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

  const mintButtonText = () => {
    if (isConnecting) {
      return <p>Connecting...</p>;
    }

    if (loading) {
      return <p>Loading...</p>;
    }

    return <p>Mint Tokens</p>;
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
        {mintButtonText()}
      </button>
      <div className={styles.message}>{messageStatus()}</div>
    </div>
  );
}

function FetchProposals() {
  const PROPOSALS = ["cat", "dog", "fish", "toilet"]; // TODO: Bring in actual proposals from API

  // TODO: Implement voting and delegate functions to the buttons in Lines 73 and 76

  return (
    <div>
      <div className={styles.tableHeader}>
        <h1>Proposal List</h1>
      </div>
      <table className={styles.proposalTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>No. of Votes</th>
            <th>Vote</th>
            <th>Delegate</th>
          </tr>
        </thead>
        <tbody>
          {PROPOSALS.map((proposal, index) => (
            <tr key={index}>
              <td>{proposal}</td>
              <td>----</td>
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
