
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateServicioDto } from './dto/create-servicio.dto.js';
import { UpdateServicioDto } from './dto/update-servicio.dto.js';

@Injectable()
export class ServiciosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServicioDto: CreateServicioDto) {
    if (createServicioDto.activo === false) {
      throw new BadRequestException(
        'Un servicio nuevo debe estar activo.',
      );
    }

    await this.validarProfesional(createServicioDto.profesional_id);
    await this.validarOficio(createServicioDto.oficio_id);

    return this.prisma.servicio.create({
      data: {
        ...createServicioDto,
        activo: true,
      },
    });
  }

  findAll() {
    return this.prisma.servicio.findMany({
      where: {
        activo: true,
        profesional: {
          activo: true,
          usuario: { activo: true },
        },
        oficio: { activo: true },
      },
      orderBy: { id: 'asc' },
      include: { oficio: true },
    });
  }

  async findOne(id: number) {
    const servicio = await this.prisma.servicio.findUnique({
      where: {
        id,
        activo: true,
        profesional: {
          activo: true,
          usuario: { activo: true },
        },
        oficio: { activo: true },
      },
      include: {
        oficio: true,
        profesional: {
          include: {
            usuario: {
              select: {
                nombre: true,
                apellido: true,
                telefono: true,
              },
            },
            ubicacion: true,
          },
        },
        resenas: { where: { activo: true } },
      },
    });

    if (!servicio) {
      throw new NotFoundException(
        `No existe un servicio con id ${id}.`,
      );
    }

    return servicio;
  }

  async obtenerPropietario(profesionalId: number) {
    const profesional = await this.prisma.profesional.findUnique({
      where: { id: profesionalId, activo: true },
      select: {
        id: true,
        usuario_id: true,
      },
    });

    if (!profesional) {
      throw new NotFoundException(
        `No existe un profesional activo con id ${profesionalId}.`,
      );
    }

    return profesional;
  }

  async update(id: number, dto: UpdateServicioDto) {
    const { profesional_id, activo, ...datos } = dto;

    if (profesional_id !== undefined) {
      throw new BadRequestException(
        'No se puede cambiar el propietario de un servicio.',
      );
    }

    if (activo === true) {
      const existe = await this.prisma.servicio.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existe) {
        throw new NotFoundException(
          `No existe un servicio con id ${id}.`,
        );
      }
    } else {
      await this.findOne(id);
    }

    if (datos.oficio_id !== undefined) {
      await this.validarOficio(datos.oficio_id);
    }

    return this.prisma.servicio.update({
      where: { id },
      data: {
        ...datos,
        ...(activo !== undefined ? { activo } : {}),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.servicio.update({
      where: { id },
      data: { activo: false },
    });
  }

  private async validarProfesional(profesionalId: number) {
    const profesional = await this.prisma.profesional.findUnique({
      where: {
        id: profesionalId,
        activo: true,
        usuario: { activo: true },
      },
      select: { id: true },
    });

    if (!profesional) {
      throw new NotFoundException(
        `No existe un profesional activo con id ${profesionalId}.`,
      );
    }
  }

  private async validarOficio(oficioId: number) {
    const oficio = await this.prisma.oficio.findUnique({
      where: { id: oficioId, activo: true },
      select: { id: true },
    });

    if (!oficio) {
      throw new NotFoundException(
        `No existe un oficio activo con id ${oficioId}.`,
      );
    }
  }
}
