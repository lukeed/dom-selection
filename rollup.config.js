import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';

const pkg = require('./package');

export default {
	useStrict: false,
	entry: 'src/index.js',
	plugins: [
		resolve(),
		buble({
			transforms: { modules:false }
		})
	],
	targets: [
		{dest: pkg.main, format: 'cjs'},
		{dest: pkg.module, format: 'es'},
		{dest: pkg['umd:main'], format: 'iife', moduleName: pkg.amdName},
	]
}
