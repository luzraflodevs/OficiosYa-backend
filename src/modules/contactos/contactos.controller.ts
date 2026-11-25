
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
import { ContactosService } from './contactos.service.js';
import { CreateContactoDto } from './dto/create-contacto.dto.js';
import { UpdateContactoDto } from './dto/update-contacto.dto.js';
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

@Controller('contactos')
export class ContactosController {
  constructor(private readonly contactosService: ContactosService) {}

  @Post()
  create(@Body() dto: CreateContactoDto) {
    return this.contactosService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: RequestAutenticada) {
    this.verificarAdmin(req.usuario);
    return this.contactosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestAutenticada,
  ) {
    this.verificarAdmin(req.usuario);
    return this.contactosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactoDto,
    @Req() req: RequestAutenticada,
  ) {
    this.verificarAdmin(req.usuario);
    return this.contactosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestAutenticada,
  ) {
    this.verificarAdmin(req.usuario);
    return this.contactosService.remove(id);
  }

  private verificarAdmin(usuario: UsuarioAutenticado) {
    if (usuario.rol !== RolUsuario.ADMIN) {
      throw new ForbiddenException(
        'Esta operación requiere permisos de administrador.',
      );
    }
  }
}
