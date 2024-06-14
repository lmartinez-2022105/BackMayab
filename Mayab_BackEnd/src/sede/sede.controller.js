import Sede from './sede.model.js'

export const test = (req, res) => {
    try {
        return res.send({ message: 'El servidor si esta corriendo' })
    } catch (error) {
        console.error(error)
        return error
    }
}
/*
export const newSede = async (req, res) => {
    try {
        let data = req.body
        let sede = new Sede(data)
        console.log(data)
        await sede.save()
        return res.send({message: `Sede ${sede.nombre} registrada satisfactoriamente`})
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al registar la sede', err })
    }
}
*/

export const newSede = async (req, res) => {
    try {
        let data = req.body;
        
        // Verificar si los datos son un array
        if (Array.isArray(data)) {
            // Si es un array, iterar sobre cada elemento y guardar las sedes por separado
            for (let item of data) {
                let sede = new Sede(item);
                await sede.save();
                console.log(`Sede ${sede.nombre} registrada satisfactoriamente`);
            }
        } else {
            // Si no es un array, guardar la sede directamente
            let sede = new Sede(data);
            await sede.save();
            console.log(`Sede ${sede.nombre} registrada satisfactoriamente`);
        }

        return res.send({ message: 'Sede(s) registrada(s) satisfactoriamente' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al registrar la(s) sede(s)', error: err });
    }
}


export const update = async(req, res)=>{
    try {
        let {id} = req.params
        let data = req.body
        let updateSede = await Sede.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
       )
       if(!updateSede)return res.status(401).send({message: 'Sede no encontrada y no modificada'})
        return res.send({message: 'Sede actualizada', updateSede})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const deleteSede = async(req,res)=>{
    try {
        let {id} = req.params
        let deletedSede = await Sede.findOneAndDelete({_id: id})
        if(!deletedSede) return res.status(404).send({message: 'Sede no encontrada y no eliminada'})
        return res.send({message: `Sede con nombre ${deletedSede.nombre} borrada satisfactoriamente`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error al borrar la sede'})
    }
}

export const get = async(req,res)=>{
    try {
        let sedes = await Sede.find()
        return res.send({sedes})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error obteniendo Sedes'})
    }


}