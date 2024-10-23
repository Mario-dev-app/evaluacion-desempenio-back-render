import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Roles, Societies } from "../enums";
import { Area } from "../../area/entities/area.entity";
import * as mongoose from "mongoose";

@Schema()
export class User {

    @Prop({ required: true, minlength: 3 })
    firstname: string;
    
    @Prop({ required: true, minlength: 3 })
    lastname: string;

    @Prop({ unique: true, minlength: 8 })
    numDoc: string;

    @Prop({ required: false, minlength: 5 })
    email: string;
    
    @Prop({ required: true, minlength: 3, unique: true })
    username: string;
    
    @Prop({ required: true, minlength: 3 })
    password: string;

    @Prop({ enum: Roles, default: Roles.USER })
    role: Roles;

    @Prop({ enum: Societies, required: true })
    society: Societies;

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'Area', required: true })
    area: Area;

    @Prop({ required: true })
    position: string;

    @Prop({ required: true })
    competencyLevel: number;

    @Prop({ default: true })
    active: boolean;

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User', required: false })
    approver: User;
    
    @Prop({ default: Date.now() })
    regDate: Date;

    @Prop({ required: false })
    onesignal_id: string;

    @Prop({ required: false })
    external_id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
