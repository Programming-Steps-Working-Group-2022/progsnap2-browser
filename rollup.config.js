import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default {
	input: 'src/index.ts',
	output: [{
		format: 'esm',
		file: pkg.module,
		sourcemap: false,
	}, {
		format: 'cjs',
		file: pkg.main,
		sourcemap: false,
		esModule: false,
	}],
	plugins: [
		typescript({
			useTsconfigDeclarationDir: true
		}),
		resolve(),
		commonjs(),
	],
}
