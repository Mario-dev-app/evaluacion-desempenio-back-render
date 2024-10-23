import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Period } from './entities/period.entity';
import { Model } from 'mongoose';
import { Societies } from '../user/enums';
import { handleErrors } from '../common/methods/handle-error.method';

@Injectable()
export class PeriodService {

  private readonly logger = new Logger(PeriodService.name);

  constructor(
    @InjectModel(Period.name)
    private readonly periodModel: Model<Period>
  ) { }

  async create(createPeriodDto: CreatePeriodDto) {
    try {
      const periodFinded = await this.periodModel.findOne({ year: createPeriodDto.year, society: createPeriodDto.society });
      if (periodFinded) {
        throw new BadRequestException(`Period with these fields already exists`);
      }
      const periodCreated = await this.periodModel.create(createPeriodDto);
      return periodCreated;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  async findByFilters(year: string, society: Societies) {
    const periodFinded = await this.periodModel.findOne({ year, society, active: true });
    if (!periodFinded) {
      throw new NotFoundException(`Active period ${year} - ${society} not found`);
    }
    return periodFinded;
  }

  async findByPeriodAndSociety(year: string, society: Societies) {
    const periodFinded = await this.periodModel.findOne({ year, society });
    if (!periodFinded) {
      throw new NotFoundException(`Active period ${year} - ${society} not found`);
    }
    return periodFinded;
  }

  async findAll(limit: number, skip: number) {
    try {
      const count = await this.periodModel.countDocuments({});
      const periods = await this.periodModel.find({ visible: true }).limit(limit).skip(skip);
      return { periods, count };
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} period`;
  }

  async findAllDistinctPeriods() {
    try {
      const distinctPeriods = await this.periodModel.find({}).distinct('year');
      return distinctPeriods
        .map(period => Number(period))
        .sort((a, b) => b - a);
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  async update(id: string, updatePeriodDto: UpdatePeriodDto) {
    try {
      if (updatePeriodDto.resultsActive) {
        updatePeriodDto = { ...updatePeriodDto, surveyActive: false };
      }
      if(updatePeriodDto.surveyActive) {
        updatePeriodDto = { ...updatePeriodDto, resultsActive: false };
      }
      const periodUpdated = await this.periodModel.findByIdAndUpdate(id, updatePeriodDto);
      return periodUpdated;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  async remove(id: string) {
    try {
      const periodRemoved = await this.periodModel.findByIdAndUpdate(id, { visible: false });
      return periodRemoved;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

}
