import { Injectable, Logger } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Area } from './entities/area.entity';
import { Model } from 'mongoose';
import { handleErrors } from 'src/common/methods/handle-error.method';

@Injectable()
export class AreaService {

  private readonly logger = new Logger(AreaService.name);

  constructor(
    @InjectModel(Area.name)
    private readonly areaModel: Model<Area>
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    try {
      const areaCreated = await this.areaModel.create(createAreaDto);
      return areaCreated;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  findAll() {
    return this.areaModel.find({ active: true });
  }

  findOne(id: number) {
    return `This action returns a #${id} area`;
  }

  update(id: number, updateAreaDto: UpdateAreaDto) {
    return `This action updates a #${id} area`;
  }

  remove(id: number) {
    return `This action removes a #${id} area`;
  }
}
