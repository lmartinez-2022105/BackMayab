import {Schema, model} from 'mongoose'

const diseaseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    symptoms: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['ALTO', 'BAJO', 'MEDIO'],
        required: true
    }, 
    specialtyRequired: {
        type: Schema.ObjectId,
        ref:'specialty',
        required: true
    }
}, {
    versionKey: false
})

export default model('disease', diseaseSchema)