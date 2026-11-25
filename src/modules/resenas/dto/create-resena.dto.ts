import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateResenaDto {
  // Claves foráneas: se escriben en la clase, pero no se validan con decoradores.
  servicio_id: number;
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
}
