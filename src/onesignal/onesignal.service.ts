import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SendNotificationDto } from './dto/send-notification.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OnesignalService {

  ONESIGNAL_APP_ID: string = this.configService.get<string>('ONESIGNAL_APP_ID');

  ONESIGNAL_API_KEY: string = this.configService.get<string>('ONESIGNAL_API_KEY');

  constructor(
    private configService: ConfigService
  ) { }

  async sendNotification(sendNotificationDto: SendNotificationDto) {

    let data: any = {
      app_id: this.ONESIGNAL_APP_ID,
      name: 'test',
      target_channel: 'push',
      headings: { es: sendNotificationDto.title, en: sendNotificationDto.title },
      contents: { es: sendNotificationDto.message, en: sendNotificationDto.message },
      small_icon: 'mipmap/ic_launcher_round',
      large_icon: 'mipmap/ic_launcher_round',
    };

    if (sendNotificationDto.external_id) {
      data = {
        ...data,
        filters: [
          {
            field: 'tag',
            key: 'external_id',
            relation: '=',
            value: sendNotificationDto.external_id
          }
        ],
      }
    } else {
      data = {
        ...data,
        included_segments: ["Total Subscriptions"]
      }
    };

    const url = 'https://api.onesignal.com/notifications';
    const options = {
      method: 'POST',
      headers: { 'accept': 'application/json', 'content-type': 'application/json', 'Authorization': `Basic ${this.ONESIGNAL_API_KEY}` },
      body: JSON.stringify(data)
    };

    try {
      const response = await fetch(url, options);
      const jsonResponse = await response.json();

      return {
        ok: true,
        message: 'Notificación enviada',
        resp: jsonResponse,
      };

    } catch (error) {
      throw new HttpException(
        {
          ok: false,
          message: 'Error con el envío de la notificación',
          error,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async registerOneSignalTag(userId: string, onesignal_id: string) {
    let data = {
      app_id: this.ONESIGNAL_APP_ID,
      properties: {
        tags: { external_id: userId }
      },
      identity: {
        onesignal_id: onesignal_id,
      }
    };

    const url = `https://api.onesignal.com/apps/${this.ONESIGNAL_APP_ID}/users`;
    const options = {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json', 'Authorization': `Basic ${this.ONESIGNAL_API_KEY}` },
      body: JSON.stringify(data)
    };

    try {
      const response = await fetch(url, options);
      const jsonResponse = await response.json();

      return {
        ok: true,
        resp: jsonResponse,
      };

    } catch (error) {
      throw new HttpException({
        ok: false,
        message: 'Error con el envío de la notificación',
        error,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
