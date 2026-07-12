import { useEffect, useRef, useState } from 'react'
import { fetchAddressSuggestions, fetchClinics, type AddressSuggestion, type Clinic, type Diagnosis } from '../api/client'
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
  const [clinics, setClinics] = useState<Clinic[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  // evita disparar uma busca de sugestoes logo depois que o usuario ja
  // escolheu uma (o texto muda, mas nao e o usuario digitando de novo).
  const justPickedRef = useRef(false)

  useEffect(() => {
    if (justPickedRef.current) {
      justPickedRef.current = false
      return
    }
    if (address.trim().length < 3) {
      setSuggestions([])
      return
    }
    // debounce: so busca 350ms depois da ultima tecla, pra nao mandar uma
    // requisicao pra nominatim a cada letra digitada.
    const timeout = setTimeout(async () => {
      const results = await fetchAddressSuggestions(address)
      setSuggestions(results)
      setShowSuggestions(true)
    }, 350)

    return () => clearTimeout(timeout)
  }, [address])

  function pickSuggestion(suggestion: AddressSuggestion) {
    justPickedRef.current = true
    setAddress(suggestion.label)
    setShowSuggestions(false)
    setSuggestions([])
  }

  async function handleSearch(searchAddress = address) {
    if (searchAddress.trim().length < 3) {
      setError('Digite um endereço válido pra buscar.')
      return
    }
    setShowSuggestions(false)
    setLoading(true)
    setError(null)
    try {
      const result = await fetchClinics(searchAddress, maxDistance)
      setClinics(result)
    } catch {
      setError('Não conseguimos localizar esse endereço. Tente ser mais específico.')
      setClinics(null)
    } finally {
      setLoading(false)
    }
  }

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
        <p className="result-screen__hint">
          A lista de clínicas de exemplo cobre São Paulo, Rio de Janeiro, Salvador, Brasília, Belo Horizonte, Curitiba, Porto Alegre e Recife — endereços fora dessas capitais não vão encontrar nada por perto.
        </p>

        <div className="result-screen__filters">
          <div className="result-screen__address-wrap">
            <input
              type="text"
              className="result-screen__address-input"
              placeholder="Seu endereço (ex: Av. Paulista, São Paulo)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="result-screen__suggestions">
                {suggestions.map((suggestion) => (
                  <li key={suggestion.label}>
                    <button type="button" onMouseDown={() => pickSuggestion(suggestion)}>
                      {suggestion.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
          <button type="button" className="result-screen__search" onClick={() => handleSearch()} disabled={loading}>
            {loading ? 'buscando…' : 'buscar clínicas'}
          </button>
        </div>

        {error && <p className="result-screen__error">{error}</p>}

        {clinics && (
          <>
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
          </>
        )}

        <button type="button" className="result-screen__restart" onClick={onRestart}>
          ← testar outro dente
        </button>
      </div>
    </div>
  )
}
