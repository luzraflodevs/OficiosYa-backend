import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateContactoDto } from './dto/create-contacto.dto.js';
import { UpdateContactoDto } from './dto/update-contacto.dto.js';

@Injectable()
export class ContactosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createContactoDto: CreateContactoDto) {
    return this.prisma.contacto.create({ data: createContactoDto });
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
      throw new NotFoundException(`No existe un contacto con id ${id}.`);
    }

    return contacto;
  }

  async update(id: number, updateContactoDto: UpdateContactoDto) {
    if (updateContactoDto.activo === true) {
      const existe = await this.prisma.contacto.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!existe) {
        throw new NotFoundException(`No existe un contacto con id ${id}.`);
      }
    } else {
      await this.findOne(id);
    }

    return this.prisma.contacto.update({
      where: { id },
      data: updateContactoDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Borrado lógico: no se borra la fila, se marca como inactiva.
    return this.prisma.contacto.update({
      where: { id },
      data: { activo: false },
    });
  }
}
