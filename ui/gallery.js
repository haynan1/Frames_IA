import {galleryStudies,gallerySearch,findGalleryStudy,galleryStudyText} from '../data/gallery.js';
import {galleryAssets,galleryComparisons} from '../data/gallery-assets.js';
import {galleryReviews} from '../data/gallery-review.js';
import {movements} from '../data/content.js';
import {escapeHTML as esc} from './html.js';

const categories={Todos:'Todos os estudos',Clothing:'Clothing / roupas',Produto:'Produto'};
const state={category:'Todos',query:'',onlySaved:false};
const favoriteKey='frame-gallery-saved-v1';
let saved=new Set();
let storageWarning=false;
function loadSaved(){
  try{const value=JSON.parse(localStorage.getItem(favoriteKey)||'[]');saved=new Set(Array.isArray(value)?value.filter(id=>galleryStudies.some(s=>s.id===id)):[]);}
  catch{saved=new Set();storageWarning=true;}
}
function persistSaved(){try{localStorage.setItem(favoriteKey,JSON.stringify([...saved]));return true;}catch{storageWarning=true;return false;}}

function image(frame,description,{thumbnail=false,eager=false}={}){
  const metadata=galleryAssets[frame.asset]||{width:1024,height:1280};
  return `<img src="${thumbnail?frame.thumb:frame.asset}" alt="${esc(description)}" width="${metadata.width}" height="${metadata.height}" loading="${eager?'eager':'lazy'}" decoding="async"${eager?' fetchpriority="high"':''}>`;
}

function studyCard(s,index){
  return `<article class="gallery-card"><a class="gallery-card-image" href="#biblioteca/${s.id}" aria-label="Abrir estudo ${esc(s.title)}">${image(s.frames[1],`${s.title}: ${s.frames[1].title}`,{thumbnail:true,eager:index<3})}<span class="gallery-image-label">${s.category==='Clothing'?'CLOTHING':'PRODUCT STUDY'}</span><span class="gallery-open" aria-hidden="true">↗</span></a><div class="gallery-card-info"><div class="gallery-card-meta"><span>ESTUDO ${s.number}</span><span>03 FRAMES · ${s.duration}s</span></div><h2><a href="#biblioteca/${s.id}">${s.title}</a></h2><p>${s.world}</p><div class="gallery-card-bottom"><a class="text-link" href="#biblioteca/${s.id}">Ver a sequência ↗</a><button type="button" class="gallery-save" data-save-study="${s.id}" aria-pressed="${saved.has(s.id)}" aria-label="${saved.has(s.id)?'Remover dos salvos':'Salvar estudo'}: ${esc(s.title)}">${saved.has(s.id)?'Salvo ✓':'Salvar +'}</button></div></div></article>`;
}

