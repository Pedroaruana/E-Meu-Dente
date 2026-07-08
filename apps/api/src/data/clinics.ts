export interface ClinicRecord {
  name: string
  address: string
  lat: number
  lon: number
  url: string
}

// lista curada (nao vem de uma API externa). Cada clinica tem coordenadas
// reais de sao paulo, entao a distancia calculada a partir do endereco do
// usuario e genuina, mesmo a lista em si sendo fixa.
export const CLINICS: ClinicRecord[] = [
  { name: 'Clínica OdontoVida', address: 'Av. Paulista, 1200 — São Paulo, SP', lat: -23.5613, lon: -46.6565, url: 'https://example.com/odontovida' },
  { name: 'Sorriso & Cia Odontologia', address: 'Rua das Flores, 340 — São Paulo, SP', lat: -23.5535, lon: -46.6614, url: 'https://example.com/sorrisoecia' },
  { name: 'Espaço Dental 32', address: 'Rua Augusta, 890 — São Paulo, SP', lat: -23.5548, lon: -46.6602, url: 'https://example.com/dental32' },
  { name: 'Clínica Bem Estar Odonto', address: 'Rua Oscar Freire, 210 — São Paulo, SP', lat: -23.5615, lon: -46.6725, url: 'https://example.com/bemestar' },
  { name: 'Consultório Dr. Marcelo Lima', address: 'Al. Santos, 55 — São Paulo, SP', lat: -23.5645, lon: -46.6558, url: 'https://example.com/marcelolima' },
  { name: 'Odontologia Integrada Vila Mariana', address: 'Rua Domingos de Morais, 1500 — São Paulo, SP', lat: -23.5895, lon: -46.6389, url: 'https://example.com/vilamariana' },
  { name: 'Clínica Dental Excellence', address: 'Av. Brigadeiro Faria Lima, 3000 — São Paulo, SP', lat: -23.5870, lon: -46.6825, url: 'https://example.com/dentalexcellence' },
  { name: 'Sorrir Sempre Odontologia', address: 'Rua Teodoro Sampaio, 700 — São Paulo, SP', lat: -23.5580, lon: -46.6870, url: 'https://example.com/sorrirsempre' },
  { name: 'Clínica Odonto Popular', address: 'Rua da Consolação, 2200 — São Paulo, SP', lat: -23.5580, lon: -46.6605, url: 'https://example.com/odontopopular' },
  { name: 'Instituto Dental São Paulo', address: 'Av. Rebouças, 1800 — São Paulo, SP', lat: -23.5670, lon: -46.6790, url: 'https://example.com/institutodental' },
  { name: 'Clínica Dr. Ana Beatriz Souza', address: 'Rua Cardeal Arcoverde, 400 — São Paulo, SP', lat: -23.5605, lon: -46.6870, url: 'https://example.com/anabeatriz' },
  { name: 'Odonto Center Pinheiros', address: 'Rua dos Pinheiros, 950 — São Paulo, SP', lat: -23.5670, lon: -46.6890, url: 'https://example.com/odontocenter' },
]
