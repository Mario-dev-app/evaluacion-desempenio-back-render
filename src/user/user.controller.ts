import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateMongoIdPipe } from 'src/common/pipes/validate-mongo-id.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('limit', ParseIntPipe) limit: number, 
    @Query('skip', ParseIntPipe) skip: number
  ) {
    return this.userService.findAll(limit, skip);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.userService.findOne(term);
  }

  @Get('/approvers/all')
  findAllApproversOfUsers() {
    return this.userService.findAllApproversOfUsers();
  }

  @Get('/app-web/maybe-approvers/all')
  findAllMaybeApprovers() {
    return this.userService.findAllMaybeApprovers();
  }

  @Get('/without/goals/by/period/:periodId')
  getUserWithoutGoals(
    @Param('periodId') periodId: string,
    @Query('society') society: string
  ) {
    return this.userService.findUsersWithoutObjectives(periodId, society);
  }

  @Patch(':id')
  update(@Param('id', ValidateMongoIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('/update-password/:username')
  updatePasswordByUsername(
    @Param('username') username: string
  ) {
    return this.userService.updatePasswordByUsername(username);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
