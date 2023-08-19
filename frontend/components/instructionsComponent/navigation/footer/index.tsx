import styles from "./footer.module.css";
import { useAccount, useNetwork, useBalance } from "wagmi";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <PageBody></PageBody>
    </div>
  );
}

function PageBody() {
  return <div>{/* <WalletInfo></WalletInfo> */}</div>;
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();

  if (address)
    return (
      <div>
        <p>Your account address is: {address}</p>
        <p>Connected to the network: {chain?.name}</p>
        <WalletBalance address={address}></WalletBalance>
      </div>
    );
  if (isConnecting)
    return (
      <>
        <p>Loading...</p>
      </>
    );
  if (isDisconnected)
    return (
      <>
        <p>Wallet is Disconnected</p>
      </>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

function WalletBalance(params: { address: any }) {
  const { data, isError, isLoading } = useBalance({ address: params.address });
  if (isLoading) return <div>Fetching Balance....</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
}
