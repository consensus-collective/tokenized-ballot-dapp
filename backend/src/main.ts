import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ethers } from 'ethers';
import { VOTES } from './app.service';

import * as BallotABI from './abi/ballot.json';

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

  ballotListener(() => {
    logger.log('Listening on ballot event', 'NestApplication');
  });
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

async function ballotListener(callback?: () => void) {
  const config = new ConfigService();
  const ballotAddress = config.get('BALLOT');
  const rpcURL = config.get('SEPOLIA_RPC_URL');
  const provider = new ethers.JsonRpcProvider(rpcURL);
  const contract = new ethers.Contract(ballotAddress, BallotABI.abi, provider);

  contract
    .on('Vote', async (sender, proposalIndex, amount) => {
      const proposal = await contract.proposals(proposalIndex);

      const proposalName = ethers.decodeBytes32String(proposal.name);
      const data = {
        voter: sender,
        proposalIndex: Number(proposalIndex),
        proposalName,
        amount: amount.toString(),
        createdAt: new Date(),
      };

      VOTES.unshift(data);
    })
    .catch((err) => {
      console.log(err);
      // ignore
    });

  callback && callback();
}
