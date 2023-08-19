"use client";

import { ConnectKitButton } from "connectkit";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a
        className={styles.button}
        href="https://github.com/consensus-collective/tokenized-ballot-dapp"
        target={"_blank"}
      >
        <p>Github Repository</p>
      </a>
      <ConnectKitButton />
    </nav>
  );
}
