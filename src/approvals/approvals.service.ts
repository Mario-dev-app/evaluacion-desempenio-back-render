import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Approval } from './entities/approval.entity';
import { Model } from 'mongoose';
import { handleErrors } from '../common/methods/handle-error.method';
import { User } from '../user/entities/user.entity';
import { Roles } from '../user/enums';

@Injectable()
export class ApprovalsService {

  private readonly logger = new Logger(ApprovalsService.name);

  constructor(
    @InjectModel(Approval.name)
    private readonly approvalModel: Model<Approval>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) { }

  async create(createApprovalDto: CreateApprovalDto) {
    try {
      const userFinded = await this.userModel.findById(createApprovalDto.user);
      const approvalCreated = await this.approvalModel.create({ ...createApprovalDto, approverOne: userFinded.approver });
      return approvalCreated;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  findAll() {
    return `This action returns all approvals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} approval`;
  }

  async findOneByPeriodAndUser(period: string, user: string) {
    const approvalFinded = await this.approvalModel.findOne({ period, user });
    if (!approvalFinded) {
      throw new NotFoundException(`Approval with those params not found`);
    }
    return approvalFinded;
  }

  async findActiveByApprover(approveId: string) {

    const userFinded = await this.userModel.findById(approveId);

    let approvalsFinded: Approval[] = [];

    if (userFinded.role === Roles.BOSS) {
      const tempApprovalsFinded = await this.approvalModel.find({
        approverOne: approveId,
        state: 'IN REVIEW 1'
      }).populate({
        path: 'user',
        select: 'firstname lastname username society competencyLevel'
      });
      tempApprovalsFinded.forEach((approval) => {
        approvalsFinded.push(approval);
      });
    }

    if (userFinded.role === Roles.GER) {
      const tempApprovalsFinded = await this.approvalModel.find({
        $or: [
          { approverOne: approveId},
          { approverTwo: approveId }
        ],
        $and: [
          { state: { $nin: ['APPROVED', 'REJECTED'] } }
        ]
      }).populate({
        path: 'user',
        select: 'firstname lastname username society competencyLevel'
      });
      tempApprovalsFinded.forEach((approval) => {
        approvalsFinded.push(approval);
      });
    }

    return approvalsFinded;
  }

  async findByApproverOneAndPeriod(approverOne: string, period: string) {
    try {
      const approvalsFinded = await this.approvalModel
      .find({ approverOne, period, state: { $in: ['APPROVED', 'DONE'] }  }).populate({
        path: 'user',
        select: 'firstname lastname username society competencyLevel'
      });
      return approvalsFinded;
    } catch (error) {
      handleErrors(error, this.logger);
    }
  }

  update(id: string, updateApprovalDto: UpdateApprovalDto) {
    const approvalUpdated = this.approvalModel.findByIdAndUpdate(id, updateApprovalDto);
    return approvalUpdated;
  }

  async remove(id: string) {
    try {
      const approvalRemoved = await this.approvalModel.findByIdAndDelete(id);
      return approvalRemoved;
    } catch (error) {
      handleErrors(error, this.logger);
    }
    return `This action removes a #${id} approval`;
  }
}
