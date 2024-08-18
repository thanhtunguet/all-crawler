import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MQTT_URL } from 'src/config/dotenv';
import {
  Category,
  TldkCategory,
  TldkLink,
  TldkLog,
  Website,
} from 'src/entities';
import { DatabaseModule } from 'src/modules/database/database.module';
import { GoogleModule } from '../google/google.module';
import { TldkController } from './tldk.controller';
import TaiLieuDieuKyRepository from './tldk.repository';
import { TldkService } from './tldk.service';

@Module({
  providers: [TldkService, TaiLieuDieuKyRepository],
  controllers: [TldkController],
  imports: [
    DatabaseModule,
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
