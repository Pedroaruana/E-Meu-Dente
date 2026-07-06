import { describe, expect, it } from 'vitest'
import { getDiagnosis } from './diagnosis'

describe('getDiagnosis', () => {
  it('aponta urgencia alta pra dor constante e prolongada', () => {
    const result = getDiagnosis('dor', ['Constante, mesmo sem tocar', 'Sim, muito', 'Mais de uma semana'])
    expect(result.urgency).toBe('alta')
    expect(result.title).toMatch(/infecção|abscesso/i)
  })

  it('aponta possivel fratura quando a dor so ocorre ao morder', () => {
    const result = getDiagnosis('dor', ['Só ao morder', 'Um pouco', 'Alguns dias'])
    expect(result.title).toMatch(/fratura|cárie/i)
  })

  it('sensibilidade que persiste sugere pulpite', () => {
    const result = getDiagnosis('sensibilidade', ['Continua doendo por minutos', 'Não', 'Não'])
    expect(result.title).toMatch(/pulpite/i)
    expect(result.urgency).toBe('moderada')
  })

  it('escurecimento com dor sugere necrose', () => {
    const result = getDiagnosis('aparencia', ['Escura', 'De repente', 'Sim'])
    expect(result.urgency).toBe('alta')
  })

  it('mobilidade apos trauma e sempre urgencia alta', () => {
    const result = getDiagnosis('mobilidade', ['Só desconforto', 'Não', 'Sim'])
    expect(result.urgency).toBe('alta')
  })

  it('mau halito localizado com gosto ruim sugere infeccao', () => {
    const result = getDiagnosis('mau-halito', ['Desse dente específico', 'Sim', 'Não sei'])
    expect(result.urgency).toBe('alta')
  })

  it('escurecimento + dor noturna da forte indicio de canal', () => {
    const result = getDiagnosis('canal', ['Sim', 'Sim', 'Não'])
    expect(result.title).toMatch(/canal/i)
    expect(result.urgency).toBe('alta')
  })

  it('sem nenhum sinal de alerta no canal, urgencia e baixa', () => {
    const result = getDiagnosis('canal', ['Não', 'Não', 'Não'])
    expect(result.urgency).toBe('baixa')
  })

  it('devolve um resultado padrao pra sintoma desconhecido', () => {
    const result = getDiagnosis('sintoma-que-nao-existe', [])
    expect(result.urgency).toBe('moderada')
  })
})
