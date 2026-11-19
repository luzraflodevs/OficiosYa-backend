import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateResenaDto } from './dto/create-resena.dto.js';
import { UpdateResenaDto } from './dto/update-resena.dto.js';

@Injectable()
export class ResenasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createResenaDto: CreateResenaDto) {
    return this.prisma.resena.create({
      data: createResenaDto,
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true } },
        servicio: { select: { id: true, titulo: true } },
      },
    });
  }

  findAll() {
    return this.prisma.resena.findMany({
      orderBy: { id: 'asc' },
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true } },
        servicio: { select: { id: true, titulo: true } },
      },
    });
  }

  async findOne(id: number) {
    const resena = await this.prisma.resena.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true } },
        servicio: { select: { id: true, titulo: true } },
      },
    });
    if (!resena) {
      throw new NotFoundException(`No se encontró la reseña con id ${id}`);
    }
    return resena;
  }

  async update(id: number, updateResenaDto: UpdateResenaDto) {
    await this.findOne(id);
    return this.prisma.resena.update({
      where: { id },
      data: updateResenaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.resena.delete({
      where: { id },
    });
  }
}