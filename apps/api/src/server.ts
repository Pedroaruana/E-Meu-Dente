import { createApp } from './app.js'

const port = process.env.PORT ? Number(process.env.PORT) : 3333

const app = createApp()

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`)
})
