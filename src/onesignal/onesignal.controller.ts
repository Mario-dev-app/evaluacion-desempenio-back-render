import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OnesignalService } from './onesignal.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('onesignal')
export class OnesignalController {
  constructor(private readonly onesignalService: OnesignalService) {}

  /* @Post()
  create(@Body() createOnesignalDto: CreateOnesignalDto) {
    return this.onesignalService.create(createOnesignalDto);
  } */

  @Post('/send-notification')
  sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
    return this.onesignalService.sendNotification(sendNotificationDto);
  }

  /* @Get()
  findAll() {
    return this.onesignalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.onesignalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOnesignalDto: UpdateOnesignalDto) {
    return this.onesignalService.update(+id, updateOnesignalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.onesignalService.remove(+id);
  } */
}
