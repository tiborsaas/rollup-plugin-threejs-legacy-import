import ThreeLegacyImport from './src/threejs-legacy-import';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: './example.js',
	plugins: [
        ThreeLegacyImport(),
		nodeResolve({
			jsnext: true,
			main: true
		})
	],
	targets: [
		{
			format: 'es',
			sourceMap: false,
			dest: 'build/bundle.js'
		}
	]
};
