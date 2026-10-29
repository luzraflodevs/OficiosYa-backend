import { Module } from '@nestjs/common';
import { ResenasService } from './resenas.service.js';
import { ResenasController } from './resenas.controller.js';

@Module({
  controllers: [ResenasController],
  providers: [ResenasService],
})
export class ResenasModule {}
