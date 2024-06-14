import { Schema, model } from "mongoose";

const contactsSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    contact:{
        name:{
            type: String,
            required: true,
        },
        email:{
            type:String,
            required: true
        }
    },
    contact1:{
        name1:{
            type: String,
        },
        email1:{
            type:String
        }
    },
    contact2:{
        name2:{
            type: String,
        },
        email2:{
            type:String,
        }
    }
}, {
    versionKey: false
});

export default model('contacts', contactsSchema);