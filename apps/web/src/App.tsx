import { useState } from 'react'
import { Landing } from './components/Landing'
import { MouthScene, type ToothInfo } from './components/MouthScene'

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
          <div
            style={{
              position: 'fixed', top: 20, right: 24, zIndex: 3,
              background: 'rgba(6,20,28,.94)', color: '#ecf9fc',
              border: '1px solid rgba(143,208,221,.3)', borderRadius: 12,
              padding: '12px 18px', fontSize: 13.5,
            }}
          >
            selecionado: {selectedTooth.name} (FDI {selectedTooth.fdi}) — painel de sintomas no próximo commit
          </div>
        )}
      </>
    )
  }

  return <Landing onEnter={() => setScreen('scene3d')} />
}

export default App
