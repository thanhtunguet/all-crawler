import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import './config/dotenv';
import { DatabaseModule } from './modules/database/database.module';
import { GoogleModule } from './modules/google/google.module';
import { GritCenterModule } from './modules/grit-center/grit-center.module';
import { TldkModule } from './modules/tldk/tldk.module';
import { WebsiteModule } from './modules/website/website.module';

@Module({
  imports: [
    WebsiteModule,
    GritCenterModule,
    TldkModule,
    GoogleModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
