import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { LinkPage } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
class TaiLieuDieuKyRepository {
  constructor(
    @InjectRepository(LinkPage)
    private readonly linkPageRepository: Repository<LinkPage>,
  ) {}

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
      $('.ebook-link').each((index, element) => {
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
      const articleLinks: string[] = [];
      $('.article-link').each((index, element) => {
        const href = $(element).attr('href');
        if (href) articleLinks.push(href);
      });
      return articleLinks;
    } catch (error) {
      console.error(
        `Error getting article links from ${link} page ${page}:`,
        error,
      );
      throw error;
    }
  }

  async getListMasterPages(): Promise<
    { categoryLink: string; lastPage: number }[]
  > {
    try {
      const response = await axios.get(
        'https://tailieudieuky.com/baiviet/tai-lieu-va-ebook/',
      );
      const $ = cheerio.load(response.data);
      const promises: Promise<{ categoryLink: string; lastPage: number }>[] =
        [];

      $('.pagelayer-btn-holder.pagelayer-ele-link.pagelayer-btn-custom').each(
        (index, element) => {
          const href = $(element).attr('href');
          if (href) {
            const promise = this.getLastPage(href).then((lastPage) => ({
              categoryLink: href,
              lastPage,
            }));
            promises.push(promise);
          }
        },
      );

      return await Promise.all(promises);
    } catch (error) {
      console.error('Error getting list master pages:', error);
      throw error;
    }
  }
}

export default TaiLieuDieuKyRepository;
