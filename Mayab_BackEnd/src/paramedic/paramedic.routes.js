import { Router } from "express";
import { addParamedic, deleteParamedic, listParamedics, updateParamedic, listParamedicsAvailable } from "./paramedic.controller.js";

const api = Router()

api.post('/addParamedic', addParamedic)
api.delete('/deleteParamedic/:id', deleteParamedic)
api.put('/updateParamedic/:id', updateParamedic)
api.get('/listParamedics', listParamedics)
api.get('/listParamedicsAvailable', listParamedicsAvailable)

export default api