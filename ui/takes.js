// Tomadas prontas: the ready-made 5-take sequence, explained take by take. Camera data comes from the
// Studio template; direction notes from data/takes.js; the only choice left to the person is the model.
import {movements} from '../data/content.js';
import {cast, castById} from '../data/cast.js';
import {storeModels, storeModelById} from '../data/store-models.js';
import {directionById} from '../data/directions.js';
import {compileProject, totalDuration, exportStudioText, projectSlug, shotSizes, lenses, heights, angles, actions, focusTargets, transitions, detailRegions, moveControls, isTight, metres} from '../data/studio.js';
import {takeNotes, kitRules, kitOrder, createKitProject, KIT_EXAMPLE_SLUG} from '../data/takes.js';
import {assetSrc} from '../data/image-requests.js';
import {framingSVG, planSVG, placeholderSVG} from './diagram.js';
import {openInStudio} from './studio.js';
import {icon} from './icons.js';
import {escapeHTML as esc} from './html.js';

const storageKey = 'frame-takes-cast-v1';
const DEFAULT_CAST = 'loja-a';
const pad = n => String(n).padStart(2, '0');
const validCast = id => Boolean(castById(id) || storeModelById(id));

function readCast() {
  try { const id = localStorage.getItem(storageKey); return validCast(id) ? id : DEFAULT_CAST; } catch { return DEFAULT_CAST; }
}
const talentName = id => { const m = castById(id); if (m) return `${m.code} ${m.name}`; const s = storeModelById(id); return s ? s.code : id; };

function example(n, which) {
  const path = `assets/projects/${KIT_EXAMPLE_SLUG}/s${pad(n)}-${which}.webp`;
  const src = assetSrc(path, true);
  return src ? `<img src="${esc(src)}" alt="Exemplo gerado da tomada ${n}, imagem ${which.toUpperCase()}" loading="lazy" decoding="async">` : placeholderSVG({label: `Tomada ${n} · ${which.toUpperCase()}`, id: `s${pad(n)}-${which}`});
}

