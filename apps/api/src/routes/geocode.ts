import { Router } from 'express'
import { z } from 'zod'
import { suggestAddresses } from '../services/geocoding.js'
import { HttpError } from '../middleware/errorHandler.js'

export const geocodeRouter = Router()

const querySchema = z.object({
  q: z.string().min(3).max(200),
})

geocodeRouter.get('/suggestions', async (req, res) => {
  const parsed = querySchema.safeParse(req.query)
  if (!parsed.success) {
    throw new HttpError(400, 'Informe pelo menos 3 caracteres em q.')
  }

  let suggestions
  try {
    suggestions = await suggestAddresses(parsed.data.q)
  } catch {
    throw new HttpError(503, 'Serviço de geocodificação indisponível no momento.')
  }

  res.json({ suggestions })
})
