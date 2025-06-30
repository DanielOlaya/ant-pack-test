import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { urlencoded, json, Response } from 'express';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  const logger = new Logger('HTTP');
  const corsOptions: CorsOptions = {
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  app.enableCors(corsOptions);

  app.use((req, res: Response, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.ip;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    let logMessage = `IP: ${clientIp} | User-Agent: ${userAgent} | Method: ${req.method} | URL: ${req.url}`;
    if (Object.keys(req.query).length > 0) {
      logMessage += ` | Query Params: ${JSON.stringify(req.query)}`;
    }
    if (Object.keys(req.params).length > 0) {
      logMessage += ` | Route Params: ${JSON.stringify(req.params)}`;
    }
    if (Object.keys(req.body).length > 0) {
      logMessage += `\nBody: ${JSON.stringify(req.body)}`;
    }
    logger.log(logMessage);

    const originalSend = res.send;
    let responseBody: any;

    res.send = function (body) {
      responseBody = body;
      // eslint-disable-next-line prefer-rest-params
      return originalSend.apply(this, arguments);
    };
    res.on('finish', () => {
      const responseLog = `Status: ${res.statusCode}\nResponse Body: ${JSON.stringify(responseBody)}`;
      logger.log(`${logMessage}\n${responseLog}`);
    });

    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Ant Pack API')
    .setDescription('API para restaurantes y transacciones')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
