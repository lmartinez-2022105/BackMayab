import {Schema, model} from 'mongoose'

const specialtySchema = new Schema({
    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    }
}, {
    versionKey: false
})

export default model('specialty', specialtySchema)