import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateContactoDto } from './create-contacto.dto.js';

export class UpdateContactoDto extends PartialType(CreateContactoDto) {
  @IsOptional()
  @IsBoolean({
    message: 'El campo leído debe ser verdadero o falso (true o false).',
  })
  leido?: boolean;
}
