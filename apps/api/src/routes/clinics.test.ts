import { describe, expect, it, vi } from 'vitest'
import request from 'supertest'

// mocka a geocodificacao pra nao depender da Nominatim (rede externa) nos
// testes — assim o teste fica rapido e nao quebra se o servico estiver fora.
vi.mock('../services/geocoding.js', () => ({
  geocodeAddress: vi.fn(async (address: string) => {
    if (address === 'endereco-invalido') return null
    return { lat: -23.5613, lon: -46.6565 }
  }),
}))

const { createApp } = await import('../app.js')
const app = createApp()

describe('GET /clinics', () => {
  it('devolve clinicas ordenadas por distancia pra um endereco valido', async () => {
    const res = await request(app).get('/clinics').query({ address: 'Av. Paulista, São Paulo', radiusKm: 10 })

    expect(res.status).toBe(200)
    expect(res.body.origin).toEqual({ lat: -23.5613, lon: -46.6565 })
    expect(res.body.clinics.length).toBeGreaterThan(0)

    // confere a ordenacao em vez de so contar itens, ja que e isso que faz
    // a clinica mais perto aparecer primeiro pro usuario de verdade.
    const distances = res.body.clinics.map((c: { distanceKm: number }) => c.distanceKm)
    const sorted = [...distances].sort((a, b) => a - b)
    expect(distances).toEqual(sorted)
  })

  it('respeita o filtro de raio', async () => {
    const res = await request(app).get('/clinics').query({ address: 'Av. Paulista, São Paulo', radiusKm: 1 })
    expect(res.status).toBe(200)
    for (const clinic of res.body.clinics) {
      expect(clinic.distanceKm).toBeLessThanOrEqual(1)
    }
  })

  it('devolve 404 quando o endereco nao e encontrado', async () => {
    const res = await request(app).get('/clinics').query({ address: 'endereco-invalido' })
    expect(res.status).toBe(404)
  })

  it('rejeita endereco muito curto', async () => {
    const res = await request(app).get('/clinics').query({ address: 'ab' })
    expect(res.status).toBe(400)
  })

  it('rejeita raio fora do limite permitido', async () => {
    const res = await request(app).get('/clinics').query({ address: 'Av. Paulista, São Paulo', radiusKm: 999 })
    expect(res.status).toBe(400)
  })
})
