import { BadRequestException, Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from '../google/google.service';
import { TldkCategoryJob } from './dtos/category-job.dto';
import { TldkDocumentJob } from './dtos/document-job.dto';
import TaiLieuDieuKyRepository from './tldk.repository';
import { TldkService } from './tldk.service';

@ApiTags('TaiLieuDieuKy')
@Controller('/api/tldk')
export class TldkController {
  constructor(
    private readonly repository: TaiLieuDieuKyRepository,
    private readonly tldkService: TldkService,
    @Inject('MQTT_SERVICE')
    private readonly client: ClientProxy,
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

  @Get('/start')
  public async startTheJob() {
    await this.tldkService.start();
    return {
      message: 'Job started',
    };
  }

  @EventPattern(TldkCategoryJob.CATEGORY_JOB)
  public async handleCategory(@Payload() category: TldkCategoryJob) {
    console.log(`Received category job: ${JSON.stringify(category)}`);
    await this.tldkService.getDocumentsByCategory(category);
  }

  @EventPattern(TldkDocumentJob.DOCUMENT_JOB)
  public async handleDocument(@Payload() document: TldkDocumentJob) {
    console.log(`Received document job: ${JSON.stringify(document)}`);
    this.googleService.downloadLink(document.link, document.name);
  }
}
