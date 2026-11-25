import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOficioDto {
  @IsString({ message: 'El nombre del oficio debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre del oficio es obligatorio.' })
  @MinLength(3, {
    message: 'El nombre del oficio debe tener al menos 3 caracteres.',
  })
  @MaxLength(100, {
    message: 'El nombre del oficio no puede superar los 100 caracteres.',
  })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto.' })
  @MaxLength(1000, {
    message: 'La descripción no puede superar los 1000 caracteres.',
  })
  descripcion?: string;
}
