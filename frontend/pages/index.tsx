import Layout from "@/components/layout";
import styles from "../styles/page.module.css";
import dynamic from "next/dynamic";

import { ethers } from "ethers";

const API_URL = "http://localhost:3001/api";

const InstructionsComponent = dynamic(
  () => import("@/components/instructionsComponent"),
  { ssr: false },
);

export default function Home(props: any) {
  return (
    <Layout>
      <main className={styles.main}>
        <InstructionsComponent {...props}></InstructionsComponent>
      </main>
    </Layout>
  );
}

export async function getServerSideProps() {
  const ballot = await fetch(`${API_URL}/ballot/address`)
    .then((res) => res.json())
    .then((data) => {
      if (data.statusCode === 404) {
        return ethers.ZeroAddress;
      }

      return data.address;
    })
    .catch(() => ethers.ZeroAddress);

  const token = await fetch(`${API_URL}/token/address`)
    .then((res) => res.json())
    .then((data) => {
      if (data.statusCode === 404) {
        return ethers.ZeroAddress;
      }

      return data.address;
    })
    .catch(() => ethers.ZeroAddress);

  const proposals = await fetch(`${API_URL}/ballot/proposals`)
    .then((res) => res.json())
    .then((data) => {
      if (data.statusCode === 500) {
        return [];
      }

      return data.proposals;
    })
    .catch(() => []);

  proposals.sort((a: any, b: any) => {
    return Number(b.voteCount) - Number(a.voteCount);
  });

  return {
    props: {
      apiURL: API_URL,
      ballot: ballot,
      token: token,
      proposals: proposals,
    },
  };
}