export function galleryMarkup(id){
  loadSaved();
  if(id){const study=findGalleryStudy(id);if(study)return studyMarkup(study);return `<section class="empty"><h1>Estudo não encontrado.</h1><p>Escolha uma sequência da biblioteca para continuar.</p><a class="button" href="#biblioteca">Voltar à biblioteca</a></section>`;}
  return `<section class="gallery-intro"><div><span class="eyebrow">BIBLIOTECA VISUAL · EDIÇÃO 01</span><h1>Ideias que você<br>pode <em>ver acontecer.</em></h1><p class="intro">Dez mundos visuais. Trinta frames individuais. Explore roupa, cenário e luz em sequências que mostram como construir uma imagem — e como planejar seu movimento.</p></div><div class="gallery-counts"><div><strong>10</strong><span>CENÁRIOS</span></div><div><strong>30</strong><span>FRAMES</span></div><div><strong>06</strong><span>ESTUDOS DE ROUPA</span></div></div></section><div class="gallery-featured"><a href="#biblioteca/trench-chuva">${image(galleryStudies[1].frames[1],'Trench coat oliva em uma rua molhada ao anoitecer',{thumbnail:true,eager:true})}<span class="featured-label">01 / UM LOOK, TRÊS PLANOS<span>Entre a chuva<br>e a cidade. ↗</span></span></a><a href="#biblioteca/capsula-tres-looks">${image(galleryStudies[6].frames[0],'Lookbook: personagem fictícia com camisa branca e jeans',{thumbnail:true,eager:true})}<span class="featured-label">02 / TROCA INTENCIONAL<span>Três looks.<br>A mesma pessoa. ↗</span></span></a></div><div class="gallery-controls"><label class="search"><span class="sr-only">Buscar estudos visuais</span><input id="gallery-search" type="search" placeholder="Roupa, linho, café, deserto…" value="${esc(state.query)}"></label><div class="gallery-filter-group" role="group" aria-label="Categoria dos estudos">${Object.entries(categories).map(([key,label])=>`<button class="chip" type="button" data-gallery-category="${key}" aria-pressed="${state.category===key}">${label}</button>`).join('')}<button class="chip" type="button" id="gallery-saved" aria-pressed="${state.onlySaved}">Meus salvos</button></div></div><div class="gallery-result-bar"><p id="gallery-count" role="status" aria-live="polite"></p><span>IMAGENS GERADAS · MOVIMENTOS PROPOSTOS</span></div><div id="gallery-results" class="gallery-grid"></div><p class="note">A curadoria avalia o que se vê nas imagens. A animação e a narração são propostas para testar; estes estudos não comprovam resultado de vídeo, fidelidade de um produto real ou performance de vendas.</p><p id="gallery-storage" class="muted">${storageWarning?'O navegador não permite guardar favoritos. Você pode continuar explorando a biblioteca.':'Os favoritos ficam apenas neste navegador.'}</p><a class="text-link" href="#como-usar">Primeira vez aqui? Veja como operar o sistema ↗</a>`;
}

function comparisonMarkup(s){
  const c=galleryComparisons[s.id];
  if(!c)return '';
  return `<section class="study-comparison"><div class="section-title"><div><small>UM REPARO OBSERVÁVEL</small><h2>Bonito, mas fora da intenção.</h2></div></div><p class="intro">A primeira tentativa de plano aberto manteve praticamente o recorte anterior. O reparo pediu uma câmera muito mais afastada e limitou o tamanho do frasco no quadro. Compare a mudança de escala; isso é uma revisão de imagem, não um teste de animação.</p><div class="comparison-pair"><figure><img src="${c.candidate}" alt="Tentativa rejeitada: o frasco continua grande no quadro" width="${c.width}" height="${c.height}" loading="lazy"><figcaption><span>TENTATIVA NÃO SELECIONADA</span>O enquadramento repete a imagem-base.</figcaption></figure><figure>${image(s.frames[1],'Nova direção: o frasco aparece menor e o pedestal completo é revelado')}<figcaption><span>DEPOIS DO REPARO</span>O plano aberto mostra contexto e escala.</figcaption></figure></div></section>`;
}

