import { useMemo, useState } from 'react'
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

const DISTANCE_OPTIONS = [2, 5, 10, 20]

export function ResultScreen({ tooth, diagnosis, onRestart }: ResultScreenProps) {
  const [address, setAddress] = useState('')
  const [maxDistance, setMaxDistance] = useState(10)

  const clinics = useMemo(
    () => MOCK_CLINICS.filter((clinic) => clinic.distanceKm <= maxDistance).sort((a, b) => a.distanceKm - b.distanceKm),
    [maxDistance],
  )

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

        <h2 className="result-screen__section-title">Dicas e boas práticas</h2>
        <ul className="result-screen__tips">
          {diagnosis.tips.map((tip) => (
            <li key={tip} className="result-screen__tip">
              {tip}
            </li>
          ))}
        </ul>

        <h2 className="result-screen__section-title">Clínicas perto de você</h2>

        <div className="result-screen__filters">
          <input
            type="text"
            className="result-screen__address-input"
            placeholder="Seu endereço (ex: Av. Paulista, São Paulo)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="result-screen__distance">
            <label htmlFor="distance-filter">Distância máxima</label>
            <select
              id="distance-filter"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
            >
              {DISTANCE_OPTIONS.map((km) => (
                <option key={km} value={km}>
                  até {km} km
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="result-screen__clinics-count">{clinics.length} clínicas encontradas</p>

        <div className="result-screen__clinics">
          {clinics.map((clinic) => (
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
          {clinics.length === 0 && (
            <p className="result-screen__clinics-empty">Nenhuma clínica dentro dessa distância. Tente aumentar o filtro.</p>
          )}
        </div>

        <button type="button" className="result-screen__restart" onClick={onRestart}>
          ← testar outro dente
        </button>
      </div>
    </div>
  )
}
