import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { Period } from "../../period/entities/period.entity";
import { User } from "../../user/entities/user.entity";

@Schema()
export class Goal {

    @Prop({ required: true })
    description: string;

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
    user: User;
    
    @Prop({ type: mongoose.Schema.ObjectId, ref: 'Period' })
    period: Period;

    @Prop({ default: Date.now() })
    regDate: Date;

}

export const GoalSchema = SchemaFactory.createForClass(Goal);
