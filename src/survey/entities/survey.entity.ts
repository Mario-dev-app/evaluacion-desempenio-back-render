import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "../../user/entities/user.entity";
import { Period } from "src/period/entities/period.entity";

export interface Responses {
    description: string,
    value: number
}

@Schema()
export class Survey {

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User', required: true })
    userEvaluator: User;
    
    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User', required: true })
    userEvaluated: User;

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'Period', required: true })
    period: Period;

    @Prop({
        type: [
            {
                description: { type: String },
                value: { type: Number }
            }
        ],
        required: true
    })
    goals: [Responses];

    @Prop({
        type: [
            {
                description: { type: String },
                value: { type: Number }
            }
        ],
        required: true
    })
    competencies: [Responses];

    @Prop({ required: true })
    comentaries: String;

    @Prop({ default: false })
    isResultsDownloaded: boolean;

    @Prop({ default: Date.now() })
    regDate: Date;

}

export const SurveySchema = SchemaFactory.createForClass(Survey);