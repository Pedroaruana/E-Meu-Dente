export interface Question {
  text: string
  options: string[]
}

export const SYMPTOM_QUESTIONS: Record<string, Question[]> = {
  dor: [
    {
      text: 'A dor é constante ou só quando você morde/aperta o dente?',
      options: [
        'Só ao morder',
        'Constante, mesmo sem tocar',
        'Vai e volta ao longo do dia',
        'Só quando deito',
        'Não sei dizer bem',
      ],
    },
    {
      text: 'A dor piora com alimentos quentes ou frios?',
      options: [
        'Sim, muito com frio',
        'Sim, muito com quente',
        'Um pouco com os dois',
        'Não piora com temperatura',
      ],
    },
    {
      text: 'Há quanto tempo você sente essa dor?',
      options: [
        'Começou hoje ou ontem',
        'Alguns dias',
        'Cerca de uma semana',
        'Mais de duas semanas',
        'Meses',
      ],
    },
  ],
  sensibilidade: [
    {
      text: 'A sensibilidade passa rápido ou continua doendo depois?',
      options: ['Passa em poucos segundos', 'Continua por alguns minutos', 'Fica doendo por horas'],
    },
    {
      text: 'Começou depois de algum tratamento dentário recente?',
      options: [
        'Sim, clareamento',
        'Sim, obturação ou restauração',
        'Sim, limpeza/profilaxia',
        'Não fiz nenhum tratamento',
      ],
    },
    {
      text: 'Você também sente incômodo ao comer doces?',
      options: ['Sim, bastante', 'Um pouco', 'Não'],
    },
  ],
  aparencia: [
    {
      text: 'A mancha é escura, esbranquiçada ou amarelada?',
      options: ['Escura (marrom ou preta)', 'Esbranquiçada, tipo giz', 'Amarelada', 'Acinzentada'],
    },
    {
      text: 'Ela apareceu de repente ou foi mudando aos poucos?',
      options: ['De repente', 'Aos poucos, nas últimas semanas', 'Aos poucos, há meses'],
    },
    {
      text: 'Você sente dor ou desconforto nesse dente?',
      options: ['Sim, dor forte', 'Só um leve incômodo', 'Nenhuma dor'],
    },
  ],
  mobilidade: [
    {
      text: 'O dente balança visivelmente ou é só um leve desconforto?',
      options: ['Balança bastante', 'Balança um pouco', 'Só sinto que está diferente', 'Não balança, mas incomoda'],
    },
    {
      text: 'A gengiva ao redor está inchada ou sangrando?',
      options: ['Sim, inchada e sangrando', 'Só sangra ao escovar', 'Só inchada, sem sangrar', 'Gengiva normal'],
    },
    {
      text: 'Você sofreu algum impacto ou trauma recente na região?',
      options: ['Sim, recente', 'Sim, mas já faz tempo', 'Não'],
    },
  ],
  'mau-halito': [
    {
      text: 'O mau cheiro vem desse dente específico ou parece geral na boca?',
      options: ['Desse dente específico', 'Parece geral na boca', 'Não tenho certeza'],
    },
    {
      text: 'Sente um gosto ruim ou amargo perto desse dente?',
      options: ['Sim, constante', 'Só às vezes', 'Não'],
    },
    {
      text: 'Esse dente já teve tratamento de canal ou uma obturação grande?',
      options: ['Sim, canal', 'Sim, obturação grande', 'Não', 'Não sei'],
    },
  ],
  canal: [
    {
      text: 'O dente escureceu, ficando com uma cor diferente dos outros?',
      options: ['Sim, escureceu bastante', 'Um pouco mais escuro', 'Não mudou de cor'],
    },
    {
      text: 'Sente dor latejante, principalmente à noite?',
      options: ['Sim, intensa à noite', 'Às vezes', 'Não'],
    },
    {
      text: 'Esse dente já teve uma cárie profunda ou trauma antes?',
      options: ['Sim, cárie profunda', 'Sim, trauma/pancada', 'Os dois', 'Não'],
    },
  ],
}
