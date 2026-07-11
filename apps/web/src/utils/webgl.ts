// checagem rapida e descartavel: cria um canvas so pra perguntar se o
// navegador consegue abrir um contexto webgl, sem afetar nada na tela.
// maquinas corporativas antigas ou com driver de video bloqueado costumam
// falhar aqui, e sem essa checagem a cena 3d simplesmente trava numa tela
// preta sem explicação nenhuma.
export function hasWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}
