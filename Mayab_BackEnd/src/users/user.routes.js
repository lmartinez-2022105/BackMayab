import { Router } from "express";
import {login, register, test} from "./user.controller.js"
import {isAdmin} from '../middlewares/validateJwt.js'

const api = Router()

//Rutas publicas.
api.post('/register', register)
//Rutas Admin
api.get('/test',[isAdmin],test)
//Rutas Afiliado Doctor Paramedico
api.post('/login', login)

export default api