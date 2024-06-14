'use strict'

import Complaint from './complaint.model.js';

export const addComplaint = async (req, res) => {
    try {
        let data = req.body;
        let complaint = new Complaint({
            ...data
        });
        if (data.reason == '' || data.description == '') {
            return res.send({ msg: 'Please enter data' });
        }
        await complaint.save();
        return res.status(200).send({ msg: 'Complaint successfully added' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: 'Error adding a complaint' });
    }
};



export const getComplaints = async (req, res) => {
    try {
        let infoUser = req.user.ROL
        console.log(infoUser)
        if (infoUser === 'ADMIN') {
            let complaints = await Complaint.find().populate({ path: 'user', select: 'name -_id' })
            if (!complaints) return res.status(404).send({ msg: 'Complaints not found' })
            return res.status(200).send({ message: 'Complaints found successfully', complaints })
        } else {
            return res.status(403).send({ msg: 'You dont have access' })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).send({ msg: 'Error listing complaints' })
    }
}

export const deleteComplaint = async (req, res) => {
    try {
        let infoUser = req.user.ROL
        console.log(infoUser)
        if (infoUser === 'ADMIN') {
            let { id } = req.params
            let delComplaint = await Complaint.findOneAndDelete({ _id: id })
            if (!delComplaint) return res.status(404).send({ msg: 'Complaint not found' })
            return res.status(200).send({ msg: 'Complaint deleted successfully' })
        } else {
            return res.status(403).send({ msg: 'You dont have access' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ msg: 'Error deleting complaint' })
    }
}