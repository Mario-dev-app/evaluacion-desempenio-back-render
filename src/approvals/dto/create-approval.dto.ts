import { IsMongoId, IsOptional, IsString } from "class-validator";

export class CreateApprovalDto {

    @IsMongoId()
    period: string;
    
    @IsMongoId()
    user: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsMongoId()
    approverTwo?: string;
    
    /* @IsMongoId()
    approverOne: string;

    @IsMongoId()
    @IsOptional()
    approverTwo?: string; */
}
