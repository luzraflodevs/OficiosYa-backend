import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateServicioDto } from './dto/create-servicio.dto.js';
import { UpdateServicioDto } from './dto/update-servicio.dto.js';

@Injectable()
export class ServiciosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServicioDto: CreateServicioDto) {
    await this.validarProfesional(createServicioDto.profesional_id);
    await this.validarOficio(createServicioDto.oficio_id);

    return this.prisma.servicio.create({ data: createServicioDto });
  }

  findAll() {
    return this.prisma.servicio.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
      include: { oficio: true },
    });
  }

  async findOne(id: number) {
    const servicio = await this.prisma.servicio.findUnique({
      where: { id, activo: true },
      include: {
        oficio: true,
        profesional: {
          include: {
            usuario: {
              select: { nombre: true, apellido: true, telefono: true },
            },
            ubicacion: true,
          },
        },
        resenas: { where: { activo: true } },
      },
    });

    if (!servicio) {
      throw new NotFoundException(`No existe un servicio con id ${id}.`);
    }

    return servicio;
  }

  async update(id: number, updateServicioDto: UpdateServicioDto) {
    await this.findOne(id);

    if (updateServicioDto.profesional_id) {
      await this.validarProfesional(updateServicioDto.profesional_id);
    }
    if (updateServicioDto.oficio_id) {
      await this.validarOficio(updateServicioDto.oficio_id);
    }

    return this.prisma.servicio.update({
      where: { id },
      data: updateServicioDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Borrado lógico: no se borra la fila, se marca como inactiva.
    return this.prisma.servicio.update({
      where: { id },
      data: { activo: false },
    });
  }

  private async validarProfesional(profesionalId: number) {
    const profesional = await this.prisma.profesional.findUnique({
      where: { id: profesionalId, activo: true },
      select: { id: true },
    });
    if (!profesional) {
      throw new NotFoundException(
        `No existe un profesional con id ${profesionalId}.`,
      );
    }
  }

  private async validarOficio(oficioId: number) {
    const oficio = await this.prisma.oficio.findUnique({
      where: { id: oficioId, activo: true },
      select: { id: true },
    });
    if (!oficio) {
      throw new NotFoundException(`No existe un oficio con id ${oficioId}.`);
    }
  }
}
