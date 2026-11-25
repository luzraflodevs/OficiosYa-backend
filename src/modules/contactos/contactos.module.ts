
import { Module } from '@nestjs/common';
import { ContactosService } from './contactos.service.js';
import { ContactosController } from './contactos.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ContactosController],
  providers: [ContactosService],
})
export class ContactosModule {}
