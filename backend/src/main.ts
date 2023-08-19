import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
