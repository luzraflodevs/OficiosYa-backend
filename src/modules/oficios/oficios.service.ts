import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateOficioDto } from './dto/create-oficio.dto.js';
import { UpdateOficioDto } from './dto/update-oficio.dto.js';

@Injectable()
export class OficiosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOficioDto: CreateOficioDto) {
    return this.prisma.oficio.create({
      data: createOficioDto,
    });
  }

  findAll() {
    return this.prisma.oficio.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const oficio = await this.prisma.oficio.findUnique({
      where: { id },
      include: { servicios: true },
    });
    if (!oficio) {
      throw new NotFoundException(`No se encontró el oficio con id ${id}`);
    }
    return oficio;
  }

  async update(id: number, updateOficioDto: UpdateOficioDto) {
    await this.findOne(id);
    return this.prisma.oficio.update({
      where: { id },
      data: updateOficioDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.oficio.delete({
      where: { id },
    });
  }
}
