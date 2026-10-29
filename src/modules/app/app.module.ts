import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { ProfesionalesModule } from '../profesionales/profesionales.module.js';
import { OficiosModule } from '../oficios/oficios.module.js';
import { ServiciosModule } from '../servicios/servicios.module.js';
import { ContactosModule } from '../contactos/contactos.module.js';
import { ResenasModule } from '../resenas/resenas.module.js';

@Module({
  imports: [
    AuthModule,
    UsuariosModule,
    ProfesionalesModule,
    OficiosModule,
    ServiciosModule,
    ContactosModule,
    ResenasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}