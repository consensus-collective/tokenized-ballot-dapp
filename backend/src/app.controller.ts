import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AnyObject, AppService } from './app.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import {
  DefaultNetwork,
  NetworkQueryOptions,
  AccountParamOptions,
  ContractAddressResponse,
  ReceiptResponse,
  VoteResponse,
  ProposalResponse,
} from './app.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Token endpoint
  @ApiTags('Token')
  @ApiParam(AccountParamOptions)
  @ApiQuery(NetworkQueryOptions)
  @ApiCreatedResponse(ReceiptResponse)
  @ApiBadRequestResponse({ description: 'NetworkError' })
  @ApiTooManyRequestsResponse({ description: 'TooManyRequest' })
  @Post('/token/mint/:account')
  async mint(
    @Param('account') account: string,
    @Query('network', DefaultNetwork) network: string,
  ) {
    return this.appService.mint(account, network);
  }

  @ApiTags('Token')
  @ApiQuery(NetworkQueryOptions)
  @ApiOkResponse(ContractAddressResponse)
  @ApiNotFoundResponse({ description: 'NotFound' })
  @Get('/token/address')
  async getTokenAddress(@Query('network', DefaultNetwork) network: string) {
    return this.appService.getTokenAddress(network);
  }

  // Ballot endpoint
  @ApiTags('Ballot')
  @Get('/ballot/proposals')
  @ApiOkResponse(ProposalResponse)
  async getProposals(
    @Query('network', DefaultNetwork) network: string,
  ): Promise<AnyObject[]> {
    return this.appService.getProposals(network);
  }

  @ApiTags('Ballot')
  @Get('/ballot/vote/latest')
  @ApiOkResponse(VoteResponse)
  async latestVote(): Promise<AnyObject[]> {
    return this.appService.latestVotes();
  }

  @ApiTags('Ballot')
  @ApiQuery(NetworkQueryOptions)
  @ApiOkResponse(ContractAddressResponse)
  @ApiNotFoundResponse({ description: 'NotFound' })
  @Get('/ballot/address')
  async getBallotAddres(@Query('network', DefaultNetwork) network: string) {
    return this.appService.getBallotAddress(network);
  }
}
