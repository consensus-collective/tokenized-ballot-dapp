import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ethers } from 'ethers';

import * as TokenABI from './abi/token.json';
import { VOTES } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.enableCors();

  const logger = new Logger();
  const config = new ConfigService();

  const port = config.get<number>('PORT', 5000) || 5000;

  await initSwagger(app);
  await app.listen(port, async () => {
    logger.log(`Running on ${await app.getUrl()}`, 'NestApplication');
  });

  ballotListener();
}

bootstrap();

async function initSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tokenize Ballot')
    .setDescription('The ballots API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/explorer', app, document);
}

async function ballotListener() {
  const config = new ConfigService();
  const ballotAddress = config.get('BALLOT');
  const rpcURL = config.get('SEPOLIA_RPC_URL');
  const provider = new ethers.JsonRpcProvider(rpcURL);
  const contract = new ethers.Contract(ballotAddress, TokenABI.abi, provider);

  contract
    .on('Vote', async (sender, proposalIndex, amount) => {
      const proposal = await contract.proposals(proposalIndex);

      const proposalName = ethers.decodeBytes32String(proposal.name);
      const data = {
        voter: sender,
        proposalIndex,
        proposalName,
        amount: amount.toString(),
        createdAt: new Date().toString(),
      };

      VOTES.unshift(data);
    })
    .catch(() => {
      // ignore
    });
}
