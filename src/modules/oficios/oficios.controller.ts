import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OficiosService } from './oficios.service.js';
import { CreateOficioDto } from './dto/create-oficio.dto.js';
import { UpdateOficioDto } from './dto/update-oficio.dto.js';

@Controller('oficios')
export class OficiosController {
  constructor(private readonly oficiosService: OficiosService) {}

  @Post()
  create(@Body() createOficioDto: CreateOficioDto) {
    return this.oficiosService.create(createOficioDto);
  }

  @Get()
  findAll() {
    return this.oficiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oficiosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOficioDto: UpdateOficioDto) {
    return this.oficiosService.update(+id, updateOficioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oficiosService.remove(+id);
  }
}
