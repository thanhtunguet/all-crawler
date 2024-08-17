import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { description, name, version } from '../package.json';
import { AppModule } from './app.module';
import './config/dotenv';
import { MQTT_URL, PORT } from './config/dotenv';
import { Microservices } from './config/microservices';

class MainApp {
  async bootstrapApp() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle(name)
      .setDescription(description)
      .setVersion(version)

      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(PORT);

    console.log('Website is running on http://0.0.0.0:3000/api');
  }

  async bootstrapTaiLieuDieuKy() {
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
}

const app = new MainApp();
switch (process.env.MICROSERVICE) {
  case Microservices.TaiLieuDieuKy:
    app.bootstrapTaiLieuDieuKy();
    break;

  default:
    app.bootstrapApp();
    break;
}
