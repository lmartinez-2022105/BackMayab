'use strict'

import jwt from 'jsonwebtoken'
import User from '../users/user.model.js'
import Doctor from '../doctors/doctor.model.js'

export const validateJwt = async(req, res, next) =>{
    try {
        let secretKey = process.env.SECRET_KEY
        let {token} = req.headers
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        let {uid} = jwt.verify(token, secretKey)
        let user = await User.findOne({_id: uid})
        if(!user) return res.status(404).send({message: 'User not found - Unauthorized'})
        req.user = user
        next()
    } catch (error) {
        console.error(error)
        return res.status(401).send({message: 'Unauthorized'})
    }
}
export const validateJwtDr = async(req, res, next) =>{
    try {
        let secretKey = process.env.SECRET_KEY
        let {token} = req.headers
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        let {uid} = jwt.verify(token, secretKey)
        let doctor = await Doctor.findOne({_id: uid})
        if(!doctor) return res.status(404).send({message: 'User not found - Unauthorized'})
        req.user = doctor
        next()
    } catch (error) {
        console.error(error)
        return res.status(401).send({message: 'Unauthorized'})
    }
}
export const isAdmin = async(req, res, next)=>{
    try {
        let {ROL, name} = req.user
        if(!ROL || ROL !== 'ADMIN')  return res.status(403).send({message: `You dont have access | name ${name}`})
        next()
    } catch (error) {
        console.error(error)
        return res.status(401).send({message: 'Unauthorized role'})
    }
}

export const isDoctor = async(req, res, next)=>{
    try {
        let {ROL, name} = req.user
        if(!ROL || ROL !== 'MEDICO')  return res.status(403).send({message: `You dont have access | name ${name}`})
        next()
    } catch (error) {
        console.error(err)
        return res.status(401).send({message: 'Unauthorized role'})
    }
}

export const isParamedic = async(req, res, next)=>{
    try {
        let {role, name} = req.user
        if(!role || role !== 'PARAMEDICO')  return res.status(403).send({message: `You dont have access | name ${name}`})
        next()
    } catch (error) {
        console.error(err)
        return res.status(401).send({message: 'Unauthorized role'})
    }
}