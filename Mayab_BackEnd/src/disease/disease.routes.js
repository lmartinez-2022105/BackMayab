import {Router} from 'express'
import { newDisease, editDisease, deleteDisease, listDiseases, searchDisease } from './disease.controller.js'
import {validateJwt, isAdmin} from '../middlewares/validateJwt.js'

const api = Router()

api.post('/new', [validateJwt, isAdmin], newDisease)
api.put('/edit/:id', [validateJwt, isAdmin], editDisease)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteDisease)
api.get('/list', listDiseases)
api.post('/search', [validateJwt, isAdmin], searchDisease)

export default api