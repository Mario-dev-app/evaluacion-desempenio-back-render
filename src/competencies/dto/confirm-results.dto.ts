import { IsEmail, IsMongoId } from "class-validator";

export class ConfirmResultsDto {
    
    @IsMongoId()
    surveyId: string;

    @IsEmail()
    mailTo: string;

}