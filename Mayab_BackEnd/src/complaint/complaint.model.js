import { Schema, model } from "mongoose";

const complaintSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user'
    },
    reason: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},
    {
        versionKey: false
    }
)

export default model('complaint', complaintSchema)