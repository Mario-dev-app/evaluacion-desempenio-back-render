import { IsArray, IsInt, IsString } from "class-validator"

export class CreateCompetencyDto {

    @IsInt()
    level: number;

    @IsString()
    label: string;

    @IsArray({ always: true })
    grouping: string[];

}
