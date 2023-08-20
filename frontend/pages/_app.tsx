import "../styles/globals.css";
import { WagmiConfig, createConfig, sepolia } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/instructionsComponent/navigation/navbar";
import Footer from "@/components/instructionsComponent/navigation/footer";
import { AppProps } from "next/app";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: "_feYIOMet1Gu5rWmGEmU_KYpnnmdHMNP", // or infuraId
    walletConnectProjectId: "2af270b66d213943cb493906f96476c2",

    // Required
    appName: "You Create Web3 Dapp",

    // Optional
    chains: [sepolia],
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's logo,no bigger than 1024x1024px (max. 1MB)
  }),
);

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  return <Component {...pageProps}></Component>;
};

export default App;
