import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { AnyObject, AppService } from './app.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
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
  GroupIDParamOptions,
  NetworkQueryOptions,
  AccountParamOptions,
  ContractAddressResponse,
  ReceiptResponse,
  ProposalResponse,
  VoteResponse,
  ProposalBodyOptions,
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
  @ApiParam(GroupIDParamOptions)
  @ApiQuery({ name: 'decoded', required: false, type: Boolean, example: true })
  @ApiOkResponse(ProposalResponse)
  @ApiNotFoundResponse({ description: 'NotFound' })
  @Get('/ballot/proposal/:groupId')
  async find(
    @Param('groupId') groupId: string,
    @Query('decoded', new DefaultValuePipe(true)) decoded: string,
  ) {
    return this.appService.fetchProposal(groupId, decoded);
  }

  @ApiTags('Ballot')
  @ApiParam(GroupIDParamOptions)
  @ApiBody(ProposalBodyOptions)
  @ApiCreatedResponse(ProposalResponse)
  @ApiConflictResponse({ description: 'Conflict' })
  @Post('/ballot/proposal/:groupId')
  async createProposal(
    @Param('groupId') groupId: string,
    @Body() proposals: string[],
  ) {
    return this.appService.createProposal(groupId, proposals);
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
