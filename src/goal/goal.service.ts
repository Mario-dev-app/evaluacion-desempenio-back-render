import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Goal } from './entities/goal.entity';
import { Model } from 'mongoose';
import { handleErrors } from '../common/methods/handle-error.method';

@Injectable()
export class GoalService {

  private readonly logger = new Logger(GoalService.name);

  constructor(
    @InjectModel(Goal.name)
    private readonly goalModel: Model<Goal>
  ) {}

  async create(createGoalDto: CreateGoalDto) {
    try {
      const goalCreated = await this.goalModel.create(createGoalDto);
      return goalCreated;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  findAll() {
    return `This action returns all goal`;
  }

  async findByPeriodAndUser(period: string, user: string) {
    const goalsFounded = await this.goalModel.find({ period, user });
    if(goalsFounded.length === 0) {
      throw new NotFoundException(`Goals with period ${period} not found`);
    }

    return goalsFounded;
  }

  update(id: string, updateGoalDto: UpdateGoalDto) {
    return this.goalModel.findByIdAndUpdate(id, updateGoalDto);
  }

  async remove(id: string) {
    try {
      const goalRemoved = await this.goalModel.findByIdAndDelete(id);
      return goalRemoved;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

}
