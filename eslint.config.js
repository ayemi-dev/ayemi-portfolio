import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // `.ayemi/` es el kit de marca: material de referencia, no del producto, y
  // parte de él es CommonJS. El propio verificador del kit también lo excluye.
  // Lo que el producto usa se copia a src/ y public/, y eso sí se analiza.
  globalIgnores(['dist', '.ayemi']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // La regla base no cuenta como uso una referencia dentro de JSX, y este
      // proyecto no lleva eslint-plugin-react. Por convención, un identificador
      // que empieza en mayúscula es un componente, así que se ignora tanto si
      // es variable como si es parámetro: `PRUEBAS.map(({ Icono }) => <Icono />)`
      // es uso legítimo y la regla no lo ve.
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^[A-Z_]' },
      ],
    },
  },
  {
    // `api/` son funciones serverless de Vercel: corren en Node, no en el
    // navegador. Sin esto, `process.env` se marca como no definido, que es
    // justo donde vive la llave de Resend.
    files: ['api/**/*.js'],
    languageOptions: {
      globals: globals.node,
      parserOptions: { sourceType: 'module' },
    },
  },
])