function studyMarkup(s){
  const review=galleryReviews[s.id];
  return `<a class="gallery-back" href="#biblioteca">← Todos os estudos</a><header class="study-heading"><div><span class="eyebrow">ESTUDO ${s.number} / ${s.category==='Clothing'?'CLOTHING':'PRODUTO'}</span><h1>${s.title}</h1><p class="intro">${s.concept}</p></div><button type="button" class="button secondary small" data-save-study="${s.id}" aria-pressed="${saved.has(s.id)}">${saved.has(s.id)?'Estudo salvo ✓':'Salvar estudo +'}</button></header><div class="study-specs"><span>${s.world}</span><span>${s.palette}</span><span>${s.duration}s planejados · 3 tomadas</span></div><section class="study-workspace"><div class="study-visual"><button class="study-main-image" type="button" id="open-frame" aria-label="Ampliar frame selecionado">${image(s.frames[0],`${s.title} — ${s.frames[0].title}`,{eager:true})}<span class="study-expand">AMPLIAR ↗</span></button><div class="study-thumbnails" role="group" aria-label="Escolher frame">${s.frames.map((f,i)=>`<button type="button" data-study-frame="${i}" aria-pressed="${i===0}">${image(f,`Frame ${f.number}: ${f.title}`,{thumbnail:true,eager:true})}<span>0${f.number} / ${f.beat}</span></button>`).join('')}</div><div class="study-image-meta"><span>IMAGEM GERADA COM IA</span><span id="frame-dimensions"></span></div></div><section class="study-direction" aria-label="Direção do frame"><div class="card-tag" id="frame-position"></div><h2 id="frame-title"></h2><p class="study-frame-spec" id="frame-spec"></p><div class="study-tabs" role="group" aria-label="Tipo de direção"><button type="button" class="chip" data-prompt-kind="image" aria-pressed="true">01 / Gerar imagem</button><button type="button" class="chip" data-prompt-kind="animation" aria-pressed="false">02 / Animar o frame</button></div><p id="prompt-context" class="muted"></p><label class="sr-only" for="study-prompt">Prompt do frame selecionado</label><textarea id="study-prompt" readonly spellcheck="false"></textarea><div class="actions"><button type="button" class="button small" id="copy-study-prompt">Copiar prompt ↗</button><a class="button secondary small" id="download-study-frame" download>Baixar imagem ↓</a></div><p class="study-reference" id="frame-reference"></p><p id="frame-review-note" class="note" hidden></p></section></section><section class="study-sequence"><div class="section-title"><div><small>A HISTÓRIA EM TRÊS BATIDAS</small><h2>Da atenção ao <em>encerramento.</em></h2></div><button type="button" class="button secondary small" id="download-study">Baixar roteiro + prompts ↓</button></div><div class="study-beats">${s.frames.map(f=>`<article><span>0${f.number} / ${(f.number-1)*s.duration/3}—${f.number*s.duration/3}s</span><h3>${f.title}</h3><p>${f.beat} · ${f.framing}</p><a href="#camera/${f.move}" class="text-link">${movements.find(m=>m.id===f.move).name} ↗</a></article>`).join('')}</div><div class="study-narration"><span class="card-tag">NARRAÇÃO PROPOSTA · ADICIONAR NA EDIÇÃO</span><p>“${s.voice}”</p><small>${s.duration===24?'Estrutura curta de apresentação em três beats.':'Roteiro editorial breve.'} Ajuste a fala ao tempo disponível e mantenha uma margem de silêncio no fim.</small></div></section>${comparisonMarkup(s)}<section class="study-curation"><div class="section-title"><div><small>CURADORIA VISUAL</small><h2>O que levar. <em>O que revisar.</em></h2></div><span class="badge">VÍDEO AINDA NÃO TESTADO</span></div><div class="curation-grid"><article><span class="card-tag">FUNCIONA VISUALMENTE</span><h3>O que está presente.</h3><p>${review?esc(review.strength):'A revisão específica desta série ainda não foi registrada.'}</p></article><article><span class="card-tag">PONTO DE REVISÃO</span><h3>Olhe de perto.</h3><p>${review?esc(review.caution):'Compare identidade, desenho da peça, apoios e direção de luz entre os frames antes de animar.'}</p></article><article><span class="card-tag">NÃO FUNCIONA SE…</span><h3>O risco da geração.</h3><p>${s.avoid}</p></article><article><span class="card-tag">COMO REPARAR</span><h3>Volte à referência.</h3><p>${s.repair}</p></article></div><div class="study-locks"><h3>O que precisa permanecer</h3><p><strong>Roupa / objeto:</strong> ${s.wardrobe}</p><p>${s.invariants}</p></div></section><div class="callout"><div><span class="eyebrow">LEVE A IDEIA PARA A SUA CAMPANHA</span><h3>O próximo passo é o seu plano.</h3><p>Baixe o roteiro, organize suas referências e construa as tomadas no Studio.</p></div><a class="button" href="#studio">Abrir o Studio ↗</a></div><dialog id="frame-dialog" aria-labelledby="dialog-frame-title"><div class="frame-dialog-bar"><h2 id="dialog-frame-title">${s.title}</h2><button type="button" class="button secondary small" id="close-frame">Fechar ×</button></div><img id="dialog-frame-image" alt=""><div class="frame-dialog-nav"><button type="button" class="button secondary small" id="previous-frame">← Frame anterior</button><span id="dialog-frame-count" role="status"></span><button type="button" class="button secondary small" id="next-frame">Próximo frame →</button></div></dialog>`;
}

