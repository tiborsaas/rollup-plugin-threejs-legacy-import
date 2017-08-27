# Three.js legacy import (Rollup plugin)

This is a Rollup plugin to transform Three.js legacy files in the examples folder to ES6 modules. This repo exists because Three.js is mostly refactored to use ES6 modules, but there are tons of goodies in the [examples folder](https://github.com/mrdoob/three.js/tree/dev/examples/js) which still use the ES5 style `THREE` object namespace.

# Installation

Install the plugin via NPM:

`npm install rollup-plugin-threejs-legacy-import`

# Options

## explicitExports (optional)
If the `explicitExports` key is set in the config object, then the exported variable will be overwritten and it will generate the variable names as set in the array. By default it exports the name of the file.
 
`export { GPUParticleSystem, GPUParticleContainer }`

See example config below.

# Usage

## Step 1
In your Rollup config file, import it and add it to the plugin list:

```javascript
import ThreeLegacyImport from 'rollup-plugin-threejs-legacy-import';

const options = {
	explicitExports: { 
		'GPUParticleSystem': ['GPUParticleSystem', 'GPUParticleContainer'] 
	}
}

export default {
    entry: './application.js',
    plugins: [
        ThreeLegacyImport(options), // <-- this is the juice, the rest is boilerplate
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

## Step 2

Rename your legacy files as `filename.legacy.js`

For example in order to import and transform `OrbitControls.js` rename it to `OrbitControls.legacy.js`

# License

MIT