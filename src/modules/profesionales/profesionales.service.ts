
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto.js';
import { UpdateProfesionaleDto } from './dto/update-profesionale.dto.js';
import { RolUsuario } from '../../generated/prisma/enums.js';

@Injectable()
export class ProfesionalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfesionaleDto: CreateProfesionaleDto) {
    const { usuario_id, ubicacion_id, descripcion, matricula, activo } =
      createProfesionaleDto;

    if (activo === false) {
      throw new BadRequestException(
        'Un perfil profesional nuevo debe estar activo.',
      );
    }

    await this.validarUsuario(usuario_id);
    await this.validarUbicacion(ubicacion_id);

    return this.prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.findUnique({
        where: { id: usuario_id, activo: true },
        select: { id: true, rol: true },
      });

      if (!usuario) {
        throw new NotFoundException(
          `No existe un usuario activo con id ${usuario_id}.`,
        );
      }

      if (usuario.rol === RolUsuario.ADMIN) {
        throw new ConflictException(
          'No se puede cambiar el rol de un administrador.',
        );
      }

      const existente = await tx.profesional.findUnique({
        where: { usuario_id },
        select: { id: true },
      });

      if (existente) {
        throw new ConflictException(
          'Ese usuario ya tiene un perfil profesional.',
        );
      }

      const profesional = await tx.profesional.create({
        data: {
          usuario_id,
          ubicacion_id,
          descripcion,
          matricula,
          activo: true,
        },
      });

      if (usuario.rol === RolUsuario.CLIENTE) {
        await tx.usuario.update({
          where: { id: usuario_id },
          data: { rol: RolUsuario.PROFESIONAL },
        });
      }

      return profesional;
    });
  }

  findAll() {
    return this.prisma.profesional.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
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
          select: {
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
        },
        ubicacion: true,
        servicios: {
          where: { activo: true },
        },
      },
    });

    if (!profesional) {
      throw new NotFoundException(
        `No existe un profesional con id ${id}.`,
      );
    }

    return profesional;
  }

  async update(
    id: number,
    updateProfesionaleDto: UpdateProfesionaleDto,
  ) {
    const { usuario_id, activo, ...datos } = updateProfesionaleDto;

    if (usuario_id !== undefined) {
      throw new BadRequestException(
        'No se puede cambiar el propietario de un perfil profesional.',
      );
    }

    if (activo === true) {
      const existe = await this.prisma.profesional.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existe) {
        throw new NotFoundException(
          `No existe un profesional con id ${id}.`,
        );
      }
    } else {
      await this.findOne(id);
    }

    if (datos.ubicacion_id !== undefined) {
      await this.validarUbicacion(datos.ubicacion_id);
    }

    return this.prisma.profesional.update({
      where: { id },
      data: {
        ...datos,
        ...(activo !== undefined ? { activo } : {}),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.profesional.update({
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

    const existente = await this.prisma.profesional.findUnique({
      where: { usuario_id: usuarioId },
      select: { id: true },
    });

    if (existente) {
      throw new ConflictException(
        'Ese usuario ya tiene un perfil profesional.',
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
