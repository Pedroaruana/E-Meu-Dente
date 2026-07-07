import { Router } from 'express'
import { z } from 'zod'
import { getDiagnosis } from '../data/diagnosis.js'
import { HttpError } from '../middleware/errorHandler.js'

export const diagnosisRouter = Router()

const diagnosisRequestSchema = z.object({
  symptomId: z.string().min(1).max(50),
  answers: z.array(z.string().min(1).max(200)).min(1).max(10),
})

diagnosisRouter.post('/', (req, res) => {
  const parsed = diagnosisRequestSchema.safeParse(req.body)
  if (!parsed.success) {
    throw new HttpError(400, 'Dados inválidos: informe symptomId e uma lista de answers.')
  }

  const { symptomId, answers } = parsed.data
  const diagnosis = getDiagnosis(symptomId, answers)
  res.json(diagnosis)
})
