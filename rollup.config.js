import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default {
	input: 'src/client/EventsBrowser.ts',
	output: [{
		format: 'esm',
		file: 'static/lit-elements.mjs',
		sourcemap: false,
	}],
	plugins: [
		typescript({
			useTsconfigDeclarationDir: true
		}),
		resolve(),
		commonjs(),
	],
}
