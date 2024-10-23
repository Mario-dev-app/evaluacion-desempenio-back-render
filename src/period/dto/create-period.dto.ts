import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";
import { Societies } from "src/user/enums/societies.enum";

export class CreatePeriodDto {

    @IsString()
    @MinLength(4)
    year: string;

    @IsString()
    @MinLength(2)
    society: Societies;

    @IsBoolean()
    @IsOptional()
    visible?: boolean;

    @IsBoolean()
    @IsOptional()
    active?: boolean;

    @IsBoolean()
    @IsOptional()
    surveyActive?: boolean;

    @IsBoolean()
    @IsOptional()
    resultsActive?: boolean;
    
}
