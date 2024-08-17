import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MQTT_URL, REDIS_URL } from 'src/config/dotenv';
import {
  Category,
  TldkCategory,
  TldkLink,
  TldkLog,
  Website,
} from 'src/entities';
import { GoogleModule } from '../google/google.module';
import { TldkController } from './tldk.controller';
import TaiLieuDieuKyRepository from './tldk.repository';
import { TldkService } from './tldk.service';

const redisUrl = new URL(REDIS_URL);

console.log({
  host: redisUrl.host,
  port: Number(redisUrl.port),
});

@Module({
  providers: [TldkService, TaiLieuDieuKyRepository],
  controllers: [TldkController],
  imports: [
    TypeOrmModule.forFeature([
      Website,
      Category,
      TldkLink,
      TldkCategory,
      TldkLog,
    ]),
    GoogleModule,
    ClientsModule.register([
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: MQTT_URL, // MQTT broker URL
        },
      },
    ]),
  ],
})
export class TldkModule {}
