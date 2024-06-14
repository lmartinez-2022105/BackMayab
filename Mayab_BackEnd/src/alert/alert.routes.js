import { Router } from "express"
import { addAlert } from "./alert.controller.js"
import {validateJwt} from '../middlewares/validateJwt.js'

const api = Router()

api.post('/addAlert', [validateJwt], addAlert)
api.delete('/deleteAlert/:id')


export default api