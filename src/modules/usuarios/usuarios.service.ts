import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: { correo: createUsuarioDto.correo },
    });
    if (existe) {
      throw new BadRequestException('Ya existe un usuario con ese correo');
    }

    const { contrasena, ...resto } = createUsuarioDto;
    return this.prisma.usuario.create({
      data: {
        ...resto,
        contrasena_hash: contrasena,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        telefono: true,
        rol: true,
        fecha_creacion: true,
        fecha_actualizacion: true,
      },
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        telefono: true,
        rol: true,
        fecha_creacion: true,
        fecha_actualizacion: true,
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        telefono: true,
        rol: true,
        fecha_creacion: true,
        fecha_actualizacion: true,
        profesional: true,
      },
    });
    if (!usuario) {
      throw new NotFoundException(`No se encontró el usuario con id ${id}`);
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);
    const { contrasena, ...resto } = updateUsuarioDto;

    return this.prisma.usuario.update({
      where: { id },
      data: {
        ...resto,
        ...(contrasena ? { contrasena_hash: contrasena } : {}),
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        telefono: true,
        rol: true,
        fecha_creacion: true,
        fecha_actualizacion: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}