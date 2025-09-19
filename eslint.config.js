import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';
import { fileURLToPath } from 'node:url';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import { includeIgnoreFile } from '@eslint/compat';
import pluginQuery from '@tanstack/eslint-plugin-query';

import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	...pluginQuery.configs['flat/recommended'],
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		plugins: { boundaries },
		settings: {
			'boundaries/include': ['src/**/*'],
			'boundaries/elements': [
				{
					mode: 'full',
					type: 'shared',
					pattern: ['src/lib/components/**/*', 'src/lib/queries/**/*', 'src/lib/stores/**/*', 'src/lib/assets/**/*', 'src/lib/utils/**/*', 'src/lib/hooks/**/*']
				},
				{
					mode: 'full',
					type: 'feature',
					capture: ['featureName'],
					pattern: ['src/lib/features/*/**/*']
				},
				{
					mode: 'full',
					type: 'routes',
					capture: ['_', 'fileName'],
					pattern: ['src/routes/**/*']
				},
				{
					mode: 'full',
					type: 'global-styles',
					pattern: 'src/app.css'
				},
				{
					mode: 'full',
					type: 'neverImport',
					pattern: ['src/*']
				}
			]
		},
		rules: {
			'boundaries/no-unknown': ['error'],
			'boundaries/no-unknown-files': ['error'],
			'boundaries/element-types': [
				'error',
				{
					default: 'disallow',
					rules: [
						{
							from: ['shared'],
							allow: ['shared']
						},
						{
							from: ['feature'],
							allow: ['shared', ['feature', { featureName: '${from.featureName}' }]]
						},
						{
							from: ['routes'],
							allow: [['routes', { fileName: '*.css' }], 'global-styles']
						}
					]
				}
			]
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
);
