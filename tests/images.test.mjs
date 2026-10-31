import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, rm, stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {cast, castViews} from '../data/cast.js';
import {directions} from '../data/directions.js';
import {lights, grades} from '../data/studio.js';
import {imageRequests} from '../data/image-requests.js';
import {generatedAssets} from '../data/generated-assets.js';
import {writeCodexQueue} from '../scripts/codex-queue.mjs';
import {routes} from '../ui/routes.js';
import {iconNames} from '../ui/icons.js';

const root = new URL('..', import.meta.url);

test('The fictional cast is complete, diverse in build and described for prompts', () => {
  assert.equal(cast.length, 10); assert.equal(new Set(cast.map(m => m.id)).size, 10); assert.equal(castViews.length, 7);
  for (const m of cast) {
    assert.match(m.identity, /^fictional /); assert.ok(m.identity.length > 200);
    assert.ok(m.age >= 21, 'adults only'); assert.ok(m.mst >= 1 && m.mst <= 10);
    for (const d of m.bestFor) assert.ok(directions.some(x => x.id === d), `${m.id} → ${d}`);
  }
  assert.ok(cast.some(m => m.line.includes('plus')) && cast.some(m => m.age >= 40) && cast.some(m => m.line === 'Masculina'));
});

test('Art directions are complete repeatable sets', () => {
  assert.equal(directions.length, 9); assert.equal(new Set(directions.map(d => d.id)).size, 9);
  for (const d of directions) {
    assert.ok(Object.hasOwn(lights, d.light) && Object.hasOwn(grades, d.grade));
    assert.ok(d.setup.length >= 2); assert.ok(d.environment.length > 80 && d.artDirection.length > 80);
    for (const c of d.palette) assert.match(c.hex, /^#[0-9A-F]{6}$/i);
    assert.ok(cast.some(m => m.id === d.hero.castId));
  }
});

test('The image queue is unique, ordered by dependency and safe to publish', () => {
  const ids = new Set(imageRequests.map(r => r.id)), targets = new Set(imageRequests.map(r => r.target));
  assert.equal(ids.size, imageRequests.length); assert.equal(targets.size, imageRequests.length);
  assert.equal(imageRequests.length, 102);
  const byId = new Map(imageRequests.map(r => [r.id, r]));
  const rank = {P0: 0, P1: 1, P2: 2};
  imageRequests.forEach((r, i) => {
    assert.match(r.id, /^[A-Z0-9][A-Z0-9-]+$/);
    assert.match(r.target, /^assets\/[a-z0-9/-]+\.webp$/); assert.doesNotMatch(r.target, /\.\./);
    assert.equal(r.incoming, `incoming/${r.id}.png`);
    assert.ok(['1024x1536', '1536x1024'].includes(r.size));
    assert.match(r.prompt, /No text|No people/); assert.doesNotMatch(r.prompt, /undefined|NaN/);
    assert.ok(r.accept.length >= 3);
    for (const ref of r.references) assert.ok(targets.has(ref), `${r.id} references ${ref}, which is not produced by the queue`);
    for (const dep of r.dependsOn) {
      const parent = byId.get(dep);
      assert.ok(parent.wave < r.wave, `${dep} must come before ${r.id}`);
      assert.ok(rank[parent.priority] <= rank[r.priority], `${dep} must not have lower priority than ${r.id}`);
    }
    if (i) { const prev = imageRequests[i - 1]; assert.ok(rank[prev.priority] < rank[r.priority] || (prev.priority === r.priority && prev.wave <= r.wave)); }
  });
  assert.equal(imageRequests.filter(r => r.priority === 'P0').length, 44);
});

test('The Codex queue documents are generated from data', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'frame-queue-'));
  try {
    await writeCodexQueue(dir);
    const json = JSON.parse(await readFile(join(dir, 'docs/codex/fila.json'), 'utf8'));
    assert.deepEqual(json.requests.map(r => r.id), imageRequests.map(r => r.id));
    const md = await readFile(join(dir, 'docs/codex/FILA-DE-IMAGENS.md'), 'utf8');
    for (const r of imageRequests) assert.ok(md.includes(`## ${r.id}`));
  } finally { await rm(dir, {recursive: true, force: true}); }
});

test('Every registered generated image exists with its thumbnail and was requested', async () => {
  const targets = new Set(imageRequests.map(r => r.target));
  for (const [path, meta] of Object.entries(generatedAssets)) {
    assert.ok(targets.has(path) || /^assets\/projects\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/.test(path), path);
    assert.ok((await stat(new URL(path, root))).size > 0);
    assert.ok((await stat(new URL(meta.thumb, root))).size > 0);
    assert.equal(meta.upscaled, false);
  }
});

test('Navigation routes are unique and every icon exists', async () => {
  assert.equal(new Set(routes.map(r => r.id)).size, routes.length);
  for (const r of routes) assert.ok(iconNames.includes(r.icon), r.icon);
  const app = await readFile(new URL('app.js', root), 'utf8');
  const renders = app.match(/const renders=\{([^}]+)\}/)[1];
  for (const r of routes) assert.match(renders, new RegExp(`(^|,)'?${r.id}'?(:|,|$)`), `render for ${r.id}`);
  const html = await readFile(new URL('index.html', root), 'utf8');
  assert.match(html, /studio\.css/); assert.match(html, /aria-controls="sidebar"/);
});

test('Private intake folders stay out of Git and out of the published site', async () => {
  const ignore = await readFile(new URL('.gitignore', root), 'utf8');
  for (const rule of ['incoming/', 'references/*', '!references/README.md', 'private-output/']) assert.ok(ignore.includes(rule), rule);
  const build = await readFile(new URL('scripts/build.mjs', root), 'utf8');
  assert.doesNotMatch(build, /'references'|'incoming'|'private-output'/);
});
