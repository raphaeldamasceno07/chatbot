import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vite.config.ts' // Importa sua config base

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['src/http/controllers/**/*.{spec,e2e-spec}.ts'], // Rodar apenas arquivos de teste
      exclude: ['**/node_modules/**'], // Excluir node_modules
      globals: true,
      environment: 'node',
      globalSetup: './vitest.setup.e2e.ts', // Caminho para o arquivo de setup E2E existente
      setupFiles: [], // Opcional: scripts que rodam ANTES de cada arquivo de teste
      testTimeout: 30000, // E2E costumam demorar mais (esperando banco/docker)
    },
  }),
)
