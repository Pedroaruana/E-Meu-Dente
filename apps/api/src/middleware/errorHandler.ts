import type { NextFunction, Request, Response } from 'express'

export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: 'Rota não encontrada' })
}

// precisa dos 4 parametros (mesmo sem usar `next`) pra o Express reconhecer
// essa funcao como error handler em vez de middleware comum.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message })
    return
  }
  console.error(err)
  res.status(500).json({ error: 'Erro interno do servidor' })
}
