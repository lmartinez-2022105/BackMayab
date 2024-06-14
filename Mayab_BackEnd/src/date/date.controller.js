import Date from '../date/date.model.js'
import User from '../users/user.model.js'

const isDoctorAvailable = async (doctorId, date, time) => {
    const existingDate = await Date.findOne({
        doctor: doctorId,
        date: date,
        time: time
    })
    return !existingDate
}

export const updateDate = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params
        let foundDate = await Date.findById(id)

        if (!data.date) {
            data.date = foundDate.date
        }
        if (!data.time) {
            data.time = foundDate.time
        }
        if (!data.doctor) {
            data.doctor = foundDate.doctor
        }

        // Validar que el tiempo esté en formato de 24 horas y sea múltiplo de 5
        let [hours, minutes] = data.time.split(':').map(Number)
        minutes = Math.floor(minutes / 5) * 5
        data.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

        const doctorAvailable = await isDoctorAvailable(data.doctor, data.date, data.time)

        if (!doctorAvailable) {
            return res.status(400).send({ message: 'El doctor no está disponible en esa fecha y hora' })
        }

        let updatedDate = await Date.findByIdAndUpdate(id, data, { new: true })

        if (!updatedDate) {
            return res.status(400).send({ message: 'No se pudo actualizar la cita' })
        }

        return res.status(200).send({ message: 'Cita actualizada', updatedDate })
    } catch (error) {
        return res.status(404).send({ message: 'Error en la función updateDate', error })
    }
}

export const deleteDate = async (req, res) => {
    try {
        let {id} = req.params
        let deletedDate = await Date.findByIdAndDelete(id)
        if (!deletedDate) return res.status(404).send({ message: 'No se pudo eliminar la cita'})
        return res.status(200).send({ message: 'Cita eliminada', deletedDate })
    } catch (error) {
        return res.status(400).send({ message: 'Error in function deleteDate', error })
    }
}

export const myDate = async (req, res) => {
    try {
        let userId = req.user._id

        // Obtener el usuario para acceder a su cita
        let user = await User.findById(userId).populate({
            path: 'date',
            select: '-_id',
            populate: {
                path: 'doctor',
                select: 'name surname sede -_id',
                populate: {
                    path:'sede',
                    select: 'nombre -_id'
                }
            }
        })
        if (!user) return res.status(404).send({ message: 'Usuario no encontrado' })

        let myDate = user.date
        if (!myDate) return res.status(404).send({ message: 'No se encontró tu cita' })

        return res.status(200).send({ message: 'Cita encontrada', myDate })
    } catch (error) {
        return res.status(500).send({ message: 'Error en la función myDate', error })
    }
}

export const viewMedicalHistory = async (req, res) => {
    try {
        let userId = req.user._id

        // Buscar el usuario por su ID
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' })
        }

        // Obtener la cita del usuario y poblar los datos relacionados
        const userDate = await Date.findById(user.date).populate({
            path: 'updates',
            populate: {
                path: 'doctor',
                model: 'doctor'
            }
        })
        if (!userDate) {
            return res.status(404).send({ message: 'No se encontró la cita del usuario' })
        }

        // Obtener y devolver el historial médico del usuario
        const medicalHistory = userDate.updates
        return res.send({ msg: `Hola ${user.name}, este es tu historial médico:`, medicalHistory })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error al obtener el historial médico', error: err })
    }
}