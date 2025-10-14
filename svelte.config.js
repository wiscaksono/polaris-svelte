import adapterNode from '@sveltejs/adapter-node';
import adapterVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: process.env.VERCEL ? adapterVercel() : adapterNode(),
		experimental: { remoteFunctions: true },
		typescript: {
			config: (conf) => {
				conf.exclude = ['node_modules', '.svelte-kit', 'build', 'dist', 'coverage', 'test-results', '**/*.test.ts', '**/*.spec.ts'];
			}
		}
	},
	vitePlugin: {
		inspector: {
			showToggleButton: 'always',
			toggleButtonPos: 'bottom-right',
			navKeys: {
				parent: 'ArrowUp',
				child: 'ArrowDown',
				sibling: 'ArrowRight',
				prev: 'ArrowLeft'
			}
		}
	}
};

export default config;
