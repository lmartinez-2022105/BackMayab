import axios from "axios"
import nodemailer from 'nodemailer'
import Contacts from '../contact/contact.model.js'
import Alert from './alert.model.js'
import TeamMedical from '../teamMedical/teamMedical.model.js'

async function sendEmail(user, surname, latitud, longitud, recipientEmail) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'emergenciasmayab@gmail.com',
                pass: 'qbnjxfmmaggynepi' //qbnjxfmmaggynepi -> MAYAB
            }
        })

        const mailOptions = {   
            from: 'emergenciasmayab@gmail.com',
            to: recipientEmail,
            subject: 'Emergencia Médica: Información Importante',
            html: `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        background-color: #f2f2f2;
                    }
                    .container {
                        background-color: #fff;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #ff6347;
                        margin-bottom: 20px;
                    }
                    p {
                        font-size: 16px;
                    }
                    .location-link {
                        display: block;
                        margin-top: 20px;
                        text-decoration: none;
                        color: #007bff;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Emergencia Médica</h1>
                    <p>Estimados familiares de ${user} ${surname},</p>
                    <p>Nos dirigimos a ustedes para informarles que ${user} ${surname} ha experimentado una emergencia médica y está recibiendo atención especializada en este momento. Entendemos lo preocupante que puede ser esta situación para ustedes y queremos brindarles la mayor tranquilidad posible.</p>
                    <p>Por favor, hagan clic en el siguiente enlace para ver la ubicación actual del paciente y seguir su progreso:</p>
                    <a class="location-link" href="https://www.google.com/maps/search/?api=1&query=${latitud}%20${longitud}">Ver Ubicación</a>
                    <p>Por favor, manténganse en contacto con nosotros para cualquier actualización adicional.</p>
                    <p>Atentamente,</p>
                    <p>Equipo de Emergencias Médicas MAYAB</p>
                </div>
            </body>
            </html>
            `
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Correo electrónico enviado:', info.response)
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error)
    }
}

export const addAlert = async (req, res) => {
    try {
        let user = req.user.name
        let surname = req.user.surname
        let { id } = req.user
        let {latitud, longitud} = req.body

        let searchContact = await Contacts.find({ patient: id })
        if (searchContact.length === 0) return res.status(404).send({ msg: 'No hay contactos registrados'})

        let equipoMedico = await TeamMedical.findOne({status: true}) //Falta verificar la sede
        if(!equipoMedico) return res.status(404).send({msg: 'No hay ambulancias disponibles'})
        
        let alert = new Alert({
            user: id,
            contacts: searchContact.map(contact => contact._id),
            teamMedical: equipoMedico,
            ubicacion:{
                latitud: latitud,
                longitud: longitud
            },
            date: Date.now()
        })

        console.log(alert)

        for (const contact of searchContact) {
            if (contact.contact && contact.contact.email) {
                await sendEmail(user, surname, latitud, longitud, contact.contact.email)
            }
            if (contact.contact1 && contact.contact1.email1) {
                await sendEmail(user, surname, latitud, longitud, contact.contact1.email1)
            }
            if (contact.contact2 && contact.contact2.email2) {
                await sendEmail(user, surname, latitud, longitud, contact.contact2.email2)
            }
        }
        return res.status(200).send({ msg: 'Correos electrónicos enviados a todos los contactos' })
    } catch (error) {
        console.error('Error al registrar una alerta:', error)
        return res.status(500).send({ msg: 'Error al registrar una alerta' })
    }
}
