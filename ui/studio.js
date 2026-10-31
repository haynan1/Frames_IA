import {movements} from '../data/content.js';
import {cast, castById, castAssetPath} from '../data/cast.js';
import {directions, directionById, directionAssetPath} from '../data/directions.js';
import {brandPresets} from '../data/brand.js';
import {
  templates, createStudioProject, studioIssues, validateStudio, parseStudio, migrateProduction, compileShot, compileProject, totalDuration,
  exportStudioText, exportCodexRequest, projectReferences, keyframeAsset, projectSlug, metres,
  shotSizes, lenses, heights, angles, degreeOptions, actions, focusTargets, speeds, transitions, formats, objectives, verticals, categories, fabrics, lights, grades,
  moveControls, MAX_STUDIO_SHOTS, MAX_STUDIO_BYTES, detailRegions, isTight
} from '../data/studio.js';
import {storeModels, storeModelById, STORE_REF_DIR} from '../data/store-models.js';
import {assetSrc, isGenerated} from '../data/image-requests.js';
import {planSVG, sideSVG, framingSVG, placeholderSVG, lightingSVG} from './diagram.js';
import {icon} from './icons.js';
import {escapeHTML as esc} from './html.js';

const storageKey = 'frame-studio-v2';
const legacyKey = 'frame-production-v1';
const steps = [
  {n: 1, label: 'Briefing', title: 'O que esta cena precisa dizer.', help: 'Marca, objetivo, formato e mensagem orientam cada decisão seguinte. Nada aqui vai para dentro da imagem: logo e textos entram na edição.', paths: ['meta', 'brief']},
  {n: 2, label: 'Peça & elenco', title: 'O que vestimos e quem veste.', help: 'Descreva a construção real da peça em inglês, como ela é: decote, fechos, costuras, comprimento. É isso que mantém a peça idêntica em todos os frames.', paths: ['product', 'talent']},
  {n: 3, label: 'Cenário & luz', title: 'Onde a história acontece.', help: 'Escolha uma direção de arte para preencher cenário, luz e cor de uma vez. Ajuste o texto depois, se precisar.', paths: ['look']},
  {n: 4, label: 'Sequência', title: 'Tomada por tomada.', help: 'Escolha uma tomada na linha do tempo, ajuste o plano à esquerda e veja a câmera se mover. Embaixo, o painel Produzir diz o que anexar, qual prompt copiar e onde marcar o que já ficou pronto.', paths: ['shots']},
  {n: 5, label: 'Entrega', title: 'Leve a direção para a produção.', help: 'Confira o progresso e as pendências, baixe as referências e o pacote. Para gerar todas as imagens de uma vez, envie o pedido ao Codex.', paths: []}
];
const STAGES = [
  ['studio', 'Monte a cena', 'Etapas 1 a 4: peça, modelo, cenário e cada tomada. Toda escolha reescreve os prompts na hora.'],
  ['camera', 'Gere as imagens', 'No painel Produzir de cada tomada: baixe as referências, anexe no ChatGPT (ou outra ferramenta de imagem) e cole o prompt.'],
  ['video', 'Anime as tomadas', 'Leve a imagem inicial, e a final quando houver, a uma ferramenta de vídeo junto com o prompt de movimento.'],
  ['film', 'Monte o filme', 'Junte os clipes na ordem da Entrega, no CapCut ou no Premiere. Texto, logo e música entram aqui.']
];
const howtoKey = 'frame-howto-v1';
const SECTION = /^(meta|brief|product|talent|look)$/;

let state = null;

const fieldId = path => `f-${path.replace(/[^a-z0-9]+/gi, '-')}`;
const options = (map, value) => Object.entries(map).map(([k, v]) => `<option value="${esc(k)}"${String(k) === String(value) ? ' selected' : ''}>${esc(typeof v === 'string' ? v : v.label)}</option>`).join('');
const hintIds = (id, hint) => `${hint ? `${id}-hint ` : ''}${id}-err`;
function field({label, path, value, max = 200, hint = '', large = false, en = false, type = 'text', attrs = '', shot = false}) {
  const id = fieldId(path);
  const data = shot ? `data-shot-field="${esc(path.split('.').pop())}"` : `data-path="${esc(path)}"`;
  const control = large
    ? `<textarea id="${id}" ${data} maxlength="${max}" aria-describedby="${hintIds(id, hint)}" spellcheck="${en ? 'false' : 'true'}">${esc(value)}</textarea>`
    : `<input id="${id}" ${data} type="${type}" value="${esc(value)}" ${type === 'text' ? `maxlength="${max}"` : ''} aria-describedby="${hintIds(id, hint)}" ${attrs}>`;
  return `<div class="field${large ? ' full-width' : ''}"><label for="${id}">${esc(label)}${en ? ' <abbr class="lang" title="Escreva em inglês: vai direto para o prompt">EN</abbr>' : ''}</label>${control}${hint ? `<small class="hint" id="${id}-hint">${esc(hint)}</small>` : ''}<small class="field-err" id="${id}-err" hidden></small></div>`;
}
function select({label, path, value, map, hint = '', shot = false, extra = ''}) {
  const id = fieldId(path);
  const data = shot ? `data-shot-field="${esc(path.split('.').pop())}"` : `data-path="${esc(path)}"`;
  return `<div class="field${extra}"><label for="${id}">${esc(label)}</label><select id="${id}" ${data} aria-describedby="${hintIds(id, hint)}">${options(map, value)}</select>${hint ? `<small class="hint" id="${id}-hint">${esc(hint)}</small>` : ''}<small class="field-err" id="${id}-err" hidden></small></div>`;
}
const image = (path, label, {ratio = '2:3', person = true, id = '', thumb = true} = {}) => {
  const src = assetSrc(path, thumb);
  return src ? `<img src="${esc(src)}" alt="${esc(label)}" loading="lazy" decoding="async">` : placeholderSVG({label, id: id || path.split('/').slice(-2).join('/'), ratio, person});
};
const swatches = palette => `<div class="swatches">${palette.map(c => `<span class="swatch"><svg viewBox="0 0 20 20" aria-hidden="true"><rect width="20" height="20" rx="4" fill="${esc(c.hex)}"/></svg>${esc(c.name)}<small>${esc(c.hex)}</small></span>`).join('')}</div>`;

function getPath(obj, path) { return path.split('.').reduce((o, k) => o?.[k], obj); }
function setPath(obj, path, value) {
  const keys = path.split('.');
  if (!SECTION.test(keys[0]) || keys.length !== 2 || keys.some(k => k === '__proto__' || k === 'constructor' || k === 'prototype')) return;
  obj[keys[0]][keys[1]] = value;
}

