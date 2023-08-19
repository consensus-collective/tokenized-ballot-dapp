export function networkConfig(): NetworkConfig {
  return {
    networks: {
      sepolia: {
        url: process.env.SEPOLIA_RPC_URL,
        accounts: [process.env.PRIVATE_KEY],
        contracts: {
          ballot: process.env.BALLOT,
          token: process.env.TOKEN,
        },
      },
    },
  };
}

export interface Network {
  url: string;
  accounts: string[];
  contracts: Contracts;
}

export interface Networks {
  sepolia: Network;
}

export interface Contracts {
  token: string;
  ballot: string;
}

export interface NetworkConfig {
  networks: Networks;
}
