import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UtilsService } from './utils.service';
import { CreateUtilDto } from './dto/create-util.dto';
import { UpdateUtilDto } from './dto/update-util.dto';

@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Get()
  findAll() {
    return this.utilsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUtilDto: UpdateUtilDto) {
    return this.utilsService.update(+id, updateUtilDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilsService.remove(+id);
  }
}
