import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TldkCategory, TldkDocument } from 'src/entities';
import { Repository } from 'typeorm';
import TaiLieuDieuKyRepository from './tldk.repository';

@Injectable()
export class TldkService {
  constructor(
    @InjectRepository(TldkCategory)
    private readonly categoryRepository: Repository<TldkCategory>,
    @InjectRepository(TldkDocument)
    private readonly documentRepository: Repository<TldkDocument>,
    private readonly repository: TaiLieuDieuKyRepository,
  ) {}

  public async saveCategories(categories: TldkCategory[]) {
    await this.categoryRepository.save(categories);
  }

  public async getCategories(): Promise<TldkCategory[]> {
    return await this.categoryRepository.find();
  }

  public async saveDocuments(documents: TldkDocument[]) {
    const MAX = 500;
    for (let i = 0; i < documents.length; i += MAX) {
      await this.documentRepository.save(documents.slice(i, i + MAX));
    }
  }

  public async getDocumentsByCategory(
    category: TldkCategory,
  ): Promise<TldkDocument[]> {
    // Handle Article
    if (this.isArticleCategory(category.link)) {
      const articles = await this.repository.getArticleLinks(
        category.link,
        category.page,
      );
      const documents = articles.map((article) => {
        const document: TldkDocument = this.documentRepository.create();
        document.link = article.link;
        document.name = article.name;
        document.category = category;
        document.categoryPage = category.page;
        return document;
      });
      return documents;
    }

    // Handle Ebook
    if (this.isEbookCategory(category.link)) {
      const ebooks = await this.repository.getEbookLinks(
        category.link,
        category.page,
      );
      const documents = ebooks.map((ebook) => {
        const document = this.documentRepository.create();
        document.link = ebook.link;
        document.name = ebook.name;
        document.category = category;
        document.categoryPage = category.page;
        return document;
      });
      return documents;
    }

    //
    return [];
  }

  private isArticleCategory(link: string) {
    return link.match(/baiviet\/tag/);
  }

  private isEbookCategory(link: string) {
    return link.match(/ebook/);
  }
}
