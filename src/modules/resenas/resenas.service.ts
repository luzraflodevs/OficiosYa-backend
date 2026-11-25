import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateResenaDto } from './dto/create-resena.dto.js';
import { UpdateResenaDto } from './dto/update-resena.dto.js';

@Injectable()
export class ResenasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createResenaDto: CreateResenaDto) {
    await this.validarServicio(createResenaDto.servicio_id);
    await this.validarUsuario(createResenaDto.usuario_id);

    return this.prisma.resena.create({ data: createResenaDto });
  }

  findAll() {
    return this.prisma.resena.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
      include: {
        usuario: { select: { nombre: true, apellido: true } },
        servicio: { select: { titulo: true } },
      },
    });
  }

  async findOne(id: number) {
    const resena = await this.prisma.resena.findUnique({
      where: { id, activo: true },
      include: {
        usuario: { select: { nombre: true, apellido: true } },
        servicio: { select: { titulo: true } },
      },
    });

    if (!resena) {
      throw new NotFoundException(`No existe una reseña con id ${id}.`);
    }

    return resena;
  }

  async update(id: number, updateResenaDto: UpdateResenaDto) {
    if (updateResenaDto.activo === true) {
      const existe = await this.prisma.resena.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!existe) {
        throw new NotFoundException(`No existe una reseña con id ${id}.`);
      }
    } else {
      await this.findOne(id);
    }

    if (updateResenaDto.servicio_id) {
      await this.validarServicio(updateResenaDto.servicio_id);
    }
    if (updateResenaDto.usuario_id) {
      await this.validarUsuario(updateResenaDto.usuario_id);
    }

    return this.prisma.resena.update({
      where: { id },
      data: updateResenaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Borrado lógico: no se borra la fila, se marca como inactiva.
    return this.prisma.resena.update({
      where: { id },
      data: { activo: false },
    });
  }

  private async validarServicio(servicioId: number) {
    const servicio = await this.prisma.servicio.findUnique({
      where: { id: servicioId, activo: true },
      select: { id: true },
    });
    if (!servicio) {
      throw new NotFoundException(
        `No existe un servicio con id ${servicioId}.`,
      );
    }
  }

  private async validarUsuario(usuarioId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId, activo: true },
      select: { id: true },
    });
    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con id ${usuarioId}.`);
    }
  }
}
