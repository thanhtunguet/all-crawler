import { Test, TestingModule } from '@nestjs/testing';
import { GritCenterController } from './grit-center.controller';

describe('GritCenterController', () => {
  let controller: GritCenterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GritCenterController],
    }).compile();

    controller = module.get<GritCenterController>(GritCenterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
