import './NotFoundPage.css'

export function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <span className="not-found__icon">🦷</span>
        <h1 className="not-found__code">404</h1>
        <p className="not-found__text">Essa página não existe.</p>
        <a href="/" className="not-found__link">
          ← voltar pro início
        </a>
      </div>
    </div>
  )
}
