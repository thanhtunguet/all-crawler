import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Category,
  Document,
  FileType,
  GritArticle,
  GritDocument,
  GritGoogleDocs,
  Website,
} from 'src/entities';
import { GritCenterController } from './grit-center.controller';
import { GritCenterService } from './grit-center.service';

@Module({
  providers: [GritCenterService],
  controllers: [GritCenterController],
  imports: [
    TypeOrmModule.forFeature([
      Document,
      FileType,
      Website,
      Category,
      GritDocument,
      GritArticle,
      GritGoogleDocs,
    ]),
  ],
})
export class GritCenterModule {}
