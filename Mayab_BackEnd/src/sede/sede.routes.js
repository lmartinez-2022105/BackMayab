import { Router } from "express"
import { newSede, update, deleteSede, get} from "./sede.controller.js"
 
const api = Router()
 
api.post('/add', newSede)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteSede)
api.get('/get', get)


 
export default api