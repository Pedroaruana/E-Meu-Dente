import { useRef, useState } from 'react'
import { Landing } from './components/Landing'
import { MouthScene, type MouthSceneHandle, type ToothInfo } from './components/MouthScene'
import { SymptomPanel, type Symptom } from './components/SymptomPanel'
import { QuestionFlow } from './components/QuestionFlow'
import { ResultScreen } from './components/ResultScreen'
import { getDiagnosis, type Diagnosis } from './data/diagnosis'

type Screen = 'landing' | 'scene3d'

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [selectedTooth, setSelectedTooth] = useState<ToothInfo | null>(null)
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null)
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null)
  const mouthSceneRef = useRef<MouthSceneHandle>(null)

  function resetSelection() {
    setSelectedTooth(null)
    setSelectedSymptom(null)
    setDiagnosis(null)
    mouthSceneRef.current?.resetCamera()
  }

  if (screen === 'scene3d') {
    return (
      <>
        <MouthScene
          ref={mouthSceneRef}
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
        {selectedTooth && selectedSymptom && !diagnosis && (
          <QuestionFlow
            tooth={selectedTooth}
            symptomId={selectedSymptom.id}
            symptomLabel={selectedSymptom.label}
            onBack={resetSelection}
            onComplete={(answers) => {
              setDiagnosis(getDiagnosis(selectedSymptom.id, answers))
            }}
          />
        )}
        {selectedTooth && diagnosis && (
          <ResultScreen tooth={selectedTooth} diagnosis={diagnosis} onRestart={resetSelection} />
        )}
      </>
    )
  }

  return <Landing onEnter={() => setScreen('scene3d')} />
}

export default App
