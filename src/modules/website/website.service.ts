import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Website } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectRepository(Website) private repository: Repository<Website>,
  ) {}

  list(): Promise<Website[]> {
    return this.repository.find({
      relations: ['categories'],
    });
  }

  count(): Promise<number> {
    return this.repository.count();
  }

  getById(id: number): Promise<Website> {
    return this.repository.findOne({
      where: {
        id,
      },
      relations: ['categories'],
    });
  }
}
