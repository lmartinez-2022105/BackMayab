import { Schema, model } from 'mongoose'

const sedeSchema = new Schema({
    nombre: {
        type: String,
        require: true
    },

    direccion: {
        type: String,
        require: true
    },
    ubicacion:{
        type: String, 
        required: true
    },

    departamento: {
        type: String,
        required: true
    },

    municipio: {
        type: String,
        required: true
    },

    telefono: {
        type: Number,
        minLegnth: [8, 'necesitan 8 caracteres'],
        maxLenght: [8, 'son maximo 8 caracteres'],
        required: true,
        unique: true
    }

},
    {
        versionKey: false
    }
)

export default model('sede', sedeSchema)