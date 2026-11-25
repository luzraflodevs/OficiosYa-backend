
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
import { OficiosService } from './oficios.service.js';
import { CreateOficioDto } from './dto/create-oficio.dto.js';
import { UpdateOficioDto } from './dto/update-oficio.dto.js';
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

@Controller('oficios')
export class OficiosController {
  constructor(private readonly oficiosService: OficiosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateOficioDto,
    @Req() req: RequestAutenticada,
  ) {
    this.verificarAdmin(req.usuario);
    return this.oficiosService.create(dto);
  }

  @Get()
  findAll() {
    return this.oficiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.oficiosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOficioDto,
    @Req() req: RequestAutenticada,
  ) {
    this.verificarAdmin(req.usuario);
    return this.oficiosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestAutenticada,
  ) {
    this.verificarAdmin(req.usuario);
    return this.oficiosService.remove(id);
  }

  private verificarAdmin(usuario: UsuarioAutenticado) {
    if (usuario.rol !== RolUsuario.ADMIN) {
      throw new ForbiddenException(
        'Esta operación requiere permisos de administrador.',
      );
    }
  }
}
