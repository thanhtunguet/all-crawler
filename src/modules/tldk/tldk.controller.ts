import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Table } from 'console-table-printer';
import TaiLieuDieuKyRepository from './tldk.repository';

@ApiTags('TaiLieuDieuKy')
@Controller('/api/tldk')
export class TldkController {
  constructor(private readonly repository: TaiLieuDieuKyRepository) {}

  @Get('/')
  async crawl() {
    try {
      const masterPages = await this.repository.getListMasterPages();
      const table = new Table({
        columns: [
          { name: 'Category Link', alignment: 'left' },
          { name: 'Number of Pages', alignment: 'right' },
          { name: 'Type', alignment: 'left' },
        ],
      });

      masterPages.forEach(({ categoryLink, lastPage }) => {
        const type = categoryLink.includes('ebook') ? 'Ebook' : 'Article';
        table.addRow({
          'Category Link': categoryLink,
          'Number of Pages': lastPage,
          Type: type,
        });
      });

      table.printTable();
      return table;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
}
