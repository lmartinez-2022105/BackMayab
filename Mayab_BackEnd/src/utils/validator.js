import {compare, hash} from 'bcrypt'

export const encrypt = async(password) =>{
    try {
        return hash(password, 10)
    } catch (error) {
        console.error(error)
    }
}

export const checkPassword = async(password, hash) =>{
    try {
        return await compare(password, hash)
    } catch (error) {
        console.error(error)
        return error
    }
}