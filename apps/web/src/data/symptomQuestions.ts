export interface Question {
  text: string
  options: string[]
}

export const SYMPTOM_QUESTIONS: Record<string, Question[]> = {
  dor: [
    {
      text: 'A dor é constante ou só quando você morde/aperta o dente?',
      options: ['Só ao morder', 'Constante, mesmo sem tocar', 'Vai e volta'],
    },
    {
      text: 'A dor piora com alimentos quentes ou frios?',
      options: ['Sim, muito', 'Um pouco', 'Não piora'],
    },
    {
      text: 'Há quanto tempo você sente essa dor?',
      options: ['Começou hoje ou ontem', 'Alguns dias', 'Mais de uma semana'],
    },
  ],
  sensibilidade: [
    {
      text: 'A sensibilidade passa rápido ou continua doendo depois?',
      options: ['Passa em poucos segundos', 'Continua doendo por minutos'],
    },
    {
      text: 'Começou depois de algum tratamento dentário recente?',
      options: ['Sim', 'Não'],
    },
    {
      text: 'Você também sente incômodo ao comer doces?',
      options: ['Sim', 'Não'],
    },
  ],
  aparencia: [
    {
      text: 'A mancha é escura, esbranquiçada ou amarelada?',
      options: ['Escura', 'Esbranquiçada', 'Amarelada'],
    },
    {
      text: 'Ela apareceu de repente ou foi mudando aos poucos?',
      options: ['De repente', 'Aos poucos'],
    },
    {
      text: 'Você sente dor ou desconforto nesse dente?',
      options: ['Sim', 'Não'],
    },
  ],
  mobilidade: [
    {
      text: 'O dente balança visivelmente ou é só um leve desconforto?',
      options: ['Balança bastante', 'Leve mobilidade', 'Só desconforto'],
    },
    {
      text: 'A gengiva ao redor está inchada ou sangrando?',
      options: ['Sim', 'Não'],
    },
    {
      text: 'Você sofreu algum impacto ou trauma recente na região?',
      options: ['Sim', 'Não'],
    },
  ],
  'mau-halito': [
    {
      text: 'O mau cheiro vem desse dente específico ou parece geral na boca?',
      options: ['Desse dente específico', 'Parece geral'],
    },
    {
      text: 'Sente um gosto ruim ou amargo perto desse dente?',
      options: ['Sim', 'Não'],
    },
    {
      text: 'Esse dente já teve tratamento de canal ou uma obturação grande?',
      options: ['Sim', 'Não', 'Não sei'],
    },
  ],
  canal: [
    {
      text: 'O dente escureceu, ficando com uma cor diferente dos outros?',
      options: ['Sim', 'Não'],
    },
    {
      text: 'Sente dor latejante, principalmente à noite?',
      options: ['Sim', 'Não'],
    },
    {
      text: 'Esse dente já teve uma cárie profunda ou trauma antes?',
      options: ['Sim', 'Não'],
    },
  ],
}
