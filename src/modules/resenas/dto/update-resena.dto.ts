import { PartialType } from '@nestjs/mapped-types';
import { CreateResenaDto } from './create-resena.dto.js';

export class UpdateResenaDto extends PartialType(CreateResenaDto) {}
