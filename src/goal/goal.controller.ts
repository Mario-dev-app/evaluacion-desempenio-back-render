import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ValidateMongoIdPipe } from 'src/common/pipes/validate-mongo-id.pipe';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  create(@Body() createGoalDto: CreateGoalDto) {
    return this.goalService.create(createGoalDto);
  }

  @Get()
  findAll() {
    return this.goalService.findAll();
  }

  @Get(':period/:user')
  findByPeriodAndUser(
    @Param('period', ValidateMongoIdPipe) period: string, 
    @Param('user', ValidateMongoIdPipe) user: string
  ) {
    return this.goalService.findByPeriodAndUser(period, user);
  }

  @Patch(':id')
  update(
    @Param('id', ValidateMongoIdPipe) id: string, 
    @Body() updateGoalDto: UpdateGoalDto
  ) {
    return this.goalService.update(id, updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.goalService.remove(id);
  }
}
