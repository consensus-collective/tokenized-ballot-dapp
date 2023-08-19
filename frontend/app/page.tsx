"use client";

import styles from "./page.module.css";
import "./globals.css";
import dynamic from "next/dynamic";

const InstructionsComponent = dynamic(
  () => import("@/components/instructionsComponent"),
  { ssr: false },
);

export default function Home() {
  return (
    <main className={styles.main}>
      <InstructionsComponent></InstructionsComponent>
    </main>
  );
}
