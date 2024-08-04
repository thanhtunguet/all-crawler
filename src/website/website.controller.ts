import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Website } from 'src/entities';
import { WebsiteService } from './website.service';

@ApiTags('Website')
@Controller('api/website')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Get('/list')
  list(): Promise<Website[]> {
    return this.websiteService.list();
  }

  @Get('/count')
  count(): Promise<number> {
    return this.websiteService.count();
  }

  @Get('/get/:id')
  getById(@Param('id') id: number): Promise<Website> {
    return this.websiteService.getById(id);
  }
}
