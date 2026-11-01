// Cast, art directions and image queue pages.
import {cast, castById, castViews, castAssetPath} from '../data/cast.js';
import {storeModels, storeFileName, STORE_REF_DIR} from '../data/store-models.js';
import {createKitProject, takeNotes} from '../data/takes.js';
import {directions, directionById, directionAssetPath} from '../data/directions.js';
import {lights, grades} from '../data/studio.js';
import {imageRequests, requestGroups, isGenerated, isDone, needsRedo, assetSrc, queueStats} from '../data/image-requests.js';
import {placeholderSVG, lightingSVG} from './diagram.js';
import {icon} from './icons.js';
import {escapeHTML as esc} from './html.js';

const head = (tag, title, intro) => `<div class="page-head"><span class="eyebrow">${tag}</span><h1>${title}</h1><p class="intro">${intro}</p></div>`;
const picture = (path, label, {ratio = '2:3', person = true, id = '', thumb = true, eager = false} = {}) => {
  const src = assetSrc(path, thumb);
  return src ? `<img src="${esc(src)}" alt="${esc(label)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">` : placeholderSVG({label, id: id || path.split('/').slice(-2).join('/'), ratio, person});
};
const swatches = palette => `<div class="swatches">${palette.map(c => `<span class="swatch"><svg viewBox="0 0 20 20" aria-hidden="true"><rect width="20" height="20" rx="4" fill="${esc(c.hex)}"/></svg>${esc(c.name)}<small>${esc(c.hex)}</small></span>`).join('')}</div>`;
const ready = model => castViews.filter(v => isGenerated(castAssetPath(model.id, v.id))).length;

// ---------- cast ----------
// The store's own AI models: listed with the private file names the Studio asks for, never with their images.
const storeSection = () => `<section class="store-models" aria-labelledby="store-title"><div class="section-title"><div><small>MODELOS DA LOJA · REFERÊNCIA PRIVADA</small><h2 id="store-title">MODELO-A e as 20 fichas da Sarcenet</h2></div></div><p class="muted">Modelos de IA da própria loja. As imagens não vão para o site: ficam na pasta da loja e, depois de <code>npm run modelos -- --origem "…/07 - VESTUARIO"</code>, em recortes limpos de rosto, corpo e costas em <code>${STORE_REF_DIR}/</code>. No Studio, escolha a modelo na etapa 2; o painel Produzir pede cada arquivo pelo nome.</p><ul class="store-grid">${storeModels.map(m => `<li class="store-card"><b>${esc(m.code)}</b><span>${esc(m.look)}</span><code>${esc(storeFileName(m.id, 'rosto'))}</code><small>${esc(m.source)}</small></li>`).join('')}</ul></section>`;
export function castMarkup(id) {
  if (id) {
    const m = castById(id);
    return m ? castDetail(m) : `<section class="empty"><h1>Modelo não encontrada.</h1><a class="button" href="#elenco">Voltar ao elenco</a></section>`;
  }
  return `${head(`ELENCO · ${cast.length} MODELOS FICTÍCIAS + ${storeModels.length} DA LOJA`, 'Rostos com <em>ficha.</em>', 'Cada modelo tem identidade escrita, medidas, energia de pose e sete vistas de referência. A ficha é o que mantém o mesmo rosto da primeira à última cena. As modelos SC são inventadas; as modelos da loja aparecem abaixo, como referência privada.')}<div class="filterbar" role="group" aria-label="Linha"><button class="chip" type="button" data-cast-filter="all" aria-pressed="true">Todas</button><button class="chip" type="button" data-cast-filter="Feminina" aria-pressed="false">Feminina</button><button class="chip" type="button" data-cast-filter="Masculina" aria-pressed="false">Masculina</button><button class="chip" type="button" data-cast-filter="plus" aria-pressed="false">Plus, 40+ e petite</button></div><p class="result-count" id="cast-count" role="status"></p><div class="cast-grid" id="cast-grid">${cast.map(m => `<article class="cast-card" data-line="${esc(m.line)}"><a href="#elenco/${m.id}" class="cast-card-media" aria-label="Abrir ficha de ${m.code} ${esc(m.name)}">${picture(castAssetPath(m.id, 'corpo-frente'), `${m.code} ${m.name}, corpo inteiro`, {id: m.code})}</a><div class="cast-card-body"><div class="cast-card-top"><span class="card-tag">${m.code} · ${esc(m.line.toUpperCase())}</span><span class="count-pill">${ready(m)}/${castViews.length}</span></div><h2><a href="#elenco/${m.id}">${esc(m.name)}</a></h2><p>${m.age} anos · ${m.height.toFixed(2).replace('.', ',')} m · manequim ${esc(m.size)}</p><p class="muted">${esc(m.energy)}</p></div></article>`).join('')}</div>${storeSection()}<section class="panel cast-policy"><h2>Usar as modelos reais da Sarcenet</h2><p>O repositório e o site são públicos. Fotos de pessoas reais só entram pela pasta privada <code>references/sarcenet/</code>, que o Git ignora, e somente com termo de autorização de uso de imagem para IA registrado em <code>references/sarcenet/CONSENTIMENTO.md</code>. Imagens geradas a partir de pessoas reais não são publicadas no site.</p><a class="text-link" href="./docs/codex/IMAGENS-CODEX.md">Ler o protocolo de referências ↗</a></section>`;
}

