import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuthDto: CreateAuthDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: { correo: createAuthDto.correo },
    });
    if (existe) {
      throw new BadRequestException('El correo ya se encuentra registrado');
    }

    const { contrasena, ...resto } = createAuthDto;
    const usuario = await this.prisma.usuario.create({
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
      },
    });

    return {
      mensaje: 'Usuario registrado correctamente',
      usuario,
    };
  }

  findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
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
        rol: true,
      },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    await this.findOne(id);
    const { contrasena, ...resto } = updateAuthDto;
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
        rol: true,
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