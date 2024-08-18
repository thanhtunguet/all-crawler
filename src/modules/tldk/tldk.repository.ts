import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { TldkCategory } from 'src/entities';
import { slugify } from 'src/helpers/slugify';
import { DocumentDto } from './dtos/document.dto';

@Injectable()
class TaiLieuDieuKyRepository {
  async getLastPage(link: string): Promise<number> {
    try {
      const response = await axios.get(link);
      const $ = cheerio.load(response.data);
      const lastPageLink = $('.page-number ul').children().eq(-2).text().trim();
      if (!lastPageLink) return 1;
      return Number(lastPageLink);
    } catch (error) {
      console.error(`Error getting last page for ${link}:`, error);
      throw error;
    }
  }

  async getEbookLinks(link: string, page: number): Promise<DocumentDto[]> {
    try {
      const pageNumber = page < 10 ? `0${page}` : `${page}`;
      const pageLink = link.replace(/page=[0-9]+/, `page=${pageNumber}`);
      const response = await axios.get(pageLink);
      const $ = cheerio.load(response.data);
      const ebookLinks: DocumentDto[] = [];
      $('.book-item').each(function () {
        const href = $(this).find('a').attr('href');
        const name = $(this).find('h2.booktitle').text();
        const document = new DocumentDto();
        document.link = href;
        document.name = name;
        if (!!href && !!name) ebookLinks.push(document);
      });
      return ebookLinks;
    } catch (error) {
      console.error(
        `Error getting ebook links from ${link} page ${page}:`,
        error,
      );
      throw error;
    }
  }

  async getArticleLinks(link: string, page: number): Promise<DocumentDto[]> {
    try {
      const pageLink = `${link.replace(/page\/[0-9]+\//, '')}page/${page}/`;
      console.log(pageLink);
      const documents: DocumentDto[] = [];
      const response = await axios.get(pageLink);
      const $ = cheerio.load(response.data);

      const articleLinks: string[] = [];

      $('a[rel="bookmark"]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) articleLinks.push(href);
      });

      for (const articleLink of articleLinks) {
        const res = await axios.get(articleLink);
        const $ = cheerio.load(res.data);
        $('.download a').each(function () {
          const downloadHref = $(this).attr('href');
          const name = $(this).text().trim();
          const document = new DocumentDto();
          document.link = downloadHref;
          document.name = name.replace('Tải xuống: ', '');
          documents.push(document);
        });
      }

      return documents;
    } catch (error) {
      console.error(
        `Error getting article links from ${link} page ${page}:`,
        error,
      );
      throw error;
    }
  }

  async getListMasterPages(): Promise<TldkCategory[]> {
    try {
      const response = await axios.get(
        'https://tailieudieuky.com/baiviet/tai-lieu-va-ebook/',
      );
      const $ = cheerio.load(response.data);
      const promises: Promise<TldkCategory>[] = [];

      $('.pagelayer-btn-holder.pagelayer-ele-link.pagelayer-btn-custom').each(
        (_, element) => {
          const href = $(element).attr('href');
          const title = $(element).text().trim();
          if (href) {
            const promise = this.getLastPage(href).then((lastPage) => {
              const tldk: TldkCategory = new TldkCategory();
              tldk.name = title;
              tldk.slug = slugify(title);
              tldk.categoryLink = href;
              tldk.numberOfPage = lastPage;
              return tldk;
            });
            promises.push(promise);
          }
        },
      );

      const links = await Promise.all(promises);
      return links;
    } catch (error) {
      console.error('Error getting list master pages:', error);
      throw error;
    }
  }
}

export default TaiLieuDieuKyRepository;