function castDetail(m) {
  const views = castViews.map(v => {
    const path = castAssetPath(m.id, v.id);
    return `<figure class="view-card"><div class="view-media">${picture(path, `${m.code} ${m.name}: ${v.label}`, {id: `${m.code} · ${v.id}`})}</div><figcaption><b>${esc(v.label)}</b><span class="badge${isGenerated(path) ? ' ok' : ''}">${isGenerated(path) ? 'GERADA' : v.priority}</span></figcaption></figure>`;
  }).join('');
  const bestFor = m.bestFor.map(id => directionById(id)).filter(Boolean);
  return `<a class="gallery-back" href="#elenco">← Todo o elenco</a><header class="cast-hero"><div class="cast-hero-media">${picture(castAssetPath(m.id, 'rosto-frente'), `${m.code} ${m.name}, rosto frontal`, {id: m.code, thumb: false, eager: true})}</div><div><span class="eyebrow">${m.code} · ${esc(m.line.toUpperCase())}</span><h1>${esc(m.name)}</h1><p class="intro">${esc(m.energy)}</p><dl class="spec-list"><div><dt>Idade</dt><dd>${m.age} anos</dd></div><div><dt>Altura</dt><dd>${m.height.toFixed(2).replace('.', ',')} m</dd></div><div><dt>Manequim</dt><dd>${esc(m.size)}</dd></div><div><dt>Tom de pele</dt><dd>Monk ${m.mst}/10</dd></div></dl><ul class="rules">${m.traits.map(t => `<li>${esc(t)}</li>`).join('')}</ul><div class="actions"><a class="button" href="#studio/2">Escalar no Studio ↗</a><button type="button" class="button secondary small" id="copy-identity">${icon('copy')}Copiar identidade</button></div></div></header><section><div class="section-title"><div><small>FICHA DE IDENTIDADE · INGLÊS PARA PROMPT</small><h2>O texto que <em>fixa o rosto.</em></h2></div></div><div class="prompt-text" id="identity-text">${esc(m.identity)}</div></section><section><div class="section-title"><div><small>SETE VISTAS DE REFERÊNCIA</small><h2>Do rosto ao <em>turnaround.</em></h2></div><a class="text-link" href="#fila">Ver na fila de imagens ↗</a></div><div class="view-grid">${views}</div><p class="note">Ordem de geração: rosto frontal primeiro (âncora), depois corpo frontal, depois as demais vistas anexando as duas âncoras. Rejeite qualquer vista em que formato do rosto, sobrancelhas, marcas ou cabelo mudem.</p></section><section><div class="section-title"><div><small>ONDE ELA FUNCIONA MELHOR</small><h2>Direções sugeridas.</h2></div></div><div class="direction-mini">${bestFor.map(d => `<a href="#direcoes/${d.id}" class="direction-mini-card"><span class="direction-mini-media">${picture(directionAssetPath(d.id, 'hero'), d.name, {id: d.id})}</span><b>${esc(d.name)}</b><small>${esc(d.tagline)}</small></a>`).join('')}</div></section>`;
}

