import { IsOptional, IsString, MinLength } from "class-validator";

export class AuthDto {
    
    @IsString()
    @MinLength(3)
    username: string;

    @IsString()
    @MinLength(3)
    password: string; 

    @IsString()
    @IsOptional()
    onesignal_id?: string;
}