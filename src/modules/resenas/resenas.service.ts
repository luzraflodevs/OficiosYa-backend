
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateResenaDto } from './dto/create-resena.dto.js';
import { UpdateResenaDto } from './dto/update-resena.dto.js';

@Injectable()
export class ResenasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateResenaDto) {
    if (dto.activo === false) {
      throw new BadRequestException(
        'Una reseña nueva debe estar activa.',
      );
    }

    await this.validarUsuario(dto.usuario_id);

    const servicio = await this.prisma.servicio.findUnique({
      where: {
        id: dto.servicio_id,
        activo: true,
        profesional: {
          activo: true,
          usuario: { activo: true },
        },
        oficio: { activo: true },
      },
      select: {
        id: true,
        profesional: {
          select: { usuario_id: true },
        },
      },
    });

    if (!servicio) {
      throw new NotFoundException(
        `No existe un servicio disponible con id ${dto.servicio_id}.`,
      );
    }

    if (servicio.profesional.usuario_id === dto.usuario_id) {
      throw new BadRequestException(
        'No podés reseñar tus propios servicios.',
      );
    }

    const existente = await this.prisma.resena.findFirst({
      where: {
        usuario_id: dto.usuario_id,
        servicio_id: dto.servicio_id,
      },
      select: { id: true },
    });

    if (existente) {
      throw new ConflictException(
        'Ya publicaste una reseña para este servicio.',
      );
    }

    return this.prisma.resena.create({
      data: {
        usuario_id: dto.usuario_id,
        servicio_id: dto.servicio_id,
        calificacion: dto.calificacion,
        comentario: dto.comentario,
        activo: true,
      },
    });
  }

  findAll() {
    return this.prisma.resena.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
      include: {
        usuario: {
          select: { nombre: true, apellido: true },
        },
        servicio: {
          select: { titulo: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const resena = await this.prisma.resena.findUnique({
      where: { id, activo: true },
      include: {
        usuario: {
          select: { nombre: true, apellido: true },
        },
        servicio: {
          select: { titulo: true },
        },
      },
    });

    if (!resena) {
      throw new NotFoundException(
        `No existe una reseña con id ${id}.`,
      );
    }

    return resena;
  }

  async update(id: number, dto: UpdateResenaDto) {
    const { usuario_id, servicio_id, activo, ...datos } = dto;

    if (
      usuario_id !== undefined ||
      servicio_id !== undefined
    ) {
      throw new BadRequestException(
        'No se puede cambiar el autor ni el servicio de una reseña.',
      );
    }

    if (activo === true) {
      const existe = await this.prisma.resena.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existe) {
        throw new NotFoundException(
          `No existe una reseña con id ${id}.`,
        );
      }
    } else {
      await this.findOne(id);
    }

    return this.prisma.resena.update({
      where: { id },
      data: {
        ...datos,
        ...(activo !== undefined ? { activo } : {}),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.resena.update({
      where: { id },
      data: { activo: false },
    });
  }

  private async validarUsuario(usuarioId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId, activo: true },
      select: { id: true },
    });

    if (!usuario) {
      throw new NotFoundException(
        `No existe un usuario activo con id ${usuarioId}.`,
      );
    }
  }
}
