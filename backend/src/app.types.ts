import { DefaultValuePipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ethers } from 'ethers';

export const ADDRESS = ethers.Wallet.createRandom().address;
export const DefaultNetwork = new DefaultValuePipe('sepolia');

export const NetworkQueryOptions = {
  name: 'network',
  required: false,
  type: String,
  example: 'sepolia',
};

export const AccountParamOptions = {
  name: 'account',
  type: String,
  example: ADDRESS,
};

export class ContractAddress {
  @ApiProperty({ name: 'network', type: String, example: 'sepolia' })
  network: string;

  @ApiProperty({ name: 'address', type: String, example: ADDRESS })
  address: string;
}

const MINT_VALUE = ethers.parseUnits('1').toString();
const EXPLORER = `https://sepolia.etherscan.io/tx/${ethers.ZeroHash}`;

export class Receipt {
  @ApiProperty({ name: 'hash', type: String, example: ethers.ZeroHash })
  hash: string;

  @ApiProperty({ name: 'blockNumber', type: Number, example: 60851 })
  blockNumber: number;

  @ApiProperty({ name: 'network', type: String, example: 'sepolia' })
  network: string;

  @ApiProperty({ name: 'account', type: String, example: ADDRESS })
  account: string;

  @ApiProperty({ name: 'amount', type: String, example: MINT_VALUE })
  amount: string;

  @ApiProperty({ name: 'explorerURL', type: String, example: EXPLORER })
  explorerURL: string;
}

const DATE = new Date().toString();

export class Vote {
  @ApiProperty({ name: 'proposalIndex', type: Number, example: 2 })
  proposalIndex: number;

  @ApiProperty({ name: 'proposalName', type: String, example: 'cat' })
  proposalName: number;

  @ApiProperty({ name: 'account', type: String, example: ADDRESS })
  account: string;

  @ApiProperty({ name: 'amount', type: String, example: MINT_VALUE })
  amount: string;

  @ApiProperty({ name: 'createdAt', type: String, example: DATE })
  createdAt: string;
}

export class Proposal {
  @ApiProperty({ name: 'index', type: Number, example: 2 })
  index: number;

  @ApiProperty({ name: 'name', type: String, example: 'cat' })
  name: number;

  @ApiProperty({ name: 'voteCount', type: Number, example: 100000000000 })
  voteCount: string;
}

export class Proposals {
  @ApiProperty({ name: 'proposals', type: Proposal, isArray: true })
  proposals: Proposal[];
}

export const ContractAddressResponse = { type: ContractAddress };
export const ReceiptResponse = { type: Receipt };
export const VoteResponse = { type: Vote, isArray: true };
export const ProposalResponse = { type: Proposals };
