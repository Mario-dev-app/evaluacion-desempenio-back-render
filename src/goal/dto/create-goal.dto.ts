import { IsMongoId, IsString } from "class-validator";

export class CreateGoalDto {

    @IsString()
    description: string;

    @IsMongoId()
    user: string;

    @IsMongoId()
    period: string;

}
