import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateContactoDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @IsString({ message: 'El detalle debe ser texto' })
  @IsNotEmpty({ message: 'El detalle de la consulta es obligatorio' })
  @MinLength(10, { message: 'El detalle debe tener al menos 10 caracteres' })
  detalle: string;
}