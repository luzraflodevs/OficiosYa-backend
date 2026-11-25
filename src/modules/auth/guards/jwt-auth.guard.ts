import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticación requerido.');
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      throw new UnauthorizedException('Token de autenticación requerido.');
    }

    try {
      const payload: unknown = await this.jwtService.verifyAsync(token);

      if (
        typeof payload !== 'object' ||
        payload === null ||
        !('sub' in payload) ||
        typeof payload.sub !== 'number' ||
        !Number.isInteger(payload.sub)
      ) {
        throw new UnauthorizedException('Token inválido.');
      }

      const usuario = await this.prisma.usuario.findUnique({
        where: { id: payload.sub, activo: true },
        select: {
          id: true,
          email: true,
          rol: true,
        },
      });

      if (!usuario) {
        throw new UnauthorizedException('Usuario inexistente o inactivo.');
      }

      Object.assign(request, { usuario });

      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o vencido.');
    }
  }
}