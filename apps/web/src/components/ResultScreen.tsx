import type { Diagnosis } from '../data/diagnosis'
import { MOCK_CLINICS } from '../data/mockClinics'
import type { ToothInfo } from './MouthScene'
import './ResultScreen.css'

interface ResultScreenProps {
  tooth: ToothInfo
  diagnosis: Diagnosis
  onRestart: () => void
}

const URGENCY_LABEL: Record<Diagnosis['urgency'], string> = {
  baixa: 'Urgência baixa',
  moderada: 'Urgência moderada',
  alta: 'Urgência alta',
}

export function ResultScreen({ tooth, diagnosis, onRestart }: ResultScreenProps) {
  return (
    <div className="result-screen">
      <div className="result-screen__content">
        <p className="result-screen__eyebrow">resultado da triagem · {tooth.name}</p>

        <div className="result-screen__diagnosis">
          <span className={`result-screen__urgency result-screen__urgency--${diagnosis.urgency}`}>
            {URGENCY_LABEL[diagnosis.urgency]}
          </span>
          <h1 className="result-screen__title">{diagnosis.title}</h1>
          <p className="result-screen__description">{diagnosis.description}</p>
        </div>

        <p className="result-screen__disclaimer">
          Isso é uma triagem e não substitui uma avaliação odontológica presencial.
        </p>

        <h2 className="result-screen__clinics-title">Clínicas perto de você</h2>
        <div className="result-screen__clinics">
          {MOCK_CLINICS.map((clinic) => (
            <a
              key={clinic.name}
              className="result-screen__clinic"
              href={clinic.url}
              target="_blank"
              rel="noreferrer"
            >
              <div>
                <p className="result-screen__clinic-name">{clinic.name}</p>
                <p className="result-screen__clinic-address">{clinic.address}</p>
              </div>
              <span className="result-screen__clinic-distance">{clinic.distanceKm} km</span>
            </a>
          ))}
        </div>

        <button type="button" className="result-screen__restart" onClick={onRestart}>
          ← testar outro dente
        </button>
      </div>
    </div>
  )
}
