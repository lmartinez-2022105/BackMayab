'use strict'

import { Router } from "express"
import { addContact, updateContact, deleteContact, listContacts } from './contact.controller.js'
import {validateJwt} from '../middlewares/validateJwt.js'

const api = Router()

api.post('/addContact', [validateJwt], addContact)
api.put('/updateContact/:id', [validateJwt], updateContact)
api.delete('/deleteContact/:id', [validateJwt], deleteContact)
api.get('/listContacts', [validateJwt], listContacts)

export default api