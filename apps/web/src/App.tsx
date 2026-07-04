import { useState } from 'react'
import { Landing } from './components/Landing'

type Screen = 'landing' | 'scene3d'

function App() {
  const [screen, setScreen] = useState<Screen>('landing')

  if (screen === 'scene3d') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#ecf9fc', background: '#0d1f2b' }}>
        <p>ambiente 3D entra aqui no próximo commit</p>
      </div>
    )
  }

  return <Landing onEnter={() => setScreen('scene3d')} />
}

export default App
