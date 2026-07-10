import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import { healthRouter } from './routes/health.js'
import { diagnosisRouter } from './routes/diagnosis.js'
import { clinicsRouter } from './routes/clinics.js'
import { geocodeRouter } from './routes/geocode.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({ origin: allowedOrigins }))
  app.use(limiter)
  app.use(express.json())

  app.use('/health', healthRouter)
  app.use('/diagnosis', diagnosisRouter)
  app.use('/clinics', clinicsRouter)
  app.use('/geocode', geocodeRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
