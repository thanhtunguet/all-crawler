import { Test, TestingModule } from '@nestjs/testing';
import { TldkController } from './tldk.controller';

describe('TldkController', () => {
  let controller: TldkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TldkController],
    }).compile();

    controller = module.get<TldkController>(TldkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
