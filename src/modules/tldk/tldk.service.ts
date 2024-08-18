import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { TldkCategory } from 'src/entities';
import { TldkLink } from 'src/entities/TldkLink';
import { Repository } from 'typeorm';
import { GoogleService } from '../google/google.service';
import { TldkCategoryJob } from './dtos/category-job.dto';
import { TldkDocumentJob } from './dtos/document-job.dto';
import TaiLieuDieuKyRepository from './tldk.repository';

@Injectable()
export class TldkService implements OnModuleInit {
  constructor(
    //
    private readonly repository: TaiLieuDieuKyRepository,
    //
    @InjectRepository(TldkLink)
    private readonly linkPageRepository: Repository<TldkLink>,
    //
    @InjectRepository(TldkCategory)
    private readonly categoryRepository: Repository<TldkCategory>,
    //
    private readonly googleService: GoogleService,
    //
    @Inject('MQTT_SERVICE')
    private readonly mqttClient: ClientProxy,
  ) {}

  public async onModuleInit() {
    try {
      await this.mqttClient.connect();
      console.log('Connected to MQTT_SERVICE successfully.');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ queues:', error);
    }
  }

  public async saveCategories(categories: TldkCategory[]) {
    await this.categoryRepository.clear();
    await this.categoryRepository.save(categories);
  }

  public async start() {
    const categories = await this.categoryRepository.find();
    const jobs = categories
      .map((category) => {
        const jobs = [];
        for (let i = 1; i <= category.numberOfPage; i++) {
          const job = new TldkCategoryJob();
          job.link = category.categoryLink;
          job.name = category.name;
          job.page = i;
          jobs.push(job);
        }
        return jobs;
      })
      .flat();
    await this.pushCategoriesToQueue(jobs);
  }

  public async getDocumentsByCategory(
    job: TldkCategoryJob,
  ): Promise<TldkDocumentJob[]> {
    const link = job.link;
    const page = job.page;

    // Handle Article
    if (this.isArticleCategory(link)) {
      const articles = await this.repository.getArticleLinks(link, page);
      const documents = articles.map((article) => {
        const documentJob = new TldkDocumentJob();
        documentJob.link = article.link;
        documentJob.name = article.name;
        return documentJob;
      });
      await this.pushDocumentsToQueue(documents);
      return;
    }

    // Handle Ebook
    if (this.isEbookCategory(link)) {
      const ebooks = await this.repository.getEbookLinks(link, page);
      const documents = ebooks.map((ebook) => {
        const documentJob = new TldkDocumentJob();
        documentJob.link = ebook.link;
        documentJob.name = ebook.name;
        return documentJob;
      });
      await this.pushDocumentsToQueue(documents);
      return;
    }
  }

  private isArticleCategory(link: string) {
    return link.match(/baiviet\/tag/);
  }

  private isEbookCategory(link: string) {
    return link.match(/ebook/);
  }

  public async pushDocumentsToQueue(documents: TldkDocumentJob[]) {
    for (const document of documents) {
      await this.mqttClient.emit(TldkDocumentJob.DOCUMENT_JOB, document);
    }
  }

  public async pushCategoriesToQueue(categories: TldkCategoryJob[]) {
    for (const category of categories) {
      this.mqttClient.emit(TldkCategoryJob.CATEGORY_JOB, category);
    }
  }
}
