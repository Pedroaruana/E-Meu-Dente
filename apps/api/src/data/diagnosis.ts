export type Urgency = 'baixa' | 'moderada' | 'alta'

export interface Diagnosis {
  title: string
  description: string
  urgency: Urgency
  tips: string[]
}

type Rule = (answers: string[]) => Diagnosis

const GENERAL_TIPS = [
  'Escove os dentes pelo menos 2x ao dia com creme dental fluoretado.',
  'Use fio dental todos os dias, principalmente antes de dormir.',
  'Evite beliscar doces e alimentos ácidos entre as refeições.',
]

const FALLBACK: Diagnosis = {
  title: 'Avaliação recomendada',
  description: 'Não foi possível identificar um padrão claro com essas respostas. O ideal é marcar uma avaliação com um dentista.',
  urgency: 'moderada',
  tips: GENERAL_TIPS,
}

const RULES: Record<string, Rule> = {
  dor: ([whenPain, tempReaction, duration]) => {
    const longDuration = duration === 'Mais de duas semanas' || duration === 'Meses'

    if (whenPain === 'Constante, mesmo sem tocar' && longDuration) {
      return {
        title: 'Possível infecção ou abscesso crônico',
        description: 'Dor constante que já dura semanas é um sinal forte de infecção instalada na polpa ou raiz do dente. Isso não tende a melhorar sozinho.',
        urgency: 'alta',
        tips: [
          'Procure um dentista o quanto antes — infecções dentárias podem se espalhar.',
          'Evite mastigar do lado do dente afetado até a avaliação.',
          'Compressas frias do lado de fora do rosto ajudam a aliviar o inchaço, se houver.',
        ],
      }
    }
    if (whenPain === 'Constante, mesmo sem tocar') {
      return {
        title: 'Possível inflamação aguda da polpa',
        description: 'Dor constante recente sugere que a polpa do dente está inflamada (pulpite). Costuma piorar se não for tratada.',
        urgency: 'alta',
        tips: ['Evite alimentos muito quentes ou frios nesse dente.', 'Não adie a consulta — pulpite pode evoluir rápido.', ...GENERAL_TIPS.slice(0, 1)],
      }
    }
    if (whenPain === 'Só quando deito') {
      return {
        title: 'Possível pressão pulpar ou sinusite',
        description: 'Dor que piora deitado é clássica de aumento de pressão dentro do dente (inflamação) ou, às vezes, de sinusite — vale investigar qual é a causa.',
        urgency: 'moderada',
        tips: ['Durma com a cabeceira um pouco elevada enquanto não é avaliado.', ...GENERAL_TIPS.slice(0, 2)],
      }
    }
    if (whenPain === 'Só ao morder') {
      return {
        title: 'Possível fratura ou cárie profunda',
        description: 'Dor apenas ao morder costuma indicar uma rachadura no dente ou uma cárie já avançada, que precisa de restauração.',
        urgency: 'moderada',
        tips: ['Evite mastigar alimentos duros desse lado.', 'Não force o dente até a avaliação.', ...GENERAL_TIPS.slice(0, 1)],
      }
    }
    if (tempReaction === 'Sim, muito com frio' || tempReaction === 'Sim, muito com quente') {
      return {
        title: 'Possível sensibilidade acentuada',
        description: 'Reação forte à temperatura, mesmo sem dor constante, geralmente indica desgaste de esmalte ou início de inflamação.',
        urgency: 'moderada',
        tips: ['Use creme dental para sensibilidade por algumas semanas.', ...GENERAL_TIPS],
      }
    }
    return {
      title: 'Possível sensibilidade leve ou cárie inicial',
      description: 'Os sintomas sugerem algo em estágio inicial, mas vale confirmar com um dentista antes que evolua.',
      urgency: 'baixa',
      tips: GENERAL_TIPS,
    }
  },

  sensibilidade: ([duration, afterTreatment, sweets]) => {
    if (duration === 'Fica doendo por horas') {
      return {
        title: 'Possível pulpite (inflamação da polpa)',
        description: 'Sensibilidade que demora horas a passar é mais intensa do que o normal e pode indicar que a polpa do dente já está inflamada.',
        urgency: 'alta',
        tips: ['Evite alimentos e bebidas muito quentes ou frias.', 'Não adie a avaliação — esse padrão tende a piorar.'],
      }
    }
    if (duration === 'Continua por alguns minutos') {
      return {
        title: 'Sensibilidade moderada',
        description: 'Sensibilidade que persiste por minutos já passa de um desgaste simples — vale investigar a causa.',
        urgency: 'moderada',
        tips: ['Use creme dental para sensibilidade.', 'Evite escovar com força excessiva.', ...GENERAL_TIPS.slice(0, 1)],
      }
    }
    if (afterTreatment !== 'Não fiz nenhum tratamento') {
      return {
        title: 'Sensibilidade pós-tratamento',
        description: 'É comum sentir sensibilidade por um tempo depois de um procedimento dentário. Geralmente passa sozinha em algumas semanas.',
        urgency: 'baixa',
        tips: ['Evite alimentos muito gelados nos primeiros dias.', 'Informe seu dentista se a sensibilidade não diminuir.'],
      }
    }
    return {
      title: 'Sensibilidade dentinária comum',
      description: sweets === 'Sim, bastante'
        ? 'A reação a doces junto com o frio/calor sugere desgaste do esmalte expondo a dentina.'
        : 'Provavelmente é desgaste do esmalte expondo a dentina, algo bem comum e tratável.',
      urgency: 'baixa',
      tips: ['Troque para um creme dental específico para sensibilidade.', 'Evite escovar os dentes logo após comer cítricos.', ...GENERAL_TIPS.slice(0, 1)],
    }
  },

  aparencia: ([color, onset, pain]) => {
    if (color === 'Escura (marrom ou preta)' && pain === 'Sim, dor forte') {
      return {
        title: 'Possível necrose do dente',
        description: 'Escurecimento com dor forte pode indicar que a polpa do dente morreu (necrose). É importante avaliar o quanto antes.',
        urgency: 'alta',
        tips: ['Não ignore esse sinal — necrose pode evoluir para infecção.', 'Evite mastigar nesse dente até a consulta.'],
      }
    }
    if (color === 'Escura (marrom ou preta)') {
      return {
        title: 'Possível cárie ou desvitalização',
        description: 'Manchas escuras costumam indicar cárie ativa ou início de desvitalização do dente, mesmo sem dor ainda.',
        urgency: 'moderada',
        tips: ['Marque uma consulta preventiva — cárie escura tende a se aprofundar.', ...GENERAL_TIPS.slice(0, 2)],
      }
    }
    if (color === 'Esbranquiçada, tipo giz') {
      return {
        title: 'Possível início de cárie (mancha branca)',
        description: 'Manchas brancas costumam ser o primeiro sinal de desmineralização do esmalte — ainda dá tempo de reverter com flúor.',
        urgency: 'moderada',
        tips: ['Use creme dental com mais flúor (pergunte ao dentista sobre gel de flúor).', 'Reduza o consumo de açúcar e refrigerantes.', ...GENERAL_TIPS.slice(0, 1)],
      }
    }
    return {
      title: 'Provável mancha superficial',
      description: onset === 'De repente'
        ? 'Mudança repentina de cor vale investigar com o dentista pra descartar outras causas.'
        : 'Mudança gradual de cor costuma estar ligada a alimentos, bebidas, café ou tártaro acumulado — uma limpeza profissional resolve.',
      urgency: 'baixa',
      tips: ['Uma limpeza (profilaxia) profissional deve resolver boa parte da mancha.', 'Reduza café, vinho tinto e cigarro, que mancham o esmalte.'],
    }
  },

  mobilidade: ([intensity, gum, trauma]) => {
    if (trauma === 'Sim, recente') {
      return {
        title: 'Possível lesão traumática recente',
        description: 'Mobilidade após um impacto recente precisa ser avaliada rapidamente para tentar salvar o dente.',
        urgency: 'alta',
        tips: ['Procure atendimento de urgência — o tempo importa muito em trauma dentário.', 'Evite mexer no dente com a língua ou os dedos.'],
      }
    }
    if (intensity === 'Balança bastante' && (gum === 'Sim, inchada e sangrando' || gum === 'Só inchada, sem sangrar')) {
      return {
        title: 'Possível doença periodontal avançada',
        description: 'Mobilidade forte com gengiva inchada sugere perda de suporte ósseo ao redor do dente — indicado procurar um periodontista.',
        urgency: 'alta',
        tips: ['Reforce a limpeza com fio dental, com cuidado, sem forçar a gengiva.', 'Evite fumar, o que piora bastante a doença periodontal.'],
      }
    }
    if (gum === 'Só sangra ao escovar') {
      return {
        title: 'Possível gengivite inicial',
        description: 'Sangramento ao escovar, combinado com mobilidade leve, costuma indicar gengivite — reversível com boa higiene.',
        urgency: 'moderada',
        tips: ['Escove com mais cuidado e regularidade, sem pular o fio dental.', 'Considere um enxaguante bucal antisséptico.', ...GENERAL_TIPS.slice(0, 1)],
      }
    }
    return {
      title: 'Mobilidade leve',
      description: 'Pode ser inflamação localizada e passageira da gengiva. Ainda assim, vale confirmar com um dentista.',
      urgency: 'moderada',
      tips: GENERAL_TIPS,
    }
  },

  'mau-halito': ([localized, badTaste, previousTreatment]) => {
    if (localized === 'Desse dente específico' && badTaste === 'Sim, constante') {
      return {
        title: 'Possível infecção localizada',
        description: 'Mau cheiro e gosto ruim constantes vindos de um único dente costumam indicar infecção ou tecido em decomposição embaixo de uma restauração.',
        urgency: 'alta',
        tips: ['Procure avaliação logo — infecção localizada não melhora sozinha.', 'Evite mastigar desse lado até a consulta.'],
      }
    }
    if (previousTreatment === 'Sim, canal' || previousTreatment === 'Sim, obturação grande') {
      return {
        title: 'Possível infiltração em tratamento antigo',
        description: 'Mau cheiro num dente que já teve canal ou obturação grande pode indicar infiltração — quando bactérias voltam a entrar por uma pequena fresta.',
        urgency: 'moderada',
        tips: ['Um raio-X vai mostrar se há infiltração.', ...GENERAL_TIPS.slice(0, 2)],
      }
    }
    return {
      title: 'Possível causa geral (não só desse dente)',
      description: 'O sintoma pode estar mais ligado à higiene bucal geral, língua saburrosa ou gengiva do que a esse dente específico.',
      urgency: 'baixa',
      tips: ['Escove também a língua todos os dias.', 'Beba mais água ao longo do dia — boca seca piora o odor.', ...GENERAL_TIPS.slice(0, 1)],
    }
  },

  canal: ([darkened, nightPain, history]) => {
    const strongDark = darkened === 'Sim, escureceu bastante'
    const strongPain = nightPain === 'Sim, intensa à noite'

    if (strongDark && strongPain) {
      return {
        title: 'Forte indício de necessidade de canal',
        description: 'Escurecimento acentuado do dente junto com dor noturna latejante são sinais clássicos de que o tratamento de canal pode ser necessário.',
        urgency: 'alta',
        tips: ['Procure um endodontista assim que possível.', 'Analgésicos comuns só aliviam temporariamente — não substituem o tratamento.'],
      }
    }
    if (strongDark || strongPain || history === 'Os dois') {
      return {
        title: 'Possível indício de canal',
        description: 'Pelo menos um sinal de alerta importante está presente. Uma avaliação com raio-X vai confirmar se o canal é realmente necessário.',
        urgency: 'moderada',
        tips: ['Evite mastigar alimentos duros nesse dente.', 'Não deixe a avaliação para depois — esse quadro tende a evoluir.'],
      }
    }
    if (history === 'Sim, cárie profunda' || history === 'Sim, trauma/pancada') {
      return {
        title: 'Atenção por histórico do dente',
        description: 'O dente já passou por algo sério antes (cárie profunda ou trauma), então mesmo sem sintomas fortes agora vale um acompanhamento.',
        urgency: 'moderada',
        tips: ['Peça pro dentista avaliar a vitalidade do dente na próxima consulta.', ...GENERAL_TIPS.slice(0, 1)],
      }
    }
    return {
      title: 'Baixo indício de canal',
      description: 'Os sinais clássicos não apareceram, o que é uma boa notícia. Ainda assim, uma avaliação preventiva nunca é demais.',
      urgency: 'baixa',
      tips: GENERAL_TIPS,
    }
  },
}

export function getDiagnosis(symptomId: string, answers: string[]): Diagnosis {
  const rule = RULES[symptomId]
  if (!rule) return FALLBACK
  return rule(answers)
}
