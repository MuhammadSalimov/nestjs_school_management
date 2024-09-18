import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as basicAuth from 'express-basic-auth';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // prefix
  app.setGlobalPrefix('api');

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // versioning
  app.enableVersioning();

  // cors
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, origin);
    },
    credentials: true,
  });
  // Cookie parser
  app.use(cookieParser());
  // config
  const config = app.get<ConfigService>(ConfigService);

  // swagger auth
  app.use(
    '/api/docs*',
    basicAuth({
      challenge: true,
      users: {
        admin: '123',
      },
    }),
  );

  // swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('School management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(config.get('PORT'), () => {
    console.log(`server start http://localhost:${config.get('PORT')}`);
    console.log(`Api docs http://localhost:${config.get('PORT')}/api/docs`);
  });
}
bootstrap();
