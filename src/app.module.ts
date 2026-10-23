import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { ProfesionalesModule } from './modules/profesionales/profesionales.module.js';
import { OficiosModule } from './modules/oficios/oficios.module.js';
import { ServiciosModule } from './modules/servicios/servicios.module.js';
import { ContactosModule } from './modules/contactos/contactos.module.js';
import { ResenasModule } from './modules/resenas/resenas.module.js';

@Module({
  imports: [AuthModule, UsersModule, ProfesionalesModule, OficiosModule, ServiciosModule, ContactosModule, ResenasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
