import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateServicioDto {
  @IsInt({ message: 'El profesional_id debe ser un número entero' })
  @IsPositive({ message: 'El profesional_id debe ser positivo' })
  profesional_id: number;

  @IsInt({ message: 'El oficio_id debe ser un número entero' })
  @IsPositive({ message: 'El oficio_id debe ser positivo' })
  oficio_id: number;

  @IsString({ message: 'El título debe ser texto' })
  @IsNotEmpty({ message: 'El título del servicio es obligatorio' })
  titulo: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El precio estimado debe ser numérico' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio_estimado?: number;
}