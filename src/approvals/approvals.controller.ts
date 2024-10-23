import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { ValidateMongoIdPipe } from 'src/common/pipes/validate-mongo-id.pipe';

@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) { }

  @Post()
  create(@Body() createApprovalDto: CreateApprovalDto) {
    return this.approvalsService.create(createApprovalDto);
  }

  /* @Get()
  findAll() {
    return this.approvalsService.findAll();
  } */

  @Get()
  findOneByPeriodAndUser(
    @Query('period', ValidateMongoIdPipe) period: string,
    @Query('user', ValidateMongoIdPipe) user: string
  ) {
    return this.approvalsService.findOneByPeriodAndUser(period, user);
  }

  @Get('by-approver-id/:id')
  findActiveByApprover(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.approvalsService.findActiveByApprover(id);
  }

  @Get('available/survey/by-approver')
  findByApproverOneAndPeriod(
    @Query('period', ValidateMongoIdPipe) period: string, 
    @Query('approverOne', ValidateMongoIdPipe) approverOne: string
  ) {
    return this.approvalsService.findByApproverOneAndPeriod(approverOne, period);
  }

  @Patch(':id')
  update(
    @Param('id', ValidateMongoIdPipe) id: string, 
    @Body() updateApprovalDto: UpdateApprovalDto
  ) {
    return this.approvalsService.update(id, updateApprovalDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.approvalsService.remove(id);
  }
}
