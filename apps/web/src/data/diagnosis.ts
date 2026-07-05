export type Urgency = 'baixa' | 'moderada' | 'alta'

export interface Diagnosis {
  title: string
  description: string
  urgency: Urgency
}

type Rule = (answers: string[]) => Diagnosis

const FALLBACK: Diagnosis = {
  title: 'Avaliação recomendada',
  description: 'Não foi possível identificar um padrão claro com essas respostas. O ideal é marcar uma avaliação com um dentista.',
  urgency: 'moderada',
}

const RULES: Record<string, Rule> = {
  dor: ([whenPain, tempSensitivity, duration]) => {
    if (whenPain === 'Constante, mesmo sem tocar' && duration === 'Mais de uma semana') {
      return {
        title: 'Possível infecção ou abscesso',
        description: 'Dor constante e prolongada pode indicar infecção na polpa do dente. Recomendado procurar um dentista o quanto antes.',
        urgency: 'alta',
      }
    }
    if (whenPain === 'Só ao morder') {
      return {
        title: 'Possível fratura ou cárie profunda',
        description: 'Dor apenas ao morder costuma indicar uma rachadura no dente ou uma cárie já avançada.',
        urgency: 'moderada',
      }
    }
    if (tempSensitivity === 'Sim, muito') {
      return {
        title: 'Possível inflamação da polpa',
        description: 'Dor forte com temperatura sugere que a polpa do dente já está inflamada.',
        urgency: 'moderada',
      }
    }
    return {
      title: 'Possível sensibilidade ou cárie inicial',
      description: 'Os sintomas sugerem algo em estágio inicial, mas vale confirmar com um dentista.',
      urgency: 'baixa',
    }
  },

  sensibilidade: ([duration, afterTreatment]) => {
    if (duration === 'Continua doendo por minutos') {
      return {
        title: 'Possível pulpite (inflamação da polpa)',
        description: 'Sensibilidade que demora a passar pode indicar que a polpa do dente está inflamada e precisa de avaliação.',
        urgency: 'moderada',
      }
    }
    if (afterTreatment === 'Sim') {
      return {
        title: 'Sensibilidade pós-tratamento',
        description: 'É comum sentir sensibilidade por um tempo depois de um procedimento. Geralmente passa sozinha, mas informe seu dentista se persistir.',
        urgency: 'baixa',
      }
    }
    return {
      title: 'Sensibilidade dentinária',
      description: 'Provavelmente é desgaste do esmalte expondo a dentina. Um creme dental para sensibilidade costuma ajudar.',
      urgency: 'baixa',
    }
  },

  aparencia: ([color, onset, pain]) => {
    if (color === 'Escura' && pain === 'Sim') {
      return {
        title: 'Possível necrose do dente',
        description: 'Escurecimento com dor pode indicar que a polpa do dente morreu. É importante avaliar logo.',
        urgency: 'alta',
      }
    }
    if (color === 'Esbranquiçada') {
      return {
        title: 'Possível início de cárie',
        description: 'Manchas brancas costumam ser o primeiro sinal de desmineralização do esmalte (início de cárie).',
        urgency: 'moderada',
      }
    }
    return {
      title: 'Provável mancha superficial',
      description: onset === 'Aos poucos'
        ? 'Mudança gradual de cor costuma estar ligada a alimentos, bebidas ou tártaro — uma limpeza pode resolver.'
        : 'Vale investigar a causa com um dentista para descartar outras origens.',
      urgency: 'baixa',
    }
  },

  mobilidade: ([intensity, gum, trauma]) => {
    if (trauma === 'Sim') {
      return {
        title: 'Possível lesão traumática',
        description: 'Mobilidade após impacto precisa ser avaliada rapidamente para evitar perda do dente.',
        urgency: 'alta',
      }
    }
    if (intensity === 'Balança bastante' && gum === 'Sim') {
      return {
        title: 'Possível doença periodontal avançada',
        description: 'Mobilidade forte com gengiva inchada sugere perda de suporte ósseo — procure um periodontista.',
        urgency: 'alta',
      }
    }
    return {
      title: 'Mobilidade leve',
      description: 'Pode ser inflamação localizada da gengiva. Ainda assim, vale confirmar com um dentista.',
      urgency: 'moderada',
    }
  },

  'mau-halito': ([localized, badTaste]) => {
    if (localized === 'Desse dente específico' && badTaste === 'Sim') {
      return {
        title: 'Possível infecção localizada',
        description: 'Mau cheiro e gosto ruim vindos de um único dente costumam indicar infecção ou restos de tecido em decomposição.',
        urgency: 'alta',
      }
    }
    return {
      title: 'Possível causa geral',
      description: 'O sintoma pode estar mais ligado à higiene bucal geral do que a esse dente específico.',
      urgency: 'baixa',
    }
  },

  canal: ([darkened, nightPain]) => {
    if (darkened === 'Sim' && nightPain === 'Sim') {
      return {
        title: 'Forte indício de necessidade de canal',
        description: 'Escurecimento do dente junto com dor noturna latejante são sinais clássicos de que o tratamento de canal pode ser necessário.',
        urgency: 'alta',
      }
    }
    if (darkened === 'Sim' || nightPain === 'Sim') {
      return {
        title: 'Possível indício de canal',
        description: 'Pelo menos um sinal de alerta está presente. Uma avaliação com raio-X vai confirmar se o canal é necessário.',
        urgency: 'moderada',
      }
    }
    return {
      title: 'Baixo indício de canal',
      description: 'Os sinais clássicos não apareceram, mas uma avaliação preventiva nunca é demais.',
      urgency: 'baixa',
    }
  },
}

export function getDiagnosis(symptomId: string, answers: string[]): Diagnosis {
  const rule = RULES[symptomId]
  if (!rule) return FALLBACK
  return rule(answers)
}
