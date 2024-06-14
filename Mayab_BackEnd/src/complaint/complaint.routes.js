import { Router } from "express"
import { addComplaint, getComplaints, deleteComplaint} from "./complaint.controller.js"
import { validateJwt } from "../middlewares/validateJwt.js"

const api = Router()

api.post('/addComplaint', addComplaint)
api.get('/getComplaints', [validateJwt], getComplaints)
api.delete('/deleteComplaint/:id', [validateJwt], deleteComplaint)

export default api