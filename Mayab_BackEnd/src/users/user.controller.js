import User from './user.model.js'
import DateModel from '../date/date.model.js'
import Disease from '../disease/disease.model.js'
import Doctor from '../doctors/doctor.model.js'
import { generateJwt } from '../utils/generateToken.js'
import { encrypt, checkPassword } from '../utils/validator.js'

export const test = (req, res) => {
    try {
        return res.send({ message: 'Server running' })
    } catch (error) {
        console.error(error)
        return error
    }
}

export const register = async (req, res) => {
    try {
        let data = req.body
        data.ROL = 'AFILIADO'

        // Validar que el DPI tenga exactamente 13 dígitos numéricos
        if (!(/^\d{13}$/.test(data.DPI))) {
            return res.status(400).send({ message: 'El DPI debe tener exactamente 13 dígitos numéricos' })
        }

        // Validar que la contraseña tenga al menos 8 caracteres
        if (data.password.length < 8) {
            return res.status(400).send({ message: 'La contraseña debe tener al menos 8 caracteres' })
        }

        // Validaciones de existencia de datos
        const checks = [
            { model: User, field: 'DPI', message: 'El DPI que ingresó ya ha sido registrado con otro usuario' },
            { model: Doctor, field: 'DPI', message: 'El DPI que ingresó ya ha sido registrado con otro Doctor' },
            { model: User, field: 'email', message: 'El correo que ingresó ya ha sido registrado con otro usuario' },
            { model: User, field: 'phone', message: 'El teléfono que ingresó ya ha sido registrado con otro usuario' },
            { model: Doctor, field: 'phone', message: 'El teléfono que ingresó ya ha sido registrado con otro doctor' }
        ]

        for (const check of checks) {
            let condition = {}
            condition[check.field] = data[check.field]
            let exist = await check.model.findOne(condition)
            if (exist) return res.status(400).send({ message: check.message })
        }

        // Validación de campos vacíos
        if (!data.name || !data.surname || !data.DPI || !data.phone || !data.password || !data.disease) {
            return res.status(400).send({ message: 'Por favor llene todos los campos obligatorios' })
        }

        // Verificar existencia de la enfermedad
        const disease = await Disease.findById(data.disease)
        if (!disease) {
            return res.status(400).send({ message: 'Enfermedad no válida' })
        }

        // Encriptación de la contraseña
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()

        // Lógica para programar la cita
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
                return res.status(400).send({ message: 'Severidad desconocida' })
        }

        const currentDate = new Date()
        const appointmentDate = new Date(currentDate.getTime())
        appointmentDate.setDate(appointmentDate.getDate() + daysToAdd)

        let appointmentScheduled = false
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
                    appointmentScheduled = true
                    break
                }
            }

            if (appointmentScheduled) {
                break
            } else {
                console.log(`Doctor no disponible: ${doctor.name} ${doctor.surname} en el rango de horas ${doctor.openingHours}`)
            }
        }

        if (!appointmentScheduled) {
            return res.status(500).send({ message: 'No hay disponibilidad de citas en el rango de fechas' })
        }

        const newDate = new DateModel({
            date: appointmentDate,
            time: appointmentDate.toTimeString().split(':').slice(0, 2).join(':'), // Solo la hora en formato HH:MM
            doctor: chosenDoctor._id,
            updates: [] // No inicializar con updates
        })

        await newDate.save()

        // Asignar la cita al usuario
        user.date = newDate._id
        await user.save()

        console.log('Registro y cita creados exitosamente')

        return res.send({
            message: 'Te has registrado exitosamente y tu cita ha sido programada',
            appointment: {
                date: appointmentDate.toDateString(),
                time: appointmentDate.toTimeString().split(':').slice(0, 2).join(':'),
                doctor: `${chosenDoctor.name} ${chosenDoctor.surname}`,
                sede: chosenDoctor.sede.nombre
            }
        })
    } catch (error) {
        console.error("Error en el registro:", error)
        return res.status(500).send({ message: 'Error al registrarse', error })
    }
}

export const login = async (req, res) => {
    try {
        let { password, email, DPI, phone } = req.body
        let user = await User.findOne({ $or: [{ email: email }, { DPI: DPI }, { phone: phone }] })
        let doctor = await Doctor.findOne({ $or: [{ DPI: DPI }, { phone: phone }] })
        if(!user || !await checkPassword(password, user.password)) return res.status(401).send({message: 'DPI o contraseña incorrectos'})
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                surname: user.surname,
                name: user.name,
                phone: user.phone,
                DPI: user.DPI,
                email: user.email,
                role: user.ROL
            }
            let token = await generateJwt(loggedUser)
            return res.send({
                message: `Welcome ${loggedUser.name}`,
                loggedUser,
                token
            })
        } else if (doctor && await checkPassword(password, doctor.password)) {
            let loggedDoctor = {
                uid: doctor._id,
                surname: doctor.surname,
                name: doctor.name,
                phone: doctor.phone,
                role: doctor.ROL
            }
            let token = await generateJwt(loggedDoctor)
            return res.send({
                message: `Welcome Dr.${loggedDoctor.name}`,
                loggedDoctor,
                token
            })
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al intentarse logear', error })
    }
}
