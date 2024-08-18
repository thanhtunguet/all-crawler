import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MQTT_URL } from 'src/config/dotenv';
import { DatabaseModule } from 'src/modules/database/database.module';
import * as entities from '../../entities';
import { GoogleModule } from '../google/google.module';
import { TldkController } from './tldk.controller';
import TaiLieuDieuKyRepository from './tldk.repository';
import { TldkService } from './tldk.service';

@Module({
  providers: [TldkService, TaiLieuDieuKyRepository],
  controllers: [TldkController],
  imports: [
    DatabaseModule,
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
    TypeOrmModule.forFeature(Object.values(entities)),
  ],
})
export class TldkModule {}
