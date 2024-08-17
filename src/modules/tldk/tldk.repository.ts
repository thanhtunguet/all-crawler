import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { TldkCategory } from 'src/entities';

@Injectable()
class TaiLieuDieuKyRepository {
  async getLastPage(link: string): Promise<number> {
    try {
      const response = await axios.get(link);
      const $ = cheerio.load(response.data);
      const lastPageLink = $('.page-numbers').last().attr('href');
      if (!lastPageLink) return 1;

      const match = lastPageLink.match(/page\/(\d+)/);
      return match ? parseInt(match[1], 10) : 1;
    } catch (error) {
      console.error(`Error getting last page for ${link}:`, error);
      throw error;
    }
  }

  async getEbookLinks(link: string, page: number): Promise<string[]> {
    try {
      const response = await axios.get(link);
      const $ = cheerio.load(response.data);
      const ebookLinks: string[] = [];
      $('.download').each((index, element) => {
        const href = $(element).attr('href');
        if (href) ebookLinks.push(href);
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

  async getArticleLinks(link: string, page: number): Promise<string[]> {
    try {
      const response = await axios.get(link);
      const $ = cheerio.load(response.data);

      const downloadLinks = [];

      const articleLinks: string[] = [];

      $('a[rel="bookmark"]').each((index, element) => {
        const href = $(element).attr('href');
        if (href) articleLinks.push(href);
      });

      for (const articleLink of articleLinks) {
        const res = await axios.get(articleLink);
        const $ = cheerio.load(res.data);
        $('p.download a').each(function () {
          const downloadHref = $(this).attr('href');
          downloadLinks.push(downloadHref);
        });
      }

      return downloadLinks;
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
        (index, element) => {
          const href = $(element).attr('href');
          if (href) {
            const promise = this.getLastPage(href).then((lastPage) => {
              const tldk: TldkCategory = new TldkCategory();
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
