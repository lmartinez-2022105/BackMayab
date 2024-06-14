import {Router} from 'express'
import { updateDate, deleteDate, myDate, viewMedicalHistory } from './date.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validateJwt.js'

const api = Router()

api.put('/updateDate/:id', [validateJwt, isAdmin], updateDate)
api.get('/myDate', [validateJwt], myDate)
api.delete('/deleteDate/:id', [validateJwt, isAdmin], deleteDate)
api.get('/myMedicalHistory', validateJwt, viewMedicalHistory)

export default api