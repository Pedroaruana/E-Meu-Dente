import express from 'express'
import { healthRouter } from './routes/health.js'
import { diagnosisRouter } from './routes/diagnosis.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(express.json())
  app.use('/health', healthRouter)
  app.use('/diagnosis', diagnosisRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
