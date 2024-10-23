import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { Societies } from 'src/user/enums';
import { Response } from 'express';
import { ValidateMongoIdPipe } from 'src/common/pipes/validate-mongo-id.pipe';
import { ConfirmResultsDto } from 'src/competencies/dto/confirm-results.dto';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveyService.create(createSurveyDto);
  }

  @Post('/confirm-results')
  confirmResults(@Body() confirmResultsDto: ConfirmResultsDto) {
    return this.surveyService.confirmResults(confirmResultsDto);
  }

  @Get()
  findAll() {
    return this.surveyService.findAll();
  }

  @Get(':userEvaluatedId')
  findOneByUserEvaluatedAndPeriod(
    @Param('userEvaluatedId', ValidateMongoIdPipe) userEvaluatedId: string,
    @Query('period', ValidateMongoIdPipe) period: string
  ) {
    return this.surveyService.findOneByUserEvaluatedAndPeriod(userEvaluatedId, period);
  }

  @Get('/get/by-period/by-society')
  findByPeriodAndSociety(
    @Query('year') year: string, 
    @Query('society') society: Societies
  ) {
    return this.surveyService.findByPeriodAndSociety(year, society);
  }

  @Get('/download/excel-report')
  downloadExcelReport(
    @Query('year') year: string, 
    @Query('society') society: Societies,
    @Res() res: Response
  ) {
    return this.surveyService.downloadExcelReport(year, society, res);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveyService.update(+id, updateSurveyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveyService.remove(+id);
  }
}
