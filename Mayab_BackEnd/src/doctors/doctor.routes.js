import { Router } from "express";
import { register, deleteDoctor, deleteMyProfile, updateMyProfile, getDoctor, updateDiseaseDoctorToUser, getDoctorToSpecialty } from "./doctor.controller.js";
import { validateJwt, validateJwtDr, isDoctor, isAdmin } from "../middlewares/validateJwt.js";

const api = Router()

api.post('/register', register)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteDoctor )
api.delete('/deleteProfile', validateJwt, deleteMyProfile)
api.get('/updateProfile', validateJwt, updateMyProfile)
api.get('/list', getDoctor)
api.get('/listDoctors/:id', getDoctorToSpecialty)
api.put('/updateDisease', [validateJwtDr, isDoctor], updateDiseaseDoctorToUser)


export default api