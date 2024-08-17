import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Repository } from 'typeorm';
import { TldkCategory, TldkLink } from '../../entities';
import TaiLieuDieuKyRepository from './tldk.repository';

// Mock axios and cheerio
jest.mock('axios');
jest.mock('cheerio');

describe('TaiLieuDieuKyRepository', () => {
  let repository: TaiLieuDieuKyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaiLieuDieuKyRepository,
        {
          provide: getRepositoryToken(TldkLink),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TldkCategory),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<TaiLieuDieuKyRepository>(TaiLieuDieuKyRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLastPage', () => {
    it('should return the last page number from the link', async () => {
      const mockHtml = '<a href="/page/3" class="page-numbers">3</a>';
      (axios.get as jest.Mock).mockResolvedValue({ data: mockHtml });
      const $ = cheerio.load(mockHtml);
      (cheerio.load as jest.Mock).mockReturnValue($);

      const result = await repository.getLastPage(
        'https://tailieudieuky.com/baiviet/tag/hoc-sinh-gioi-quoc-gia/',
      );

      expect(result).toBe(3);
    });

    it('should return 1 if no last page link is found', async () => {
      const mockHtml = '<a class="page-numbers">1</a>';
      (axios.get as jest.Mock).mockResolvedValue({ data: mockHtml });
      const $ = cheerio.load(mockHtml);
      (cheerio.load as jest.Mock).mockReturnValue($);

      const result = await repository.getLastPage('https://example.com');

      expect(result).toBe(1);
    });

    it('should throw an error if axios request fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(
        repository.getLastPage('https://example.com'),
      ).rejects.toThrow('Network error');
    });
  });

  describe('getEbookLinks', () => {
    it('should return an array of ebook links from the page', async () => {
      const mockHtml =
        '<a class="ebook-link" href="https://example.com/ebook1">Ebook 1</a>';
      (axios.get as jest.Mock).mockResolvedValue({ data: mockHtml });
      const $ = cheerio.load(mockHtml);
      (cheerio.load as jest.Mock).mockReturnValue($);

      const result = await repository.getEbookLinks('https://example.com', 1);

      expect(result).toEqual(['https://example.com/ebook1']);
    });

    it('should throw an error if axios request fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(
        repository.getEbookLinks('https://example.com', 1),
      ).rejects.toThrow('Network error');
    });
  });

  describe('getArticleLinks', () => {
    it('should return an array of article links from the page', async () => {
      const mockHtml =
        '<a class="pagelayer-btn-holder pagelayer-ele-link pagelayer-btn-custom" href="https://example.com/article1">Article 1</a>';
      (axios.get as jest.Mock).mockResolvedValue({ data: mockHtml });
      const $ = cheerio.load(mockHtml);
      (cheerio.load as jest.Mock).mockReturnValue($);

      const result = await repository.getArticleLinks('https://example.com', 1);

      expect(result).toEqual(['https://example.com/article1']);
    });

    it('should throw an error if axios request fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(
        repository.getArticleLinks('https://example.com', 1),
      ).rejects.toThrow('Network error');
    });
  });

  describe('getListMasterPages', () => {
    it('should return an array of TldkCategory entities and save them to the repository', async () => {
      const mockHtml =
        '<a class="pagelayer-btn-holder pagelayer-ele-link pagelayer-btn-custom" href="https://example.com/page1">Page 1</a>';
      (axios.get as jest.Mock).mockResolvedValue({ data: mockHtml });
      const $ = cheerio.load(mockHtml);
      (cheerio.load as jest.Mock).mockReturnValue($);

      const mockCategory = {
        categoryLink: 'https://example.com/page1',
        numberOfPage: 3,
      };
      const mockCategories = [mockCategory];
      jest.spyOn(repository, 'getLastPage').mockResolvedValue(3);

      const result = await repository.getListMasterPages();

      expect(result).toEqual(mockCategories);
    });

    it('should throw an error if axios request fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(repository.getListMasterPages()).rejects.toThrow(
        'Network error',
      );
    });
  });
});
