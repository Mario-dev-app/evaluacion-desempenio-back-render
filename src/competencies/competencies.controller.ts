import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompetenciesService } from './competencies.service';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';
import { ValidateMongoIdPipe } from 'src/common/pipes/validate-mongo-id.pipe';

@Controller('competencies')
export class CompetenciesController {
  constructor(private readonly competenciesService: CompetenciesService) {}

  @Post()
  create(@Body() createCompetencyDto: CreateCompetencyDto) {
    return this.competenciesService.create(createCompetencyDto);
  }

  @Get()
  findAll() {
    return this.competenciesService.findAll();
  }

  @Get(':level')
  findOne(@Param('level') level: string) {
    return this.competenciesService.findOne(level);
  }

  @Get('/levels/all')
  findAllLevelOfCompetencies() {
    return this.competenciesService.findAllLevelOfCompetencies();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompetencyDto: UpdateCompetencyDto) {
    return this.competenciesService.update(+id, updateCompetencyDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.competenciesService.remove(id);
  }
}
