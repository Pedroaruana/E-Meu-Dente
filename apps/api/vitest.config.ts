import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // o primeiro request de cada suite as vezes demora um pouco mais
    // (setup do express), entao o padrao de 5s as vezes falhava a toa.
    testTimeout: 15000,
  },
})
