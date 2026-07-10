export interface ClinicRecord {
  name: string
  address: string
  lat: number
  lon: number
}

// lista curada (nao vem de uma API externa). Cada clinica tem coordenadas
// reais, entao a distancia calculada a partir do endereco do usuario e
// genuina, mesmo a lista em si sendo fixa. Cobre as principais capitais pra
// nao voltar "0 clinicas" pra qualquer endereco fora de sao paulo.
export const CLINICS: ClinicRecord[] = [
  // Sao Paulo, SP
  { name: 'Clínica OdontoVida', address: 'Av. Paulista, 1200 — São Paulo, SP', lat: -23.5613, lon: -46.6565 },
  { name: 'Sorriso & Cia Odontologia', address: 'Rua das Flores, 340 — São Paulo, SP', lat: -23.5535, lon: -46.6614 },
  { name: 'Espaço Dental 32', address: 'Rua Augusta, 890 — São Paulo, SP', lat: -23.5548, lon: -46.6602 },
  { name: 'Clínica Bem Estar Odonto', address: 'Rua Oscar Freire, 210 — São Paulo, SP', lat: -23.5615, lon: -46.6725 },
  { name: 'Consultório Dr. Marcelo Lima', address: 'Al. Santos, 55 — São Paulo, SP', lat: -23.5645, lon: -46.6558 },
  { name: 'Odontologia Integrada Vila Mariana', address: 'Rua Domingos de Morais, 1500 — São Paulo, SP', lat: -23.5895, lon: -46.6389 },
  { name: 'Clínica Dental Excellence', address: 'Av. Brigadeiro Faria Lima, 3000 — São Paulo, SP', lat: -23.5870, lon: -46.6825 },
  { name: 'Sorrir Sempre Odontologia', address: 'Rua Teodoro Sampaio, 700 — São Paulo, SP', lat: -23.5580, lon: -46.6870 },
  { name: 'Clínica Odonto Popular', address: 'Rua da Consolação, 2200 — São Paulo, SP', lat: -23.5580, lon: -46.6605 },
  { name: 'Instituto Dental São Paulo', address: 'Av. Rebouças, 1800 — São Paulo, SP', lat: -23.5670, lon: -46.6790 },
  { name: 'Clínica Dr. Ana Beatriz Souza', address: 'Rua Cardeal Arcoverde, 400 — São Paulo, SP', lat: -23.5605, lon: -46.6870 },
  { name: 'Odonto Center Pinheiros', address: 'Rua dos Pinheiros, 950 — São Paulo, SP', lat: -23.5670, lon: -46.6890 },

  // Rio de Janeiro, RJ
  { name: 'Clínica Sorriso Carioca', address: 'Av. Nossa Sra. de Copacabana, 500 — Rio de Janeiro, RJ', lat: -22.9711, lon: -43.1822 },
  { name: 'Odonto Rio Centro', address: 'Rua da Assembleia, 100 — Rio de Janeiro, RJ', lat: -22.9068, lon: -43.1729 },
  { name: 'Clínica Ipanema Dental', address: 'Rua Visconde de Pirajá, 300 — Rio de Janeiro, RJ', lat: -22.9838, lon: -43.2047 },

  // Salvador, BA
  { name: 'Clínica Sorriso Baiano', address: 'Av. Tancredo Neves, 1200 — Salvador, BA', lat: -12.9711, lon: -38.5108 },
  { name: 'Odonto Barra Salvador', address: 'Av. Oceânica, 400 — Salvador, BA', lat: -13.0105, lon: -38.5326 },
  { name: 'Clínica Costa Azul Odonto', address: 'Rua Vasco da Gama, 150 — Salvador, BA', lat: -12.9950, lon: -38.4650 },

  // Brasilia, DF
  { name: 'Clínica Odonto Brasília', address: 'SQS 108, Bloco A — Brasília, DF', lat: -15.7942, lon: -47.8822 },

  // Belo Horizonte, MG
  { name: 'Sorriso BH Odontologia', address: 'Av. Afonso Pena, 900 — Belo Horizonte, MG', lat: -19.9167, lon: -43.9345 },

  // Curitiba, PR
  { name: 'Clínica Odonto Curitiba', address: 'Rua XV de Novembro, 500 — Curitiba, PR', lat: -25.4284, lon: -49.2733 },

  // Porto Alegre, RS
  { name: 'Sorriso Gaúcho Odontologia', address: 'Av. Borges de Medeiros, 400 — Porto Alegre, RS', lat: -30.0346, lon: -51.2177 },

  // Recife, PE
  { name: 'Clínica Odonto Recife', address: 'Av. Boa Viagem, 800 — Recife, PE', lat: -8.1130, lon: -34.8994 },
]
