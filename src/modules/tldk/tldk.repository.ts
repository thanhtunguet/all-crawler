import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { TldkCategory, TldkLink } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
class TaiLieuDieuKyRepository {
  constructor(
    @InjectRepository(TldkLink)
    private readonly linkPageRepository: Repository<TldkLink>,
    @InjectRepository(TldkCategory)
    private readonly categoryRepository: Repository<TldkCategory>,
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
              const tldk: TldkCategory = this.categoryRepository.create();
              tldk.categoryLink = href;
              tldk.numberOfPage = lastPage;
              return tldk;
            });
            promises.push(promise);
          }
        },
      );

      const links = await Promise.all(promises);
      await this.categoryRepository.save(links);
      return links;
    } catch (error) {
      console.error('Error getting list master pages:', error);
      throw error;
    }
  }
}

export default TaiLieuDieuKyRepository;
