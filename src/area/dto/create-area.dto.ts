import { IsString } from "class-validator";

export class CreateAreaDto {

    @IsString()
    label: string;
    
    @IsString()
    code: string;

}
