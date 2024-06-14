import Disease from '../disease/disease.model.js'

export const newDisease = async (req, res) => {
    try {
        let disease = req.body
        const existingDisease = await Disease.findOne({ name: disease.name })

        if (existingDisease) {
            return res.status(400).send({ message: 'La enfermedad ya existe en la base de datos' })
        }

        if (!disease.name || !disease.description || !disease.symptoms || !disease.severity) {
            return res.status(400).send({ message: 'Todos los campos (name, description, symptoms, severity) son requeridos para cada enfermedad' })
        }
        const allowedSeverities = ['ALTO', 'MEDIO', 'BAJO']
        if (!allowedSeverities.includes(disease.severity)) {
            return res.status(400).send({ message: 'La severidad debe ser ALTO, MEDIO o BAJO' })
        }

        let newDisease = new Disease(disease)
        await newDisease.save()
        return res.send({ message: 'disease registered successfully', disease})
    } catch (error) {
        return res.status(500).send({ message: 'Error in function newdiseaseBatch', error: error})
    }
}

/*
export const newDisease = async (req, res) => {
    try {
        const diseases = req.body;
        
        if (!Array.isArray(diseases)) {
            return res.status(400).send({ message: 'Los datos deben ser un array' });
        }

        for (let disease of diseases) {
            const existingDisease = await Disease.findOne({ name: disease.name });

            if (existingDisease) {
                continue; // Skip this disease if it already exists
            }

            if (!disease.name || !disease.description || !disease.symptoms || !disease.severity || !disease.specialtyRequired) {
                return res.status(400).send({ message: 'Todos los campos (name, description, symptoms, severity, specialtyRequired) son requeridos para cada enfermedad' });
            }

            const allowedSeverities = ['ALTO', 'MEDIO', 'BAJO'];
            if (!allowedSeverities.includes(disease.severity)) {
                return res.status(400).send({ message: 'La severidad debe ser ALTO, MEDIO o BAJO' });
            }

            let newDisease = new Disease(disease);
            await newDisease.save();
        }

        return res.send({ message: 'Enfermedades registradas exitosamente' });
    } catch (error) {
        console.error("Error en la función newDiseaseBatch:", error);
        return res.status(500).send({ message: 'Error al agregar enfermedades', error: error });
    }
}
*/


export const editDisease = async (req, res) => {
    try {
        let data = req.body
        let {id} = req.params
        let disease = await Disease.findById(id)
        if (!disease) return res.status(404).send({ message: 'Disease not found' })

        if (data.name && data.name !== disease.name) {
            const existingDisease = await Disease.findOne({ name: data.name })
            if (existingDisease) {
                return res.status(400).send({ message: 'Ya existe una enfermedad con el nuevo nombre proporcionado' })
            }
        }

        if (!data.name) {
            data.name = disease.name
        }
        if (!data.description) {
            data.description = disease.description
        }
        if (!data.symptoms) {
            data.symptoms = disease.symptoms
        }
        if (!data.severity) {
            data.severity = disease.severity
        } else {
            const allowedSeverities = ['ALTO', 'MEDIO', 'BAJO']
            if (!allowedSeverities.includes(data.severity)) {
                return res.status(400).send({ message: 'La severidad debe ser ALTO, MEDIO o BAJO' })
            }
        }

        let diseaseUpdate = await Disease.findByIdAndUpdate(id, data, { new: true })
        return res.send({ message: 'Disease updated successfully', diseaseUpdate })
    } catch (error) {
        return res.status(500).send({ message: 'Error in function editDisease', error })
    }
}


export const deleteDisease = async (req, res) => {
    try {
        let {id} = req.params
        let disease = await Disease.findById(id)
        if (!disease) return res.status(404).send({ message: 'Disease not found' })
        await Disease.findByIdAndDelete(id)
        return res.send({ message: 'Disease deleted successfully', disease })
    } catch (error) {
        return res.status(404).send({ message: 'Error in function deleteDisease', error })
    }
}

export const listDiseases = async (req, res) => {
    try {
        let diseases = await Disease.find({}, 'name description symptoms severity')
        return res.send(diseases)
    } catch (error) {
        return res.status(404).send({ message: 'Error in function listDiseases', error })
    }
}

export const searchDisease = async (req, res) => {
    try {
        const { name, symptoms, severity } = req.body;
        let query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (symptoms) {
            query.symptoms = { $regex: symptoms, $options: 'i' };
        }
        if (severity) {
            query.severity = { $regex: severity, $options: 'i' };
        }

        let diseases = await Disease.find(query);

        if (!diseases.length) {
            return res.status(404).send({ message: 'No diseases found for the given search criteria' });
        }

        return res.send({ message: 'Diseases found:', diseases });
    } catch (error) {
        return res.status(500).send({ message: 'Error in function searchDisease', error });
    }
}