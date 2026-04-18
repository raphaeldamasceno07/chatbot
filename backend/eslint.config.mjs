import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 1. Substitui o .eslintignore
  {
    ignores: ['node_modules/**', 'build/**', 'dist/**', 'coverage/**'],
  },

  // 2. Regras base do ESLint (sem formatação)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Configuração do projeto
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2023,
      },
    },

    rules: {
      // ❌ Remove ponto e vírgula
      semi: ['error', 'never'],

      // Limita linhas vazias
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],

      // Permite any, mas avisa
      '@typescript-eslint/no-explicit-any': 'warn',

      // Ignora variáveis não usadas começando com _
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
]
