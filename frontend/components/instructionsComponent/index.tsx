import styles from "./instructionsComponent.module.css";
import { useAccount, useNetwork, useBalance, useSignMessage, useContractRead } from "wagmi";
import { useState, useEffect } from "react";
import { ethers } from 'ethers';


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
  const [signatureMessage, setSignatureMessage] = useState("");
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();

  return (
    <div>
      <button className={styles.mintbutton}
        disabled={isLoading}
        onClick={() =>
          //TODO: Bring in Minting function in ERC20 contract API    
          signMessage({
            message: signatureMessage,
          })
        }
      >
      <p>Mint Tokens</p>
      </button>    
    </div>
  )
}

function FetchProposals() {

  const PROPOSALS = ['cat', 'dog', 'fish', 'toilet']; // TODO: Bring in actual proposals from API

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
  )
}
