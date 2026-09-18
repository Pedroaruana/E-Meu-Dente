import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { Landing } from './components/Landing'
import type { MouthSceneHandle, ToothInfo } from './components/MouthScene'
import { NoWebGLFallback } from './components/NoWebGLFallback'
import { NotFoundPage } from './components/NotFoundPage'
import { SymptomPanel, type Symptom } from './components/SymptomPanel'
import { QuestionFlow } from './components/QuestionFlow'
import { ResultScreen } from './components/ResultScreen'
import { fetchDiagnosis, type Diagnosis } from './api/client'
import { hasWebGLSupport } from './utils/webgl'

// three.js e o grosso do bundle (~700kb) — carregando so quando o usuario
// clica em "Entrar", a tela inicial fica leve e rapida de verdade.
const MouthScene = lazy(() => import('./components/MouthScene'))

type Screen = 'landing' | 'scene3d'

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [selectedTooth, setSelectedTooth] = useState<ToothInfo | null>(null)
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null)
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null)
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false)
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null)
  const mouthSceneRef = useRef<MouthSceneHandle>(null)
  const webglSupported = useMemo(() => hasWebGLSupport(), [])

  function resetSelection() {
    setSelectedTooth(null)
    setSelectedSymptom(null)
    setDiagnosis(null)
    setDiagnosisError(null)
    mouthSceneRef.current?.resetCamera()
  }

  async function handleAnswers(symptomId: string, answers: string[]) {
    setLoadingDiagnosis(true)
    setDiagnosisError(null)
    try {
      const result = await fetchDiagnosis(symptomId, answers)
      setDiagnosis(result)
    } catch {
      setDiagnosisError('Não foi possível gerar o diagnóstico agora. Tente novamente.')
    } finally {
      setLoadingDiagnosis(false)
    }
  }

  if (screen === 'scene3d') {
    return (
      <>
        {webglSupported ? (
          <Suspense fallback={<div className="scene-loading">carregando…</div>}>
            <MouthScene
              ref={mouthSceneRef}
              onBack={() => setScreen('landing')}
              onToothSelected={(tooth) => setSelectedTooth(tooth)}
            />
          </Suspense>
        ) : (
          !selectedTooth && (
            <NoWebGLFallback onBack={() => setScreen('landing')} onContinue={(tooth) => setSelectedTooth(tooth)} />
          )
        )}
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
            onComplete={(answers) => handleAnswers(selectedSymptom.id, answers)}
            loading={loadingDiagnosis}
            error={diagnosisError}
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

// rota leve baseada em pathname, sem depender do react-router — o app tem
// poucas paginas fora do fluxo principal, entao uma lib de rotas seria
// complexidade a mais sem necessidade real.
function AppRouter() {
  const pathname = window.location.pathname
  if (pathname !== '/') return <NotFoundPage />
  return <App />
}

export default AppRouter
