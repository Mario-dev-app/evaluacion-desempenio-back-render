import { Module } from '@nestjs/common';
import { PeriodService } from './period.service';
import { PeriodController } from './period.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Period, PeriodSchema } from './entities/period.entity';

@Module({
  controllers: [PeriodController],
  providers: [PeriodService],
  imports: [
    MongooseModule.forFeature([
      { name: Period.name, schema: PeriodSchema }
    ])
  ],
  exports: [PeriodService]
})
export class PeriodModule {}
