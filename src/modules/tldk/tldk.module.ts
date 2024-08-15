import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, TldkCategory, TldkLink, Website } from 'src/entities';
import { TldkController } from './tldk.controller';
import TaiLieuDieuKyRepository from './tldk.repository';
import { TldkService } from './tldk.service';

@Module({
  providers: [TldkService, TaiLieuDieuKyRepository],
  controllers: [TldkController],
  imports: [
    TypeOrmModule.forFeature([Website, Category, TldkLink, TldkCategory]),
  ],
})
export class TldkModule {}
