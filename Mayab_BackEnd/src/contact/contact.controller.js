'use strict'

import Contact from './contact.model.js'

export const addContact = async (req, res) => {
   try {
    let data = req.body
    let {id} = req.user
    data.patient = id
    if(!data.name && !data.email) return res.send({message:'Si solo quiere agregar un contacto solo llene la primera casilla'})
    data.contact={
        name : data.name,
        email: data.email
    }
    data.contact1={
        name1: data.name1,
        email1: data.email1,
    }
    data.contact2={
        name2: data.name2,
        email2: data.email2
    }
    let contactos = new Contact(data)
    await contactos.save()
    return res.send({message: 'contactos agregados exitosamente', contactos})
   } catch (error) {
    console.error(error)
    return res.status(500).send({message:'Error al intentar añadir contactos'});
   }
}

export const updateContact = async (req, res) => {
    try {
        let userID = req.user.id
        let { id } = req.params
        let data = req.body

        if (data.nameContact == '' ||  data.phoneContact == '') {
            return res.send({ msg: 'Por favor ingrese toda la información que se le solicita' })
        }

        let contact = await Contact.findOne({ 'contacts._id': id, 'patient': userID })
        if (!contact) return res.status(404).send({ msg: 'No tienes permiso para editarlo' })

        let contactSearch = await Contact.findOne({ 'contacts._id': id })
        if (!contactSearch) return res.status(404).send({ msg: 'Contacto no encontrado' })

        let updatedContact = await Contact.findOneAndUpdate(
            { 'contacts._id': id },
            {
                $set: {
                    'contacts.$.nameContact': data.nameContact,
                    'contacts.$.phoneContact': data.phoneContact
                }
            },
            { new: true }
        )
        await contact.save()
        return res.status(200).send({ msg: 'Se ha actualizado correctamente', updatedContact })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: 'Error al actualizar contacto' })
    }
}

export const deleteContact = async (req, res) => {
    try {        
        let userID = req.user.id
        let { id } = req.params
        let delContact = await Contact.findOneAndUpdate(
            { 'contacts._id': id, 'patient': userID },
            {
                $pull: {
                    'contacts': { '_id': id }
                }
            },
            { new: true } // Opción para devolver el documento actualizado después de la eliminación
        )
        if (!delContact) return res.status(404).send({ msg: 'Contacto no encontrado o no tienes acceso para eliminar' })
        return res.status(200).send({ msg: 'Se ha eliminado correctamente el contacto' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ msg: 'Error al eliminar el contacto' })
    }
}

export const listContacts = async (req, res) => {
    try {
        let userID = req.user.id
        let contacts = await Contact.find({ patient: userID }).populate('patient', '-_id name surname')
        if (contacts.length == 0) return res.status(404).send({ msg: 'No se han encontrado usuarios ' })
        return res.status(200).send({ msg: 'Se ha listado correctamente los contactos', contacts })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ msg: 'Error al listar contactos' })
    }
}