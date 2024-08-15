import { BadRequestException, Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import TaiLieuDieuKyRepository from './tldk.repository';

@ApiTags('TaiLieuDieuKy')
@Controller('/api/tldk')
export class TldkController {
  constructor(private readonly repository: TaiLieuDieuKyRepository) {}

  @Get('/categories')
  async crawl() {
    try {
      const masterPages = await this.repository.getListMasterPages();

      return masterPages;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return new BadRequestException();
    }
  }
}
