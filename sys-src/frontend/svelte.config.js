import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import watchAndRun from '@kitql/vite-plugin-watch-and-run'
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// custom __dirname replacement for the __dirname from the commonJS in ES Module
const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// https://github.com/sveltejs/svelte-preprocess
    preprocess: [
        preprocess({
            postcss: true,
        }),
    ],
	kit: {
        adapter: adapter({
            // default options are shown
            pages: 'build',
            assets: 'build',
            fallback: null,
            precompress: false
        }),
        prerender: {
            // This can be false if you're using a fallback (i.e. SPA mode)
            default: true
        },
        vite: () => ({
            resolve: {
                alias: {
                    $components: resolve(__dirname, './src/lib/components'),
                    $shared: resolve(__dirname, './src/lib/shared')
                },
            },
            plugins: [
                watchAndRun([
                    {
                        watch: '**/*.(gql|graphql)',
                        run: 'npm run gen'
                    }
                ])
            ]
        })
	}
};

export default config;
