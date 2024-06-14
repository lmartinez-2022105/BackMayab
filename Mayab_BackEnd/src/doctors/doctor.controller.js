import Doctor from './doctor.model.js'
import DateModel from '../date/date.model.js'
import User from '../users/user.model.js'
import Disease from '../disease/disease.model.js'
import Specialty from '../specialty/specialty.model.js'
import { encrypt } from '../utils/validator.js'


export const register = async (req, res) => {
    try {
        let data = req.body
        let phoneExists = await Doctor.find({ phone: data.phone })
        let phoneUserExists = await User.find({phone: data.phone})
        let dpiExists = await Doctor.find({ DPI: data.DPI })
        let dpiUserExists = await User.find({ DPI: data.DPI })
        let specialtyExists = await Doctor.find({ specialty: data.specialty })
        if (!specialtyExists) return res.status(404).send({ message: 'La especialidad no existe' })
        if (phoneExists) return res.status(409).send({ message: 'Phone already exists' })
        if (phoneUserExists) return res.status(409).send({ message: 'Phone already exists with User' })
        if (dpiExists) return res.status(409).send({ message: 'DPI already exists' })
        if (dpiUserExists) return res.status(409).send({ message: 'DPI already exists with User' })
        if (data.password.length < 8) return res.status(400).send({ message: 'The password must be at least 8 characters' })
        if (!data.DPI.length === 13) return res.status(400).send({ message: 'The DPI must be 13 characters long' })
        data.password = await encrypt(data.password)
        let doctor = new Doctor(data)
        await doctor.save()
        return res.send({ message: 'Medico añadido exitosamente' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error al agregar Medico', err })
    }
}

//FUNCIÓN QUE SIRVE PARA PODER METER DATOS EN ARRAY EN FORMATO JSON
/*
export const register = async (req, res) => {
    try {
        let doctors = req.body // Se asume que req.body es un array de objetos
        if (!Array.isArray(doctors)) {
            return res.status(400).send({ message: 'Los datos deben ser un array' })
        }

        let results = []

        for (let data of doctors) {
            let phoneExists = await Doctor.findOne({ phone: data.phone })
            let phoneUserExists = await User.findOne({ phone: data.phone })
            let dpiExists = await Doctor.findOne({ DPI: data.DPI })
            let dpiUserExists = await User.findOne({ DPI: data.DPI })
            let specialtyExists = await Specialty.findOne({ _id: data.specialty })

            if (!specialtyExists) {
                results.push({ data, status: 404, message: 'La especialidad no existe' })
                continue
            }
            if (phoneExists) {
                results.push({ data, status: 409, message: 'Phone already exists' })
                continue
            }
            if (phoneUserExists) {
                results.push({ data, status: 409, message: 'Phone already exists with User' })
                continue
            }
            if (dpiExists) {
                results.push({ data, status: 409, message: 'DPI already exists' })
                continue
            }
            if (dpiUserExists) {
                results.push({ data, status: 409, message: 'DPI already exists with User' })
                continue
            }
            if (data.password.length < 8) {
                results.push({ data, status: 400, message: 'The password must be at least 8 characters' })
                continue
            }
            if (data.DPI.toString().length !== 13) {
                results.push({ data, status: 400, message: 'The DPI must be 13 characters long' })
                continue
            }

            data.password = await encrypt(data.password)
            let doctor = new Doctor(data)
            await doctor.save()
            results.push({ data, status: 200, message: 'Medico añadido exitosamente' })
        }

        return res.send({ results })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error al agregar Medico', err })
    }
}
*/



export const deleteDoctor = async (req, res) => {
    try {
        let { id } = req.params
        let deleteDoctor = await Doctor.findOneAndDelete({ _id: id })
        if (!deleteDoctor) return res.send({ message: 'No existe el Medico que deseas eliminar' })
        return res.send({ message: 'Medico eliminado exitosamente' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error al eliminar Medico', err })
    }
}

export const deleteMyProfile = async (req, res) => {
    try {
        let { id } = req.user
        let deleteProfile = await Doctor.findOneAndDelete({ _id: id })
        if (!deleteProfile) return res.send({ message: 'No existe tu perfil' })
        return res.send({ message: 'Tu perfil ha sido eliminado exitosamente' })
    } catch (error) {
        return res.status(500).send({ message: 'Error in function deleteMyProfile', error })
    }
}

export const getDoctor = async (req, res) => {
    try {
        let doctors = await Doctor.find().populate('sede', 'nombre -_id').populate('specialty', 'title -_id')
        return res.send(doctors)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error al listar Médicos' })
    }
}

export const getDoctorToSpecialty = async (req, res) => {
    try {
        let { id } = req.params
        let doctors = await Doctor.find({ specialty: id }).populate('sede', 'nombre -_id').select('name surname gender phone -_id')
        if (!doctors) res.status(200).send({ message: 'No hay doctores con esta especialidad' })
        return res.status(200).send({ message: 'Doctores con esta especialidad: ', doctors })
    } catch (error) {
        return res.status(500).send({ message: 'Error en la funcion getDoctorToSpecialty' })
    }
}

export const updateMyProfile = async (req, res) => {
    try {
        let { id } = req.user
        let { passwordOld, passwordNew, ...data } = req.body
        let myProfile = await Doctor.findById(id)
        if (passwordOld !== myProfile.password) return res.status(400).send({ message: 'La contraseña anterior no coincide' })
        let phoneExists = await Doctor.find({ phone: data.phone })
        if (phoneExists) return res.status(409).send({ message: 'El número de telefono ya está registrado con otro usuario' })
        if (passwordNew < 8) return res.status(400).send({ message: 'The password must be at least 8 characters' })
        if (!data.DPI.length === 13) return res.status(400).send({ message: 'The DPI must be 13 characters long' })
        passwordNew = await encrypt(passwordNew)
        let updateProfile = await Doctor.findByIdAndUpdate(id, { ...data, password: passwordNew })
        return res.send({ message: 'Tu perfil se ha actualizado', updateProfile })
    } catch (error) {
        return res.status(500).send({ message: 'Error in function updateMyProfile' })
    }
}

export const updateDoctor = async (req, res) => {
    try {
        let { id } = req.params
        let { passwordOld, passwordNew, ...data } = req.body
        let doctorUpdate = await Doctor.findById(id)
        if (passwordOld !== doctorUpdate.password) return res.status(400).send({ message: 'La constraseña anterior no conincide' })
        let phoneExists = await Doctor.find({ phone: data.phone })
        let dpiExists = await Doctor.find({ DPI: data.DPI })
        if (phoneExists) return res.status(409).send({ message: 'El número de telefono ya está registrado con otro usuario' })
        if (dpiExists) return res.status(409).send({ message: 'El DPI ya está registrado con otro usuario' })
        if (passwordNew.length < 8) return res.status(400).send({ message: 'The password must be at least 8 characters' })
        if (!data.DPI.length === 13) return res.status(400).send({ message: 'The DPI must be 13 characters long' })
        passwordNew = await encrypt(passwordNew)
        let updateDoctor = await Doctor.findByIdAndUpdate(id, { ...data, password: passwordNew })
        return res.send({ message: 'Medico actualizado exitosamente', updateDoctor })
    } catch (error) {
        return res.status(500).send({ message: 'Error in function updateDoctor' })
    }
}

export const updateDiseaseDoctorToUser = async (req, res) => {
    try {
        const { userId, diseaseId, diagnostic } = req.body

        // Verificar si el usuario y la enfermedad existen
        const user = await User.findById(userId)
        const disease = await Disease.findById(diseaseId)

        if (!user || !disease) {
            return res.status(404).send({ message: 'Usuario o enfermedad no encontrada' })
        }

        // Obtener la cita del usuario
        let userDate = await DateModel.findById(user.date)

        // Verificar si la cita y el doctor asociado existen
        if (!userDate || !userDate.doctor) {
            return res.status(400).send({ message: 'No se encontró la cita del usuario o el doctor asociado' })
        }

        // Programar una nueva cita según la severidad de la enfermedad
        let daysToAdd
        switch (disease.severity) {
            case 'ALTO':
                daysToAdd = 4
                break
            case 'MEDIO':
                daysToAdd = 8
                break
            case 'BAJO':
                daysToAdd = 12
                break
            default:
                return res.status(400).send({ message: 'Severidad de enfermedad no válida' })
        }

        const currentDate = new Date()
        const appointmentDate = new Date(currentDate.getTime())
        appointmentDate.setDate(appointmentDate.getDate() + daysToAdd)

        let chosenDoctor

        // Obtener doctores con información de la sede y la especialidad relacionada
        const doctors = await Doctor.find({ ROL: 'MEDICO', specialty: disease.specialtyRequired }).populate('sede')
        if (doctors.length === 0) {
            return res.status(500).send({ message: 'No hay doctores disponibles para esta especialidad' })
        }

        const openingHours = (hours) => {
            const [start, end] = hours.split('-').map(h => parseInt(h))
            return { start, end }
        }

        for (let i = 0; i < doctors.length; i++) {
            const doctor = doctors[i]
            const { start, end } = openingHours(doctor.openingHours)

            for (let hour = start; hour < end; hour++) {
                const randomMinute = Math.floor(Math.random() * 12) * 5 // múltiplos de 5
                appointmentDate.setHours(hour, randomMinute, 0)

                const conflictingAppointment = await DateModel.findOne({
                    date: {
                        $gte: new Date(appointmentDate.setSeconds(0, 0)),
                        $lt: new Date(appointmentDate.setSeconds(59, 999))
                    },
                    doctor: doctor._id
                })

                if (!conflictingAppointment) {
                    chosenDoctor = doctor
                    userDate.date = new Date(appointmentDate) // Actualiza la fecha de la cita
                    userDate.doctor = doctor._id // Actualiza el doctor de la cita
                    break
                }
            }

            if (chosenDoctor) {
                break
            }
        }

        if (!chosenDoctor) {
            return res.status(500).send({ message: 'No hay disponibilidad de citas en el rango de fechas' })
        }

        // Guardar el historial de la cita actual
        const updateRecord = {
            updateDate: new Date(),
            diagnostic: diagnostic,
            previousDate: userDate.date,
            previosTime: userDate.time
        }
        userDate.updates.push(updateRecord)

        // Guardar la nueva cita
        await userDate.save()

        const sedeName = chosenDoctor.sede ? chosenDoctor.sede.nombre : 'No especificada'

        return res.send({
            message: 'Enfermedad actualizada y cita programada exitosamente',
            appointment: {
                date: userDate.date.toISOString().split('T')[0],
                time: userDate.date.toTimeString().split(':').slice(0, 2).join(':'),
                doctor: `${chosenDoctor.name} ${chosenDoctor.surname}`,
                sede: sedeName
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error al actualizar la enfermedad y programar la cita', error: err })
    }
}
