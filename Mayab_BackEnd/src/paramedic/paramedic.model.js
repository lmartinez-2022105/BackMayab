import { Schema, model } from "mongoose";

const paramedicSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    DPI:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        required: true,
        default: false
    },
    sede:{
        type: Schema.ObjectId,
        required: true
    }
},{
    versionKey: false
})

export default model('paramedic', paramedicSchema)