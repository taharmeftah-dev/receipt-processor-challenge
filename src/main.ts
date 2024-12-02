import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips unknown properties
      forbidNonWhitelisted: true, // Throws error for unknown properties
      transform: true, // Auto-transform payloads to DTOs
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map(err => ({
            field: err.property,
            errors: Object.values(err.constraints || {}),
          }))
        );
      },
    }),
  );


  await app.listen(3000);
}
bootstrap();
