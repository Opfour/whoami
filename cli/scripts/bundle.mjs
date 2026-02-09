import { build } from 'esbuild';
import { chmodSync, readFileSync } from 'node:fs';

const outfile = 'dist/wai.cjs';

/** Strip shebangs from source files so only the banner shebang remains. */
const stripShebang = {
  name: 'strip-shebang',
  setup(build) {
    build.onLoad({ filter: /\.ts$/ }, async (args) => {
      let contents = readFileSync(args.path, 'utf-8');
      if (contents.startsWith('#!')) {
        contents = contents.replace(/^#!.*\n/, '');
      }
      return { contents, loader: 'ts' };
    });
  },
};

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile,
  banner: { js: '#!/usr/bin/env node' },
  plugins: [stripShebang],
  external: [
    'node:*',
    'deasync',
  ],
  sourcemap: false,
  minify: false,
});

chmodSync(outfile, 0o755);
console.log(`Bundled → ${outfile}`);
