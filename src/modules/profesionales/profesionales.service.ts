import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto.js';
import { UpdateProfesionaleDto } from './dto/update-profesionale.dto.js';

@Injectable()
export class ProfesionalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfesionaleDto: CreateProfesionaleDto) {
    await this.validarUsuario(createProfesionaleDto.usuario_id);
    await this.validarUbicacion(createProfesionaleDto.ubicacion_id);

    return this.prisma.profesional.create({ data: createProfesionaleDto });
  }

  findAll() {
    return this.prisma.profesional.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
      include: {
        usuario: {
          select: { nombre: true, apellido: true, email: true, telefono: true },
        },
        ubicacion: true,
      },
    });
  }

  async findOne(id: number) {
    const profesional = await this.prisma.profesional.findUnique({
      where: { id, activo: true },
      include: {
        usuario: {
          select: { nombre: true, apellido: true, email: true, telefono: true },
        },
        ubicacion: true,
        servicios: { where: { activo: true } },
      },
    });

    if (!profesional) {
      throw new NotFoundException(`No existe un profesional con id ${id}.`);
    }

    return profesional;
  }

  async update(id: number, updateProfesionaleDto: UpdateProfesionaleDto) {
    if (updateProfesionaleDto.activo === true) {
      const existe = await this.prisma.profesional.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!existe) {
        throw new NotFoundException(`No existe un profesional con id ${id}.`);
      }
    } else {
      await this.findOne(id);
    }

    if (updateProfesionaleDto.usuario_id) {
      await this.validarUsuario(updateProfesionaleDto.usuario_id, id);
    }
    if (updateProfesionaleDto.ubicacion_id) {
      await this.validarUbicacion(updateProfesionaleDto.ubicacion_id);
    }

    return this.prisma.profesional.update({
      where: { id },
      data: updateProfesionaleDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Borrado lógico: no se borra la fila, se marca como inactiva.
    return this.prisma.profesional.update({
      where: { id },
      data: { activo: false },
    });
  }

  // El usuario tiene que existir y no puede tener ya un perfil de profesional
  // (la relación usuario - profesional es de uno a uno).
  private async validarUsuario(usuarioId: number, profesionalId?: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId, activo: true },
      select: { id: true },
    });
    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con id ${usuarioId}.`);
    }

    const existente = await this.prisma.profesional.findUnique({
      where: { usuario_id: usuarioId },
      select: { id: true },
    });
    if (existente && existente.id !== profesionalId) {
      throw new ConflictException(
        'Ese usuario ya tiene un perfil de profesional.',
      );
    }
  }

  private async validarUbicacion(ubicacionId: number) {
    const ubicacion = await this.prisma.ubicacion.findUnique({
      where: { id: ubicacionId },
      select: { id: true },
    });
    if (!ubicacion) {
      throw new NotFoundException(
        `No existe una ubicación con id ${ubicacionId}.`,
      );
    }
  }
}
