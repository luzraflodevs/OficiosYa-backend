import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateServicioDto {
  @IsInt({ message: 'El id del profesional debe ser un número entero.' })
  @Min(1, { message: 'El id del profesional debe ser mayor a 0.' })
  profesional_id: number;

  @IsInt({ message: 'El id del oficio debe ser un número entero.' })
  @Min(1, { message: 'El id del oficio debe ser mayor a 0.' })
  oficio_id: number;

  @IsString({ message: 'El título debe ser un texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MinLength(5, { message: 'El título debe tener al menos 5 caracteres.' })
  @MaxLength(150, { message: 'El título no puede superar los 150 caracteres.' })
  titulo: string;

  @IsString({ message: 'La descripción debe ser un texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres.',
  })
  @MaxLength(2000, {
    message: 'La descripción no puede superar los 2000 caracteres.',
  })
  descripcion: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número con hasta 2 decimales.' },
  )
  @Min(0, { message: 'El precio no puede ser negativo.' })
  precio: number;

  @IsOptional()
  @IsBoolean({
    message: 'El estado activo debe ser verdadero o falso (true o false).',
  })
  activo?: boolean;
}
