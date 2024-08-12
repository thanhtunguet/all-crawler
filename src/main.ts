import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { description, name, version } from '../package.json';
import { AppModule } from './app.module';
import './config/dotenv';
import { PORT } from './config/dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  if (process.env.NODE_ENV === 'development') {
    console.log('Website is running on http://0.0.0.0:3000/api');
  }
}

bootstrap();
