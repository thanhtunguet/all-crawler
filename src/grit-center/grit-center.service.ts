import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GritArticle, GritDocument, GritGoogleDocs } from 'src/entities';
import { Repository } from 'typeorm';
import { GritCenterDocumentDto } from './dtos/grit-center.dto';

@Injectable()
export class GritCenterService {
  constructor(
    @InjectRepository(GritArticle)
    private readonly gritArticleRepository: Repository<GritArticle>,
    @InjectRepository(GritDocument)
    private readonly gritDocumentRepository: Repository<GritDocument>,
    @InjectRepository(GritGoogleDocs)
    private readonly gritGoogleDocsRepository: Repository<GritGoogleDocs>,
  ) {}
  public async syncJson(list: GritCenterDocumentDto[]) {
    for (const article of list) {
      let articleDAO: GritArticle = this.gritArticleRepository.create();

      article.id = article.id;
      articleDAO.title = article.title;
      articleDAO.slug = article.slug;
      articleDAO.description = article.description;
      articleDAO.content = article.content;
      articleDAO.image = article.image;
      articleDAO.type = Number(article.type);
      articleDAO.fileAudio = article.file_audio;
      articleDAO.filePdf = article.file_pdf;
      articleDAO.link = article.link;
      articleDAO.typeName = article.type_name;
      articleDAO.isBookmark = article.is_bookmark;

      articleDAO = await this.gritArticleRepository.save(articleDAO);

      const documents = article.orther_documents.map((document) => {
        const documentDAO: GritDocument = this.gritDocumentRepository.create();
        document.id = document.id;
        documentDAO.categoryId = article.id;
        documentDAO.title = document.title;
        documentDAO.link = document.link;
        documentDAO.description = document.description;
        documentDAO.image = document.image;
        documentDAO.content = document.content;
        documentDAO.createdAt = new Date(document.created_at);
        documentDAO.updatedAt = new Date(document.updated_at);
        documentDAO.type = Number(document.type);
        documentDAO.status = Number(document.status);
        documentDAO.keyWords = document.key_words;
        documentDAO.fileAudio = document.file_audio;
        documentDAO.filePdf = document.file_pdf;
        documentDAO.slug = document.slug;
        documentDAO.feeType = Number(document.fee_type);
        documentDAO.gritArticle = articleDAO;
        return documentDAO;
      });
      await this.gritDocumentRepository.insert(documents);
    }
  }

  public async googleDocs() {
    const articles = await this.gritArticleRepository.find();
    const documents = await this.gritDocumentRepository.find();

    const googleDocsArticleLinks = articles.reduce((links, article) => {
      const regex =
        /(https:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9-_]+)\//g;
      const matches = article.content?.match(regex);
      if (matches) {
        links.push(
          ...matches.map((match) => {
            const googleDocs = this.gritGoogleDocsRepository.create();
            const fileIdMatch = match.match(/\/d\/([a-zA-Z0-9-_]+)\/(.*)$/);
            if (fileIdMatch) {
              googleDocs.fileId = fileIdMatch[1];
            }
            googleDocs.gritArticleId = article.id;
            googleDocs.googleDocsLink = match;
            googleDocs.gritDocumentId = null;
            return googleDocs;
          }),
        );
      }
      return links;
    }, []);
    const googleDocsDocumentLinks = documents.reduce((links, document) => {
      const regex =
        /(https:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9-_]+)\//g;
      const matches = document.content?.match(regex);
      if (matches) {
        links.push(
          ...matches.map((match) => {
            const googleDocs = this.gritGoogleDocsRepository.create();
            const fileIdMatch = match.match(/\/d\/([a-zA-Z0-9-_]+)\/(.*)$/);
            if (fileIdMatch) {
              googleDocs.fileId = fileIdMatch[1];
            }
            googleDocs.gritArticleId = null;
            googleDocs.googleDocsLink = match;
            googleDocs.gritDocumentId = document.id;
            return googleDocs;
          }),
        );
      }
      return links;
    }, []);

    const links = [...googleDocsDocumentLinks, ...googleDocsArticleLinks];
    const CHUNK = 500;
    for (let i = 0; i < links.length; i += CHUNK) {
      const list = links.slice(i, i + CHUNK);
      await this.gritGoogleDocsRepository.insert(list);
    }
    return links.length;
  }

  private readonly reduceLink = (links, article) => {
    const regex =
      /(https:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9-_]+)\//g;
    const matches = article.content?.match(regex);
    if (matches) {
      links.push(
        ...matches.map((match) => {
          const googleDocs = this.gritGoogleDocsRepository.create();
          const fileIdMatch = match.match(/\/d\/([a-zA-Z0-9-_]+)\/(.*)$/);
          if (fileIdMatch) {
            googleDocs.fileId = fileIdMatch[1];
          }
          googleDocs.gritArticleId = article.id;
          googleDocs.googleDocsLink = match;
          googleDocs.gritDocumentId = null;
          return googleDocs;
        }),
      );
    }
    return links;
  };

  public async googleDocsLinks() {
    return this.gritGoogleDocsRepository
      .createQueryBuilder('gritGoogleDocs')
      .select('gritDocumentId, gritArticleId, googleDocsLink', 'googleDocsLink')
      .groupBy('fileId')
      .getRawMany()
      .then((results) =>
        results.map(({ googleDocsLink, gritArticleId, gritDocumentId }) => {
          return {
            link: googleDocsLink,
            id: Number(gritArticleId) || Number(gritDocumentId),
          };
        }),
      );
  }
}
