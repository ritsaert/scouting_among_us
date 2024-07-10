const esbuild = require('esbuild');

esbuild
	.build({
		platform: 'node',
		target: 'node22',
		bundle: true,
		sourcemap: true,
		minifyWhitespace: true,
		minifyIdentifiers: false,
		minifySyntax: false,
		keepNames: true,
		entryPoints: [ './src/index.ts' ],
		outfile: 'dist/index.js',
		external: []
	})
	.catch(() => process.exit(1));
