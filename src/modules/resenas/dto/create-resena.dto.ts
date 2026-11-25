import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateResenaDto {
  @IsInt({ message: 'El id del servicio debe ser un número entero.' })
  @Min(1, { message: 'El id del servicio debe ser mayor a 0.' })
  servicio_id: number;

  @IsInt({ message: 'El id del usuario debe ser un número entero.' })
  @Min(1, { message: 'El id del usuario debe ser mayor a 0.' })
  usuario_id: number;

  @IsInt({ message: 'La calificación debe ser un número entero.' })
  @Min(1, { message: 'La calificación mínima es 1.' })
  @Max(5, { message: 'La calificación máxima es 5.' })
  calificacion: number;

  @IsOptional()
  @IsString({ message: 'El comentario debe ser un texto.' })
  @MaxLength(1000, {
    message: 'El comentario no puede superar los 1000 caracteres.',
  })
  comentario?: string;

  @IsOptional()
  @IsBoolean({
    message: 'El estado activo debe ser verdadero o falso (true o false).',
  })
  activo?: boolean;
}
