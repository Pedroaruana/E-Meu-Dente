import type { GeoPoint } from './geocoding.js'
import { CLINICS } from '../data/clinics.js'

export interface Clinic {
  name: string
  address: string
  distanceKm: number
  url: string
}

// formula de haversine: distancia em linha reta entre dois pontos na
// superficie da terra a partir de latitude/longitude.
function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function findNearbyClinics(origin: GeoPoint, radiusKm: number): Clinic[] {
  return CLINICS
    .map((clinic) => ({
      name: clinic.name,
      address: clinic.address,
      // as clinicas sao ficticias (sem site de verdade), entao o link leva
      // pro Google Maps na coordenada exata em vez de uma url quebrada.
      url: `https://www.google.com/maps/search/?api=1&query=${clinic.lat},${clinic.lon}`,
      distanceKm: Math.round(haversineKm(origin, { lat: clinic.lat, lon: clinic.lon }) * 10) / 10,
    }))
    .filter((clinic) => clinic.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
}
