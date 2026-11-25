
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ServiciosService } from './servicios.service.js';
import { CreateServicioDto } from './dto/create-servicio.dto.js';
import { UpdateServicioDto } from './dto/update-servicio.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolUsuario } from '../../generated/prisma/enums.js';

type UsuarioAutenticado = {
  id: number;
  email: string;
  rol: RolUsuario;
};

type RequestAutenticada = Request & {
  usuario: UsuarioAutenticado;
};

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateServicioDto,
    @Req() req: RequestAutenticada,
  ) {
    if (
      req.usuario.rol !== RolUsuario.PROFESIONAL &&
      req.usuario.rol !== RolUsuario.ADMIN
    ) {
      throw new ForbiddenException(
        'Solo los profesionales pueden publicar servicios.',
      );
    }

    await this.verificarPropietario(
      dto.profesional_id,
      req.usuario,
    );

    return this.serviciosService.create(dto);
  }

  @Get()
  findAll() {
    return this.serviciosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServicioDto,
    @Req() req: RequestAutenticada,
  ) {
    const servicio = await this.serviciosService.findOne(id);

    await this.verificarPropietario(
      servicio.profesional_id,
      req.usuario,
    );

    if (dto.profesional_id !== undefined) {
      throw new ForbiddenException(
        'No está permitido cambiar el propietario de un servicio.',
      );
    }

    if (
      req.usuario.rol !== RolUsuario.ADMIN &&
      dto.activo !== undefined
    ) {
      throw new ForbiddenException(
        'No tenés permisos para modificar el estado del servicio.',
      );
    }

    return this.serviciosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestAutenticada,
  ) {
    const servicio = await this.serviciosService.findOne(id);

    await this.verificarPropietario(
      servicio.profesional_id,
      req.usuario,
    );

    return this.serviciosService.remove(id);
  }

  private async verificarPropietario(
    profesionalId: number,
    usuario: UsuarioAutenticado,
  ) {
    if (usuario.rol === RolUsuario.ADMIN) {
      return;
    }

    const profesional =
      await this.serviciosService.obtenerPropietario(profesionalId);

    if (profesional.usuario_id !== usuario.id) {
      throw new ForbiddenException(
        'No tenés permisos para administrar este servicio.',
      );
    }
  }
}
