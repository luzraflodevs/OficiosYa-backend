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
import { ResenasService } from './resenas.service.js';
import { CreateResenaDto } from './dto/create-resena.dto.js';
import { UpdateResenaDto } from './dto/update-resena.dto.js';

@Controller('resenas')
export class ResenasController {
  constructor(private readonly resenasService: ResenasService) {}

  @Post()
  create(@Body() createResenaDto: CreateResenaDto) {
    return this.resenasService.create(createResenaDto);
  }

  @Get()
  findAll() {
    return this.resenasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resenasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResenaDto: UpdateResenaDto,
  ) {
    return this.resenasService.update(id, updateResenaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.resenasService.remove(id);
  }
}
