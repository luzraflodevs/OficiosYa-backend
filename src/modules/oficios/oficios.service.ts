import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOficioDto } from './dto/create-oficio.dto.js';
import { UpdateOficioDto } from './dto/update-oficio.dto.js';

@Injectable()
export class OficiosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOficioDto: CreateOficioDto) {
    await this.validarNombre(createOficioDto.nombre);

    return this.prisma.oficio.create({ data: createOficioDto });
  }

  findAll() {
    return this.prisma.oficio.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const oficio = await this.prisma.oficio.findUnique({
      where: { id, activo: true },
      include: { servicios: { where: { activo: true } } },
    });

    if (!oficio) {
      throw new NotFoundException(`No existe un oficio con id ${id}.`);
    }

    return oficio;
  }

  async update(id: number, updateOficioDto: UpdateOficioDto) {
    await this.findOne(id);

    if (updateOficioDto.nombre) {
      await this.validarNombre(updateOficioDto.nombre, id);
    }

    return this.prisma.oficio.update({
      where: { id },
      data: updateOficioDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Borrado lógico: no se borra la fila, se marca como inactiva.
    return this.prisma.oficio.update({
      where: { id },
      data: { activo: false },
    });
  }

  // El nombre del oficio es único en la base: si ya existe otro con
  // ese nombre, se responde 409 en lugar de dejar que falle la base.
  private async validarNombre(nombre: string, oficioId?: number) {
    const existente = await this.prisma.oficio.findUnique({
      where: { nombre },
      select: { id: true },
    });

    if (existente && existente.id !== oficioId) {
      throw new ConflictException('Ya existe un oficio con ese nombre.');
    }
  }
}
