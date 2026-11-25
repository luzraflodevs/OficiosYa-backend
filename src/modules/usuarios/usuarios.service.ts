import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';

// Campos que se devuelven del usuario. contrasena_hash NO está:
// la contraseña nunca sale en las respuestas.
const camposUsuario = {
  id: true,
  nombre: true,
  apellido: true,
  email: true,
  telefono: true,
  rol: true,
  activo: true,
  creado_en: true,
  actualizado_en: true,
};

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.usuario.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
      select: camposUsuario,
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id, activo: true },
      select: camposUsuario,
    });

    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con id ${id}.`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    if (updateUsuarioDto.activo === true) {
      const existe = await this.prisma.usuario.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!existe) {
        throw new NotFoundException(`No existe un usuario con id ${id}.`);
      }
    } else {
      await this.findOne(id);
    }

    if (updateUsuarioDto.email) {
      await this.validarEmail(updateUsuarioDto.email, id);
    }

    return this.prisma.usuario.update({
      where: { id },
      data: updateUsuarioDto,
      select: camposUsuario,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Borrado lógico: no se borra la fila, se marca como inactiva.
    return this.prisma.usuario.update({
      where: { id },
      data: { activo: false },
      select: camposUsuario,
    });
  }

  private async validarEmail(email: string, usuarioId: number) {
    const existente = await this.prisma.usuario.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existente && existente.id !== usuarioId) {
      throw new ConflictException(
        'Ya existe una cuenta con ese correo electrónico.',
      );
    }
  }
}
