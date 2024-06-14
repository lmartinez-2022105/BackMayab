import {Schema, model} from 'mongoose'

const medicalHistorySchema = new Schema({
    updateDate: {
        type: Date, 
        required: true
    },
    diagnostic: {
        type: String,
        required: true
    },
    previousDate: {
        type: Date,
        required: true
    },
    previosTime: {
        type: String,
        required: true
    }
},{
    versionKey: false
})


const dateSchema = new Schema({
    date:{
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    doctor: {
        type: Schema.ObjectId,
        ref: 'doctor',
        required: true
    },
    updates: [medicalHistorySchema]
}, {
    versionKey: false
})

export default model('date', dateSchema)