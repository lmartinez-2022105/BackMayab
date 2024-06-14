'use strict'

import { Router } from "express"
import { addMedicalTeam, listTeamMedical } from "./teamMedical.controller.js"

const api = Router()

api.post('/addTeamMedical', addMedicalTeam)
api.get('/listTeamMedical', listTeamMedical)

export default api