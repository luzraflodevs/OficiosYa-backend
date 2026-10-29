import { Injectable } from '@nestjs/common';
import { CreateOficioDto } from './dto/create-oficio.dto.js';
import { UpdateOficioDto } from './dto/update-oficio.dto.js';

@Injectable()
export class OficiosService {
  create(createOficioDto: CreateOficioDto) {
    return 'This action adds a new oficio';
  }

  findAll() {
    return `This action returns all oficios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} oficio`;
  }

  update(id: number, updateOficioDto: UpdateOficioDto) {
    return `This action updates a #${id} oficio`;
  }

  remove(id: number) {
    return `This action removes a #${id} oficio`;
  }
}
