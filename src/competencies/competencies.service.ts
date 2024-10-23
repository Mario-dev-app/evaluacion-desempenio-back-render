import { Injectable, Logger } from '@nestjs/common';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';
import { handleErrors } from 'src/common/methods/handle-error.method';
import { InjectModel } from '@nestjs/mongoose';
import { Competency } from './entities/competency.entity';
import { Model } from 'mongoose';

@Injectable()
export class CompetenciesService {

  private readonly logger = new Logger(CompetenciesService.name);

  constructor(
    @InjectModel(Competency.name)
    private readonly competencyModel: Model<Competency>
  ) {}

  async create(createCompetencyDto: CreateCompetencyDto) {
    try {
      const compentencyCreated = await this.competencyModel.create(createCompetencyDto);
      return compentencyCreated;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  async findAll() {
    try {
      const competencies = await this.competencyModel.find({}).sort({ level: -1 });
      return competencies;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  async findOne(level: string) {
    try {
      const competencyFounded = await this.competencyModel.findOne({ level });
      return competencyFounded;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  async findAllLevelOfCompetencies() {
    try {
      const levels = await this.competencyModel.find({}).select('level label');
      return levels;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  update(id: number, updateCompetencyDto: UpdateCompetencyDto) {
    return `This action updates a #${id} competency`;
  }

  async remove(id: string) {
    try {
      const competencyRemoved = await this.competencyModel.findByIdAndDelete(id);
      return competencyRemoved;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }
}
