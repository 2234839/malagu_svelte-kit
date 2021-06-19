import preprocess from 'svelte-preprocess';
import { join } from 'path';
import { readFileSync } from 'fs';
import esbuild from 'esbuild';

/** @type {import('@sveltejs/kit').Adapter} */
const adapter = {
	name: "adapter-malagu",
	async adapt({ utils, config }) {
		utils.log.info('Copying assets');
		const static_directory = "../malagu/.malagu/frontend";
		utils.copy_client_files(static_directory);
		utils.copy_static_files(static_directory);
		await esbuild.build({
			entryPoints: ['.svelte-kit/output/server/app.js'],
			outfile: join(static_directory, 'index.js'),
			bundle: true,
			external: Object.keys(JSON.parse(readFileSync('package.json', 'utf8')).dependencies || {}),
			format: 'esm',
			platform: 'node',
			target: 'node12',
			define: {
				esbuild_app_dir: '"' + config.kit.appDir + '"'
			}
		});

	}
};
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter,
		vite: {
			server: {
				port: 3001
			},

			outDir: "../malagu/.malagu/frontend/dist/",
			emptyOutDir: true,
		}
	}
};

export default config;
