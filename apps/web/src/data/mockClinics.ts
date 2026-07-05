export interface Clinic {
  name: string
  address: string
  distanceKm: number
  url: string
}

// dados de exemplo — a partir do dia 5 isso vira uma busca real
// (geolocalizacao do usuario + OpenStreetMap/Overpass).
export const MOCK_CLINICS: Clinic[] = [
  {
    name: 'Clínica OdontoVida',
    address: 'Av. Paulista, 1200 — São Paulo, SP',
    distanceKm: 1.2,
    url: 'https://example.com/odontovida',
  },
  {
    name: 'Sorriso & Cia Odontologia',
    address: 'Rua das Flores, 340 — São Paulo, SP',
    distanceKm: 2.8,
    url: 'https://example.com/sorrisoecia',
  },
  {
    name: 'Espaço Dental 32',
    address: 'Rua Augusta, 890 — São Paulo, SP',
    distanceKm: 3.5,
    url: 'https://example.com/dental32',
  },
]
