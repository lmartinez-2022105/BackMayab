import { Schema, model } from "mongoose";

const alertSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    contacts:[{
        type: Schema.Types.ObjectId,
        ref: 'contact',
        required: true
    }],
    teamMedical:{
        type: Schema.ObjectId,
        ref: 'teamMedical',
        required: true
    },
    historialClinico:{
        type: Schema.ObjectId,
        required: true
    },
    ubicacion: {
        latitud: {
            type: String,
            required: true
        },
        longitud: {
            type: String,
            required: true
        }
    },
    date:{
        type: Date,
        required: true
    }
},{
    versionKey: false
})

export default model('alert', alertSchema)