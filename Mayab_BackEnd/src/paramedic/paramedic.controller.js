'use strict'

import Paramedic from './paramedic.model.js'
import User from '../users/user.model.js'
import Doctor from '../doctors/doctor.model.js'

export const addParamedic = async (req, res) => {
    try {
        let data = req.body

        data.status = false

        if (data.name == '' || data.surname == '' || data.DPI == '' || data.phone == '') {
            return res.send({ msg: 'Por favor ingrese toda la información que se le solicita' })
        }

        function isNumeric(str) {
            return /^\d+$/.test(str)
        }

        //Verificar DPI
        let existsDPI = await Paramedic.findOne({ DPI: data.DPI })
        let existsDPIUser = await User.findOne({ DPI: data.DPI })
        let existsDPIDoctor = await Doctor.findOne({ DPI: data.DPI })

        //Verificar numero de telefono
        let existsPhoneParamedic = await Paramedic.findOne({ phone: data.phone })
        let existsPhoneUser = await User.findOne({ phone: data.phone })
        let existsPhoneDoctor = await Doctor.findOne({ phone: data.phone })

        //Mensajes de DPI
        if (existsDPI) return res.status(409).send({ msg: 'Paramedico ya registrado con este DPI' })
        if (existsDPIUser) return res.status(409).send({ msg: 'Usuario ya registrado con este DPI' })
        if (existsDPIDoctor) return res.status(409).send({ msg: 'Doctor ya registrado con este DPI' })

        //Mensajes de telefono
        if (existsPhoneParamedic) return res.status(409).send({ msg: 'Paramedico ya registrado con este teléfono' })
        if (existsPhoneUser) return res.status(409).send({ msg: 'Usuario ya registrado con este teléfono' })
        if (existsPhoneDoctor) return res.status(409).send({ msg: 'Doctor ya registrado con este teléfono' })

        //Validaciones
        if (data.DPI.length !== 13 || !isNumeric(data.DPI)) return res.send({ msg: 'Por favor verifique el DPI, debe contener 13 números' })
        if (data.phone.length !== 8 || !isNumeric(data.phone)) return res.send({ msg: 'Por favor verifique el teléfono, debe contener 8 números' })

        let paramedic = new Paramedic(data)
        await paramedic.save()
        return res.send({ msg: 'Paramedico registrado exitosamente' })
    } catch (error) {
        console.error(error)
        return res.send({ msg: 'Error en la función addParamedic' })
    }
}

export const deleteParamedic = async (req, res) => {
    try {
        let { id } = req.params
        let delParamedic = await Paramedic.findOneAndDelete({ _id: id })
        if (!delParamedic) return res.status(404).send({ msg: 'Paramedico no encontrado' })
        return res.send({ msg: 'Paramedico eliminado correctamente' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ msg: 'Error en la función deleteParamedic' })
    }
}

export const updateParamedic = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body

        if (data.name == '' || data.surname == '' || data.DPI == '' || data.phone == '') {
            return res.send({ msg: 'Por favor ingrese toda la información que se le solicita' })
        }

        function isNumeric(str) {
            return /^\d+$/.test(str)
        }

        if (data.DPI) {
            if (data.DPI.length !== 13 || !isNumeric(data.DPI)) return res.send({ msg: 'Por favor verifique el DPI, debe contener 13 números' })

            let existsDPI = await Paramedic.findOne({ DPI: data.DPI })
            let existsDPIUser = await User.findOne({ DPI: data.DPI })
            let existsDPIDoctor = await Doctor.findOne({ DPI: data.DPI })

            if (existsDPI) return res.status(409).send({ msg: 'Paramedico ya registrado con este DPI' })
            if (existsDPIUser) return res.status(409).send({ msg: 'Usuario ya registrado con este DPI' })
            if (existsDPIDoctor) return res.status(409).send({ msg: 'Doctor ya registrado con este DPI' })
        }

        if (data.phone) {
            if (data.phone.length !== 8 || !isNumeric(data.phone)) return res.send({ msg: 'Por favor verifique el teléfono, debe contener 8 números' })
            
            let existsPhoneParamedic = await Paramedic.findOne({ phone: data.phone })
            let existsPhoneUser = await User.findOne({ phone: data.phone })
            let existsPhoneDoctor = await Doctor.findOne({ phone: data.phone })

            if (existsPhoneParamedic) return res.status(409).send({ msg: 'Paramedico ya registrado con este teléfono' })
            if (existsPhoneUser) return res.status(409).send({ msg: 'Usuario ya registrado con este teléfono' })
            if (existsPhoneDoctor) return res.status(409).send({ msg: 'Doctor ya registrado con este teléfono' })
        }

        let updateParamedic =  await Paramedic.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateParamedic) return res.status(404).send({ msg: 'Paramedico no encontrado y no actualizado' })
        return res.status(200).send({ msg: 'Paramedico actualizado correctamente', updateParamedic })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ msg: 'Error en la función updateParamedic' })
    }
}

export const listParamedics = async (req, res) => {
    try {
        let paramedics = await Paramedic.find()
        if (paramedics.length == 0) return res.status(404).send({ msg: 'No hay paramedicos' })
        return res.status(200).send({ msg: 'Se han listado correctamente los paramedicos', paramedics })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ msg: 'Error en la función listParamedics' })
    }
}

export const listParamedicsAvailable = async(req, res) =>{
    try {
        let paramedics = await Paramedic.find({status: true})
        if(paramedics.length == 0) return res.status(404).send({msg:'No hay paramedicos disponibles'})
        return res.status(200).send({ msg: 'Se han listado correctamente los paramedicos disponibles', paramedics })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ msg: 'Error en la función listParamedicsAvaible' })
    }
}