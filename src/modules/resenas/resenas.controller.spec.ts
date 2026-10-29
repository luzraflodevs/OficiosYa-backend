import { Test, TestingModule } from '@nestjs/testing';
import { ResenasController } from './resenas.controller.js';
import { ResenasService } from './resenas.service.js';

describe('ResenasController', () => {
  let controller: ResenasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResenasController],
      providers: [ResenasService],
    }).compile();

    controller = module.get<ResenasController>(ResenasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
