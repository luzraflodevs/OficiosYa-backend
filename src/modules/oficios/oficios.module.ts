
import { Module } from '@nestjs/common';
import { OficiosService } from './oficios.service.js';
import { OficiosController } from './oficios.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [OficiosController],
  providers: [OficiosService],
})
export class OficiosModule {}
