import { WagmiConfig, createConfig, sepolia } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/instructionsComponent/navigation/navbar";
import Footer from "@/components/instructionsComponent/navigation/footer";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.ALCHEMY_API_KEY, // or infuraId
    walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID ?? "",

    // Required
    appName: "You Create Web3 Dapp",

    // Optional
    chains: [sepolia],
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's logo,no bigger than 1024x1024px (max. 1MB)
  }),
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider mode="dark">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "105vh",
          }}
        >
          <Navbar />
          <div style={{ flexGrow: 1 }}>{children}</div>
          <Footer />
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