// ---------- directions ----------
export function directionsMarkup(id) {
  if (id) {
    const d = directionById(id);
    return d ? directionDetail(d) : `<section class="empty"><h1>Direção não encontrada.</h1><a class="button" href="#direcoes">Voltar às direções</a></section>`;
  }
  return `${head(`DIREÇÕES DE ARTE · ${directions.length} MUNDOS`, 'Luz, lente e <em>lugar.</em>', 'Cada direção é um set fotográfico repetível: planta de luz, lente, exposição, paleta, cenário e o que evitar. Escolha uma no Studio e cenário, luz e cor são preenchidos de uma vez.')}<div class="direction-grid">${directions.map((d, i) => `<article class="direction-card"><a href="#direcoes/${d.id}" class="direction-card-media" aria-label="Abrir ${esc(d.name)}">${picture(directionAssetPath(d.id, 'hero'), `${d.name}: imagem-chave`, {id: d.id, eager: i < 3})}<span class="direction-index">${String(i + 1).padStart(2, '0')}</span></a><div class="direction-card-body"><h2><a href="#direcoes/${d.id}">${esc(d.name)}</a></h2><p class="direction-tagline">${esc(d.tagline)}</p><p class="muted">${esc(d.use)}</p>${swatches(d.palette)}</div></article>`).join('')}</div><p class="note">A direção <strong>Seda &amp; janela</strong> é a assinatura proposta para a Sarcenet, inspirada no significado do nome: uma seda fina e macia. É uma hipótese de linguagem a validar com a loja, não um guia de marca oficial.</p>`;
}

function directionDetail(d) {
  return `<a class="gallery-back" href="#direcoes">← Todas as direções</a><header class="direction-hero"><div class="direction-hero-media">${picture(directionAssetPath(d.id, 'hero'), `${d.name}: imagem-chave`, {id: d.id, thumb: false, eager: true})}</div><div><span class="eyebrow">DIREÇÃO DE ARTE</span><h1>${esc(d.name)}</h1><p class="intro">${esc(d.tagline)} ${esc(d.use)}</p><div class="tags">${d.mood.map(x => `<span>${esc(x)}</span>`).join('')}</div><dl class="spec-list"><div><dt>Lente</dt><dd>${esc(d.lens)}</dd></div><div><dt>Exposição</dt><dd>${esc(d.exposure)}</dd></div><div><dt>Luz</dt><dd>${esc(lights[d.light].label)}</dd></div><div><dt>Cor</dt><dd>${esc(grades[d.grade].label)}</dd></div></dl>${swatches(d.palette)}<div class="actions"><a class="button" href="#studio/3">Usar no Studio ↗</a></div></div></header><div class="studio-split"><section class="panel"><span class="eyebrow">PLANTA DE LUZ</span><div class="diagram-box">${lightingSVG(d)}</div><ol class="light-legend">${d.setup.map(l => `<li><b>${esc(l.label)}</b> · ${esc(l.modifier)}</li>`).join('')}</ol></section><section class="panel"><span class="eyebrow">CENÁRIO VAZIO</span><div class="plate-media">${picture(directionAssetPath(d.id, 'plate'), `${d.name}: cenário vazio`, {ratio: '3:2', person: false, id: `${d.id}/plate`})}</div><h3>Prompt de cenário</h3><div class="prompt-text">${esc(d.environment)}</div><h3>Direção de luz e cor</h3><div class="prompt-text">${esc(d.artDirection)}</div><p class="note">Evite: ${esc(d.avoid)}</p></section></div>`;
}

