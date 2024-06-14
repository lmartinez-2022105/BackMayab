import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import {config} from 'dotenv'
import csrf from 'csurf'


import alertRoutes from '../src/alert/alert.routes.js'
import paramedicRoutes from '../src/paramedic/paramedic.routes.js'
import ambulanceRoutes from '../src/ambulance/ambulance.routes.js'
import medicalTeamRoutes from '../src/teamMedical/teamMedical.routes.js'

import userRoutes from '../src/users/user.routes.js'
import contactRoutes from '../src/contact/contact.routes.js'
import diseaseRoutes from '../src/disease/disease.routes.js'
import doctorRoutes from '../src/doctors/doctor.routes.js'
import SedeRoutes from '../src/sede/sede.routes.js'
import dateRoutes from '../src/date/date.routes.js'
import specialtyRoutes from '../src/specialty/specialty.routes.js'
import complaintRoutes from '../src/complaint/complaint.routes.js'

const server = express()
config()
const port = process.env.PORT || 3200

// Configurar express-rate-limit
/* crea un middleware de límite de velocidad que permite a los usuario hacer max 100 solicitudes desde la misma dirección IP 
en un lapso de 15 min. Si intenta hacer más de 100 solicitudes dentro de ese período de tiempo, 
el middleware rechazará esas solicitudes adicionales hasta que pase el período de 15 minutos.
*/
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de solicitudes por IP
})

//server.use(csrf({ cookie: true }));
server.use(express.urlencoded({extended: false}))
server.use(express.json())
server.use(cors())
server.use(morgan('dev'))
server.use(helmet())
server.use(limiter)


//Rutas
server.use('/user',userRoutes)
server.use('/contact', contactRoutes)
server.use('/disease', diseaseRoutes)
server.use('/doctor', doctorRoutes)
server.use('/sede', SedeRoutes)
server.use('/date', dateRoutes)
server.use('/specialty', specialtyRoutes)
server.use('/complaint', complaintRoutes)

server.use('/paramedic', paramedicRoutes)
server.use('/ambulance', ambulanceRoutes)
server.use('/teamMedical', medicalTeamRoutes)
server.use('/alert', alertRoutes)

export const initServer = async () => {
    server.listen(port, () => {
        console.log(`Server HTTP running in port ${port}`)
    })
}