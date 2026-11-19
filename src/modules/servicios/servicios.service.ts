import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateServicioDto } from './dto/create-servicio.dto.js';
import { UpdateServicioDto } from './dto/update-servicio.dto.js';

@Injectable()
export class ServiciosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createServicioDto: CreateServicioDto) {
    return this.prisma.servicio.create({
      data: createServicioDto,
      include: {
        oficio: true,
        profesional: {
          include: {
            usuario: { select: { nombre: true, apellido: true } },
            ubicacion: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.servicio.findMany({
      orderBy: { id: 'asc' },
      include: {
        oficio: true,
        profesional: {
          include: {
            usuario: { select: { nombre: true, apellido: true, telefono: true } },
            ubicacion: true,
          },
        },
        resenas: true,
      },
    });
  }

  async findOne(id: number) {
    const servicio = await this.prisma.servicio.findUnique({
      where: { id },
      include: {
        oficio: true,
        profesional: {
          include: {
            usuario: { select: { nombre: true, apellido: true, telefono: true } },
            ubicacion: true,
          },
        },
        resenas: {
          include: {
            usuario: { select: { nombre: true, apellido: true } },
          },
        },
      },
    });
    if (!servicio) {
      throw new NotFoundException(`No se encontró el servicio con id ${id}`);
    }
    return servicio;
  }

  async update(id: number, updateServicioDto: UpdateServicioDto) {
    await this.findOne(id);
    return this.prisma.servicio.update({
      where: { id },
      data: updateServicioDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.servicio.delete({
      where: { id },
    });
  }
}