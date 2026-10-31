import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
  templates, createStudioProject, validateStudio, studioIssues, parseStudio, compileShot, compileProject, shotTimeline, totalDuration,
  exportStudioText, exportCodexRequest, requiredReferences, cameraDistance, needsEndFrame, MAX_STUDIO_SHOTS, slugify
} from '../data/studio.js';
import {createProduction} from '../data/production.js';
import {stepMarkup, produceMarkup, shotProgress} from '../ui/studio.js';
import {planSVG, sideSVG, framingSVG, lightingSVG} from '../ui/diagram.js';
import {directions} from '../data/directions.js';

const clone = value => structuredClone(value);

test('Every scene template is valid and survives an export/import round trip', () => {
  for (const [id, template] of Object.entries(templates)) {
    const project = template.build();
    assert.deepEqual(studioIssues(project), [], id);
    const restored = parseStudio(JSON.stringify(validateStudio(project)));
    assert.deepEqual(restored, validateStudio(project), id);
  }
});

test('The Sarcenet showcase is a contiguous 15-second, six-shot vertical film', () => {
  const p = createStudioProject('sarcenet-capsula-seda');
  const timeline = shotTimeline(p);
  assert.equal(p.shots.length, 6); assert.equal(totalDuration(p), 15); assert.equal(p.brief.format, '9:16');
  timeline.forEach((s, i) => { assert.equal(s.end - s.start, s.duration); if (i) assert.equal(s.start, timeline[i - 1].end); });
});

