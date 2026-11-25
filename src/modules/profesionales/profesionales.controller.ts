
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
import { ProfesionalesService } from './profesionales.service.js';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto.js';
import { UpdateProfesionaleDto } from './dto/update-profesionale.dto.js';
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

@Controller('profesionales')
export class ProfesionalesController {
  constructor(private readonly profesionalesService: ProfesionalesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateProfesionaleDto,
    @Req() req: RequestAutenticada,
  ) {
    if (
      req.usuario.rol !== RolUsuario.ADMIN &&
      dto.usuario_id !== req.usuario.id
    ) {
      throw new ForbiddenException(
        'Solo podés crear un perfil profesional para tu propia cuenta.',
      );
    }

    return this.profesionalesService.create(dto);
  }

  @Get()
  findAll() {
    return this.profesionalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profesionalesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfesionaleDto,
    @Req() req: RequestAutenticada,
  ) {
    const profesional = await this.profesionalesService.findOne(id);

    if (
      req.usuario.rol !== RolUsuario.ADMIN &&
      profesional.usuario_id !== req.usuario.id
    ) {
      throw new ForbiddenException(
        'No tenés permisos para modificar este perfil.',
      );
    }

    if (dto.usuario_id !== undefined) {
      throw new ForbiddenException(
        'No está permitido cambiar el propietario del perfil.',
      );
    }

    if (
      req.usuario.rol !== RolUsuario.ADMIN &&
      dto.activo !== undefined
    ) {
      throw new ForbiddenException(
        'No tenés permisos para modificar el estado del perfil.',
      );
    }

    return this.profesionalesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestAutenticada,
  ) {
    const profesional = await this.profesionalesService.findOne(id);

    if (
      req.usuario.rol !== RolUsuario.ADMIN &&
      profesional.usuario_id !== req.usuario.id
    ) {
      throw new ForbiddenException(
        'No tenés permisos para eliminar este perfil.',
      );
    }

    return this.profesionalesService.remove(id);
  }
}
