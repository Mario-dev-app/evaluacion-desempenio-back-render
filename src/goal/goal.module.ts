import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Goal, GoalSchema } from './entities/goal.entity';

@Module({
  controllers: [GoalController],
  providers: [GoalService],
  imports: [
    MongooseModule.forFeature([
      { name: Goal.name, schema: GoalSchema }
    ])
  ],
  exports: [
    MongooseModule
  ]
})
export class GoalModule {}
