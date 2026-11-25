import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { RegisterAuthDto } from './dto/register-auth.dto.js';
import { hashPassword, verifyPassword } from './password.util.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const existente = await this.prisma.usuario.findUnique({
      where: { email: registerAuthDto.email },
      select: { id: true },
    });

    if (existente) {
      throw new ConflictException(
        'Ya existe una cuenta con ese correo electrónico.',
      );
    }

    // La contraseña se guarda encriptada con bcrypt, nunca en texto plano.
    const contrasenaHash = await hashPassword(registerAuthDto.password);

    return this.prisma.usuario.create({
      data: {
        nombre: registerAuthDto.nombre,
        apellido: registerAuthDto.apellido,
        email: registerAuthDto.email,
        telefono: registerAuthDto.telefono,
        contrasena_hash: contrasenaHash,
      },
      // select elige qué campos se devuelven: el hash no se devuelve.
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        rol: true,
        creado_en: true,
      },
    });
  }

  async login(loginAuthDto: LoginAuthDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: loginAuthDto.email },
    });

    // Mismo mensaje si el correo no existe, si el usuario está dado de baja
    // o si la contraseña es incorrecta: así no se da pistas de cuál falló.
    if (
      !usuario ||
      !usuario.activo ||
      !(await verifyPassword(loginAuthDto.password, usuario.contrasena_hash))
    ) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
    });

    return {
      access_token: accessToken,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}
