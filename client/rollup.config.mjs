import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const production = process.env.build === 'production';

export default {
  input: 'src/main.ts', // Use the TypeScript source file directly
  output: {
    format: 'iife',
    file: production ? 'public/js/main.min.js' : 'public/js/main.js',
    sourcemap: !production,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production
    }),
    production && terser()
  ]
};
