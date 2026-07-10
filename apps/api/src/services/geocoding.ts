const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
// Nominatim exige um User-Agent identificavel (nao aceita o default do fetch)
// e no maximo 1 requisicao por segundo — ok pra esse volume de uso.
const USER_AGENT = 'EMeuDente/0.1 (projeto de portfolio; github.com/Pedroaruana)'

export interface GeoPoint {
  lat: number
  lon: number
}

export interface AddressSuggestion extends GeoPoint {
  label: string
}

export async function geocodeAddress(address: string): Promise<GeoPoint | null> {
  const url = new URL(NOMINATIM_URL)
  url.searchParams.set('q', address)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  })

  if (!response.ok) {
    throw new Error(`Nominatim respondeu ${response.status}`)
  }

  const results = (await response.json()) as Array<{ lat: string; lon: string }>
  if (results.length === 0) return null

  return { lat: Number(results[0].lat), lon: Number(results[0].lon) }
}

// usado pro autocomplete: devolve varias opcoes (nao só a primeira) pra
// o usuario escolher o endereco certo em vez de digitar tudo as cegas.
export async function suggestAddresses(query: string): Promise<AddressSuggestion[]> {
  const url = new URL(NOMINATIM_URL)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '5')

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  })

  if (!response.ok) {
    throw new Error(`Nominatim respondeu ${response.status}`)
  }

  const results = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>
  return results.map((r) => ({ label: r.display_name, lat: Number(r.lat), lon: Number(r.lon) }))
}
