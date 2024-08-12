import { Test, TestingModule } from '@nestjs/testing';
import { GritCenterService } from './grit-center.service';

describe('GritCenterService', () => {
  let service: GritCenterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GritCenterService],
    }).compile();

    service = module.get<GritCenterService>(GritCenterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
