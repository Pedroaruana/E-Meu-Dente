import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QuestionFlow } from './QuestionFlow'

const tooth = { fdi: 11, name: 'incisivo central superior direito' }

describe('QuestionFlow', () => {
  it('mostra a primeira pergunta do sintoma escolhido', () => {
    render(
      <QuestionFlow
        tooth={tooth}
        symptomId="dor"
        symptomLabel="Dor ao mastigar"
        onBack={() => {}}
        onComplete={() => {}}
      />,
    )

    expect(screen.getByText('pergunta 1 de 3')).toBeInTheDocument()
    expect(screen.getByText(/dor é constante ou só quando/i)).toBeInTheDocument()
  })

  it('avanca pra proxima pergunta ao responder', async () => {
    const user = userEvent.setup()
    render(
      <QuestionFlow
        tooth={tooth}
        symptomId="dor"
        symptomLabel="Dor ao mastigar"
        onBack={() => {}}
        onComplete={() => {}}
      />,
    )

    await user.click(screen.getByText('Só ao morder'))

    expect(screen.getByText('pergunta 2 de 3')).toBeInTheDocument()
  })

  it('chama onComplete com todas as respostas apos a ultima pergunta', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(
      <QuestionFlow
        tooth={tooth}
        symptomId="dor"
        symptomLabel="Dor ao mastigar"
        onBack={() => {}}
        onComplete={onComplete}
      />,
    )

    await user.click(screen.getByText('Só ao morder'))
    await user.click(screen.getByText('Um pouco com os dois'))
    await user.click(screen.getByText('Alguns dias'))

    expect(onComplete).toHaveBeenCalledWith(['Só ao morder', 'Um pouco com os dois', 'Alguns dias'])
  })

  it('chama onBack ao clicar em escolher outro dente', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(
      <QuestionFlow
        tooth={tooth}
        symptomId="dor"
        symptomLabel="Dor ao mastigar"
        onBack={onBack}
        onComplete={() => {}}
      />,
    )

    await user.click(screen.getByText('← escolher outro dente'))

    expect(onBack).toHaveBeenCalledOnce()
  })
})
