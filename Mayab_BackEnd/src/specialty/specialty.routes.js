import {Router} from 'express'
import { newSpecialty, updateSpecialty, deleteSpecialty, listSpecialties, searchSpecialties } from './specialty.controller.js'
import {validateJwt, isAdmin} from '../middlewares/validateJwt.js'

const api = Router()

api.post('/new', [validateJwt, isAdmin], newSpecialty)
api.put('/update/:id', [validateJwt, isAdmin], updateSpecialty)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteSpecialty)
api.get('/list', listSpecialties)
api.post('/search', [validateJwt, isAdmin], searchSpecialties)

export default api