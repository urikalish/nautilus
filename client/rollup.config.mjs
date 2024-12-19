import { terser } from 'rollup-plugin-terser';

const isProduction = process.env.build === 'production';

export default {
  input: 'tsc/main.js',
  output: {
    format: 'iife',
    file: isProduction ? 'public/js/main.min.js' : 'public/js/main.js',
    sourcemap: !isProduction,
  },
  plugins: [
    isProduction && terser()
  ]
};
