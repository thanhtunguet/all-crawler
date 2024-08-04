import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, Website } from 'src/entities';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';

@Module({
  imports: [TypeOrmModule.forFeature([Website, Category])],
  providers: [WebsiteService],
  controllers: [WebsiteController],
})
export class WebsiteModule {}
