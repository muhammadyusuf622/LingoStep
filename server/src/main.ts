import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilters } from './filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  
  app.enableCors({
    origin: process.env.CORS_ORIGINS, // masalan: 'http://localhost:4000'
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['authorization', 'content-type'],
    optionsSuccessStatus: 200,
  });


  app.useGlobalFilters(new AllExceptionsFilters())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

    const config = new DocumentBuilder()
  .setTitle('example croud')
  .setDescription('The Example Croud api description')
  .setVersion('1.0')
  .addBearerAuth()
  .build()


  const documentFactory = () => SwaggerModule.createDocument(app, config)

  if(process.env.NODE_ENV?.trim() == 'development') {
    SwaggerModule.setup('swg', app, documentFactory);
  }

  app.setGlobalPrefix('/api');


  const PORT = parseInt(process.env.APP_PORT as string) || 4000
  const HOST = process.env.HOST
  await app.listen(PORT, () => {
    console.log(`http://${HOST}:${PORT}`)
  });
}
bootstrap();
