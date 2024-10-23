import { IsOptional, IsString } from "class-validator";

export class SendNotificationDto {

    @IsString()
    title: string;

    @IsString()
    message: string;

    @IsString()
    @IsOptional()
    external_id?: string;

}