export function mountGallery({id,notify,download}){
  const s=findGalleryStudy(id);let active=true;
  function saveStudy(button){
    const key=button.dataset.saveStudy;if(saved.has(key))saved.delete(key);else saved.add(key);
    const persisted=persistSaved();
    document.querySelectorAll('[data-save-study]').forEach(b=>{const yes=saved.has(b.dataset.saveStudy);b.setAttribute('aria-pressed',String(yes));b.textContent=s?(yes?'Estudo salvo ✓':'Salvar estudo +'):(yes?'Salvo ✓':'Salvar +');if(!s)b.setAttribute('aria-label',`${yes?'Remover dos salvos':'Salvar estudo'}: ${findGalleryStudy(b.dataset.saveStudy).title}`);});
    notify(persisted?(saved.has(key)?'Estudo salvo neste navegador.':'Estudo removido dos salvos.'):'O favorito vale nesta visita; o navegador não permite guardá-lo.');
  }
  const onSave=e=>{const b=e.target.closest('[data-save-study]');if(b){saveStudy(b);if(!s&&state.onlySaved){renderCards();document.querySelector('#gallery-saved').focus();}}};
  document.querySelector('main').addEventListener('click',onSave);
  function renderCards(){
    const results=gallerySearch(state.query,state.category).filter(study=>!state.onlySaved||saved.has(study.id));
    document.querySelector('#gallery-count').textContent=`${results.length} ${results.length===1?'estudo encontrado':'estudos encontrados'} · ${results.length*3} frames`;
    document.querySelector('#gallery-results').innerHTML=results.length?results.map(studyCard).join(''):'<div class="empty full-width"><h2>Nenhum estudo nesta seleção.</h2><p>Troque o termo, escolha outra categoria ou desative Meus salvos.</p><button type="button" id="reset-gallery" class="button secondary small">Limpar filtros</button></div>';
    document.querySelector('#reset-gallery')?.addEventListener('click',()=>{state.query='';state.category='Todos';state.onlySaved=false;document.querySelector('#gallery-search').value='';syncFilters();renderCards();});
  }
  function syncFilters(){document.querySelectorAll('[data-gallery-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.galleryCategory===state.category)));document.querySelector('#gallery-saved').setAttribute('aria-pressed',String(state.onlySaved));}
  if(!id){
    document.querySelector('#gallery-search').addEventListener('input',e=>{state.query=e.target.value;renderCards();});
    document.querySelectorAll('[data-gallery-category]').forEach(b=>b.addEventListener('click',()=>{state.category=b.dataset.galleryCategory;syncFilters();renderCards();}));
    document.querySelector('#gallery-saved').addEventListener('click',()=>{state.onlySaved=!state.onlySaved;syncFilters();renderCards();});renderCards();
    return ()=>{active=false;document.querySelector('main').removeEventListener('click',onSave);};
  }
  if(!s)return ()=>{document.querySelector('main').removeEventListener('click',onSave);};
  let selected=0,kind='image';const dialog=document.querySelector('#frame-dialog');
  function updateFrame(){
    const f=s.frames[selected],meta=galleryAssets[f.asset];
    document.querySelector('#open-frame').innerHTML=image(f,`${s.title} — ${f.title}`,{eager:true})+'<span class="study-expand">AMPLIAR ↗</span>';
    document.querySelector('#frame-position').textContent=`FRAME 0${f.number} / ${f.beat.toUpperCase()}`;
    document.querySelector('#frame-title').textContent=f.title;
    document.querySelector('#frame-spec').textContent=`${f.framing} · ${movements.find(m=>m.id===f.move).name} · ${s.duration/3}s propostos`;
    document.querySelector('#frame-dimensions').textContent=meta?`${meta.width} × ${meta.height} PX`:'Dimensões em verificação';
    document.querySelector('#study-prompt').value=kind==='image'?f.imagePrompt:f.animationPrompt;
    document.querySelector('#prompt-context').textContent=kind==='image'?'Prompt usado na construção deste estudo. Os próximos frames usam o frame 01 como referência.':'Direção proposta para imagem → vídeo. Anexe a imagem deste frame ao provedor; o clipe ainda precisa ser produzido e revisado.';
    const downloadFrame=document.querySelector('#download-study-frame');downloadFrame.href=f.asset;downloadFrame.download=`${s.id}-0${f.number}.webp`;
    document.querySelector('#frame-reference').textContent=kind==='image'?(selected===0?'Frame inicial: geração de uma base fictícia. Não precisa de referência externa.':`Referência: ${s.id}-01.webp. ${s.id==='capsula-tres-looks'?'A roupa muda por decisão do roteiro; a pessoa e o enquadramento devem permanecer.':'Preservar a mesma pessoa, peça ou produto e a direção da luz.'}`):`Anexo para animar: ${s.id}-0${f.number}.webp. Não use o estudo inteiro como uma única imagem de vídeo.`;
    const frameNote=document.querySelector('#frame-review-note');
    const warning=galleryReviews[s.id]?.frameWarnings?.[f.number];
    frameNote.hidden=!warning;frameNote.textContent=warning||'';
    document.querySelectorAll('[data-study-frame]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.studyFrame)===selected)));
    document.querySelectorAll('[data-prompt-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.promptKind===kind)));
    document.querySelector('#dialog-frame-image').src=f.asset;document.querySelector('#dialog-frame-image').alt=`${s.title} — ${f.title}`;
    document.querySelector('#dialog-frame-count').textContent=`Frame ${f.number} de 3`;
    document.querySelector('#previous-frame').disabled=selected===0;document.querySelector('#next-frame').disabled=selected===2;
  }
  document.querySelectorAll('[data-study-frame]').forEach(b=>b.addEventListener('click',()=>{selected=Number(b.dataset.studyFrame);updateFrame();}));
  document.querySelectorAll('[data-prompt-kind]').forEach(b=>b.addEventListener('click',()=>{kind=b.dataset.promptKind;updateFrame();}));
  document.querySelector('#copy-study-prompt').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.querySelector('#study-prompt').value);if(active)notify('Prompt do frame copiado.');}catch{if(active)notify('Cópia indisponível. Selecione o texto ou baixe o roteiro.');}});
  document.querySelector('#download-study').addEventListener('click',()=>download(`frame-${s.id}-roteiro.txt`,galleryStudyText(s)));
  document.querySelector('#open-frame').addEventListener('click',()=>dialog.showModal());
  document.querySelector('#close-frame').addEventListener('click',()=>dialog.close());
  document.querySelector('#previous-frame').addEventListener('click',()=>{if(selected>0){selected--;updateFrame();}});
  document.querySelector('#next-frame').addEventListener('click',()=>{if(selected<2){selected++;updateFrame();}});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&selected>0){e.preventDefault();selected--;updateFrame();}else if(e.key==='ArrowRight'&&selected<2){e.preventDefault();selected++;updateFrame();}});
  updateFrame();return ()=>{active=false;if(dialog.open)dialog.close();document.querySelector('main').removeEventListener('click',onSave);};
}
