import { Module } from '@nestjs/common';
import { CompetenciesService } from './competencies.service';
import { CompetenciesController } from './competencies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Competency, CompetencySchema } from './entities/competency.entity';

@Module({
  controllers: [CompetenciesController],
  providers: [CompetenciesService],
  imports: [
    MongooseModule.forFeature([
      { name: Competency.name, schema: CompetencySchema}
    ])
  ]
})
export class CompetenciesModule {}
