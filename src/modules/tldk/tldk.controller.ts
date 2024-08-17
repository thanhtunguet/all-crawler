import { BadRequestException, Controller, Get, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
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
  ) {}

  @Get('/start')
  public async startTheJob() {
    await this.tldkService.start();
    return {
      message: 'Job started',
    };
  }

  @Get('/categories')
  public async crawl() {
    try {
      const masterPages = await this.repository.getListMasterPages();
      return masterPages;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return new BadRequestException();
    }
  }

  @EventPattern(TldkCategoryJob.CATEGORY_JOB)
  public async handleCategory(@Payload() category: TldkCategoryJob) {
    await this.tldkService.getDocumentsByCategory(category);
  }

  @EventPattern(TldkDocumentJob.DOCUMENT_JOB)
  public async handleDocument(
    @Payload() document: TldkDocumentJob,
    @Ctx() context: MqttContext,
  ) {
    console.log(context.getTopic());
    console.log(`Received document job: ${JSON.stringify(document)}`);
    this.tldkService.download(document.link);
  }
}
