const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'swn-package-'));

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

try {
  const packed = JSON.parse(run(process.execPath, [process.env.npm_execpath, 'pack', '--ignore-scripts', '--json', '--pack-destination', temp]))[0];
  const files = packed.files.map(file => file.path);
  for (const file of ['LICENSE.md', 'README.md', 'dist/swn.js', 'dist/swn.min.js', 'dist/swn.mjs', 'dist/swn.cjs', 'dist/swn.css', 'dist/swn.min.css', 'dist/swn.d.mts', 'dist/swn.d.cts']) assert.ok(files.includes(file), `Missing ${file}`);
  assert.ok(files.every(file => !file.startsWith('src/') && !file.startsWith('node_modules/') && !file.startsWith('tests/')));
  run('tar', ['-xf', path.join(temp, packed.filename), '-C', temp]);
  fs.mkdirSync(path.join(temp, 'node_modules'));
  fs.renameSync(path.join(temp, 'package'), path.join(temp, 'node_modules', 'senangwebs-notices'));
  fs.copyFileSync('tests/package/consumer.mts', path.join(temp, 'consumer.mts'));
  fs.copyFileSync('tests/package/consumer.cts', path.join(temp, 'consumer.cts'));
  fs.writeFileSync(path.join(temp, 'ssr.cjs'), `
    const assert = require('node:assert/strict');
    const SWN = require('senangwebs-notices');
    const instance = new SWN({ bgOpacity: 0 });
    assert.equal(instance.openCount, 0);
    assert.equal(instance.options.bgOpacity, 0);
    instance.destroy(); instance.uninstall();
    for (const file of ['senangwebs-notices/style.css', 'senangwebs-notices/dist/swn.css', 'senangwebs-notices/dist/swn.min.css']) assert.ok(require.resolve(file));
    for (const file of ['senangwebs-notices/dist/swn.js', 'senangwebs-notices/dist/swn.min.js']) assert.equal(typeof require(file), 'function');
    instance.show('SSR').then(() => { process.exitCode = 1; }, error => assert.match(error.message, /browser document/));
    assert.throws(() => instance.install(), /browser document/);
  `);
  fs.writeFileSync(path.join(temp, 'ssr.mjs'), `
    import assert from 'node:assert/strict';
    import SWN from 'senangwebs-notices';
    assert.equal(typeof SWN, 'function');
    const instance = new SWN();
    await assert.rejects(instance.show('SSR'), /browser document/);
  `);
  run(process.execPath, [path.join(temp, 'ssr.cjs')]);
  run(process.execPath, [path.join(temp, 'ssr.mjs')]);
  fs.writeFileSync(path.join(temp, 'tsconfig.json'), JSON.stringify({ compilerOptions: { module: 'NodeNext', moduleResolution: 'NodeNext', target: 'ES2022', strict: true, noEmit: true, types: [], lib: ['ES2022', 'DOM'] }, files: ['consumer.mts', 'consumer.cts'] }));
  run(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', path.join(temp, 'tsconfig.json')]);
  console.log(`Packed-package ESM, CommonJS, SSR, CSS, legacy bundles and TypeScript passed (${packed.entryCount} files).`);
} finally {
  assert.equal(path.dirname(path.resolve(temp)), path.resolve(os.tmpdir()), 'Refusing cleanup outside the temporary directory.');
  assert.ok(path.basename(temp).startsWith('swn-package-'), 'Refusing cleanup of an unrelated directory.');
  fs.rmSync(temp, { recursive: true, force: true });
}
