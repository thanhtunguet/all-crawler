import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import './config/dotenv';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from './config/dotenv';
import * as entities from './entities';
import { GritCenterModule } from './grit-center/grit-center.module';
import { WebsiteModule } from './website/website.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DB_HOST,
      port: Number(DB_PORT),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      entities: Object.values(entities),
      synchronize: false,
    }),
    WebsiteModule,
    GritCenterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
