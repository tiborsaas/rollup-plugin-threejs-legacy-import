# Three.js legacy loader

This is a Rollup plugin to transform Three.js legacy files in the examples folder to ES6 modules. This repo exists because Three.js is now mostly operating via ES6 modules, but there are tons of goodies in the [examples folder](https://github.com/mrdoob/three.js/tree/dev/examples/js). 

# Usage

## Step 1
Install the plugin via `npm install rollup-plugin-threejs-legacy-importer`

## Step 2
In your Rollup config file, import it and add it to the plugin list:

```javascript
import ThreeLegacyImport from './rollup-three-legacy';

export default {
	entry: './application.js',
	plugins: [
    ThreeLegacyImport(),
		babel({
			compact: true,
			presets: [
				['es2015', {modules: false}]
			]
		}),
		nodeResolve({
			jsnext: true,
			main: true
		}),
	],
	targets: [
		{
			format: 'es',
			sourceMap: false,
			dest: 'build/bundle.js'
		}
	]
};
```

## Step 3

Rename your legacy files as `filename.legacy.js`

For example in order to import and transform `OrbitControls.js` rename it to `OrbitControls.legacy.js`

