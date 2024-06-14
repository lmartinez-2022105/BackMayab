'use strict'

import jwt from 'jsonwebtoken'

const secretKey = "@Mayab-24KinPanMomo@"

export const generateJwt = async(payload) =>{
    try {
        return jwt.sign(payload, secretKey,{
            expiresIn: '8h',
            algorithm: 'HS256'
        })
    } catch (error) {
        console.error(error)
    }
}