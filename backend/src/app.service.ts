import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NetworkConfig, Networks } from './config';
import { ethers } from 'ethers';

import * as TokenABI from './abi/token.json';
import * as BallotABI from './abi/ballot.json';

export interface AnyObject {
  [any: string]: any;
}

// STORAGE
export const ACCOUNTS: AnyObject = {};
export const VOTES: AnyObject[] = [];

// CONSTANT
const MINT_VALUE: bigint = ethers.parseUnits('1');
const DAY: number = 1 * 24 * 60 * 60 * 1000;

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private networks: Networks;

  constructor(private configService: ConfigService<NetworkConfig>) {
    this.networks = this.configService.get('networks');
  }

  async mint(account: string, network: string) {
    const now = Date.now();
    const previousMintTime = ACCOUNTS[account] ?? 0;
    const avalaibleMintTime = previousMintTime + DAY;

    if (now < avalaibleMintTime) {
      throw new HttpException('TooManyRequest', HttpStatus.TOO_MANY_REQUESTS);
    }

    const tokenAddress = this.networks[network].contracts.token;
    const rpcURL = this.networks[network].url;
    const privateKey = this.networks[network].accounts[0];

    const provider = new ethers.JsonRpcProvider(rpcURL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(tokenAddress, TokenABI.abi, wallet);

    try {
      this.logger.log('Minting...');

      const txr = await contract.mint(account, MINT_VALUE);
      const tx = await txr.wait(1);

      ACCOUNTS[account] = now;

      this.logger.log(`Minted ${MINT_VALUE.toString()} to ${account}!`);

      return {
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        network,
        account: account,
        amount: MINT_VALUE.toString(),
        explorerURL: `https://${network}.etherscan.io/tx/${tx.hash}`,
      };
    } catch (err) {
      this.logger.error(err.message);
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getTokenAddress(network: string) {
    if (!this.networks[network].contracts.token) {
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
    }

    return {
      network,
      address: this.networks[network].contracts.token,
    };
  }

  async getBalance(network: string, address: string) {
    if (!this.networks[network].contracts.token) {
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
    }

    const tokenAddress = this.networks[network].contracts.token;
    const rpcURL = this.networks[network].url;

    const provider = new ethers.JsonRpcProvider(rpcURL);
    const contract = new ethers.Contract(tokenAddress, TokenABI.abi, provider);
    const balanceOf = await contract.balanceOf(address);

    return {
      network,
      account: address,
      balance: balanceOf.toString(),
    };
  }

  async latestVotes() {
    return VOTES.slice(0, 5);
  }

  async getBallotAddress(network: string) {
    if (!this.networks[network].contracts.ballot) {
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
    }

    return {
      network: network,
      address: this.networks[network].contracts.ballot,
    };
  }

  async getProposals(network: string) {
    const ballotAddress = this.networks[network].contracts.ballot;
    const rpcURL = this.networks[network].url;

    const provider = new ethers.JsonRpcProvider(rpcURL);
    const contract = new ethers.Contract(
      ballotAddress,
      BallotABI.abi,
      provider,
    );

    const totalProposal = await contract.proposalCount();

    if (totalProposal.toString() === '0') {
      return {
        proposals: [],
      };
    }

    const proposals: AnyObject[] = [];
    for (let i = 0; i < totalProposal; i++) {
      const proposal = await contract.proposals(i);
      proposals.push({
        name: ethers.decodeBytes32String(proposal.name),
        voteCount: proposal.voteCount.toString(),
        index: i,
      });
    }

    return { proposals };
  }
}
