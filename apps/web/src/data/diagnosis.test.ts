import { describe, expect, it } from 'vitest'
import { getDiagnosis } from './diagnosis'

describe('getDiagnosis', () => {
  it('aponta urgencia alta pra dor constante e prolongada', () => {
    const result = getDiagnosis('dor', ['Constante, mesmo sem tocar', 'Sim, muito com frio', 'Mais de duas semanas'])
    expect(result.urgency).toBe('alta')
    expect(result.title).toMatch(/infecção|abscesso/i)
    expect(result.tips.length).toBeGreaterThan(0)
  })

  it('aponta possivel fratura quando a dor so ocorre ao morder', () => {
    const result = getDiagnosis('dor', ['Só ao morder', 'Um pouco com os dois', 'Alguns dias'])
    expect(result.title).toMatch(/fratura|cárie/i)
  })

  it('dor que piora deitado sugere pressao pulpar', () => {
    const result = getDiagnosis('dor', ['Só quando deito', 'Não piora com temperatura', 'Alguns dias'])
    expect(result.urgency).toBe('moderada')
  })

  it('sensibilidade que persiste por horas sugere pulpite', () => {
    const result = getDiagnosis('sensibilidade', ['Fica doendo por horas', 'Não fiz nenhum tratamento', 'Não'])
    expect(result.title).toMatch(/pulpite/i)
    expect(result.urgency).toBe('alta')
  })

  it('sensibilidade pos-tratamento tem urgencia baixa', () => {
    const result = getDiagnosis('sensibilidade', ['Passa em poucos segundos', 'Sim, clareamento', 'Não'])
    expect(result.urgency).toBe('baixa')
  })

  it('escurecimento com dor forte sugere necrose', () => {
    const result = getDiagnosis('aparencia', ['Escura (marrom ou preta)', 'De repente', 'Sim, dor forte'])
    expect(result.urgency).toBe('alta')
  })

  it('mancha esbranquicada sugere inicio de carie', () => {
    const result = getDiagnosis('aparencia', ['Esbranquiçada, tipo giz', 'Aos poucos, há meses', 'Nenhuma dor'])
    expect(result.title).toMatch(/cárie/i)
  })

  it('mobilidade apos trauma recente e sempre urgencia alta', () => {
    const result = getDiagnosis('mobilidade', ['Não balança, mas incomoda', 'Gengiva normal', 'Sim, recente'])
    expect(result.urgency).toBe('alta')
  })

  it('mau halito localizado com gosto ruim constante sugere infeccao', () => {
    const result = getDiagnosis('mau-halito', ['Desse dente específico', 'Sim, constante', 'Não sei'])
    expect(result.urgency).toBe('alta')
  })

  it('escurecimento forte + dor noturna da forte indicio de canal', () => {
    const result = getDiagnosis('canal', ['Sim, escureceu bastante', 'Sim, intensa à noite', 'Não'])
    expect(result.title).toMatch(/canal/i)
    expect(result.urgency).toBe('alta')
  })

  it('sem nenhum sinal de alerta no canal, urgencia e baixa', () => {
    const result = getDiagnosis('canal', ['Não mudou de cor', 'Não', 'Não'])
    expect(result.urgency).toBe('baixa')
  })

  it('devolve um resultado padrao pra sintoma desconhecido', () => {
    const result = getDiagnosis('sintoma-que-nao-existe', [])
    expect(result.urgency).toBe('moderada')
    expect(result.tips.length).toBeGreaterThan(0)
  })
})
