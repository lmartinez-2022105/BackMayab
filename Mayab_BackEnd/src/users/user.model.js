import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        require: true
    },
    surname:{
        type:String,
        required: true
    },
    DPI:{
        type:Number,
        required: true,
        unique: true
    },
    phone:{
        type:Number,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
        minLenght:[8, 'Su contraseña debe de ser de al menos 8 caracteres']
    },
    email:{
        type:String,
        unique: true,
        required:false
    },
    ROL:{
        type:String,
        required:true,
        enum:['AFILIADO','PARAMEDICO','ADMIN']
    },
    disease: {
        type: Schema.ObjectId,
        ref: 'disease',
        required: true
    },
    date: {
        type: Schema.ObjectId,
        ref: 'date'
    }
},
 {
    versionKey: false
 }
)

export default model('user', userSchema)