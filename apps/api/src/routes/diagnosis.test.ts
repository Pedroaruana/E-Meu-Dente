import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.js'

const app = createApp()

describe('POST /diagnosis', () => {
  it('devolve um diagnostico valido pra um payload correto', async () => {
    // esse combo de respostas ja e testado direto na regra em diagnosis.ts;
    // aqui o foco e confirmar que a rota entrega esse resultado por HTTP.
    const res = await request(app)
      .post('/diagnosis')
      .send({
        symptomId: 'canal',
        answers: ['Sim, escureceu bastante', 'Sim, intensa à noite', 'Não'],
      })

    expect(res.status).toBe(200)
    expect(res.body.title).toMatch(/canal/i)
    expect(res.body.urgency).toBe('alta')
    expect(Array.isArray(res.body.tips)).toBe(true)
  })

  // os dois testes abaixo sao separados de proposito (em vez de um so com
  // payload vazio) pra garantir que o zod acusa cada campo obrigatorio
  // independente do outro, nao só quando os dois faltam ao mesmo tempo.
  it('rejeita payload sem answers', async () => {
    const res = await request(app).post('/diagnosis').send({ symptomId: 'canal' })
    expect(res.status).toBe(400)
  })

  it('rejeita payload sem symptomId', async () => {
    const res = await request(app).post('/diagnosis').send({ answers: ['Sim'] })
    expect(res.status).toBe(400)
  })

  it('usa o diagnostico padrao pra um sintoma desconhecido', async () => {
    // confirma que o fallback (getDiagnosis retorna algo generico quando o
    // symptomId nao existe) tambem funciona passando pela rota, nao so na
    // funcao pura isolada.
    const res = await request(app)
      .post('/diagnosis')
      .send({ symptomId: 'sintoma-inventado', answers: ['qualquer coisa'] })

    expect(res.status).toBe(200)
    expect(res.body.urgency).toBe('moderada')
  })
})
