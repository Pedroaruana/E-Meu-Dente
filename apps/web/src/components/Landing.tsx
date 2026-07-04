import { useState } from 'react'
import toothMascot from '../assets/tooth-mascot.png'
import { ChromaKeyVideo } from './ChromaKeyVideo'
import './Landing.css'

interface LandingProps {
  onEnter: () => void
}

const steps = [
  {
    number: '01',
    title: 'Escolha o dente',
    description: 'Explore o modelo 3D interativo e clique no dente que está te incomodando.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3c-3.5 0-6 2.3-5.6 5.8.3 2.6 1.5 4 2.1 6.7.4 1.8 1 4 2 4 1.2 0 1-3 1.5-5 .5 2 .3 5 1.5 5 1 0 1.6-2.2 2-4 .6-2.7 1.8-4.1 2.1-6.7C18 5.3 15.5 3 12 3Z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Responda 3 perguntas',
    description: 'Conte o que sente — dor, sensibilidade, aparência ou mobilidade do dente.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 5h16v10H9l-4 4V15H4Z" strokeLinejoin="round" />
        <path d="M8 9h8M8 12h5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Veja o resultado',
    description: 'Descubra o que pode estar acontecendo e ache clínicas perto de você.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" strokeLinejoin="round" />
        <circle cx="12" cy="9.5" r="2.4" />
      </svg>
    ),
  },
]

const badges = ['100% gratuito', 'Sem cadastro', 'Resultado em 1 minuto']

function BackgroundIcons() {
  return (
    <div className="landing__bg-icons" aria-hidden="true">
      <svg className="landing__bg-icon landing__bg-icon--1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 3c-3.5 0-6 2.3-5.6 5.8.3 2.6 1.5 4 2.1 6.7.4 1.8 1 4 2 4 1.2 0 1-3 1.5-5 .5 2 .3 5 1.5 5 1 0 1.6-2.2 2-4 .6-2.7 1.8-4.1 2.1-6.7C18 5.3 15.5 3 12 3Z" />
      </svg>
      <svg className="landing__bg-icon landing__bg-icon--2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M4 20 15 9M13 4l2 2-9 9-2.5.5L4 13Z" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M15 6l3 3" strokeLinecap="round" />
      </svg>
      <svg className="landing__bg-icon landing__bg-icon--3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8Z" />
      </svg>
      <svg className="landing__bg-icon landing__bg-icon--4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 3c-3.5 0-6 2.3-5.6 5.8.3 2.6 1.5 4 2.1 6.7.4 1.8 1 4 2 4 1.2 0 1-3 1.5-5 .5 2 .3 5 1.5 5 1 0 1.6-2.2 2-4 .6-2.7 1.8-4.1 2.1-6.7C18 5.3 15.5 3 12 3Z" />
      </svg>
      <svg className="landing__bg-icon landing__bg-icon--5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8Z" />
      </svg>
    </div>
  )
}

type MouthState = 'dirty' | 'brushing' | 'clean'

export function Landing({ onEnter }: LandingProps) {
  const [mouthState, setMouthState] = useState<MouthState>('dirty')

  return (
    <div className="landing">
      <BackgroundIcons />

      <header className="landing__nav">
        <span className="landing__logo">
          <span className="landing__logo-mark">🦷</span> E Meu Dente?
        </span>
        <a
          className="landing__nav-link"
          href="https://github.com/Pedroaruana/E-Meu-Dente-"
          target="_blank"
          rel="noreferrer"
        >
          ver código &lt;/&gt;
        </a>
      </header>

      <section className="landing__hero">
        <p className="landing__eyebrow">triagem odontológica rápida</p>
        <h1 className="landing__title">E Meu Dente?</h1>
        <p className="landing__subtitle">
          Aponte o que está incomodando, responda algumas perguntas rápidas e
          descubra o que pode estar acontecendo — depois encontre uma clínica
          perto de você.
        </p>

        <div className="landing__cta">
          <button type="button" className="landing__button" onClick={onEnter}>
            Entrar no ambiente 3D
            <span className="landing__button-arrow">→</span>
          </button>
          <div className="landing__mascot-wrap">
            {mouthState === 'dirty' && (
              <p className="landing__bubble">
                ninguém me escova há dias
                <button
                  type="button"
                  className="landing__brush-btn"
                  onClick={() => setMouthState('brushing')}
                  aria-label="escovar o dente"
                  title="escovar o dente"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 20 15 9" strokeLinecap="round" />
                    <path d="M13 4l2 2-9 9-2.5.5L4 13Z" strokeLinejoin="round" strokeLinecap="round" />
                    <path d="M15 6l3 3" strokeLinecap="round" />
                  </svg>
                </button>
              </p>
            )}
            {mouthState === 'clean' && (
              <p className="landing__bubble landing__bubble--clean">agora sim!!!!</p>
            )}
            <div className="landing__mascot-box">
              {mouthState === 'dirty' ? (
                <img src={toothMascot} alt="Mascote dente cansado" className="landing__mascot" />
              ) : (
                <ChromaKeyVideo
                  src="/videos/tooth-brushing.mp4"
                  size={96}
                  onEnded={() => setMouthState('clean')}
                />
              )}
            </div>
          </div>
        </div>

        <div className="landing__badges">
          {badges.map((badge, i) => (
            <span className="landing__badge" key={badge}>
              {i > 0 && <span className="landing__badge-dot">·</span>}
              {badge}
            </span>
          ))}
        </div>
      </section>

      <section className="landing__steps">
        <p className="landing__steps-eyebrow">como funciona</p>
        <div className="landing__steps-grid">
          {steps.map((step) => (
            <div className="landing__step" key={step.number}>
              <span className="landing__step-number">{step.number}</span>
              <span className="landing__step-icon">{step.icon}</span>
              <h3 className="landing__step-title">{step.title}</h3>
              <p className="landing__step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing__footer">
        <p>E Meu Dente? é uma ferramenta de triagem e não substitui uma avaliação odontológica.</p>
        <p className="landing__footer-license">Projeto de código aberto — licença MIT</p>
      </footer>
    </div>
  )
}
