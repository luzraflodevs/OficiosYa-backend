import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service.js';
import { ServiciosController } from './servicios.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ServiciosController],
  providers: [ServiciosService],
})
export class ServiciosModule {}
