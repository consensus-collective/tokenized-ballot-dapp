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

export const GroupIDParamOptions = {
  name: 'groupId',
  type: String,
  example: 'animal',
};

export const AccountParamOptions = {
  name: 'account',
  type: String,
  example: ADDRESS,
};

export const ProposalBodyOptions = {
  type: String,
  isArray: true,
  required: true,
  examples: { animal: { value: ['cat', 'dog', 'fish'] } },
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

export class Proposal {
  @ApiProperty({ name: 'groupId', type: String, example: 'animal' })
  groupId: string;

  @ApiProperty({ name: 'proposals', isArray: true, example: ['cat', 'dog'] })
  proposals: string[];
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

export const ContractAddressResponse = { type: ContractAddress };
export const ReceiptResponse = { type: Receipt };
export const ProposalResponse = { type: Proposal };
export const VoteResponse = { type: Vote, isArray: true };
