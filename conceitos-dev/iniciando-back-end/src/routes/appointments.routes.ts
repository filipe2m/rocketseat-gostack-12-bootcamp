import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import { parseISO } from 'date-fns'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateAppointmentService'

import ensureAuthtenticated from '../middlewares/ensureAuthenticated'

const appointmentsRouter = Router()

// Aplicar o ensureAuthenticated em todas as rotas:
appointmentsRouter.use(ensureAuthtenticated)

appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appointments = await appointmentsRepository.find()

    return response.json(appointments)
})

appointmentsRouter.post('/', async (request, response) => {
    const { provider_id, date } = request.body

    const parsedDate = parseISO(date)
    
    const createAppointment = new CreateAppointmentService()
    
    const appointment = await createAppointment.execute({
        provider_id,
        date: parsedDate
    })

    return response.json(appointment)
})

export default appointmentsRouter