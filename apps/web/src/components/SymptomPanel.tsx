import type { ReactNode } from 'react'
import type { ToothInfo } from './MouthScene'
import './SymptomPanel.css'

export interface Symptom {
  id: string
  label: string
  icon: ReactNode
}

const SYMPTOMS: Symptom[] = [
  {
    id: 'dor',
    label: 'Dor ao mastigar',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2 9.5 8H4l4.5 4L7 18l5-3.5L17 18l-1.5-6L20 8h-5.5Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'sensibilidade',
    label: 'Sensibilidade (quente/frio)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3v12.5" strokeLinecap="round" />
        <path d="M9 13.5V6a3 3 0 0 1 6 0v7.5a4 4 0 1 1-6 0Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'aparencia',
    label: 'Aparência (cor ou mancha)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9 10.5c0-1 .8-1.8 1.8-1.8M14.2 15c-1 0-1.8-.8-1.8-1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'mobilidade',
    label: 'Está mole',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M8 4c-2.5 1-4 3.3-4 6.5 0 4 2.5 7 5 9 1 .8 2 .5 2-1v-3M16 4c2.5 1 4 3.3 4 6.5 0 4-2.5 7-5 9-1 .8-2 .5-2-1v-3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'mau-halito',
    label: 'Mau hálito na região',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M8 21c2-3 2-5 1-8M12 21c1.5-4 1.5-7 0-11M16 21c1-3 .5-5-1-8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'canal',
    label: 'Suspeita de canal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3v6M9 9h6l-1 12h-4L9 9Z" strokeLinejoin="round" />
      </svg>
    ),
  },
]

interface SymptomPanelProps {
  tooth: ToothInfo
  onBack: () => void
  onSelectSymptom: (symptom: Symptom) => void
}

export function SymptomPanel({ tooth, onBack, onSelectSymptom }: SymptomPanelProps) {
  return (
    <div className="symptom-panel">
      <h2 className="symptom-panel__title">{tooth.name}</h2>
      <p className="symptom-panel__fdi">notação FDI: dente {tooth.fdi}</p>
      <p className="symptom-panel__question">o que você está sentindo nesse dente?</p>

      <div className="symptom-panel__grid">
        {SYMPTOMS.map((symptom) => (
          <button
            key={symptom.id}
            type="button"
            className="symptom-panel__option"
            onClick={() => onSelectSymptom(symptom)}
          >
            <span className="symptom-panel__option-icon">{symptom.icon}</span>
            {symptom.label}
          </button>
        ))}
      </div>

      <button type="button" className="symptom-panel__back" onClick={onBack}>
        ← escolher outro dente
      </button>
    </div>
  )
}
