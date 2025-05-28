import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { BadRequestException, ValidationError, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as bodyParser from 'body-parser';
// import { CronService } from "./shared/cron/cron-service";
// import { I18nValidationPipe } from 'nestjs-i18n';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json({ limit: '500mb' }));
  app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      if (validationErrors[0]?.children.length) {
        return new BadRequestException(
          Object.values(validationErrors[0].children[0].constraints)[0],
        );
      } else {
        return new BadRequestException(
          Object.values(validationErrors[0].constraints)[0],
        );
      }
    },
  }));
  
  // app.useGlobalPipes(
  //   new I18nValidationPipe({
  //     transform: true,
  //     whitelist: true,
  //     exceptionFactory: (errors) => {
  //       // Flatten the first constraint message
  //       const firstError = errors[0];
  //       const constraints = firstError?.constraints || firstError?.children?.[0]?.constraints;
  //       const message = constraints ? Object.values(constraints)[0] : 'Validation error';
  //       return new BadRequestException(message);
  //     },
  //   }),
  // );
  
  app.enableVersioning({
    type: VersioningType.URI, // Enables /v1, /v2, etc.
  });
  
  const configV1 = new DocumentBuilder()
    .setTitle('E-commerce Admin Api - V1')
    .setDescription('E-commerce Admin Api Documentation - Version 1')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  
  const documentV1 = SwaggerModule.createDocument(app, configV1, {
    include: [AppModule], // we can create separate modules per version if desired
  });
  
  SwaggerModule.setup('api/v1', app, documentV1, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
  
  // app.get(CronService);
  
  
  await app.listen(process.env.PORT || 4000);
}

bootstrap();
