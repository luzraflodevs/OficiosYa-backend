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
import { ServiciosService } from './servicios.service.js';
import { CreateServicioDto } from './dto/create-servicio.dto.js';
import { UpdateServicioDto } from './dto/update-servicio.dto.js';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.serviciosService.create(createServicioDto);
  }

  @Get()
  findAll() {
    return this.serviciosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServicioDto: UpdateServicioDto,
  ) {
    return this.serviciosService.update(id, updateServicioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosService.remove(id);
  }
}
