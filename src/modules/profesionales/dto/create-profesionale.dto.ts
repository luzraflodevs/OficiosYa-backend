import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProfesionaleDto {
  @IsInt({ message: 'El id de usuario debe ser un número entero.' })
  @Min(1, { message: 'El id de usuario debe ser mayor a 0.' })
  usuario_id: number;

  @IsInt({ message: 'El id de ubicación debe ser un número entero.' })
  @Min(1, { message: 'El id de ubicación debe ser mayor a 0.' })
  ubicacion_id: number;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto.' })
  @MaxLength(1000, {
    message: 'La descripción no puede superar los 1000 caracteres.',
  })
  descripcion?: string;

  @IsOptional()
  @IsString({ message: 'La matrícula debe ser un texto.' })
  @MaxLength(50, {
    message: 'La matrícula no puede superar los 50 caracteres.',
  })
  matricula?: string;

  @IsOptional()
  @IsBoolean({
    message: 'El estado activo debe ser verdadero o falso (true o false).',
  })
  activo?: boolean;
}
