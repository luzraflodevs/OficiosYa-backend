import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service.js';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto.js';
import { UpdateProfesionaleDto } from './dto/update-profesionale.dto.js';

@Controller('profesionales')
export class ProfesionalesController {
  constructor(private readonly profesionalesService: ProfesionalesService) {}

  @Post()
  create(@Body() createProfesionaleDto: CreateProfesionaleDto) {
    return this.profesionalesService.create(createProfesionaleDto);
  }

  @Get()
  findAll() {
    return this.profesionalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profesionalesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfesionaleDto: UpdateProfesionaleDto,
  ) {
    return this.profesionalesService.update(id, updateProfesionaleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profesionalesService.remove(id);
  }
}
