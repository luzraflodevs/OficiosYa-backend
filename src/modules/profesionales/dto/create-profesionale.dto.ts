import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProfesionaleDto {
  @IsInt({ message: 'El usuario_id debe ser un número entero' })
  @IsPositive({ message: 'El usuario_id debe ser positivo' })
  usuario_id: number;

  @IsInt({ message: 'El ubicacion_id debe ser un número entero' })
  @IsPositive({ message: 'El ubicacion_id debe ser positivo' })
  ubicacion_id: number;

  @IsOptional()
  @IsString({ message: 'La biografía debe ser texto' })
  biografia?: string;

  @IsOptional()
  @IsString({ message: 'La matrícula debe ser texto' })
  matricula?: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo verificado debe ser verdadero o falso' })
  verificado?: boolean;
}