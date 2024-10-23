import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from "class-validator"
import { Responses } from "../entities/survey.entity";
import { Type } from "class-transformer";

class ResponseDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    value: number;
}

export class CreateSurveyDto {

    @IsMongoId()
    userEvaluator: string;

    @IsMongoId()
    userEvaluated: string;

    @IsMongoId()
    period: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResponseDto)
    goals: ResponseDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResponseDto)
    competencies: ResponseDto[];

    @IsString()
    @MinLength(2)
    @MaxLength(250)
    comentaries: string;

    @IsBoolean()
    @IsOptional()
    isResultsDownloaded?: boolean;
}
