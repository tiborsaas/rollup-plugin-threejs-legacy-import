let acorn = require("acorn"),
	path = require("path"),
	walk = require("estree-walker").walk,
	MagicString = require("magic-string");

let threeLegacyImport = function(){
	return {
		transform: function( code, filePath ) {
			const codeString = new MagicString(code);
			let transformedCode = '';
			let fileModified = false;
			let expressions = [];

			if( filePath.indexOf('legacy.js') !== -1 ) {
				fileModified = true;
				const fileName = path.basename(filePath);
				const fileNameRoot = fileName.split('.')[0];
				const ast = acorn.parse(code, {ecmaVersion: 5, preserveParens: true});

				walk(ast, {
					enter: function(node, parent) {
						if( node.type == 'MemberExpression' && node.object.name == 'THREE' ) {
							codeString.overwrite(node.start, node.end, node.property.name );

							if( !expressions.includes(node.property.name) && node.property.name !== fileNameRoot ) {
								expressions.push(node.property.name);
							}
						}
					}
				});
				const importList = expressions.join(',');
				transformedCode = `import{ ${importList} } from 'three';`;
				transformedCode += codeString.toString();
				transformedCode += `export { ${fileNameRoot} }`;
			}
			return {
				code: ( fileModified ) ? transformedCode : code
			}
		}
	}
}

export default threeLegacyImport;