test('Keyframes follow the camera: end frames exist when the composition changes and back views attach back references', () => {
  const p = createStudioProject('sarcenet-capsula-seda');
  const shots = compileProject(p);
  assert.equal(shots[0].keyB, null, 'rack focus keeps the composition');
  assert.ok(shots[1].keyB && shots[2].keyB && shots[3].keyB, 'dolly out, orbit and turn need an end frame');
  const back = shots[3].keyB;
  assert.match(back, /view from directly behind/);
  assert.match(back, /sc-01-corpo-costas\.webp/); assert.match(back, /peca-costas\.webp/);
  assert.match(back, /sarcenet-capsula-seda-s04-a\.png/, 'B frames attach their A frame for continuity');
  assert.doesNotMatch(shots[3].keyA, /corpo-costas/, 'the start frame faces the camera');
  assert.match(shots[2].motion, /arcs 30 degrees/);
  for (const c of shots) for (const text of [c.keyA, c.keyB, c.motion].filter(Boolean)) {
    assert.doesNotMatch(text, /undefined|NaN|null|\[object/);
    assert.match(text, /SHOT|KEYFRAME/);
  }
  assert.deepEqual(requiredReferences(p).sort(), ['peca-costas.webp', 'peca-detalhe.webp', 'peca-frente.webp', 'sc-01-corpo-costas.webp', 'sc-01-corpo-frente.webp', 'sc-01-rosto-frente.webp']);
});

test('Camera distance follows optics and motion direction is checked', () => {
  // Full body (2.05 m) on 50mm in a vertical frame uses the 36 mm sensor side.
  assert.ok(Math.abs(cameraDistance('fs', 50, '9:16') - 2.847) < .01);
  assert.ok(cameraDistance('cu', 85, '9:16') < cameraDistance('ms', 85, '9:16'));
  const p = createStudioProject('em-branco');
  Object.assign(p.shots[0], {move: 'dolly-in', sizeStart: 'cu', sizeEnd: 'fs'});
  assert.ok(compileShot(p, 0).warnings.some(w => /aproxima/.test(w)));
  Object.assign(p.shots[0], {move: 'orbit', degrees: 180, sizeStart: 'fs', sizeEnd: 'fs'});
  assert.ok(compileShot(p, 0).warnings.some(w => /90°/.test(w)));
  Object.assign(p.shots[0], {move: 'static', degrees: 0, action: 'still'});
  assert.equal(needsEndFrame(p.shots[0]), false);
});

test('Prompts stay gender-neutral where the cast is not', () => {
  const p = createStudioProject('sarcenet-capsula-seda');
  p.talent.castId = 'sc-08';
  for (const c of compileProject(p)) for (const text of [c.keyA, c.keyB, c.motion].filter(Boolean)) assert.doesNotMatch(text, /\b(her|she)\b/i);
});

test('Hostile or broken imports fail before replacing the draft', () => {
  assert.throws(() => parseStudio('{broken'), /JSON/);
  assert.throws(() => parseStudio(' '.repeat(131073)), /128 KB/);
  const base = validateStudio(createStudioProject());
  const cases = [
    p => { p.version = 3; },
    p => { p.brief = null; },
    p => { p.shots = []; },
    p => { p.shots = Array.from({length: MAX_STUDIO_SHOTS + 1}, () => clone(base.shots[0])); },
    p => { p.shots = Array.from({length: 13}, () => ({...clone(base.shots[0]), duration: 10})); },
    p => { p.shots[0].duration = 3.5; },
    p => { p.shots[0].duration = '3'; },
    p => { p.shots[0].move = 'teleport'; },
    p => { p.shots[0].lens = '85'; },
    p => { p.shots[0].angle = 30; },
    p => { p.brief.format = '__proto__'; },
    p => { p.product.refFront = '../../secret.png'; },
    p => { p.product.refFront = 'https://example.com/a.png'; },
    p => { p.talent.castId = 'celebrity'; },
    p => { p.talent = {castId: 'custom', customRef: '', customDescription: ''}; },
    p => { p.meta.title = 'a\u0007b'; },
    p => { p.shots[0].status = {a: 'yes'}; },
    p => { p.shots[0].status = {hack: true}; },
    p => { p.shots[0].status = []; }
  ];
  for (const mutate of cases) { const p = clone(base); mutate(p); assert.throws(() => parseStudio(JSON.stringify(p)), undefined, mutate.toString()); }
  const extra = clone(base); extra.brief.injected = '<script>'; extra.shots[0].extra = 1; extra.__proto__polluted = true;
  const clean = parseStudio(JSON.stringify(extra));
  assert.equal(Object.hasOwn(clean.brief, 'injected'), false); assert.equal(Object.hasOwn(clean.shots[0], 'extra'), false);
  assert.equal({}.polluted, undefined);
});

test('Plans from the previous planner migrate into the Studio', () => {
  const legacy = createProduction();
  const migrated = parseStudio(JSON.stringify(legacy));
  assert.equal(migrated.version, 2);
  assert.equal(migrated.shots.length, legacy.shots.length);
  assert.equal(totalDuration(migrated), legacy.shots.reduce((n, s) => n + s.duration, 0));
  assert.equal(migrated.product.refFront, legacy.brief.reference);
  assert.equal(migrated.talent.castId, 'none');
});

test('Exports list every shot, every keyframe destination and no placeholders', () => {
  const p = createStudioProject();
  const text = exportStudioText(p);
  for (const s of p.shots) assert.ok(text.includes(s.title));
  assert.doesNotMatch(text, /undefined|NaN/);
  const codex = exportCodexRequest(p);
  assert.match(codex, /incoming\/projects\/sarcenet-capsula-seda\/s01-a\.png/);
  assert.match(codex, /assets\/projects\/sarcenet-capsula-seda\/s04-b\.webp/);
  assert.equal((codex.match(/^## \d{2}[AB] · /gm) || []).length, compileProject(p).reduce((n, c) => n + (c.keyB ? 2 : 1), 0));
  assert.equal(slugify('Ação · Verão 2027!'), 'acao-verao-2027');
});

test('Studio markup escapes every user-controlled field', () => {
  const p = createStudioProject();
  const attack = '"><img src=x onerror=alert(1)>';
  Object.assign(p.meta, {title: attack}); Object.assign(p.brief, {brand: attack, message: attack});
  Object.assign(p.product, {name: attack, details: attack}); p.look.environment = attack; p.shots[0].title = attack; p.shots[0].intent = attack;
  for (let n = 1; n <= 5; n++) assert.doesNotMatch(stepMarkup(n, p), /<img src=x/, `step ${n}`);
  assert.match(stepMarkup(4, p), /produce-steps/);
  for (let i = 0; i < p.shots.length; i++) assert.doesNotMatch(produceMarkup(p, compileShot(p, i)), /<img src=x/, `produce ${i}`);
});

test('Each keyframe lists the references to attach, and they match the prompt exactly', () => {
  for (const template of Object.values(templates)) {
    const p = template.build();
    for (const c of compileProject(p)) for (const [which, prompt] of [['a', c.keyA], ['b', c.keyB]]) {
      if (!prompt) { assert.equal(c.refs[which], null); continue; }
      const line = prompt.split('\n').find(l => l.startsWith('Attach and follow: '));
      assert.equal(line, `Attach and follow: ${c.refs[which].map(r => r.file).join(', ')}.`);
      for (const r of c.refs[which]) {
        assert.ok(['cast', 'store', 'product', 'keyframe', 'custom'].includes(r.kind) && r.label && r.role);
        if (r.path !== null) assert.match(r.path, /^assets\/[a-z0-9/._ -]+$/i);
      }
    }
  }
  const back = compileShot(createStudioProject('sarcenet-capsula-seda'), 3).refs.b;
  assert.deepEqual(back.find(r => r.file === 'sc-01-corpo-costas.webp'), {file: 'sc-01-corpo-costas.webp', kind: 'cast', role: 'body-back', label: 'SC-01 Helena · corpo inteiro · costas', path: 'assets/cast/sc-01/corpo-costas.webp'});
  assert.equal(back.at(-1).kind, 'keyframe');
});

test('Production progress is stored per shot, survives export and counts library keyframes as done', () => {
  const p = createStudioProject('sarcenet-capsula-seda');
  assert.deepEqual(validateStudio(p).shots[0].status, {a: false, b: false, clip: false});
  p.shots[3].status = {clip: true};
  const restored = parseStudio(JSON.stringify(validateStudio(p)));
  assert.deepEqual(restored.shots[3].status, {a: false, b: false, clip: true});
  const prog = shotProgress(restored, compileShot(restored, 3));
  assert.equal(prog.total, 3);
  assert.equal(prog.done, 3, 'both keyframes of the showcase are in the library and the clip was marked');
  const blank = createStudioProject('em-branco');
  const fresh = shotProgress(blank, compileShot(blank, 0));
  assert.equal(fresh.done, 0); assert.ok(fresh.list.every(x => !x.library));
});

test('Camera diagrams render finite geometry for every template, shot and progress', () => {
  for (const template of Object.values(templates)) {
    const p = template.build();
    for (const c of compileProject(p)) for (const t of [0, .5, 1]) {
      for (const svg of [planSVG(c, t, p.brief.format), sideSVG(c, t), framingSVG(c, t, p.brief.format)]) {
        assert.match(svg, /^<svg/); assert.doesNotMatch(svg, /NaN|Infinity|undefined/);
      }
    }
  }
  for (const d of directions) assert.doesNotMatch(lightingSVG(d), /NaN|undefined/);
});

test('Ultra close-ups land on a garment region, attach the detail photo and keep the face out', () => {
  const p = createStudioProject('sarcenet-ultra-close');
  const glide = compileShot(p, 0);
  assert.equal(glide.sizeStart, 'macro');
  assert.match(glide.keyA, /true macro of the fabric/);
  assert.match(glide.keyA, /filled by the fabric surface/);
  assert.match(glide.keyA, /Macro optics/);
  assert.match(glide.keyA, /about 13 cm from the fabric/, 'macro distance on 100mm in 9:16');
  assert.match(glide.motion, /glides slowly sideways/);
  assert.ok(glide.refs.a.some(r => r.role === 'garment-detail'));
  assert.ok(!glide.refs.a.some(r => r.role === 'identity'), 'no face reference in a fabric close-up');
  assert.match(compileShot(p, 1).motion, /arcs 30 degrees clockwise around the neckline/);
  assert.match(compileShot(p, 3).motion, /turns 30 degrees very slowly in place so the light sweeps across the fabric/);
  assert.match(compileShot(p, 5).keyA, /Image 1 \(sarcenet-modelo-a-rosto\.png\) = identity only/);
  for (const c of compileProject(p)) assert.deepEqual(c.warnings, [], c.title);
});

test('Close-ups without evidence are flagged instead of invented', () => {
  const p = createStudioProject('sarcenet-ultra-close');
  p.product.refDetail = '';
  const c = compileShot(p, 0);
  assert.ok(c.warnings.some(w => /sem foto de detalhe/.test(w)));
  assert.match(c.keyA, /There is no close-up reference of this detail/);
  Object.assign(p.shots[3], {degrees: 90});
  assert.ok(compileShot(p, 3).warnings.some(w => /acima de 45°/.test(w)));
  Object.assign(p.shots[5], {sizeStart: 'ecu', sizeEnd: 'fs'});
  assert.ok(compileShot(p, 5).warnings.some(w => /Salto de escala/.test(w)));
  Object.assign(p.shots[2], {action: 'walk'});
  assert.ok(compileShot(p, 2).warnings.some(w => /a modelo fica parada/.test(w)));
});

test('Store models are valid talent, private references and old projects gain a detail region', () => {
  const p = validateStudio(createStudioProject('sarcenet-anuncio'));
  p.talent.castId = 'loja-07';
  const parsed = parseStudio(JSON.stringify(p));
  assert.match(compileShot(parsed, 0).keyA, /LOJA-07, an adult woman/);
  assert.ok(compileShot(parsed, 0).refs.a.every(r => r.kind !== 'store' || r.path === null), 'store images are never served by the site');
  const legacy = structuredClone(p); legacy.shots.forEach(s => delete s.detail);
  assert.equal(parseStudio(JSON.stringify(legacy)).shots[0].detail, 'fabric');
  for (const bad of ['loja-99', 'loja-', 'LOJA-01']) { const x = structuredClone(p); x.talent.castId = bad; assert.throws(() => parseStudio(JSON.stringify(x))); }
  const wrongDetail = structuredClone(p); wrongDetail.shots[0].detail = 'navel';
  assert.throws(() => parseStudio(JSON.stringify(wrongDetail)), /região do detalhe/);
});

test('Prompts follow the store realism rules', () => {
  for (const template of Object.values(templates)) for (const c of compileProject(template.build())) for (const text of [c.keyA, c.keyB, c.motion].filter(Boolean)) {
    assert.doesNotMatch(text, /\b(luxury|premium|cinematic)\b/i);
    assert.doesNotMatch(text, /softbox|octabox|tripod stand/i);
  }
  const p = createStudioProject('sarcenet-anuncio');
  assert.match(compileShot(p, 0).motion, /real time \(no slow motion\)/);
  assert.match(compileShot(p, 0).keyA, /never mirrored/);
});
