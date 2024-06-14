import { Schema, model } from "mongoose";

const ambulanceSchema = new Schema({
    placa:{
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

export default model('ambulance', ambulanceSchema)