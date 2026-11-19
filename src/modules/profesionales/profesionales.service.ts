import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto.js';
import { UpdateProfesionaleDto } from './dto/update-profesionale.dto.js';

@Injectable()
export class ProfesionalesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfesionaleDto: CreateProfesionaleDto) {
    return this.prisma.profesional.create({
      data: createProfesionaleDto,
      include: {
        usuario: {
          select: { id: true, nombre: true, apellido: true, correo: true, telefono: true },
        },
        ubicacion: true,
      },
    });
  }

  findAll() {
    return this.prisma.profesional.findMany({
      orderBy: { id: 'asc' },
      include: {
        usuario: {
          select: { id: true, nombre: true, apellido: true, correo: true, telefono: true },
        },
        ubicacion: true,
        servicios: true,
      },
    });
  }

  async findOne(id: number) {
    const profesional = await this.prisma.profesional.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { id: true, nombre: true, apellido: true, correo: true, telefono: true },
        },
        ubicacion: true,
        servicios: {
          include: { oficio: true },
        },
      },
    });
    if (!profesional) {
      throw new NotFoundException(`No se encontró el profesional con id ${id}`);
    }
    return profesional;
  }

  async update(id: number, updateProfesionaleDto: UpdateProfesionaleDto) {
    await this.findOne(id);
    return this.prisma.profesional.update({
      where: { id },
      data: updateProfesionaleDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.profesional.delete({
      where: { id },
    });
  }
}