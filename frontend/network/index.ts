import {
  Abi,
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from "viem";
import { sepolia } from "viem/chains";
import { getContract } from "viem";
import { SEPOLIA_RPC, BALLOT_ADDRESS, AddressLike } from "./constant";
import BallotAbi from "../abis/ballot.json";

export const client = createPublicClient({
  chain: sepolia,
  transport: http(SEPOLIA_RPC),
});

export const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
});

// // JSON-RPC Account
// export const [account] = await walletClient.getAddresses();

export const ballotContract = getContract({
  address: BALLOT_ADDRESS as AddressLike,
  abi: BallotAbi as Abi,
  publicClient: client,
  walletClient: walletClient,
});
