import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PeriodService } from './period.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { Societies } from 'src/user/enums';
import { ValidateMongoIdPipe } from 'src/common/pipes/validate-mongo-id.pipe';

@Controller('period')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @Post()
  create(@Body() createPeriodDto: CreatePeriodDto) {
    return this.periodService.create(createPeriodDto);
  }

  @Get()
  findAll(
    @Query('limit', ParseIntPipe) limit: number, 
    @Query('skip', ParseIntPipe) skip: number
  ) {
    return this.periodService.findAll(limit, skip);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.periodService.findOne(+id);
  }

  @Get('search/byFilters')
  findByFilters(@Query('year') year: string, @Query('society') society: Societies) {
    return this.periodService.findByFilters(year, society);
  }

  @Get('/all/distinct/years')
  findAllDistinctPeriods() {
    return this.periodService.findAllDistinctPeriods();
  }

  @Patch(':id')
  update(
    @Param('id', ValidateMongoIdPipe) id: string, 
    @Body() updatePeriodDto: UpdatePeriodDto
  ) {
    return this.periodService.update(id, updatePeriodDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.periodService.remove(id);
  }
}
