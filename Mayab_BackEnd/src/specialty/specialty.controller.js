import Specialty from './specialty.model.js'


export const newSpecialty = async (req, res) => {
    try {
        let data = req.body
        let specialtyFound = await Specialty.find({ title: data.title })
        if (specialtyFound) return res.status(409).send({ message: 'Specialty already exists' })
        let specialty = new Specialty(data)
        await specialty.save()
        return res.send({ message: `Specialty ${specialty.title} registrada satisfactoriamente` })
    } catch (error) {
        return res.status(500).send({ message: 'Error en la función newSpecialty' })
    }
}

/*
Esta función sirve para poder meterle datos a la entidad en formato JSON en array
export const newSpecialty = async (req, res) => {
    try {
        let data = req.body
        
        // Verificar si la solicitud contiene datos
        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(400).send({ message: 'Invalid data format or empty array' })
        }

        // Verificar si alguna de las especialidades ya existe
        const existingSpecialties = await Specialty.find({ title: { $in: data.map(item => item.title) } })
        if (existingSpecialties.length > 0) {
            const existingTitles = existingSpecialties.map(spec => spec.title)
            return res.status(409).send({ message: `Specialties already exist: ${existingTitles.join(', ')}` })
        }

        // Crear las nuevas especialidades
        const specialties = await Specialty.create(data)

        return res.send({ message: `${specialties.length} specialties registered successfully` })
    } catch (error) {
        console.error('Error in newSpecialties:', error)
        return res.status(500).send({ message: 'Error in newSpecialties function' })
    }
}
*/



export const updateSpecialty = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let specialtyFound = await Specialty.find({ title: data.title })
        if (specialtyFound) return res.status(409).send({ message: 'Specialty already exists' })
        let updateSpecialty = await Specialty.findOneAndUpdate({ _id: id }, data)
        return res.status(200).send({ message: 'Especialidad actualizada', updateSpecialty })
    } catch (error) {
        return res.status(500).send({ message: 'Error en la función updateSpecialty' })
    }
}

export const deleteSpecialty = async (req, res) => {
    try {
        let { id } = req.params
        let deletedSpecialty = await Specialty.findByIdAndDelete(id)
        if (!deletedSpecialty) return res.status(404).send({ message: 'Especialidad no encontrada' })
        return res.status(200).send({ message: `Especialidad ${deletedSpecialty.title} eliminada satisfactoriamente` })
    } catch (error) {
        return res.status(500).send({ message: 'Error en la funcion deleteSpecialty' })
    }
}

export const listSpecialties = async (req, res) => {
    try {
        let specialties = await Specialty.find()
        if (!specialties) return res.status(400).send({ message: 'No hay registros de especialidades' })
        return res.status(200).send({ message: 'Especialidades econtradas: ', specialties })
    } catch (error) {
        return res.status(500).send({ message: 'Error en la funcion listSpecialties' })
    }
}

export const searchSpecialties = async (req, res) => {
    try {
        const { name, letter } = req.body; // Obtiene el nombre y la letra de la especialidad de la solicitud
        let query = {};

        if (name) {
            // Utiliza expresiones regulares para buscar el nombre de la especialidad, ignorando las tildes y distinguiendo entre mayúsculas y minúsculas
            const regexName = new RegExp(`^${name.replace(/[^\w\s]/gi, '')}$`, 'i'); // Remueve los caracteres especiales y tildes
            query.title = { $regex: regexName };
        }

        if (letter) {
            // Utiliza expresiones regulares para buscar la letra en el nombre de la especialidad, ignorando las tildes y distinguiendo entre mayúsculas y minúsculas
            const regexLetter = new RegExp(letter, 'i'); // No se remueven caracteres especiales para buscar la letra tal cual
            query.title = { $regex: regexLetter };
        }

        let specialties = await Specialty.find(query);

        if (!specialties.length) {
            return res.status(404).send({ message: 'No specialties found for the given search criteria' });
        }

        return res.send({ message: 'Specialties found:', specialties });
    } catch (error) {
        return res.status(500).send({ message: 'Error in function searchSpecialties', error });
    }
}