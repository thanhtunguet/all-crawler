import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkPage } from 'src/entities';
import { Repository } from 'typeorm';
import TaiLieuDieuKyRepository from './tldk.repository';

@Injectable()
export class TldkService {
  private async sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  private extractGoogleDriveId(url: string): string {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : '';
  }

  private isGoogleDocs(url: string): boolean {
    return url.includes('docs.google.com/document');
  }

  private isFolder(url: string): boolean {
    return url.includes('drive.google.com/drive/folders');
  }

  constructor(
    private readonly repository: TaiLieuDieuKyRepository,
    @InjectRepository(LinkPage)
    private readonly linkPageRepository: Repository<LinkPage>,
  ) {}

  async crawl(): Promise<void> {
    const masterPages = await this.repository.getListMasterPages();
    for (const masterPage of masterPages) {
      const { categoryLink, lastPage } = masterPage;
      for (let page = 1; page <= lastPage; page++) {
        const ebookLinks = await this.repository.getEbookLinks(
          categoryLink,
          page,
        );
        const articleLinks = await this.repository.getArticleLinks(
          categoryLink,
          page,
        );

        const documentLinks = [...ebookLinks, ...articleLinks];

        for (const documentLink of documentLinks) {
          const linkPage = this.linkPageRepository.create();
          linkPage.categoryLink = categoryLink;
          linkPage.pageNumber = page;
          linkPage.documentLink = documentLink;
          linkPage.googleDriveId = this.extractGoogleDriveId(documentLink);
          linkPage.isGoogleDocs = this.isGoogleDocs(documentLink);
          linkPage.isFolder = this.isFolder(documentLink);
          await this.linkPageRepository.save(linkPage);
        }
      }
    }
  }
}
