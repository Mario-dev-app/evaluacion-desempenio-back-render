import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from './entities/survey.entity';
import { PeriodModule } from 'src/period/period.module';
import { PdfService } from 'src/common/services/pdf/pdf.service';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService, PdfService],
  imports: [
    MongooseModule.forFeature([
      { name: Survey.name, schema: SurveySchema }
    ]),
    PeriodModule
  ]
})
export class SurveyModule {}
