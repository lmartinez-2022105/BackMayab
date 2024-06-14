import { Schema, model } from "mongoose";

const medicalTeamSchema = new Schema({
    ambulance:{
        type: Schema.ObjectId,
        ref: 'ambulance',
        required: true
    },
    paramedics:[{
        type: Schema.ObjectId,
        ref: 'paramedic',
        required: true
    }],
    status:{
        type: Boolean,
        required: true
    }
},{
    versionKey: false
})

export default model('medicalTeam', medicalTeamSchema)