import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Area {

    @Prop({ required: true })
    label: string;
    
    @Prop({ required: true, unique: true })
    code: string;

    @Prop({ default: true })
    active: boolean; 

}


export const AreaSchema = SchemaFactory.createForClass(Area);