import { IsEmail, IsInt, IsMongoId, IsOptional, IsString, MinLength } from "class-validator";
import { Roles, Societies } from "../enums";

export class CreateUserDto {

    @IsString()
    @MinLength(3)
    firstname: string;
    
    @IsString()
    @MinLength(3)
    lastname: string;

    @IsString()
    @MinLength(8)
    numDoc: string;
    
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(3)
    username: string;
    
    @IsString()
    @MinLength(3)
    password: string;

    @IsOptional()
    role?: Roles;

    @IsInt()
    competencyLevel: number;

    @IsMongoId()
    @IsOptional()
    approver?: string;

    @IsString()
    @MinLength(2)
    society: Societies;

    @IsMongoId()
    area: string;

    @IsString()
    position: string;

    @IsString()
    @IsOptional()
    onesignal_id?: string;

    @IsString()
    @IsOptional()
    external_id?: string;


}
