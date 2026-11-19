import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateResenaDto {
  @IsInt({ message: 'El usuario_id debe ser un número entero' })
  @IsPositive({ message: 'El usuario_id debe ser positivo' })
  usuario_id: number;

  @IsInt({ message: 'El servicio_id debe ser un número entero' })
  @IsPositive({ message: 'El servicio_id debe ser positivo' })
  servicio_id: number;

  @IsInt({ message: 'La calificación debe ser un número entero' })
  @Min(1, { message: 'La calificación mínima es 1' })
  @Max(5, { message: 'La calificación máxima es 5' })
  calificacion: number;

  @IsOptional()
  @IsString({ message: 'El comentario debe ser texto' })
  comentario?: string;
}