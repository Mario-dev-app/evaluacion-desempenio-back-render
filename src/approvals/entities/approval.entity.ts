import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Period } from "../../period/entities/period.entity";
import { User } from "../../user/entities/user.entity";

@Schema()
export class Approval {

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'Period', required: true })
    period: Period;

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User', required: true })
    approverOne: User;
    
    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User', required: false })
    approverTwo: User;

    @Prop({ enum: ['IN REVIEW 2' ,'IN REVIEW 1', 'APPROVED', 'REJECTED', 'DONE'], default: 'IN REVIEW 1' })
    state: string;
}

export const ApprovalSchema = SchemaFactory.createForClass(Approval);