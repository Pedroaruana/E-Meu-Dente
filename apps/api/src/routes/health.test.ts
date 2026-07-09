import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.js'

const app = createApp()

describe('GET /health', () => {
  it('responde 200 com status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    // uptime confirma que e o processo real respondendo, nao um mock
    expect(typeof res.body.uptime).toBe('number')
  })
})
