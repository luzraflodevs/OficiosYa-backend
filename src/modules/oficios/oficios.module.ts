import { Module } from '@nestjs/common';
import { OficiosService } from './oficios.service.js';
import { OficiosController } from './oficios.controller.js';

@Module({
  controllers: [OficiosController],
  providers: [OficiosService],
})
export class OficiosModule {}
