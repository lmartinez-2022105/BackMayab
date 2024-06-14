'use strict'

import MedicalTeam from './teamMedical.model.js'
import Ambulance from '../ambulance/ambulance.model.js'
import Paramedic from '../paramedic/paramedic.model.js'

export const addMedicalTeam = async(req, res)=>{
    try {
        let data = req.body

        // let existsAmbulance =  await Ambulance.findOne({_id: data.ambulance})
        // if(!existsAmbulance) return res.status(404).send({msg: 'Ambulancia no encontrada'})

        // let existsParamedic = await Paramedic.findOne({_id: data.paramedic})
        // if(!existsParamedic) return res.status(404).send({msg: 'Paramedico no encontrado'})

        // let existsParamedicTeam = await MedicalTeam.findOne({ paramedics: data.paramedics})
        // if(existsParamedicTeam) return res.send({msg: 'Ya existe ese paramedico'})

        // let medicalTeamParamedic = await Paramedic.find()
        // console.log(medicalTeamParamedic)
        // if(medicalTeamParamedic.length > 3) return res.send({msg: 'Ha alcanzado el maximo de paramedicos por equipo'})

        let medicalTeam = new MedicalTeam(data)
        await medicalTeam.save()
        return res.send({msg: 'Equipo médico registrado exitosamente'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({msg: 'Error en el metodo addMedicalTeam'})
    }
}

export const updateTeamMedical = async(req, res) =>{
    try {
        
    } catch (error) {
        console.error(error)
        return res.status(500).send({msg: 'Error en el metodo updateTeamMedical'})
    }
}

export const listTeamMedical = async(req, res) =>{
    try {
        let medicalsTeams = await MedicalTeam.find().populate('paramedics', ['-_id', 'name', 'surname'])
        if(medicalsTeams.length == 0) return res.status(404).send({msg: 'No hay equipos medicos'})
        return res.status(200).send({msg: 'Equipos medicos: ', medicalsTeams})
    } catch (error) {
        console.error(error)
        return res.status(500).send({msg: 'Error en el metodo listTeamMedical'})
    }
}