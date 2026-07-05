import { useState } from 'react'
import { Landing } from './components/Landing'
import { MouthScene, type ToothInfo } from './components/MouthScene'
import { SymptomPanel, type Symptom } from './components/SymptomPanel'
import { QuestionFlow } from './components/QuestionFlow'

type Screen = 'landing' | 'scene3d'

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [selectedTooth, setSelectedTooth] = useState<ToothInfo | null>(null)
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null)

  function resetSelection() {
    setSelectedTooth(null)
    setSelectedSymptom(null)
  }

  if (screen === 'scene3d') {
    return (
      <>
        <MouthScene
          onBack={() => setScreen('landing')}
          onToothSelected={(tooth) => setSelectedTooth(tooth)}
        />
        {selectedTooth && !selectedSymptom && (
          <SymptomPanel
            tooth={selectedTooth}
            onBack={resetSelection}
            onSelectSymptom={(symptom: Symptom) => setSelectedSymptom(symptom)}
          />
        )}
        {selectedTooth && selectedSymptom && (
          <QuestionFlow
            tooth={selectedTooth}
            symptomId={selectedSymptom.id}
            symptomLabel={selectedSymptom.label}
            onBack={resetSelection}
            onComplete={(answers) => {
              console.log('respostas coletadas:', answers, 'para o dente', selectedTooth.fdi)
            }}
          />
        )}
      </>
    )
  }

  return <Landing onEnter={() => setScreen('scene3d')} />
}

export default App
