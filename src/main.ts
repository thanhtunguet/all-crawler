import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { description, name, version } from '../package.json';
import { AppModule } from './app.module';
import './config/dotenv';
import { MQTT_URL, PORT } from './config/dotenv';

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

async function bootstrapMqtt() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        url: MQTT_URL,
      },
    },
  );

  app.listen();
}

bootstrap().then(async () => {
  await bootstrapMqtt();
  console.log('Microservice is running on http://0.0.0.0:3000/api');
});
