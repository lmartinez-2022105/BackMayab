'use strict'

import { Router } from "express"
import { addAmbulance, listAmbulances, deleteAmbulance, updateAmbulance, listAmbulancesAvailable } from "./ambulance.controller.js"

const api = Router()

api.post('/addAmbulance', addAmbulance)
api.get('/listAmbulances', listAmbulances)
api.get('/listAmbulancesAvailable', listAmbulancesAvailable)
api.delete('/deleteAmbulance/:id', deleteAmbulance)
api.put('/updateAmbulance/:id', updateAmbulance)

export default api