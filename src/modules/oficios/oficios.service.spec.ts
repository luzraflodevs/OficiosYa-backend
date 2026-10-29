import { Test, TestingModule } from '@nestjs/testing';
import { OficiosService } from './oficios.service.js';

describe('OficiosService', () => {
  let service: OficiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OficiosService],
    }).compile();

    service = module.get<OficiosService>(OficiosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
