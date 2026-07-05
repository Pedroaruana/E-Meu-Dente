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
}

export function QuestionFlow({ tooth, symptomId, symptomLabel, onBack, onComplete }: QuestionFlowProps) {
  const questions = SYMPTOM_QUESTIONS[symptomId] ?? []
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  const question = questions[step]

  function handleAnswer(option: string) {
    const next = [...answers, option]
    setAnswers(next)
    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      onComplete(next)
    }
  }

  if (!question) return null

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
