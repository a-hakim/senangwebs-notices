const fs = require('node:fs');
const source = fs.readFileSync('src/types/swn.d.ts', 'utf8');
fs.writeFileSync('dist/swn.d.mts', source);
fs.writeFileSync('dist/swn.d.cts', source.replace('export default SWN;', 'export = SWN;'));
fs.writeFileSync('dist/swn.d.ts', source);
// Only the two documented stylesheets are public build artifacts.
for (const file of ['swn.esm.css', 'swn.esm.css.map', 'swn.cjs.css', 'swn.cjs.css.map']) {
  fs.rmSync('dist/' + file, { force: true });
}
