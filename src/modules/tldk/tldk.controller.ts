import { BadRequestException, Controller, Get } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { AxiosError } from 'axios';
import { TldkCategory } from 'src/entities';
import { GoogleService } from '../google/google.service';
import TaiLieuDieuKyRepository from './tldk.repository';
import { TldkService } from './tldk.service';

@ApiTags('TaiLieuDieuKy')
@Controller('/api/tldk')
export class TldkController {
  constructor(
    private readonly repository: TaiLieuDieuKyRepository,
    private readonly tldkService: TldkService,
    private readonly googleService: GoogleService,
  ) {}

  @Get('/categories')
  public async categories() {
    try {
      const masterPages = await this.repository.getListMasterPages();
      await this.tldkService.saveCategories(masterPages);
      return masterPages;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return new BadRequestException();
    }
  }

  @EventPattern('category/topic')
  public async handleCategory() {
    try {
      let categories: TldkCategory[];
      categories = await this.repository.getListMasterPages();
      await this.tldkService.saveCategories(categories);
      categories = await this.tldkService.getCategories();

      for (const category of categories) {
        for (let i = 1; i <= category.page; i++) {
          const job = new TldkCategory();

          job.id = category.id;
          job.link = category.link;
          job.name = category.name;
          job.page = i;

          try {
            const documents =
              await this.tldkService.getDocumentsByCategory(job);
            await this.tldkService.saveDocuments(documents);
          } catch (error) {
            console.log(
              `Ignore ${(error as AxiosError).response.status} error from ${job.link}`,
            );
          }
        }
      }
    } catch (error) {
      console.error(`Error handling category: ${(error as Error).message}`);
    }
  }

  @EventPattern('document/topic')
  public async handleDocument() {
    const documents = await this.tldkService.getDocuments();
    for (const document of documents) {
      try {
        if (this.googleService.isGoogleLink(document.link)) {
          await this.googleService.downloadLink(document.link, document.name);
        } else {
          await this.tldkService.downloadLink(document.link);
        }
        document.isDownloaded = true;
        await this.tldkService.saveDocuments([document]);
      } catch (error) {}
    }
  }
}
