import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({collection: 'competencies'})
export class Competency {

    @Prop({ required: true, unique: true })
    level: number;

    @Prop({ required: true })
    label: string;

    @Prop({ required: true })
    grouping: string[];

}

export const CompetencySchema = SchemaFactory.createForClass(Competency);