// ---------- markup ----------
export function studioMarkup(section) {
  return `<section class="studio" aria-labelledby="studio-title"><header class="studio-head"><div><span class="eyebrow">STUDIO DE CENAS</span><h1 id="studio-title">Construa a cena.</h1><p class="studio-sub" id="studio-sub"></p></div><div class="studio-tools"><div class="field compact"><label for="template-select">Modelo de cena</label><select id="template-select">${Object.entries(templates).map(([id, t]) => `<option value="${id}">${esc(t.label)}</option>`).join('')}</select></div><button type="button" class="button secondary small" id="apply-template">Aplicar modelo</button><button type="button" class="button secondary small" id="import-studio">${icon('upload')}Importar</button><button type="button" class="button secondary small" id="export-studio">${icon('download')}Exportar .json</button><input type="file" id="studio-file" accept=".json,application/json" hidden></div></header><details class="howto" id="howto" open><summary><span class="howto-label">COMO FUNCIONA</span><span class="howto-line">O FRAME escreve a direção e os prompts. As imagens e os vídeos você gera nas suas ferramentas.</span>${icon('right')}</summary><ol class="howto-steps">${STAGES.map(([ic, title, body], i) => `<li><span class="howto-n">${String(i + 1).padStart(2, '0')}</span>${icon(ic)}<b>${title}</b><p>${body}</p></li>`).join('')}</ol><p class="howto-note">Nada sai do seu navegador: o rascunho fica salvo aqui e o site não cobra créditos. Para gerar tudo de uma vez, a Entrega tem um pedido pronto para o Codex.</p></details><ol class="stepper" aria-label="Etapas da construção">${steps.map(s => `<li><button type="button" data-step="${s.n}"><span class="step-n">${String(s.n).padStart(2, '0')}</span><span class="step-l">${s.label}</span><span class="step-state" data-step-state="${s.n}" aria-hidden="true"></span><span class="sr-only" data-step-sr="${s.n}"></span></button></li>`).join('')}</ol><div class="studio-statusbar"><p id="studio-status" role="status"></p><button type="button" class="text-button" id="undo-studio" hidden></button></div><p id="studio-error" class="studio-error" role="alert" hidden></p><div id="studio-step" class="studio-step" data-initial="${esc(section || '')}"></div><nav class="step-nav" aria-label="Navegar entre etapas"><button type="button" class="button secondary small" id="prev-step">${icon('left')}Etapa anterior</button><span id="step-count" class="step-count"></span><button type="button" class="button small" id="next-step">Próxima etapa${icon('right')}</button></nav></section>`;
}

function stepHead(s) {
  return `<div class="step-head"><span class="eyebrow">ETAPA ${String(s.n).padStart(2, '0')} / 05</span><h2>${s.title}</h2><p>${s.help}</p></div>`;
}

