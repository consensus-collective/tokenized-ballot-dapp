import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { networkConfig } from './config';
import { join } from 'path';

import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [networkConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: '/',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
