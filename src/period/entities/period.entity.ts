import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Societies } from "src/user/enums/societies.enum";

@Schema()
export class Period {

    @Prop({ required: true })
    year: string;

    @Prop({ required: true })
    society: Societies;

    @Prop({ default: true })
    visible: boolean;

    @Prop({ default: true })
    active: boolean;

    @Prop({ default: false })
    surveyActive: boolean;

    @Prop({ default: false })
    resultsActive: boolean;
    
}

export const PeriodSchema = SchemaFactory.createForClass(Period);