function briefStep(p) {
  const preset = brandPresets[p.brief.brandPreset] || null;
  return `${stepHead(steps[0])}<div class="studio-split"><div class="panel"><div class="form-grid">${field({label: 'Nome do projeto', path: 'meta.title', value: p.meta.title, max: 100, hint: 'Também define o nome dos arquivos de keyframe.'})}${select({label: 'Perfil de marca', path: 'brief.brandPreset', value: p.brief.brandPreset, map: {...Object.fromEntries(Object.entries(brandPresets).map(([k, v]) => [k, v.label])), custom: 'Personalizado'}, hint: 'Trocar o perfil aplica direção, modelo e formato sugeridos (com desfazer).'})}${field({label: 'Marca', path: 'brief.brand', value: p.brief.brand, max: 60})}${select({label: 'Objetivo', path: 'brief.objective', value: p.brief.objective, map: objectives})}</div><fieldset class="format-picker"><legend>Formato de entrega</legend><div class="choice-row">${Object.entries(formats).map(([k, f]) => `<label class="choice format-choice"><input type="radio" name="format" value="${k}" data-path="brief.format"${p.brief.format === k ? ' checked' : ''}><span class="choice-body"><span class="ratio ratio-${k.replace(':', '-')}" aria-hidden="true"></span><b>${k}</b><small>${esc(f.label.split('· ')[1])}</small></span></label>`).join('')}</div></fieldset><div class="form-grid">${field({label: 'Mensagem central', path: 'brief.message', value: p.brief.message, max: 600, large: true, hint: 'O que o espectador precisa sentir ou entender. Sem prometer resultados.'})}${field({label: 'Público', path: 'brief.audience', value: p.brief.audience, max: 300})}${field({label: 'CTA na edição', path: 'brief.cta', value: p.brief.cta, max: 120, hint: 'Texto aplicado na montagem, nunca gerado na imagem.'})}</div></div><aside class="panel brand-panel" aria-label="Perfil de marca">${preset ? `<span class="badge">${p.brief.brandPreset === 'sarcenet' ? 'MANUAL DA LOJA · 31.10' : 'PERFIL'}</span><h3>${esc(preset.name)}</h3><p class="muted">${esc(preset.segment)}</p><p>${esc(preset.origin)}</p><h4>Tom</h4><div class="tags">${preset.tone.map(t => `<span>${esc(t)}</span>`).join('')}</div><h4>Paleta</h4>${swatches(preset.palette)}<h4>Regras</h4><ul class="rules">${preset.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul><p class="note">${esc(preset.status)}</p>` : '<h3>Perfil personalizado</h3><p>Defina marca, tom e regras no briefing. A direção e o elenco são escolhidos nas próximas etapas.</p>'}</aside></div>`;
}

function castChoice(m, selected) {
  return `<label class="choice cast-choice"><input type="radio" name="talent" value="${m.id}" data-path="talent.castId"${selected === m.id ? ' checked' : ''}><span class="choice-body"><span class="choice-media">${image(castAssetPath(m.id, 'rosto-frente'), `${m.code} ${m.name}, rosto frontal`, {id: m.code})}</span><span class="choice-text"><b>${m.code} · ${esc(m.name)}</b><small>${m.age} anos · ${m.height.toFixed(2).replace('.', ',')} m · ${esc(m.size)}</small><small>${esc(m.line)}</small></span></span></label>`;
}

function productStep(p) {
  const slug = projectSlug(p);
  const refs = ['refFront', 'refBack', 'refDetail'].map(k => p.product[k]).filter(Boolean);
  const refPreview = refs.map(name => { const src = assetSrc(`assets/projects/${slug}/${name}`, true); return src ? `<figure><img src="${esc(src)}" alt="Referência ${esc(name)}" loading="lazy"><figcaption>${esc(name)}</figcaption></figure>` : ''; }).join('');
  const model = castById(p.talent.castId);
  const store = storeModelById(p.talent.castId);
  return `${stepHead(steps[1])}<div class="studio-split"><div class="panel"><h3 class="panel-title">${icon('layers')}A peça</h3><div class="form-grid">${select({label: 'Categoria do projeto', path: 'product.vertical', value: p.product.vertical, map: verticals})}${field({label: 'Nome da peça', path: 'product.name', value: p.product.name, max: 120})}${select({label: 'Tipo', path: 'product.category', value: p.product.category, map: categories})}${field({label: 'Cor', path: 'product.color', value: p.product.color, max: 60, en: true, hint: 'Ex.: champagne, deep olive, off-white.'})}${select({label: 'Material', path: 'product.fabric', value: p.product.fabric, map: fabrics, hint: fabrics[p.product.fabric]?.behavior ? `Comportamento no prompt: ${fabrics[p.product.fabric].behavior}.` : ''})}${field({label: 'Construção exata da peça', path: 'product.details', value: p.product.details, max: 800, large: true, en: true, hint: 'Decote, alças, fechos, botões, costuras, barra e comprimento. Diga também o que NÃO existe (no logo, no print).'})}${field({label: 'Referência frontal', path: 'product.refFront', value: p.product.refFront, max: 100, hint: 'Nome do arquivo que você vai anexar. Obrigatório.'})}${field({label: 'Referência de costas', path: 'product.refBack', value: p.product.refBack, max: 100, hint: 'Necessária quando a cena mostra as costas.'})}${field({label: 'Referência de detalhe', path: 'product.refDetail', value: p.product.refDetail, max: 100, hint: 'Usada nos planos detalhe.'})}</div>${refPreview ? `<div class="ref-strip">${refPreview}</div>` : ''}</div><div class="panel"><h3 class="panel-title">${icon('cast')}Elenco</h3><p class="muted">Modelos fictícias com ficha de identidade. Cada uma tem vistas de referência na fila de imagens.</p><div class="cast-picker" role="radiogroup" aria-label="Modelo da cena">${cast.map(m => castChoice(m, p.talent.castId)).join('')}<label class="choice cast-choice"><input type="radio" name="talent" value="none" data-path="talent.castId"${p.talent.castId === 'none' ? ' checked' : ''}><span class="choice-body choice-plain"><b>Sem modelo</b><small>Produto ou peça em manequim invisível.</small></span></label><label class="choice cast-choice"><input type="radio" name="talent" value="custom" data-path="talent.castId"${p.talent.castId === 'custom' ? ' checked' : ''}><span class="choice-body choice-plain"><b>Modelo própria</b><small>Referência privada, com autorização.</small></span></label></div><details class="store-group"${storeModelById(p.talent.castId) ? ' open' : ''}><summary>Modelos da loja · MODELO-A e 20 fichas</summary><p class="muted">Referência privada: as imagens não vão para o site. Gere os recortes com <code>npm run modelos</code> e anexe os arquivos de <code>${STORE_REF_DIR}/</code> que o painel Produzir pedir.</p><div class="cast-picker store-picker" role="radiogroup" aria-label="Modelos da loja">${storeModels.map(m => `<label class="choice cast-choice"><input type="radio" name="talent" value="${m.id}" data-path="talent.castId"${p.talent.castId === m.id ? ' checked' : ''}><span class="choice-body choice-plain"><b>${esc(m.code)}</b><small>${esc(m.look)}</small></span></label>`).join('')}</div></details>${p.talent.castId === 'custom' ? `<div class="form-grid">${field({label: 'Arquivo de referência da modelo', path: 'talent.customRef', value: p.talent.customRef, max: 100, hint: 'Mantenha o arquivo em references/ (fora do Git). Use somente com autorização registrada.'})}${field({label: 'Descrição da modelo', path: 'talent.customDescription', value: p.talent.customDescription, max: 600, large: true, en: true, hint: 'Idade aparente, pele, rosto, cabelo, altura. Sem nomes reais.'})}</div>` : ''}${store ? `<div class="cast-summary"><b>${esc(store.code)}</b><span>${esc(store.look)}</span><span>${esc(store.source)}</span></div>` : ''}${model ? `<div class="cast-summary"><b>${model.code} ${esc(model.name)}</b><span>${model.traits.map(esc).join(' · ')}</span><a class="text-link" href="#elenco/${model.id}">Abrir ficha ↗</a></div>` : ''}</div></div>`;
}

function lookStep(p) {
  const d = directionById(p.look.direction);
  return `${stepHead(steps[2])}<div class="direction-picker" role="radiogroup" aria-label="Direção de arte">${directions.map(x => `<label class="choice direction-choice"><input type="radio" name="direction" value="${x.id}" data-path="look.direction"${p.look.direction === x.id ? ' checked' : ''}><span class="choice-body"><span class="choice-media">${image(directionAssetPath(x.id, 'hero'), `${x.name}: imagem-chave`, {id: x.id})}</span><span class="choice-text"><b>${esc(x.name)}</b><small>${esc(x.tagline)}</small></span></span></label>`).join('')}<label class="choice direction-choice"><input type="radio" name="direction" value="custom" data-path="look.direction"${p.look.direction === 'custom' ? ' checked' : ''}><span class="choice-body choice-plain"><b>Personalizada</b><small>Descreva cenário e luz livremente.</small></span></label></div><div class="studio-split"><div class="panel"><div class="form-grid">${field({label: 'Cenário', path: 'look.environment', value: p.look.environment, max: 600, large: true, en: true, hint: 'Lugar, materiais, objetos e espaço livre. Sem marcas e sem texto legível.'})}${select({label: 'Luz', path: 'look.light', value: p.look.light, map: lights})}${select({label: 'Cor / grade', path: 'look.grade', value: p.look.grade, map: grades})}</div></div><aside class="panel">${d ? `<span class="eyebrow">PLANTA DE LUZ</span><h3>${esc(d.name)}</h3><div class="diagram-box">${lightingSVG(d)}</div><ol class="light-legend">${d.setup.map(l => `<li><b>${esc(l.label)}</b> · ${esc(l.modifier)}</li>`).join('')}</ol>${swatches(d.palette)}<p class="muted">${esc(d.lens)} · ${esc(d.exposure)}</p><p class="note">Evite: ${esc(d.avoid)}</p>` : '<h3>Direção personalizada</h3><p>Descreva o cenário e escolha luz e cor. Use as direções prontas como referência de linguagem.</p>'}</aside></div>`;
}

function sequenceStep(p) {
  return `${stepHead(steps[3])}<div class="seq-toolbar"><p class="seq-total" id="seq-total"></p><div class="seq-actions" role="group" aria-label="Organizar tomadas"><button type="button" class="icon-text" id="shot-add">${icon('plus')}Adicionar</button><button type="button" class="icon-text" id="shot-duplicate">${icon('duplicate')}Duplicar</button><button type="button" class="icon-text" id="shot-left">${icon('left')}Mover antes</button><button type="button" class="icon-text" id="shot-right">${icon('right')}Mover depois</button><button type="button" class="icon-text danger" id="shot-remove">${icon('trash')}Remover</button></div></div><div class="track-wrap"><ol class="track" id="track" aria-label="Linha do tempo: escolha uma tomada"></ol><div class="ruler" id="ruler" aria-hidden="true"></div></div><div class="seq-grid"><form class="panel inspector" id="inspector" aria-label="Tomada selecionada"></form><section class="panel preview" aria-label="Pré-visualização da câmera"><div class="preview-head"><h3>Câmera</h3><p id="preview-readout" class="readout"></p></div><div class="preview-grid"><figure class="diagram-box"><div id="framing-svg"></div><figcaption>O que a lente vê</figcaption></figure><figure class="diagram-box"><div id="plan-svg"></div><figcaption>Planta · vista de cima</figcaption></figure><figure class="diagram-box wide"><div id="side-svg"></div><figcaption>Lateral · altura da câmera</figcaption></figure></div><div class="scrub"><button type="button" class="button secondary small" id="play-shot">${icon('play')}<span>Reproduzir</span></button><label class="sr-only" for="shot-progress">Progresso da tomada</label><input type="range" id="shot-progress" min="0" max="100" value="0"><output id="shot-time" for="shot-progress">0,0s</output></div><ul class="warnings" id="shot-warnings"></ul></section><section class="panel produce" id="produce" aria-labelledby="produce-title"></section></div>`;
}

// ---------- production guide ----------
const pad2 = i => String(i + 1).padStart(2, '0');
const progressDots = prog => `<span class="prog-dots" aria-hidden="true">${prog.list.map(x => `<i data-on="${x.done}"></i>`).join('')}</span>`;

/** Checkpoints of one compiled shot. A keyframe already ingested into the site counts as done. */
export function shotProgress(p, c) {
  const status = p.shots[c.index].status || {};
  const frame = (key, label) => { const library = isGenerated(keyframeAsset(p, c.index, key)); return {key, label, library, done: library || status[key] === true}; };
  const list = [frame('a', 'Imagem inicial'), ...(c.keyB ? [frame('b', 'Imagem final')] : []), {key: 'clip', label: 'Clipe', library: false, done: status.clip === true}];
  return {list, done: list.filter(x => x.done).length, total: list.length};
}

function refCard(r) {
  const full = r.path && assetSrc(r.path);
  const thumb = r.path && assetSrc(r.path, true);
  const note = {product: 'Use a sua foto da peça, salva com este nome.', keyframe: 'A imagem que você gerou no passo 1.', custom: 'Arquivo privado, fora do site.', store: `Arquivo privado em ${STORE_REF_DIR}/ (npm run modelos).`, cast: 'Referência ainda não gerada.'}[r.kind];
  // The library stores WebP; name the download so the extension tells the truth.
  const saveAs = r.file.replace(/\.(png|jpe?g)$/i, '.webp');
  return `<li class="ref-card"><span class="ref-media">${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy" decoding="async">` : icon(r.kind === 'keyframe' ? 'film' : r.kind === 'cast' || r.kind === 'store' ? 'cast' : 'camera')}</span><span class="ref-text"><b>${esc(r.label)}</b><code>${esc(r.file)}</code>${full ? '' : `<small>${esc(note)}</small>`}</span>${full ? `<a class="icon-text ref-get" href="${esc(full)}" download="${esc(saveAs)}" aria-label="Baixar ${esc(r.label)}">${icon('download')}<span>Baixar</span></a>` : ''}</li>`;
}

function promptBlock(key, label, text) {
  return `<div class="prompt-row"><button type="button" class="button small" data-copy-prompt="${key}">${icon('copy')}Copiar ${label}</button><details class="prompt-peek" data-peek="${key}"><summary>Ver o texto</summary><label class="sr-only" for="prompt-${key}">${label}</label><textarea id="prompt-${key}" readonly spellcheck="false">${esc(text)}</textarea></details></div>`;
}

/** Step-by-step guide that turns one compiled shot into images and a clip. Pure; used by the UI and by tests. */
export function produceMarkup(p, c) {
  const prog = shotProgress(p, c);
  const item = key => prog.list.find(x => x.key === key);
  const n = pad2(c.index);
  const slug = projectSlug(p);
  const check = it => it.library
    ? `<p class="done-flag">${icon('check')}Já está no acervo do site</p>`
    : `<label class="done-check"><input type="checkbox" data-progress="${it.key}"${it.done ? ' checked' : ''}><span>${it.key === 'clip' ? 'Clipe aprovado' : 'Imagem aprovada'}</span></label>`;
  const result = which => `<figure class="produce-result">${image(keyframeAsset(p, c.index, which), `Keyframe ${which.toUpperCase()} da tomada ${c.index + 1}`, {id: `s${n}-${which}`})}<figcaption>Salve como<code>${esc(c.files[which])}</code></figcaption></figure>`;
  const step = (num, it, title, tool, body) => `<li class="produce-step" data-done="${it.done}"><div class="produce-step-head"><span class="produce-n" aria-hidden="true">${it.done ? icon('check') : num}</span><div><h4>${title}</h4><span class="produce-tool">${tool}</span></div></div>${body}${check(it)}</li>`;
  const imageTool = 'ChatGPT ou outra ferramenta de imagem';
  const steps = [
    step(1, item('a'), 'Gere a imagem inicial', imageTool, `<p>Abra um chat novo e anexe ${c.refs.a.length === 1 ? 'esta imagem' : `estas ${c.refs.a.length} imagens`}:</p><ul class="ref-cards">${c.refs.a.map(refCard).join('')}</ul><p>Cole o prompt e peça uma única imagem ${esc(p.brief.format)}.</p>${promptBlock('keyA', 'prompt A', c.keyA)}${result('a')}`),
    ...(c.keyB ? [step(2, item('b'), 'Gere a imagem final', imageTool, `<p>A câmera ou a modelo mudam durante a tomada, então o vídeo precisa saber onde termina. Num chat novo, anexe:</p><ul class="ref-cards">${c.refs.b.map(refCard).join('')}</ul>${promptBlock('keyB', 'prompt B', c.keyB)}${result('b')}`)] : []),
    step(c.keyB ? 3 : 2, item('clip'), 'Anime a tomada', 'Ferramenta de vídeo · Kling, Runway, Veo…', `<p>${c.keyB ? 'Use o modo <b>primeiro e último quadro</b>: a imagem inicial no começo e a final no fim.' : 'Envie a imagem inicial como <b>primeiro quadro</b>.'} Cole o prompt de movimento e configure <b>${c.duration} s</b> em <b>${esc(p.brief.format)}</b>.</p><div class="clip-frames">${result('a')}${c.keyB ? `${icon('arrow')}${result('b')}` : ''}</div>${promptBlock('motion', 'prompt de movimento', c.motion)}<p class="produce-save">Salve o clipe como <code>${esc(`${slug}-s${n}.mp4`)}</code>. Confira o início, o meio e o fim antes de aprovar: rosto, peça e luz precisam continuar iguais.</p>`)
  ];
  const next = p.shots[c.index + 1];
  return `<header class="produce-head"><div><span class="eyebrow">PRODUZIR · TOMADA ${n} DE ${pad2(p.shots.length - 1)}</span><h3 id="produce-title">${esc(c.title)}</h3><p class="muted">${c.duration} s · ${prog.total} passos. Siga na ordem; cada passo usa o resultado do anterior.</p></div><div class="produce-meter" role="img" aria-label="${prog.done} de ${prog.total} passos feitos">${progressDots(prog)}<span>${prog.done}/${prog.total}</span></div></header>${c.warnings.length ? `<p class="produce-warn">${icon('alert')}Antes de gerar, revise ${c.warnings.length === 1 ? 'o ponto de atenção' : `os ${c.warnings.length} pontos de atenção`} da câmera, acima.</p>` : ''}<ol class="produce-steps">${steps.join('')}</ol><footer class="produce-foot">${next ? `<button type="button" class="button secondary small" data-next-shot="${c.index + 1}">Próxima tomada: ${esc(next.title)}${icon('right')}</button>` : `<button type="button" class="button small" data-step="5">Ir para a entrega${icon('right')}</button>`}</footer>`;
}

function inspectorMarkup(p, i) {
  const s = p.shots[i];
  const ctl = moveControls[s.move] || {};
  const moveMap = Object.fromEntries(movements.map(m => [m.id, `${m.name} · ${m.group}`]));
  const path = key => `shots.${i}.${key}`;
  return `<div class="inspector-head"><span class="eyebrow">TOMADA ${String(i + 1).padStart(2, '0')}</span><a class="text-link" href="#camera/${esc(s.move)}">Ver operação no atlas ↗</a></div><fieldset><legend>Intenção</legend><div class="form-grid">${field({label: 'Título', path: path('title'), value: s.title, max: 80, shot: true})}${field({label: 'Duração (s)', path: path('duration'), value: s.duration, type: 'number', attrs: 'min="2" max="10" step="1" inputmode="numeric"', shot: true, hint: '2 a 10 segundos por tomada.'})}${field({label: 'O que o espectador percebe', path: path('intent'), value: s.intent, max: 400, large: true, shot: true})}</div></fieldset><fieldset><legend>Plano</legend><div class="form-grid">${select({label: 'Enquadramento inicial', path: path('sizeStart'), value: s.sizeStart, map: Object.fromEntries(Object.entries(shotSizes).map(([k, v]) => [k, `${v.abbr} · ${v.label}`])), shot: true})}${select({label: 'Enquadramento final', path: path('sizeEnd'), value: s.sizeEnd, map: Object.fromEntries(Object.entries(shotSizes).map(([k, v]) => [k, `${v.abbr} · ${v.label}`])), shot: true})}${select({label: 'Ângulo', path: path('angle'), value: s.angle, map: angles, shot: true})}${select({label: 'Foco', path: path('focus'), value: s.focus, map: focusTargets, shot: true})}${isTight(s.sizeStart) || isTight(s.sizeEnd) || s.focus === 'detail' ? select({label: 'Região do detalhe', path: path('detail'), value: s.detail || 'fabric', map: detailRegions, shot: true, extra: ' full-width', hint: 'Onde o plano fechado pousa na peça. Macro e plano detalhe só ficam fiéis com a foto de detalhe da etapa 2.'}) : ''}</div></fieldset><fieldset><legend>Câmera</legend><div class="form-grid">${select({label: 'Operação', path: path('move'), value: s.move, map: moveMap, shot: true, extra: ' full-width'})}${ctl.degrees ? select({label: s.move === 'turntable' ? 'Giro do sujeito' : 'Graus do movimento', path: path('degrees'), value: s.degrees, map: Object.fromEntries(degreeOptions.map(d => [d, `${d}°`])), shot: true}) : ''}${select({label: 'Lente', path: path('lens'), value: s.lens, map: lenses, shot: true})}${select({label: ctl.heightEnd ? 'Altura inicial' : 'Altura da câmera', path: path('height'), value: s.height, map: heights, shot: true})}${ctl.heightEnd ? select({label: 'Altura final', path: path('heightEnd'), value: s.heightEnd, map: heights, shot: true}) : ''}${select({label: 'Ritmo', path: path('speed'), value: s.speed, map: speeds, shot: true})}</div></fieldset><fieldset><legend>Ação & montagem</legend><div class="form-grid">${select({label: 'Ação do sujeito', path: path('action'), value: s.action, map: actions, shot: true})}${select({label: 'Transição para a próxima', path: path('transition'), value: s.transition, map: transitions, shot: true})}</div></fieldset>`;
}

function deliveryStep(p, issues) {
  const valid = !issues.length;
  const compiled = valid ? compileProject(p) : [];
  const keyframes = compiled.reduce((n, c) => n + 1 + (c.keyB ? 1 : 0), 0);
  const warnings = compiled.flatMap(c => c.warnings.map(w => ({shot: c.index, w})));
  const progress = compiled.map(c => shotProgress(p, c));
  const done = progress.reduce((n, x) => n + x.done, 0), total = progress.reduce((n, x) => n + x.total, 0);
  const refs = valid ? projectReferences(p) : [];
  return `${stepHead(steps[4])}<div class="delivery-stats"><div><strong>${totalDuration(p)}s</strong><span>DURAÇÃO</span></div><div><strong>${p.shots.length}</strong><span>TOMADAS</span></div><div><strong>${valid ? keyframes : '—'}</strong><span>KEYFRAMES</span></div><div><strong>${valid ? refs.length : '—'}</strong><span>REFERÊNCIAS</span></div><div><strong>${valid ? `${done}/${total}` : '—'}</strong><span>PASSOS FEITOS</span></div></div><div class="studio-split"><section class="panel"><h3 class="panel-title">${icon(valid ? 'check' : 'alert')}${valid ? 'Pronto para produzir' : 'Pendências que bloqueiam a entrega'}</h3>${valid ? '' : `<ul class="issue-list">${issues.map(x => `<li><button type="button" class="text-button" data-goto-path="${esc(x.path)}">${esc(x.message)}</button></li>`).join('')}</ul>`}${warnings.length ? `<h4>Pontos de atenção</h4><ul class="issue-list warn">${warnings.map(x => `<li><button type="button" class="text-button" data-goto-shot="${x.shot}">Tomada ${x.shot + 1}: ${esc(x.w)}</button></li>`).join('')}</ul>` : valid ? '<p class="muted">Nenhum ponto de atenção nas tomadas.</p>' : ''}${valid ? `<h4>Referências do filme</h4><p class="muted">Baixe uma vez e reaproveite em todas as tomadas. O painel Produzir de cada tomada diz quais anexar.</p><ul class="ref-cards">${refs.map(refCard).join('')}</ul>` : ''}</section><section class="panel"><div class="tabs" role="tablist" aria-label="Formato de saída"><button type="button" role="tab" id="out-pack" aria-controls="out-panel" aria-selected="true" data-out="pack">Pacote de produção</button><button type="button" role="tab" id="out-codex" aria-controls="out-panel" aria-selected="false" data-out="codex">Pedido para o Codex</button><button type="button" role="tab" id="out-json" aria-controls="out-panel" aria-selected="false" data-out="json">Projeto .json</button></div><div id="out-panel" role="tabpanel" aria-labelledby="out-pack"><p class="muted" id="out-context"></p><label class="sr-only" for="out-text">Saída</label><textarea id="out-text" readonly spellcheck="false"></textarea><div class="actions"><button type="button" class="button small" id="out-copy"${valid ? '' : ' disabled'}>${icon('copy')}Copiar</button><button type="button" class="button secondary small" id="out-download"${valid ? '' : ' disabled'}>${icon('download')}Baixar arquivo</button></div></div></section></div>${valid ? `<div class="table-wrap"><table><caption class="sr-only">Shot list</caption><thead><tr><th scope="col">#</th><th scope="col">Tempo</th><th scope="col">Tomada</th><th scope="col">Plano</th><th scope="col">Câmera</th><th scope="col">Distância</th><th scope="col">Ação</th><th scope="col">Keyframes</th><th scope="col">Produção</th></tr></thead><tbody>${compiled.map((c, i) => `<tr><td>${c.index + 1}</td><td>${c.start}–${c.end}s</td><td>${esc(c.title)}</td><td>${shotSizes[c.sizeStart].abbr} → ${shotSizes[c.sizeEnd].abbr}</td><td>${esc(movements.find(m => m.id === c.move).name)}${moveControls[c.move]?.degrees ? ` ${c.degrees}°` : ''} · ${c.lens}mm</td><td>${metres(c.distance.start)} → ${metres(c.distance.end)}</td><td>${esc(actions[c.action].label)}</td><td>${c.keyB ? 'A + B' : 'A'}</td><td><button type="button" class="text-button prog-cell" data-goto-shot="${c.index}">${progressDots(progress[i])}${progress[i].done}/${progress[i].total}<span class="sr-only"> passos feitos. Abrir a tomada ${c.index + 1}</span></button></td></tr>`).join('')}</tbody></table></div>` : ''}`;
}

/** Pure markup of one step for a project; used by the UI and by tests. */
export function stepMarkup(n, p) {
  return n === 1 ? briefStep(p) : n === 2 ? productStep(p) : n === 3 ? lookStep(p) : n === 4 ? sequenceStep(p) + inspectorMarkup(p, 0) + (studioIssues(p).length ? '' : produceMarkup(p, compileShot(p, 0))) :deliveryStep(p, studioIssues(p));
}

// ---------- behaviour ----------
export function mountStudio({section, notify, download}) {
  const root = document.querySelector('.studio');
  const stepBox = document.querySelector('#studio-step');
  const status = document.querySelector('#studio-status');
  const errorBox = document.querySelector('#studio-error');
  const undoButton = document.querySelector('#undo-studio');
  let disposed = false, frame = 0, playing = false, storageOk = true;

  if (!state) {
    state = {project: null, step: 1, selected: 0, t: 0, outTab: 'pack', undo: null};
    let note = '';
    try {
      const saved = localStorage.getItem(storageKey);
      const legacy = localStorage.getItem(legacyKey);
      if (saved) state.project = parseStudio(saved);
      else if (legacy) { state.project = migrateProduction(JSON.parse(legacy)); note = 'Seu plano de produção anterior foi convertido para o Studio.'; }
    } catch {
      try { const raw = localStorage.getItem(storageKey); if (raw) localStorage.setItem(`${storageKey}-backup`, raw); } catch { storageOk = false; }
      note = 'O rascunho salvo não pôde ser lido. Uma cópia foi preservada e o modelo Sarcenet foi aberto.';
    }
    state.project ||= createStudioProject();
    if (note) setTimeout(() => !disposed && notify(note), 50);
  }
  const requested = Number(section);
  if (requested >= 1 && requested <= 5) state.step = requested;
  state.selected = Math.min(state.selected, state.project.shots.length - 1);

  const project = () => state.project;
  function snapshot(label) { state.undo = {label, project: structuredClone(state.project), step: state.step, selected: state.selected}; undoButton.hidden = false; undoButton.textContent = `Desfazer: ${label}`; }
  undoButton.addEventListener('click', () => {
    if (!state.undo) return;
    Object.assign(state, {project: state.undo.project, step: state.undo.step, selected: state.undo.selected, undo: null});
    undoButton.hidden = true; render(); notify('Alteração desfeita.');
  });

  function persist(valid) {
    if (!storageOk) { status.textContent = 'O navegador não permite salvar. Exporte o projeto para guardar.'; return; }
    if (!valid) { status.textContent = 'Há campos pendentes. A última versão válida continua salva neste navegador.'; return; }
    try { localStorage.setItem(storageKey, JSON.stringify(valid)); status.textContent = 'Rascunho salvo neste navegador. Exporte o .json para guardar uma cópia.'; }
    catch { storageOk = false; status.textContent = 'O navegador não permite salvar. Exporte o projeto para guardar.'; }
  }

  function updateChrome(issues) {
    const p = project();
    document.querySelector('#studio-title').textContent = p.meta.title || 'Construa a cena.';
    document.querySelector('#studio-sub').textContent = `${p.brief.brand || 'Marca'} · ${objectives[p.brief.objective] || ''} · ${p.brief.format} · ${totalDuration(p)}s · ${p.shots.length} ${p.shots.length === 1 ? 'tomada' : 'tomadas'}`;
    for (const s of steps) {
      const bad = s.paths.length ? issues.filter(x => s.paths.some(prefix => x.path === prefix || x.path.startsWith(`${prefix}.`))).length : issues.length;
      const el = document.querySelector(`[data-step-state="${s.n}"]`);
      el.textContent = bad ? String(bad) : '✓';
      el.dataset.ok = String(!bad);
      document.querySelector(`[data-step-sr="${s.n}"]`).textContent = bad ? `, ${bad} pendência${bad > 1 ? 's' : ''}` : ', completa';
      const button = document.querySelector(`[data-step="${s.n}"]`);
      if (s.n === state.step) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
    }
    document.querySelector('#step-count').textContent = `Etapa ${state.step} de 5`;
    document.querySelector('#prev-step').disabled = state.step === 1;
    const next = document.querySelector('#next-step');
    next.hidden = state.step === 5;
    document.querySelectorAll('[data-path],[data-shot-field]').forEach(el => {
      const path = el.dataset.path || `shots.${state.selected}.${el.dataset.shotField}`;
      const issue = issues.find(x => x.path === path);
      const err = document.getElementById(`${el.id}-err`);
      if (el.type === 'radio') return;
      el.setAttribute('aria-invalid', String(Boolean(issue)));
      if (err) { err.hidden = !issue; err.textContent = issue ? issue.message : ''; }
    });
  }

  // ----- sequence views -----
  function trackMarkup() {
    const p = project();
    const valid = !studioIssues(p).length;
    return p.shots.map((s, i) => {
      const c = valid ? compileShot(p, i) : null;
      const warn = c?.warnings.length;
      const prog = c && shotProgress(p, c);
      return `<li><button type="button" class="track-shot" data-select-shot="${i}" aria-pressed="${i === state.selected}" aria-label="Tomada ${i + 1}: ${esc(s.title)}, ${s.duration} segundos${warn ? `, ${warn} ponto${warn > 1 ? 's' : ''} de atenção` : ''}${prog ? `, ${prog.done} de ${prog.total} passos de produção feitos` : ''}">${prog ? progressDots(prog) : ''}<span class="track-n">${String(i + 1).padStart(2, '0')}</span><span class="track-title">${esc(s.title)}</span><span class="track-meta">${shotSizes[s.sizeStart]?.abbr || '?'}→${shotSizes[s.sizeEnd]?.abbr || '?'} · ${esc(movements.find(m => m.id === s.move)?.name || '')}</span><span class="track-dur">${Number.isInteger(s.duration) ? s.duration : '?'}s${warn ? ' <span class="warn-dot" aria-hidden="true"></span>' : ''}</span></button></li>`;
    }).join('');
  }
  function renderTrack() {
    const track = document.querySelector('#track');
    if (!track) return;
    track.innerHTML = trackMarkup();
    const p = project();
    [...track.children].forEach((li, i) => { li.style.flexGrow = String(Math.max(2, Number(p.shots[i].duration) || 2)); });
    const total = totalDuration(p);
    const ruler = document.querySelector('#ruler');
    ruler.innerHTML = Array.from({length: total + 1}, (_, s) => `<span${s % 5 === 0 ? ' class="major"' : ''}>${s % 5 === 0 ? `${s}s` : ''}</span>`).join('');
    document.querySelector('#seq-total').innerHTML = `<strong>${total}s</strong> · ${p.shots.length} ${p.shots.length === 1 ? 'tomada' : 'tomadas'} · ${p.brief.format}`;
    document.querySelector('#shot-add').disabled = p.shots.length >= MAX_STUDIO_SHOTS;
    document.querySelector('#shot-duplicate').disabled = p.shots.length >= MAX_STUDIO_SHOTS;
    document.querySelector('#shot-remove').disabled = p.shots.length <= 1;
    document.querySelector('#shot-left').disabled = state.selected === 0;
    document.querySelector('#shot-right').disabled = state.selected === p.shots.length - 1;
  }
  function renderInspector(focusSelector) {
    const form = document.querySelector('#inspector');
    if (!form) return;
    form.innerHTML = inspectorMarkup(project(), state.selected);
    if (focusSelector) form.querySelector(focusSelector)?.focus();
  }
  function renderPreview(compiled) {
    const p = project();
    if (!document.querySelector('#plan-svg')) return null;
    if (compiled) { drawPreview(p, compiled); return compiled; }
    const issues = studioIssues(p);
    const box = ['#framing-svg', '#plan-svg', '#side-svg'];
    if (issues.some(x => x.path.startsWith(`shots.${state.selected}`) || !x.path.startsWith('shots'))) {
      box.forEach(sel => { document.querySelector(sel).innerHTML = '<p class="diagram-empty">Corrija os campos pendentes para ver a câmera.</p>'; });
      document.querySelector('#preview-readout').textContent = '';
      document.querySelector('#shot-warnings').innerHTML = '';
      return null;
    }
    const c = compileShot(p, state.selected);
    drawPreview(p, c);
    return c;
  }
  // Drawing only: playback reuses one compiled shot instead of recompiling prompts every frame.
  function drawPreview(p, c) {
    document.querySelector('#framing-svg').innerHTML = framingSVG(c, state.t, p.brief.format);
    document.querySelector('#plan-svg').innerHTML = planSVG(c, state.t, p.brief.format);
    document.querySelector('#side-svg').innerHTML = sideSVG(c, state.t);
    document.querySelector('#preview-readout').textContent = `${metres(c.distance.start)} → ${metres(c.distance.end)} · ${c.lens}mm · ${shotSizes[state.t < .5 ? c.sizeStart : c.sizeEnd].aperture}`;
    document.querySelector('#shot-time').value = `${(state.t * c.duration).toFixed(1).replace('.', ',')}s`;
    document.querySelector('#shot-progress').value = String(Math.round(state.t * 100));
    document.querySelector('#shot-warnings').innerHTML = c.warnings.map(w => `<li>${icon('alert')}<span>${esc(w)}</span></li>`).join('');
  }
  // The guide re-renders on every edit; keep open prompt panels and the focused control so typing elsewhere never collapses it.
  function renderOutputs() {
    const p = project();
    const box = document.querySelector('#produce');
    if (!box) return;
    if (studioIssues(p).length) {
      box.innerHTML = '<h3 id="produce-title" class="panel-title">Produzir</h3><p class="muted">O passo a passo de produção aparece quando todas as etapas estiverem completas. Os números vermelhos no topo mostram onde falta preencher.</p>';
      return;
    }
    const open = new Set([...box.querySelectorAll('details[open]')].map(d => d.dataset.peek));
    const active = box.contains(document.activeElement) ? document.activeElement : null;
    const focusKey = active && (active.dataset.progress ? `[data-progress="${active.dataset.progress}"]` : active.dataset.copyPrompt ? `[data-copy-prompt="${active.dataset.copyPrompt}"]` : null);
    box.innerHTML = produceMarkup(p, compileShot(p, state.selected));
    box.querySelectorAll('details[data-peek]').forEach(d => { d.open = open.has(d.dataset.peek); });
    if (focusKey) box.querySelector(focusKey)?.focus({preventScroll: true});
  }
  function deliveryOutput() {
    const p = project();
    const textarea = document.querySelector('#out-text');
    if (!textarea) return;
    const issues = studioIssues(p);
    document.querySelectorAll('[data-out]').forEach(b => { const on = b.dataset.out === state.outTab; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    document.querySelector('#out-panel').setAttribute('aria-labelledby', `out-${state.outTab}`);
    if (issues.length) { textarea.value = ''; document.querySelector('#out-context').textContent = 'Resolva as pendências para gerar as saídas.'; return; }
    const valid = validateStudio(p);
    textarea.value = state.outTab === 'pack' ? exportStudioText(valid) : state.outTab === 'codex' ? exportCodexRequest(valid) : JSON.stringify(valid, null, 2);
    document.querySelector('#out-context').textContent = {
      pack: 'Briefing, shot list, distâncias, keyframes e movimento de cada tomada, em texto.',
      codex: 'Markdown para o Codex gerar os keyframes desta cena. Salve em docs/codex/pedidos/ ou cole na conversa.',
      json: 'Projeto completo para importar depois. Não inclui imagens.'
    }[state.outTab];
  }

  function refreshLive() {
    const issues = studioIssues(project());
    updateChrome(issues);
    persist(issues.length ? null : validateStudio(project()));
    if (state.step === 4) { renderTrack(); renderPreview(); renderOutputs(); }
    if (state.step === 5) deliveryOutput();
  }

  function render(focusSelector) {
    stop();
    const p = project();
    stepBox.innerHTML = state.step === 4 ? sequenceStep(p) : stepMarkup(state.step, p);
    if (state.step === 4) { renderInspector(); }
    history.replaceState(null, '', `#studio/${state.step}`);
    refreshLive();
    if (focusSelector) stepBox.querySelector(focusSelector)?.focus();
  }

  function goStep(n, focus = true) {
    state.step = Math.max(1, Math.min(5, n));
    render();
    if (focus) { stepBox.querySelector('.step-head h2')?.setAttribute('tabindex', '-1'); stepBox.querySelector('.step-head h2')?.focus({preventScroll: true}); root.scrollIntoView({block: 'start', behavior: 'instant'}); }
  }

  function applyBrandPreset(key) {
    const preset = brandPresets[key];
    if (!preset) return;
    const p = project();
    p.brief.brand = preset.name;
    p.brief.format = preset.defaults.format;
    p.brief.objective = preset.defaults.objective;
    p.talent.castId = preset.defaults.castId;
    applyDirection(preset.defaults.direction);
    if (key === 'product') { p.product.vertical = 'product'; p.shots.forEach(s => { s.action = 'object'; if (s.focus === 'face') s.focus = 'product'; }); }
  }
  function applyDirection(id) {
    const d = directionById(id);
    if (!d) { project().look.direction = 'custom'; return; }
    Object.assign(project().look, {direction: d.id, environment: d.environment, light: d.light, grade: d.grade});
  }

  function onInput(event) {
    const el = event.target;
    if (!(el instanceof HTMLElement)) return;
    const p = project();
    if (el.dataset.progress) {
      if (event.type !== 'change') return;
      const s = p.shots[state.selected];
      s.status = {...s.status, [el.dataset.progress]: el.checked};
      refreshLive();
      const prog = shotProgress(p, compileShot(p, state.selected));
      notify(prog.done === prog.total ? `Tomada ${state.selected + 1} completa.` : `${prog.done} de ${prog.total} passos da tomada ${state.selected + 1} feitos.`);
      return;
    }
    if (el.dataset.path) {
      const value = el.value;
      if (event.type === 'change' && el.dataset.path === 'brief.brandPreset') {
        snapshot('perfil de marca'); p.brief.brandPreset = value; applyBrandPreset(value);
        notify(value === 'custom' ? 'Perfil personalizado. Mantivemos as escolhas atuais.' : `Padrões de ${brandPresets[value].name} aplicados: direção, modelo e formato.`);
        render(`#${fieldId('brief.brandPreset')}`); return;
      }
      if (event.type === 'change' && el.dataset.path === 'look.direction') {
        snapshot('direção de arte'); applyDirection(value);
        notify(value === 'custom' ? 'Direção personalizada: descreva cenário e luz.' : `Direção ${directionById(value).name} aplicada a cenário, luz e cor.`);
        render(`input[name="direction"][value="${value}"]`); return;
      }
      setPath(p, el.dataset.path, value);
      if (event.type === 'change' && (el.dataset.path === 'talent.castId' || el.dataset.path === 'product.fabric' || el.dataset.path === 'brief.format')) { render(el.type === 'radio' ? `input[name="${el.name}"][value="${value}"]` : `#${el.id}`); return; }
      refreshLive();
      return;
    }
    if (el.dataset.shotField) {
      stop();
      const key = el.dataset.shotField;
      const s = p.shots[state.selected];
      const numeric = ['duration', 'degrees', 'lens', 'angle'].includes(key);
      s[key] = numeric ? (el.value === '' ? NaN : Number(el.value)) : el.value;
      if (key === 'move' && event.type === 'change') {
        if (moveControls[s.move]?.degrees && !s.degrees) s.degrees = s.move === 'turntable' ? 90 : 30;
        if (moveControls[s.move]?.heightEnd && s.heightEnd === s.height) s.heightEnd = s.move === 'crane' ? 'high' : 'eye';
        if (!moveControls[s.move]?.degrees) s.degrees = 0;
        if (!moveControls[s.move]?.heightEnd) s.heightEnd = s.height;
        renderInspector(`#${el.id}`);
      }
      if (key === 'height' && !moveControls[s.move]?.heightEnd) s.heightEnd = s.height;
      // The detail control appears with close sizes or a detail focus.
      if (event.type === 'change' && ['sizeStart', 'sizeEnd', 'focus'].includes(key)) renderInspector(`#${el.id}`);
      refreshLive();
    }
  }

  function selectShot(i, focus = false) {
    state.selected = Math.max(0, Math.min(project().shots.length - 1, i));
    state.t = 0;
    stop();
    renderInspector();
    refreshLive();
    if (focus) document.querySelector(`[data-select-shot="${state.selected}"]`)?.focus();
  }

  function shotOperation(kind) {
    const p = project();
    const i = state.selected;
    // New shots start unproduced: progress belongs to the images of the original shot.
    if (kind === 'add' && p.shots.length < MAX_STUDIO_SHOTS) { p.shots.splice(i + 1, 0, {...structuredClone(p.shots[i]), title: 'Nova tomada', intent: 'Descreva o que o espectador precisa perceber.', move: 'static', degrees: 0, action: p.talent.castId === 'none' ? 'object' : 'still', duration: 3, status: {}}); selectShot(i + 1, true); notify('Tomada adicionada depois da selecionada.'); }
    if (kind === 'duplicate' && p.shots.length < MAX_STUDIO_SHOTS) { p.shots.splice(i + 1, 0, {...structuredClone(p.shots[i]), title: `${p.shots[i].title} (cópia)`.slice(0, 80), status: {}}); selectShot(i + 1, true); notify('Tomada duplicada.'); }
    if (kind === 'left' && i > 0) { [p.shots[i - 1], p.shots[i]] = [p.shots[i], p.shots[i - 1]]; selectShot(i - 1, true); }
    if (kind === 'right' && i < p.shots.length - 1) { [p.shots[i + 1], p.shots[i]] = [p.shots[i], p.shots[i + 1]]; selectShot(i + 1, true); }
    if (kind === 'remove' && p.shots.length > 1) { snapshot(`remover “${p.shots[i].title}”`); p.shots.splice(i, 1); selectShot(Math.min(i, p.shots.length - 1), true); notify('Tomada removida. Use Desfazer para restaurar.'); }
  }

  function stop() {
    cancelAnimationFrame(frame); playing = false;
    const play = document.querySelector('#play-shot');
    if (play) play.innerHTML = `${icon('play')}<span>Reproduzir</span>`;
  }
  function play() {
    if (playing) { stop(); return; }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { notify('Movimento reduzido ativo. Use o controle de progresso para percorrer a tomada.'); return; }
    const duration = (project().shots[state.selected].duration || 3) * 1000;
    if (state.t >= 1) state.t = 0;
    const startedAt = performance.now() - state.t * duration;
    const compiled = renderPreview();
    if (!compiled) return;
    playing = true;
    document.querySelector('#play-shot').innerHTML = `${icon('pause')}<span>Pausar</span>`;
    const tick = now => {
      if (disposed) return;
      state.t = Math.min(1, (now - startedAt) / duration);
      renderPreview(compiled);
      if (state.t < 1) frame = requestAnimationFrame(tick); else stop();
    };
    frame = requestAnimationFrame(tick);
  }

  async function copyText(text, message) {
    try { await navigator.clipboard.writeText(text); if (!disposed) notify(message); }
    catch { if (!disposed) notify('Cópia indisponível. Selecione o texto ou baixe o arquivo.'); }
  }

  function onClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const stepButton = target.closest('[data-step]');
    if (stepButton) { goStep(Number(stepButton.dataset.step)); return; }
    const shotButton = target.closest('[data-select-shot]');
    if (shotButton) { selectShot(Number(shotButton.dataset.selectShot)); return; }
    const op = target.closest('#shot-add,#shot-duplicate,#shot-left,#shot-right,#shot-remove');
    if (op) { shotOperation(op.id.slice(5)); return; }
    const copyPrompt = target.closest('[data-copy-prompt]');
    if (copyPrompt) { copyText(document.querySelector(`#prompt-${copyPrompt.dataset.copyPrompt}`).value, 'Prompt copiado. Cole na ferramenta junto com as referências.'); return; }
    const nextShot = target.closest('[data-next-shot]');
    if (nextShot) { selectShot(Number(nextShot.dataset.nextShot)); document.querySelector('.track-wrap')?.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); document.querySelector(`[data-select-shot="${state.selected}"]`)?.focus({preventScroll: true}); return; }
    const out = target.closest('[data-out]');
    if (out) { state.outTab = out.dataset.out; deliveryOutput(); out.focus(); return; }
    const gotoPath = target.closest('[data-goto-path]');
    if (gotoPath) {
      const path = gotoPath.dataset.gotoPath;
      const shot = path.match(/^shots\.(\d+)/);
      const n = shot ? 4 : steps.find(s => s.paths.some(prefix => path.startsWith(prefix)))?.n || 1;
      if (shot) state.selected = Number(shot[1]);
      goStep(n, false);
      const el = shot ? document.querySelector(`[data-shot-field="${path.split('.')[2]}"]`) : document.querySelector(`[data-path="${path}"]`);
      el?.focus();
      return;
    }
    const gotoShot = target.closest('[data-goto-shot]');
    if (gotoShot) { state.selected = Number(gotoShot.dataset.gotoShot); goStep(4, false); document.querySelector(`[data-select-shot="${state.selected}"]`)?.focus(); return; }
    if (target.closest('#prev-step')) goStep(state.step - 1);
    else if (target.closest('#next-step')) goStep(state.step + 1);
    else if (target.closest('#play-shot')) play();
    else if (target.closest('#out-copy')) copyText(document.querySelector('#out-text').value, 'Saída copiada.');
    else if (target.closest('#out-download')) {
      const valid = validateStudio(project());
      const slug = projectSlug(valid);
      if (state.outTab === 'pack') download(`${slug}-pacote.txt`, exportStudioText(valid));
      else if (state.outTab === 'codex') download(`${slug}-pedido-codex.md`, exportCodexRequest(valid), 'text/markdown;charset=utf-8');
      else download(`${slug}.frame.json`, JSON.stringify(valid, null, 2), 'application/json;charset=utf-8');
    }
  }

  function onKey(event) {
    const shot = event.target instanceof Element && event.target.closest('[data-select-shot]');
    if (shot && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault();
      const i = Number(shot.dataset.selectShot) + (event.key === 'ArrowRight' ? 1 : -1);
      if (i >= 0 && i < project().shots.length) selectShot(i, true);
    }
    const tab = event.target instanceof Element && event.target.closest('[role="tab"]');
    if (tab && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault();
      const list = [...tab.parentElement.querySelectorAll('[role="tab"]:not(:disabled)')];
      const next = list[(list.indexOf(tab) + (event.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length];
      next.click();
    }
  }

  // Header tools
  document.querySelector('#apply-template').addEventListener('click', () => {
    const id = document.querySelector('#template-select').value;
    snapshot('aplicar modelo'); state.project = createStudioProject(id); state.selected = 0; state.t = 0;
    render(); notify(`Modelo “${templates[id].label}” aplicado. Use Desfazer para voltar.`);
  });
  document.querySelector('#export-studio').addEventListener('click', () => {
    const issues = studioIssues(project());
    if (issues.length) { notify(`Resolva as pendências antes de exportar: ${issues[0].message}`); return; }
    const valid = validateStudio(project());
    download(`${projectSlug(valid)}.frame.json`, JSON.stringify(valid, null, 2), 'application/json;charset=utf-8');
  });
  const fileInput = document.querySelector('#studio-file');
  document.querySelector('#import-studio').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    errorBox.hidden = true;
    try {
      if (file.size > MAX_STUDIO_BYTES) throw new Error('O arquivo de projeto deve ter no máximo 128 KB.');
      const candidate = parseStudio(await file.text());
      if (disposed) return;
      snapshot('importar projeto'); state.project = candidate; state.selected = 0; state.t = 0;
      render(); notify('Projeto importado. Use Desfazer para voltar ao rascunho anterior.');
    } catch (error) { if (!disposed) { errorBox.hidden = false; errorBox.textContent = error.message; } }
    finally { if (!disposed) fileInput.value = ''; }
  });

  const progressHandler = event => { if (event.target.id === 'shot-progress') { stop(); state.t = Number(event.target.value) / 100; renderPreview(); } };
  root.addEventListener('input', event => { if (event.target.id === 'shot-progress') progressHandler(event); else onInput(event); });
  root.addEventListener('change', event => { if (event.target.id !== 'shot-progress') onInput(event); });
  root.addEventListener('submit', event => event.preventDefault());
  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKey);
  const howto = document.querySelector('#howto');
  try { if (localStorage.getItem(howtoKey) === 'closed') howto.open = false; } catch { /* stays open */ }
  howto.addEventListener('toggle', () => { try { localStorage.setItem(howtoKey, howto.open ? 'open' : 'closed'); } catch { /* preference is per visit */ } });
  if (state.undo) { undoButton.hidden = false; undoButton.textContent = `Desfazer: ${state.undo.label}`; }
  render();
  return () => { disposed = true; stop(); };
}

