
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateContactoDto } from './dto/create-contacto.dto.js';
import { UpdateContactoDto } from './dto/update-contacto.dto.js';

@Injectable()
export class ContactosService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateContactoDto) {
    return this.prisma.contacto.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        asunto: dto.asunto,
        mensaje: dto.mensaje,
        activo: true,
        leido: false,
      },
    });
  }

  findAll() {
    return this.prisma.contacto.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const contacto = await this.prisma.contacto.findUnique({
      where: { id, activo: true },
    });

    if (!contacto) {
      throw new NotFoundException(
        `No existe un contacto con id ${id}.`,
      );
    }

    return contacto;
  }

  async update(id: number, dto: UpdateContactoDto) {
    if (dto.activo === true) {
      const existe = await this.prisma.contacto.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existe) {
        throw new NotFoundException(
          `No existe un contacto con id ${id}.`,
        );
      }
    } else {
      await this.findOne(id);
    }

    return this.prisma.contacto.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.contacto.update({
      where: { id },
      data: { activo: false },
    });
  }
}
