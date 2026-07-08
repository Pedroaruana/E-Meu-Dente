import { Router } from 'express'
import { z } from 'zod'
import { geocodeAddress } from '../services/geocoding.js'
import { findNearbyClinics } from '../services/clinics.js'
import { HttpError } from '../middleware/errorHandler.js'

export const clinicsRouter = Router()

const querySchema = z.object({
  address: z.string().min(3).max(200),
  radiusKm: z.coerce.number().min(1).max(50).default(10),
})

clinicsRouter.get('/', async (req, res) => {
  const parsed = querySchema.safeParse(req.query)
  if (!parsed.success) {
    throw new HttpError(400, 'Informe um endereço válido (address) e, opcionalmente, radiusKm entre 1 e 50.')
  }
  const { address, radiusKm } = parsed.data

  let origin
  try {
    origin = await geocodeAddress(address)
  } catch {
    throw new HttpError(503, 'Serviço de geocodificação indisponível no momento.')
  }
  if (!origin) {
    throw new HttpError(404, 'Não conseguimos localizar esse endereço.')
  }

  const clinics = findNearbyClinics(origin, radiusKm)
  res.json({ origin, clinics })
})
