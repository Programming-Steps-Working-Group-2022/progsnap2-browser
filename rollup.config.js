import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import css from 'rollup-plugin-import-css';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/client/index.ts',
	output: [{
		format: 'esm',
		file: 'static/lit-elements.mjs',
	}],
	plugins: [
		typescript({
			useTsconfigDeclarationDir: true
		}),
		resolve(),
		commonjs(),
		css(),
		terser(),
	],
}
