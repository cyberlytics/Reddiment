import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// https://github.com/sveltejs/svelte-preprocess
    preprocess: [
        preprocess({
            postcss: true,
        }),
    ],
	kit: {
		adapter: adapter()
	}
};

export default config;
