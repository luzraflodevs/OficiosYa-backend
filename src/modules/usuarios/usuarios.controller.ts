import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsuariosService } from './usuarios.service.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
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

@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Get()
  findAll(@Req() req: RequestAutenticada) {
    this.verificarAdmin(req.usuario);
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestAutenticada,
  ) {
    this.verificarPropietarioOAdmin(req.usuario, id);
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Req() req: RequestAutenticada,
  ) {
    this.verificarPropietarioOAdmin(req.usuario, id);

    if (
      req.usuario.rol !== RolUsuario.ADMIN &&
      updateUsuarioDto.activo !== undefined
    ) {
      throw new ForbiddenException(
        'No tenés permisos para modificar el estado de una cuenta.',
      );
    }

    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestAutenticada,
  ) {
    this.verificarAdmin(req.usuario);
    return this.usuariosService.remove(id);
  }

  private verificarAdmin(usuario: UsuarioAutenticado) {
    if (usuario.rol !== RolUsuario.ADMIN) {
      throw new ForbiddenException(
        'Esta operación requiere permisos de administrador.',
      );
    }
  }

  private verificarPropietarioOAdmin(
    usuario: UsuarioAutenticado,
    id: number,
  ) {
    if (usuario.rol !== RolUsuario.ADMIN && usuario.id !== id) {
      throw new ForbiddenException(
        'No tenés permisos para acceder a este usuario.',
      );
    }
  }
}
