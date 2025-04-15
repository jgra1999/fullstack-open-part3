import js from '@eslint/js'
import globals from 'globals'
import json from '@eslint/json'
import { defineConfig } from 'eslint/config'

export default defineConfig([
	{ files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
	{ files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
	{ files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
	{
		files: ['**/*.json'],
		plugins: { json },
		language: 'json/json',
		extends: ['json/recommended']
	},
	{
		files: ['**/*.jsonc'],
		plugins: { json },
		language: 'json/jsonc',
		extends: ['json/recommended']
	},
	{
		rules: {
			eqeqeq: 'error',
			'no-trailing-spaces': 'error',
			'object-curly-spacing': ['error', 'always'],
			'arrow-spacing': ['error', { before: true, after: true }]
		}
	}
])
