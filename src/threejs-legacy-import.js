let acorn = require("acorn"),
	path = require("path"),
	walk = require("estree-walker").walk,
	MagicString = require("magic-string");

let threeLegacyImport = function( options ){
	options = Object.assign( {}, options );

	return {
		transform: function( code, filePath ) {
			const codeString = new MagicString(code);
			let transformedCode = '';
			let fileModified = false;
			let expressions = [];

			if( filePath.indexOf('legacy.js') !== -1 ) {
				fileModified = true;
				let firstModuleNameOccurance = true;
				const fileName = path.basename(filePath);
				const fileNameRoot = fileName.split('.')[0];
				const ast = acorn.parse(code, {ecmaVersion: 5, preserveParens: true});

				walk(ast, {
					enter: function(node, parent) {
						if( node.type == 'MemberExpression' && node.object.name == 'THREE' ) {
							let replaceExpression = node.property.name;
							if ( node.property.name === fileNameRoot && firstModuleNameOccurance ) {
								firstModuleNameOccurance = false;
								replaceExpression = `const ${ replaceExpression }`; 
							}
							codeString.overwrite(node.start, node.end, replaceExpression );

							if( !expressions.includes(node.property.name) && node.property.name !== fileNameRoot ) {
								expressions.push(node.property.name);
							}
						}
					}
				});
				const importList = expressions.join(',');
				transformedCode = `import{ ${importList} } from 'three';`;
				transformedCode += codeString.toString();
				let exportString = fileNameRoot;

				if( typeof options.explicitExports !== 'undefined' ) {
					if( Object.keys(options.explicitExports).includes( fileNameRoot ) ) {
						exportString = options.explicitExports[fileNameRoot].join(',');
					}
				}
				transformedCode += `export { ${exportString} }`;
			}
			return {
				name: 'Three.js legacy import',
				code: ( fileModified ) ? transformedCode : code,
			}
		}
	}
}

module.exports = threeLegacyImport;