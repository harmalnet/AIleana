import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { ExampleService } from './example.service';

@ApiTags('examples')
@Controller('api/v1/examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new example' })
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.exampleService.create(createExampleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all examples' })
  findAll() {
    return this.exampleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an example by ID' })
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an example' })
  update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
    return this.exampleService.update(id, updateExampleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an example' })
  remove(@Param('id') id: string) {
    return this.exampleService.remove(id);
  }
}
