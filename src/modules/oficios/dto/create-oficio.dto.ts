import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOficioDto {
  @IsString({ message: 'El nombre del oficio debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del oficio es obligatorio' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;
}