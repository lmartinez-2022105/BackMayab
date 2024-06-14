'use strict'

import Ambulance from './ambulance.model.js'
import Paramedic from '../paramedic/paramedic.model.js'

export const addAmbulance = async (req, res) => {
    try {
        let data = req.body

        if (data.placa == '' || data.status == '' || data.sede == '') {
            return res.send({ msg: 'Ingrese la información solicitada' })
        }

        if (data.placa.length !== 7) return res.send({ msg: 'Ingrese los 7 caracteres de placa' })

        let existsPlaca = await Ambulance.findOne({placa: data.placa})
        if(existsPlaca) return res.send({msg: 'La placa ya existe'})

        let ambulance = new Ambulance(data)
        await ambulance.save()
        return res.send({ msg: 'Ambulancia registrada exitosamente' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ msg: 'Error en la función addAmbulance' })
    }
}

export const updateAmbulance = async(req, res) =>{
    try {
        let {id} = req.params
        let data = req.body
        
        if (data.placa == '' || data.status == '' || data.sede == '') {
            return res.send({ msg: 'Ingrese la información' })
        }

        let ambulance = await Ambulance.findOne({_id: id})
        if(!ambulance) return res.status(404).send({msg: 'Ambulancia no encontrada'})

        let updatedAmbulance = await Ambulance.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )

        await ambulance.save()
        return res.status(200).send({msg: 'Ambulancia actualizada correctamente', updatedAmbulance})
    } catch (error) {
        console.error(error)
        return res.status(500).send({msg: 'Error en el metodo de updateAmbulance'})
    }
}

export const deleteAmbulance = async(req, res) =>{
    try {
        let {id} = req.params
        let deleAmbulance = await Ambulance.findOneAndDelete({_id: id})
        if(!deleAmbulance) return res.status(404).send({msg: 'Ambulancia no encontrada y no eliminada'})
        return res.status(200).send({msg: 'Ambulancia eliminada correctamente', deleAmbulance})
    } catch (error) {
        console.error(error)
        return res.status(500).send({msg: 'Error en el metodo de deleteAmbulance'})
    }
}

export const listAmbulances = async(req, res) =>{
    try {
        let ambulances = await Ambulance.find()
        if(ambulances.length == 0) return res.send({msg: 'No hay ambulancias registradas'})
        return res.status(200).send({msg: 'Ambulancias', ambulances})
    } catch (error) {
        console.error(error)
        return res.status(500).send({msg: 'Error en la función listAmbulance'})
    }
}

export const listAmbulancesAvailable = async(req, res) =>{
    try {
        let ambulances = await Ambulance.find({status: true})
        if(ambulances.length == 0) return res.send({msg: 'No hay ambulancias disponibles'})
        return res.status(200).send({msg: 'Ambulancias', ambulances})
    } catch (error) {
        console.error(error)
        return res.status(500).send({msg: 'Error en la función listAmbulance'})
    }
}
