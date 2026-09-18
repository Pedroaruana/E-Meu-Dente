import { Component, type ReactNode } from 'react'
import './ErrorBoundary.css'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

// so um class component tem getDerivedStateFromError/componentDidCatch —
// react ainda nao expoe isso via hooks, entao nao da pra fazer funcional.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <span className="error-boundary__icon">🦷</span>
            <h1 className="error-boundary__title">Algo quebrou por aqui</h1>
            <p className="error-boundary__text">
              Não conseguimos carregar essa parte do site. Tenta recarregar a página.
            </p>
            <button type="button" className="error-boundary__button" onClick={() => window.location.reload()}>
              Recarregar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
