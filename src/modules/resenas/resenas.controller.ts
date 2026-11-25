
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
import { ResenasService } from './resenas.service.js';
import { CreateResenaDto } from './dto/create-resena.dto.js';
import { UpdateResenaDto } from './dto/update-resena.dto.js';
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

@Controller('resenas')
export class ResenasController {
  constructor(private readonly resenasService: ResenasService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateResenaDto,
    @Req() req: RequestAutenticada,
  ) {
    if (dto.usuario_id !== req.usuario.id) {
      throw new ForbiddenException(
        'No podés publicar reseñas a nombre de otro usuario.',
      );
    }

    return this.resenasService.create(dto);
  }

  @Get()
  findAll() {
    return this.resenasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resenasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResenaDto,
    @Req() req: RequestAutenticada,
  ) {
    const resena = await this.resenasService.findOne(id);

    if (
      req.usuario.rol !== RolUsuario.ADMIN &&
      resena.usuario_id !== req.usuario.id
    ) {
      throw new ForbiddenException(
        'No tenés permisos para modificar esta reseña.',
      );
    }

    if (
      dto.usuario_id !== undefined ||
      dto.servicio_id !== undefined
    ) {
      throw new ForbiddenException(
        'No se puede cambiar el autor ni el servicio de una reseña.',
      );
    }

    if (
      req.usuario.rol !== RolUsuario.ADMIN &&
      dto.activo !== undefined
    ) {
      throw new ForbiddenException(
        'No tenés permisos para modificar el estado de una reseña.',
      );
    }

    return this.resenasService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestAutenticada,
  ) {
    const resena = await this.resenasService.findOne(id);

    if (
      req.usuario.rol !== RolUsuario.ADMIN &&
      resena.usuario_id !== req.usuario.id
    ) {
      throw new ForbiddenException(
        'No tenés permisos para eliminar esta reseña.',
      );
    }

    return this.resenasService.remove(id);
  }
}
