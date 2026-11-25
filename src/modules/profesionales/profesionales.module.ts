import { Module } from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service.js';
import { ProfesionalesController } from './profesionales.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ProfesionalesController],
  providers: [ProfesionalesService],
})
export class ProfesionalesModule {}
