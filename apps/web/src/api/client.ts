// URL do backend configuravel via env, com fallback pro servidor local —
// assim o mesmo build funciona em dev sem precisar de configuracao extra.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

export type Urgency = 'baixa' | 'moderada' | 'alta'

export interface Diagnosis {
  title: string
  description: string
  urgency: Urgency
  tips: string[]
}

export interface Clinic {
  name: string
  address: string
  distanceKm: number
  url: string
}

export interface AddressSuggestion {
  label: string
  lat: number
  lon: number
}

export class ApiError extends Error {}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string }
    return body.error ?? `Erro ${response.status}`
  } catch {
    return `Erro ${response.status}`
  }
}

export async function fetchDiagnosis(symptomId: string, answers: string[]): Promise<Diagnosis> {
  const response = await fetch(`${API_URL}/diagnosis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptomId, answers }),
  })

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response))
  }

  return response.json() as Promise<Diagnosis>
}

export async function fetchClinics(address: string, radiusKm: number): Promise<Clinic[]> {
  const url = new URL(`${API_URL}/clinics`)
  url.searchParams.set('address', address)
  url.searchParams.set('radiusKm', String(radiusKm))

  const response = await fetch(url)

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response))
  }

  const data = (await response.json()) as { clinics: Clinic[] }
  return data.clinics
}

export async function fetchAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
  const url = new URL(`${API_URL}/geocode/suggestions`)
  url.searchParams.set('q', query)

  const response = await fetch(url)
  if (!response.ok) return []

  const data = (await response.json()) as { suggestions: AddressSuggestion[] }
  return data.suggestions
}
