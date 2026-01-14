import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { Example } from './entities/example.entity';

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private readonly exampleRepository: Repository<Example>,
  ) {}

  async create(createExampleDto: CreateExampleDto): Promise<Example> {
    const example = this.exampleRepository.create(createExampleDto);
    return await this.exampleRepository.save(example);
  }

  async findAll(): Promise<Example[]> {
    return await this.exampleRepository.find();
  }

  async findOne(id: string): Promise<Example> {
    const example = await this.exampleRepository.findOne({ where: { id } });
    if (!example) {
      throw new NotFoundException(`Example with ID ${id} not found`);
    }
    return example;
  }

  async update(
    id: string,
    updateExampleDto: UpdateExampleDto,
  ): Promise<Example> {
    const example = await this.findOne(id);
    Object.assign(example, updateExampleDto);
    return await this.exampleRepository.save(example);
  }

  async remove(id: string): Promise<void> {
    const example = await this.findOne(id);
    await this.exampleRepository.remove(example);
  }
}