function spec(c) {
  const move = movements.find(m => m.id === c.move);
  const rows = [
    ['Enquadramento', `${shotSizes[c.sizeStart].abbr} → ${shotSizes[c.sizeEnd].abbr} · ${shotSizes[c.sizeStart].label}${c.sizeStart === c.sizeEnd ? '' : ` → ${shotSizes[c.sizeEnd].label}`}`],
    ['Câmera', `${move.name}${moveControls[c.move]?.degrees ? ` · ${c.degrees}°` : ''}`],
    ['Lente', lenses[c.lens]],
    ['Altura', heights[c.height].label],
    ['Ângulo', angles[String(c.angle)]],
    ['Distância', `${metres(c.distance.start)} → ${metres(c.distance.end)}`],
    ['Ação da modelo', actions[c.action].label],
    ['Foco', isTight(c.sizeStart) ? detailRegions[c.detail].label : focusTargets[c.focus].label],
    ['Saída', transitions[c.transition].label]
  ];
  return `<dl class="take-spec">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
}

function takeMarkup(c, note) {
  const n = c.index + 1;
  const attach = c.refs.a.map(r => `<li><code>${esc(r.file)}</code><span>${esc(r.label)}</span></li>`).join('');
  return `<article class="take" id="tomada-${n}" aria-labelledby="take-${n}-title">
    <div class="take-visual">
      <div class="take-frames${c.keyB ? '' : ' single'}"><figure>${example(n, 'a')}<figcaption>A · início</figcaption></figure>${c.keyB ? `<figure>${example(n, 'b')}<figcaption>B · fim</figcaption></figure>` : ''}</div>
      <p class="take-example-note">Exemplo gerado com SC-01 Helena e um vestido fictício. A sua sequência usa a modelo e a peça escolhidas.</p>
      <div class="take-diagrams"><figure class="diagram-box">${framingSVG(c, 0, '9:16')}<figcaption>O que a lente vê</figcaption></figure><figure class="diagram-box">${planSVG(c, 1, '9:16')}<figcaption>Planta · caminho da câmera</figcaption></figure></div>
    </div>
    <div class="take-body">
      <div class="take-head"><span class="eyebrow">TOMADA ${pad(n)} · ${esc(note.role.toUpperCase())}</span><span class="take-time">${c.start}–${c.end} s</span></div>
      <h2 id="take-${n}-title">${esc(c.title)}</h2>
      <p class="take-feeling">${esc(note.feeling)}</p>
      <p>${esc(note.why)}</p>
      ${spec(c)}
      <h3>Imagens a gerar</h3>
      <ul class="take-frames-list"><li><b>A</b>${esc(note.frames.a)}</li>${c.keyB ? `<li><b>B</b>${esc(note.frames.b)}</li>` : '<li><b>B</b>Não precisa: a composição não muda nesta tomada.</li>'}</ul>
      <h3>Anexar na imagem A</h3>
      <ul class="take-attach">${attach}</ul>
      <div class="take-actions" role="group" aria-label="Prompts da tomada ${n}">
        <button type="button" class="button small" data-take-copy="${c.index}:keyA">${icon('copy')}Prompt A</button>
        ${c.keyB ? `<button type="button" class="button small" data-take-copy="${c.index}:keyB">${icon('copy')}Prompt B</button>` : ''}
        <button type="button" class="button small" data-take-copy="${c.index}:motion">${icon('copy')}Movimento</button>
        <button type="button" class="button secondary small" data-take-open="${c.index}">Produzir no Studio${icon('right')}</button>
      </div>
      <h3>Revise antes de aprovar</h3>
      <ul class="take-review">${note.review.map(r => `<li>${icon('check')}<span>${esc(r)}</span></li>`).join('')}</ul>
      <p class="take-fix"><b>Se der errado.</b> ${esc(note.fix)}</p>
    </div>
  </article>`;
}

function takesBody(castId) {
  const p = createKitProject(castId);
  const compiled = compileProject(p);
  const total = totalDuration(p);
  const strip = compiled.map(c => `<li data-grow="${c.duration}"><a href="#tomadas/${c.index + 1}"><span>${pad(c.index + 1)}</span><b>${esc(c.title)}</b><small>${c.duration} s · ${esc(movements.find(m => m.id === c.move).name.split(' /')[0])}</small></a></li>`).join('');
  return `<ol class="take-strip" aria-label="As cinco tomadas em ordem">${strip}</ol>
    <p class="take-summary">${total} s · 9:16 · ${esc(directionById(p.look.direction).name)} · modelo <b>${esc(talentName(castId))}</b></p>
    ${compiled.map(c => takeMarkup(c, takeNotes[c.index])).join('')}`;
}

export function takesMarkup() {
  const castId = readCast();
  const option = (id, label) => `<option value="${esc(id)}"${id === castId ? ' selected' : ''}>${esc(label)}</option>`;
  return `<div class="page-head"><span class="eyebrow">TOMADAS PRONTAS · SEQUÊNCIA DE 5</span><h1>Cinco tomadas. <em>Uma peça.</em></h1><p class="intro">Uma sequência profissional já configurada: enquadramento, câmera, lente, ação, duração e transição de cada tomada. Escolha a modelo; todo o resto continua coerente. Cada tomada diz o que gerar, o que anexar, o que revisar e como corrigir.</p></div>
  <section class="take-toolbar panel" aria-label="Configurar a sequência">
    <div class="field compact"><label for="take-cast">Modelo da sequência</label><select id="take-cast"><optgroup label="Modelos da loja · referência privada">${storeModels.map(m => option(m.id, `${m.code} · ${m.name}`)).join('')}</optgroup><optgroup label="Elenco fictício">${cast.map(m => option(m.id, `${m.code} ${m.name} · ${m.line}`)).join('')}</optgroup></select></div>
    <div class="take-toolbar-actions"><button type="button" class="button" id="take-open-all">Abrir as 5 tomadas no Studio${icon('right')}</button><button type="button" class="button secondary small" id="take-pack">${icon('download')}Baixar pacote</button></div>
  </section>
  <div class="take-rules"><section class="panel"><h3 class="panel-title">${icon('layers')}O que nunca muda</h3><ul class="rules">${kitRules.map(r => `<li>${esc(r)}</li>`).join('')}</ul></section><section class="panel"><h3 class="panel-title">${icon('film')}Ordem de produção</h3><ol class="take-order">${kitOrder.map(r => `<li>${esc(r)}</li>`).join('')}</ol></section></div>
  <div id="takes-body">${takesBody(castId)}</div>`;
}

export function mountTakes({section, notify, download}) {
  const main = document.querySelector('main');
  let castId = readCast();
  const body = document.querySelector('#takes-body');
  const sizeStrip = () => body.querySelectorAll('.take-strip li').forEach(li => { li.style.flexGrow = li.dataset.grow; });
  sizeStrip();
  const project = () => createKitProject(castId);
  const onChange = event => {
    if (event.target.id !== 'take-cast' || !validCast(event.target.value)) return;
    castId = event.target.value;
    try { localStorage.setItem(storageKey, castId); } catch { /* choice is per visit */ }
    body.innerHTML = takesBody(castId);
    sizeStrip();
    notify(`Sequência atualizada para ${talentName(castId)}.`);
  };
  const onClick = async event => {
    const copy = event.target.closest('[data-take-copy]');
    if (copy) {
      const [index, key] = copy.dataset.takeCopy.split(':');
      const text = compileProject(project())[Number(index)][key];
      try { await navigator.clipboard.writeText(text); notify(`Prompt copiado · tomada ${Number(index) + 1}.`); } catch { notify('Cópia indisponível. Abra a tomada no Studio e copie de lá.'); }
      return;
    }
    const open = event.target.closest('[data-take-open]');
    if (open || event.target.closest('#take-open-all')) {
      openInStudio(project(), {selected: open ? Number(open.dataset.takeOpen) : 0, label: 'abrir tomadas prontas'});
      location.hash = '#studio/4';
      return;
    }
    if (event.target.closest('#take-pack')) {
      const p = project();
      download(`${projectSlug(p)}-${castId}-pacote.txt`, exportStudioText(p));
    }
  };
  main.addEventListener('change', onChange);
  main.addEventListener('click', onClick);
  const n = Number(section);
  if (n >= 1 && n <= takeNotes.length) setTimeout(() => document.querySelector(`#tomada-${n}`)?.scrollIntoView({block: 'start', behavior: 'instant'}), 30);
  return () => { main.removeEventListener('change', onChange); main.removeEventListener('click', onClick); };
}
