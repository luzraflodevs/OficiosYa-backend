import { Module } from '@nestjs/common';
import { ResenasService } from './resenas.service.js';
import { ResenasController } from './resenas.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ResenasController],
  providers: [ResenasService],
})
export class ResenasModule {}
