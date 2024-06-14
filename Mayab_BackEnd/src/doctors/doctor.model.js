import { Schema, model } from "mongoose"

const doctorSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    surname: {
        type: String,
        required: true
    },
    specialty: {
        type: Schema.ObjectId,
        ref: "specialty",
        required: true
    },
    openingHours:{
        type: String, 
        required: true
    },  
    gender: {
        type: String,
        enum: ["male", "female"],
        require: true
    },
    sede: {
        type: Schema.Types.ObjectId,
        ref: "sede",
        required: true
    },
    DPI: {
        type: Number,
        required: true,
        unique: true
    },
    phone:{
        type:Number,
        required: true,
        unique: true,
    },
    ROL:{
        type:String,
        default: 'MEDICO'
    }, 
    password:{
        type:String,
        required: true,
        minLenght:[8, 'Su contraseña debe de ser de al menos 8 caracteres']
    }
},
    {
        versionKey: false
    }
)

export default model('doctor', doctorSchema)