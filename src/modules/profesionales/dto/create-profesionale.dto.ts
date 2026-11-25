import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProfesionaleDto {
  // Claves foráneas: se escriben en la clase, pero no se validan con decoradores.
  usuario_id: number;
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
}