// ---------- queue ----------
export function queueMarkup() {
  const stats = queueStats();
  const pct = Math.round(stats.done / stats.total * 100);
  return `${head('FILA DE IMAGENS · CODEX', 'Cada imagem tem <em>um lugar.</em>', 'Esta é a lista de produção visual do estúdio. Cada item tem ID, prioridade, destino, referências, prompt e critério de aceite. O Codex gera, salva em <code>incoming/</code> e roda a ingestão: a imagem aparece aqui e no site automaticamente.')}<div class="queue-summary"><div><strong>${stats.done}<small>/${stats.total}</small></strong><span>${stats.redo ? `CONCLUÍDAS · ${stats.redo} PARA REFAZER` : 'GERADAS'}</span></div><div><strong>${stats.p0Done}<small>/${stats.p0}</small></strong><span>PRIORIDADE P0</span></div><div class="queue-bar"><div class="check-progress" role="progressbar" aria-label="Imagens geradas" aria-valuemin="0" aria-valuemax="${stats.total}" aria-valuenow="${stats.done}"><span data-progress="${pct}"></span></div><small>${pct}% da fila concluída</small></div></div><div class="filterbar"><label class="search"><span class="sr-only">Buscar na fila</span><input type="search" id="queue-search" placeholder="Buscar por ID, modelo, direção…"></label><div class="gallery-filter-group" role="group" aria-label="Filtrar fila">${['Todas', ...requestGroups].map((g, i) => `<button class="chip" type="button" data-queue-group="${esc(g)}" aria-pressed="${i === 0}">${esc(g)}</button>`).join('')}<button class="chip" type="button" id="queue-pending" aria-pressed="false">Só pendentes</button></div></div><p class="result-count" id="queue-count" role="status"></p><ol class="queue-list" id="queue-list"></ol><section class="panel"><h2>Como o Codex trabalha esta fila</h2><ol class="steps-list"><li>Lê <code>AGENTS.md</code> e <code>docs/codex/IMAGENS-CODEX.md</code>.</li><li>Gera na ordem: P0 antes de P1, e por onda (dependências primeiro).</li><li>Anexa as referências listadas, salva o PNG como <code>incoming/&lt;ID&gt;.png</code>.</li><li>Roda <code>python scripts/ingest-images.py</code> e <code>npm run check</code>.</li><li>Registra prompt final e revisão em <code>docs/IMAGENS.md</code>.</li></ol><a class="text-link" href="./docs/codex/FILA-DE-IMAGENS.md">Abrir a fila em Markdown ↗</a></section>`;
}

// Campaign keyframes S01–S05 are the examples of the ready-made takes: link each one to its full description.
const kitTitles = createKitProject().shots.map(s => s.title);
function takeLink(r) {
  const m = r.id.match(/^SHOW-S(\d{2})-[AB]$/);
  if (!m) return '';
  const n = Number(m[1]);
  return n <= takeNotes.length
    ? `<p class="queue-take">${icon('film')}<span>Exemplo da <a href="#tomadas/${n}">tomada ${n} · ${esc(kitTitles[n - 1])}</a> das Tomadas prontas: câmera, ação, o que revisar e como corrigir.</span></p>`
    : `<p class="queue-take">${icon('film')}<span>Plano extra de assinatura desta campanha. As <a href="#tomadas">Tomadas prontas</a> terminam na tomada 5.</span></p>`;
}
function queueItem(r) {
  const done = isDone(r), redo = needsRedo(r);
  return `<li class="queue-item${done ? ' done' : ''}"><div class="queue-media">${picture(r.target, r.title, {ratio: r.size === '1536x1024' ? '3:2' : '2:3', person: !/plate|PECA/.test(r.id), id: r.id})}</div><div class="queue-body"><div class="queue-top"><code>${esc(r.id)}</code><span class="badge${done ? ' ok' : redo ? ' redo' : ''}">${done ? 'GERADA' : redo ? `REFAZER · ${esc(r.revision)}` : `${r.priority} · ONDA ${r.wave}`}</span></div><h3>${esc(r.title)}</h3>${redo ? `<p class="queue-redo">${esc(r.revisionReason)}</p>` : ''}${takeLink(r)}<p class="muted">${esc(r.group)} · ${esc(r.size)} · destino <code>${esc(r.target)}</code></p>${r.dependsOn.length ? `<p class="queue-deps">Depende de: ${r.dependsOn.map(d => `<code>${esc(d)}</code>`).join(' ')}</p>` : ''}<details><summary>Prompt, referências e aceite</summary><div class="prompt-text">${esc(r.prompt)}</div>${r.references.length ? `<p><b>Anexar:</b> ${r.references.map(x => `<code>${esc(x)}</code>`).join(' ')}</p>` : '<p><b>Sem referência:</b> esta imagem é uma âncora.</p>'}<ul class="rules">${r.accept.map(a => `<li>${esc(a)}</li>`).join('')}</ul><button type="button" class="button secondary small" data-copy-request="${esc(r.id)}">${icon('copy')}Copiar prompt</button></details></div></li>`;
}

