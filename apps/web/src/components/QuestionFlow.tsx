import { useState } from 'react'
import { SYMPTOM_QUESTIONS } from '../data/symptomQuestions'
import type { ToothInfo } from './MouthScene'
import './QuestionFlow.css'

interface QuestionFlowProps {
  tooth: ToothInfo
  symptomId: string
  symptomLabel: string
  onBack: () => void
  onComplete: (answers: string[]) => void
  loading: boolean
  error: string | null
}

export function QuestionFlow({ tooth, symptomId, symptomLabel, onBack, onComplete, loading, error }: QuestionFlowProps) {
  const questions = SYMPTOM_QUESTIONS[symptomId] ?? []
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  const question = questions[step]

  function handleAnswer(option: string) {
    const next = [...answers, option]
    setAnswers(next)
    // sempre avanca o step, mesmo na ultima pergunta — e isso que faz
    // "question" virar undefined depois e trocar pra tela de status
    // (carregando/erro) em vez de continuar mostrando a ultima pergunta.
    setStep(step + 1)
    if (step + 1 >= questions.length) {
      onComplete(next)
    }
  }

  // depois da ultima pergunta, "question" fica undefined — usamos isso pra
  // mostrar o estado de carregando/erro da chamada a api em vez do formulario.
  if (!question) {
    return (
      <div className="question-flow">
        <p className="question-flow__context">
          {tooth.name} · {symptomLabel}
        </p>
        {loading && <p className="question-flow__status">gerando diagnóstico…</p>}
        {error && (
          <>
            <p className="question-flow__status question-flow__status--error">{error}</p>
            <button type="button" className="question-flow__option" onClick={() => onComplete(answers)}>
              tentar de novo
            </button>
          </>
        )}
        <button type="button" className="question-flow__back" onClick={onBack}>
          ← escolher outro dente
        </button>
      </div>
    )
  }

  return (
    <div className="question-flow">
      <p className="question-flow__progress">
        pergunta {step + 1} de {questions.length}
      </p>
      <div className="question-flow__bar">
        <div
          className="question-flow__bar-fill"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="question-flow__context">
        {tooth.name} · {symptomLabel}
      </p>
      <h2 className="question-flow__question">{question.text}</h2>

      <div className="question-flow__options">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            className="question-flow__option"
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <button type="button" className="question-flow__back" onClick={onBack}>
        ← escolher outro dente
      </button>
    </div>
  )
}
