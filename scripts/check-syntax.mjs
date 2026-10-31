import {readdir} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {execFileSync} from 'node:child_process';

// Parses every first-party module without executing it, so a syntax error in a
// file the tests never import still fails the check.
const root = resolve(import.meta.dirname, '..');
const files = ['app.js'];
for (const dir of ['data', 'ui', 'scripts']) {
  for (const name of await readdir(resolve(root, dir))) if (['.js', '.mjs'].includes(extname(name))) files.push(`${dir}/${name}`);
}
for (const file of files) execFileSync(process.execPath, ['--check', resolve(root, file)], {stdio: 'inherit'});
console.log(`Syntax OK: ${files.length} modules.`);
