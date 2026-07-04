import { useState } from 'react'
import { Landing } from './components/Landing'
import { MouthScene, type ToothInfo } from './components/MouthScene'
import { SymptomPanel, type Symptom } from './components/SymptomPanel'

type Screen = 'landing' | 'scene3d'

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [selectedTooth, setSelectedTooth] = useState<ToothInfo | null>(null)

  if (screen === 'scene3d') {
    return (
      <>
        <MouthScene
          onBack={() => setScreen('landing')}
          onToothSelected={(tooth) => setSelectedTooth(tooth)}
        />
        {selectedTooth && (
          <SymptomPanel
            tooth={selectedTooth}
            onBack={() => setSelectedTooth(null)}
            onSelectSymptom={(symptom: Symptom) => {
              console.log('sintoma selecionado:', symptom.id, 'para o dente', selectedTooth.fdi)
            }}
          />
        )}
      </>
    )
  }

  return <Landing onEnter={() => setScreen('scene3d')} />
}

export default App
