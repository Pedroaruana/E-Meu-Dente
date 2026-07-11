import type { ToothInfo } from './MouthScene'
import './NoWebGLFallback.css'

interface NoWebGLFallbackProps {
  onBack: () => void
  onContinue: (tooth: ToothInfo) => void
}

const REGIONS: ToothInfo[] = [
  { fdi: 0, name: 'dente superior direito' },
  { fdi: 0, name: 'dente superior esquerdo' },
  { fdi: 0, name: 'dente inferior direito' },
  { fdi: 0, name: 'dente inferior esquerdo' },
  { fdi: 0, name: 'não sei especificar exatamente' },
]

export function NoWebGLFallback({ onBack, onContinue }: NoWebGLFallbackProps) {
  return (
    <div className="no-webgl">
      <div className="no-webgl__content">
        <span className="no-webgl__icon">🦷</span>
        <h1 className="no-webgl__title">Seu navegador não suporta o modelo 3D</h1>
        <p className="no-webgl__text">
          Isso costuma acontecer em computadores corporativos ou com a aceleração gráfica desativada.
          Sem problema — você pode continuar informando de forma simples qual região do dente está incomodando.
        </p>

        <div className="no-webgl__options">
          {REGIONS.map((region) => (
            <button
              key={region.name}
              type="button"
              className="no-webgl__option"
              onClick={() => onContinue(region)}
            >
              {region.name}
            </button>
          ))}
        </div>

        <button type="button" className="no-webgl__back" onClick={onBack}>
          ← voltar ao início
        </button>
      </div>
    </div>
  )
}