export function mountQueue({notify}) {
  const state = {group: 'Todas', query: '', pending: false};
  const normalize = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const bar = document.querySelector('[data-progress]');
  bar.style.width = `${bar.dataset.progress}%`;
  function render() {
    const q = normalize(state.query);
    const list = imageRequests.filter(r => (state.group === 'Todas' || r.group === state.group) && (!state.pending || !isDone(r)) && normalize(`${r.id} ${r.title} ${r.target}`).includes(q));
    document.querySelector('#queue-count').textContent = `${list.length} ${list.length === 1 ? 'imagem' : 'imagens'} nesta seleção`;
    document.querySelector('#queue-list').innerHTML = list.length ? list.map(queueItem).join('') : '<li class="empty">Nenhuma imagem nesta seleção.</li>';
  }
  const main = document.querySelector('main');
  const onClick = async event => {
    const group = event.target.closest('[data-queue-group]');
    if (group) { state.group = group.dataset.queueGroup; document.querySelectorAll('[data-queue-group]').forEach(b => b.setAttribute('aria-pressed', String(b === group))); render(); return; }
    if (event.target.closest('#queue-pending')) { state.pending = !state.pending; document.querySelector('#queue-pending').setAttribute('aria-pressed', String(state.pending)); render(); return; }
    const copy = event.target.closest('[data-copy-request]');
    if (copy) {
      const r = imageRequests.find(x => x.id === copy.dataset.copyRequest);
      try { await navigator.clipboard.writeText(r.prompt); notify('Prompt copiado.'); } catch { notify('Cópia indisponível. Selecione o texto do prompt.'); }
    }
  };
  main.addEventListener('click', onClick);
  document.querySelector('#queue-search').addEventListener('input', e => { state.query = e.target.value; render(); });
  render();
  return () => main.removeEventListener('click', onClick);
}

export function mountCast({id, notify}) {
  const main = document.querySelector('main');
  if (id) {
    const button = document.querySelector('#copy-identity');
    const onCopy = async () => { try { await navigator.clipboard.writeText(document.querySelector('#identity-text').textContent); notify('Identidade copiada.'); } catch { notify('Cópia indisponível. Selecione o texto.'); } };
    button?.addEventListener('click', onCopy);
    return () => button?.removeEventListener('click', onCopy);
  }
  const apply = filter => {
    let shown = 0;
    document.querySelectorAll('.cast-card').forEach(card => {
      const line = card.dataset.line;
      const visible = filter === 'all' || (filter === 'plus' ? /plus|40\+|petite/.test(line) : line.startsWith(filter));
      card.hidden = !visible; if (visible) shown++;
    });
    document.querySelector('#cast-count').textContent = `${shown} ${shown === 1 ? 'modelo' : 'modelos'}`;
  };
  const onClick = event => {
    const b = event.target.closest('[data-cast-filter]');
    if (!b) return;
    document.querySelectorAll('[data-cast-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    apply(b.dataset.castFilter);
  };
  main.addEventListener('click', onClick);
  apply('all');
  return () => main.removeEventListener('click', onClick);
}
