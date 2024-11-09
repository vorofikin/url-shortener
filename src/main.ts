import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const docBuilder = new DocumentBuilder()
    .setTitle('Andrew Nikiforov Test Task')
    .setDescription('API Documentation')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, docBuilder);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
