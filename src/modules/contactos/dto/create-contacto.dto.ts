import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactoDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(120, { message: 'El nombre no puede superar los 120 caracteres.' })
  nombre: string;

  @IsEmail(
    {},
    { message: 'El correo electrónico debe tener un formato válido.' },
  )
  @MaxLength(150, {
    message: 'El correo electrónico no puede superar los 150 caracteres.',
  })
  email: string;

  @IsString({ message: 'El asunto debe ser un texto.' })
  @IsNotEmpty({ message: 'El asunto es obligatorio.' })
  @MinLength(3, { message: 'El asunto debe tener al menos 3 caracteres.' })
  @MaxLength(150, { message: 'El asunto no puede superar los 150 caracteres.' })
  asunto: string;

  @IsString({ message: 'El mensaje debe ser un texto.' })
  @IsNotEmpty({ message: 'El mensaje es obligatorio.' })
  @MinLength(10, { message: 'El mensaje debe tener al menos 10 caracteres.' })
  @MaxLength(3000, {
    message: 'El mensaje no puede superar los 3000 caracteres.',
  })
  mensaje: string;
}
