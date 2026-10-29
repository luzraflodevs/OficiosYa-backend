import { PartialType } from '@nestjs/mapped-types';
import { CreateOficioDto } from './create-oficio.dto.js';

export class UpdateOficioDto extends PartialType(CreateOficioDto) {}
