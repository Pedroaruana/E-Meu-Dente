export interface Clinic {
  name: string
  address: string
  distanceKm: number
  url: string
}

// dados de exemplo — a partir do dia 5 isso vira uma busca real
// (geolocalizacao do endereco do usuario + OpenStreetMap/Overpass).
export const MOCK_CLINICS: Clinic[] = [
  { name: 'Clínica OdontoVida', address: 'Av. Paulista, 1200 — São Paulo, SP', distanceKm: 1.2, url: 'https://example.com/odontovida' },
  { name: 'Sorriso & Cia Odontologia', address: 'Rua das Flores, 340 — São Paulo, SP', distanceKm: 2.8, url: 'https://example.com/sorrisoecia' },
  { name: 'Espaço Dental 32', address: 'Rua Augusta, 890 — São Paulo, SP', distanceKm: 3.5, url: 'https://example.com/dental32' },
  { name: 'Clínica Bem Estar Odonto', address: 'Rua Oscar Freire, 210 — São Paulo, SP', distanceKm: 0.8, url: 'https://example.com/bemestar' },
  { name: 'Consultório Dr. Marcelo Lima', address: 'Al. Santos, 55 — São Paulo, SP', distanceKm: 1.9, url: 'https://example.com/marcelolima' },
  { name: 'Odontologia Integrada Vila Mariana', address: 'Rua Domingos de Morais, 1500 — São Paulo, SP', distanceKm: 4.6, url: 'https://example.com/vilamariana' },
  { name: 'Clínica Dental Excellence', address: 'Av. Brigadeiro Faria Lima, 3000 — São Paulo, SP', distanceKm: 5.3, url: 'https://example.com/dentalexcellence' },
  { name: 'Sorrir Sempre Odontologia', address: 'Rua Teodoro Sampaio, 700 — São Paulo, SP', distanceKm: 6.1, url: 'https://example.com/sorrirsempre' },
  { name: 'Clínica Odonto Popular', address: 'Rua da Consolação, 2200 — São Paulo, SP', distanceKm: 2.2, url: 'https://example.com/odontopopular' },
  { name: 'Instituto Dental São Paulo', address: 'Av. Rebouças, 1800 — São Paulo, SP', distanceKm: 7.4, url: 'https://example.com/institutodental' },
  { name: 'Clínica Dr. Ana Beatriz Souza', address: 'Rua Cardeal Arcoverde, 400 — São Paulo, SP', distanceKm: 3.0, url: 'https://example.com/anabeatriz' },
  { name: 'Odonto Center Pinheiros', address: 'Rua dos Pinheiros, 950 — São Paulo, SP', distanceKm: 8.9, url: 'https://example.com/odontocenter' },
]
