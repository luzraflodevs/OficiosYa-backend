import { Test, TestingModule } from '@nestjs/testing';
import { OficiosController } from './oficios.controller.js';
import { OficiosService } from './oficios.service.js';

describe('OficiosController', () => {
  let controller: OficiosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OficiosController],
      providers: [OficiosService],
    }).compile();

    controller = module.get<OficiosController>(OficiosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
