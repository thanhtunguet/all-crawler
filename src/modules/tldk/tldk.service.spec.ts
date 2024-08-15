import { Test, TestingModule } from '@nestjs/testing';
import { TldkService } from './tldk.service';

describe('TldkService', () => {
  let service: TldkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TldkService],
    }).compile();

    service = module.get<TldkService>(TldkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
