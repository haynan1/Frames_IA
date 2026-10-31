import {chapters, movements, promptLibrary, tools, sources, storyboard, qaItems, reviewedAt} from './data/content.js';

import {buildPrompt} from './data/prompt-builder.js';
import {mountShell} from './ui/shell.js';
import {routeById,routeAliases} from './ui/routes.js';
import {studioMarkup,mountStudio} from './ui/studio.js';
import {castMarkup,mountCast,directionsMarkup,queueMarkup,mountQueue} from './ui/pages.js';
import {placeholderSVG} from './ui/diagram.js';
import {cast,castAssetPath} from './data/cast.js';
import {directions,directionAssetPath} from './data/directions.js';
import {queueStats,assetSrc} from './data/image-requests.js';
import {escapeHTML} from './ui/html.js';
import {galleryMarkup,mountGallery} from './ui/gallery.js';
import {quickstartMarkup} from './ui/quickstart.js';

const main = document.querySelector('main');
const photo = (name, alt, extra = '') => `<img src="./assets/${name}.webp" alt="${escapeHTML(alt)}" width="720" height="960" ${extra}>`;
const button = (text, href, secondary = false) => `<a class="button${secondary ? ' secondary' : ''}" href="${href}">${text}<span aria-hidden="true">↗</span></a>`;
const head = (tag,title,description) => `<div class="page-head"><span class="eyebrow">${tag}</span><h1>${title}</h1><p class="intro">${description}</p></div>`;
const copyButton = (id,label = 'Copiar prompt') => `<button class="button secondary small" type="button" data-copy="${id}">${label}<span aria-hidden="true">↗</span></button>`;
let dispose = () => {};
let toastTimer;

function notify(message){
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove('visible'), 4200);
}


function home(){
  const stats=queueStats();
  const cover=assetSrc('assets/studio/capa.webp');
  const coverMedia=cover?`<img src="${cover}" alt="Bastidor de filme de moda: modelo fictícia em vestido de seda champagne diante da câmera" width="1536" height="1024" fetchpriority="high">`:photo('scene','Estudo conceitual gerado com IA: produto em cenário de pedra ao pôr do sol','fetchpriority="high"');
  const castCard=m=>{const src=assetSrc(castAssetPath(m.id,'rosto-frente'),true);return `<a class="home-cast" href="#elenco/${m.id}"><span class="home-cast-media">${src?`<img src="${src}" alt="${m.code} ${escapeHTML(m.name)}" loading="lazy">`:placeholderSVG({label:`${m.code} ${m.name}`,id:m.code})}</span><b>${m.code}</b><small>${escapeHTML(m.name)}</small></a>`;};
  const dirCard=(d,i)=>{const src=assetSrc(directionAssetPath(d.id,'hero'),true);return `<a class="home-direction" href="#direcoes/${d.id}"><span class="home-direction-media">${src?`<img src="${src}" alt="${escapeHTML(d.name)}" loading="lazy">`:placeholderSVG({label:d.name,id:d.id})}</span><span class="home-direction-label"><small>${String(i+1).padStart(2,'0')}</small>${escapeHTML(d.name)}</span></a>`;};
  const flow=[['01','Briefing','Marca, objetivo, formato e mensagem.','1'],['02','Peça & elenco','Construção exata da roupa e a modelo certa.','2'],['03','Cenário & luz','Uma direção de arte preenche luz, lente e cor.','3'],['04','Sequência','Tomadas com enquadramento, câmera, giro e ação.','4'],['05','Entrega','Pacote, keyframes e pedido para o Codex.','5']];
  return `<section class="studio-hero"><div class="studio-hero-copy"><span class="eyebrow">FRAME STUDIO · SARCENET</span><h1>Dirija a coleção.<br><em>Frame a frame.</em></h1><p>Um estúdio de direção de arte com IA para moda: elenco com ficha, direções de luz, construção de cenas com câmera, aproximação e rotação, e prompts prontos para imagem e vídeo.</p><div class="actions"><a class="button" href="#studio">Abrir o Studio<span aria-hidden="true">↗</span></a><a class="button secondary" href="#como-usar">Como usar<span aria-hidden="true">↗</span></a></div></div><figure class="studio-hero-media">${coverMedia}<figcaption><span class="image-badge">${cover?'IMAGEM GERADA COM IA · ELENCO FICTÍCIO':'ESTUDO VISUAL · CAPA AGUARDANDO GERAÇÃO'}</span></figcaption></figure></section>
  <div class="home-stats"><a href="#elenco"><strong>${cast.length}</strong><span>MODELOS NO ELENCO</span></a><a href="#direcoes"><strong>${directions.length}</strong><span>DIREÇÕES DE ARTE</span></a><a href="#camera"><strong>${movements.length}</strong><span>OPERAÇÕES DE CÂMERA</span></a><a href="#fila"><strong>${stats.done}<small>/${stats.total}</small></strong><span>IMAGENS NA FILA</span></a></div>
  <div class="section-title"><div><small>O FLUXO DO ESTÚDIO</small><h2>Cinco etapas. <em>Uma cena pronta.</em></h2></div><a class="text-link" href="#studio">Começar agora ↗</a></div>
  <ol class="home-flow">${flow.map(([n,t,d,s])=>`<li><a href="#studio/${s}"><b>${n}</b><h3>${t}</h3><p>${d}</p></a></li>`).join('')}</ol>
  <div class="section-title"><div><small>ELENCO FICTÍCIO · FICHAS DE IDENTIDADE</small><h2>Rostos que <em>se repetem.</em></h2></div><a class="text-link" href="#elenco">Ver elenco ↗</a></div>
  <div class="home-cast-row">${cast.map(castCard).join('')}</div>
  <div class="section-title"><div><small>DIREÇÕES DE ARTE</small><h2>Oito sets. <em>Uma linguagem.</em></h2></div><a class="text-link" href="#direcoes">Ver direções ↗</a></div>
  <div class="home-direction-row">${directions.map(dirCard).join('')}</div>
  <div class="callout"><div><span class="eyebrow">CAMPANHA DEMONSTRATIVA</span><h3>Sarcenet · Cápsula Seda · 15s</h3><p>Seis tomadas: a matéria, o olhar, o caimento em arco, as costas, dois passos e a assinatura. Abra no Studio e veja cada câmera.</p></div><a class="button" href="#studio/4">Abrir a sequência<span aria-hidden="true">↗</span></a></div>
  <div class="section-title"><div><small>REPERTÓRIO</small><h2>Para estudar e consultar.</h2></div></div>
  <div class="feature-grid"><a class="feature" href="#biblioteca"><figure>${photo('model','Retrato de personagem adulta fictícia em blazer marfim','loading="lazy"')}<span class="index">30 FRAMES</span></figure><div class="feature-body"><h3>Biblioteca visual.</h3><p>Dez mundos e trinta frames com prompts de imagem e animação.</p><span>EXPLORAR ↗</span></div></a><a class="feature" href="#camera"><figure>${photo('product','Estudo conceitual de vidro âmbar sobre superfície escura','loading="lazy"')}<span class="index">${movements.length} OPERAÇÕES</span></figure><div class="feature-body"><h3>Atlas de câmera.</h3><p>Dolly, orbit, giro no eixo, arco com aproximação e mais, com simulação.</p><span>VER O ATLAS ↗</span></div></a><a class="feature" href="#guia"><figure>${photo('scene','Frasco conceitual em cenário cinematográfico de pedra','loading="lazy"')}<span class="index">8 CAPÍTULOS</span></figure><div class="feature-body"><h3>Manual de direção.</h3><p>Briefing, óptica, identidade, produto, vídeo e revisão.</p><span>ABRIR O MANUAL ↗</span></div></a></div>
  <p class="note">Estúdio independente. Elenco, peças e campanhas são fictícios e as imagens são geradas com IA. O perfil Sarcenet é uma proposta a validar com a loja. O site planeja e organiza; a geração de imagem e vídeo acontece na ferramenta que você escolher.</p>`;
}

function guide(section){
  const pictures = (id) => id === 'identidade' ? `<figure><img class="identity-sheet" src="./assets/identity.webp" alt="Contact sheet conceitual de uma mulher adulta fictícia: frontal, perfil, três quartos e corpo inteiro" width="1024" height="1024" loading="lazy"><figcaption class="muted">Estudo gerado com IA · quatro vistas para comparação. Uma contact sheet candidata precisa de revisão de identidade; não garante consistência.</figcaption></figure>` : ['fundamentos','produto'].includes(id) ? `<div class="guide-image"><figure>${photo('product','Vidro âmbar com iluminação de estúdio','loading="lazy"')}<figcaption>Luz controlada · contorno e reflexo descrevem o volume.</figcaption></figure><figure>${photo('scene','Produto fictício em ambiente de pedra ao pôr do sol','loading="lazy"')}<figcaption>Luz de ambiente · cenário e sombra constroem atmosfera.</figcaption></figure></div>` : '';
  const content = `${head('MANUAL DE DIREÇÃO','O olhar vem<br><em>antes do comando.</em>','Um percurso completo para dirigir imagens e vídeos de produto e moda. Estude os fundamentos, construa referências e leve cada decisão para a produção.')}<nav class="chapter-nav" aria-label="Capítulos">${chapters.map(c=>`<a href="#guia/${c.id}">${c.number} / ${escapeHTML(c.tag)}</a>`).join('')}</nav>${chapters.map(c=>`<section class="chapter" id="chapter-${c.id}"><div class="chapter-top"><span class="chapter-number">${c.number}</span><div><div class="chapter-tag">${c.tag}</div><h2>${c.title}</h2><p class="intro">${c.intro}</p></div></div>${pictures(c.id)}<div class="article-grid">${c.items.map(([t,d])=>`<article><h3>${t}</h3><p>${d}</p></article>`).join('')}</div></section>`).join('')}<div class="callout"><div><h3>Transforme teoria em direção.</h3><p>Escolha um movimento e veja o que ele muda.</p></div>${button('Explorar atlas','#camera')}</div>`;
  if(section) setTimeout(()=>document.querySelector(`#chapter-${CSS.escape(section)}`)?.scrollIntoView(),30);
  return content;
}

function camera(selected){
  const current = movements.find(m=>m.id === selected) || movements[0];
  return `${head('ATLAS DE CÂMERA','Movimento com <em>motivo.</em>','Aproximar, girar e ampliar são decisões diferentes. Explore a trajetória, observe a perspectiva e copie uma instrução para testar na sua ferramenta.')}<div class="camera-layout"><div class="move-list" role="group" aria-label="Selecione uma operação">${movements.map(m=>`<button type="button" class="move-button" data-move="${m.id}" aria-pressed="${m.id===current.id}">${m.name}<small>${m.group}</small></button>`).join('')}</div><section class="camera-detail" aria-label="Movimento selecionado"><h2>${current.name}</h2><p class="subtitle">${current.subtitle}</p><p>${current.description}</p><div class="viewfinder"><svg id="simulation" viewBox="0 0 800 500" role="img" aria-label="Simulação esquemática de ${escapeHTML(current.name)}. Controle a posição pelo seletor abaixo."></svg><span class="camera-label">FRAME / ${current.name.toUpperCase()}</span><span class="sim-label">SIMULAÇÃO 3D ESQUEMÁTICA</span></div><div class="sim-controls"><button id="play" class="button secondary small" type="button">Reproduzir <span aria-hidden="true">▷</span></button><label class="sr-only" for="camera-position">Progresso da demonstração</label><input type="range" id="camera-position" min="0" max="100" value="0"><output id="position-output" for="camera-position">0%</output></div><div class="sim-legend"><span>INÍCIO / ${current.start}</span><span>FIM / ${current.end}</span></div><div class="camera-notes"><div><h3>Quando usar</h3><p>${current.use}</p></div><div><h3>O que revisar</h3><p>${current.risk}</p></div></div><div class="prompt-text" id="camera-prompt">${escapeHTML(current.prompt)}</div>${copyButton(`move:${current.id}`)}<p class="note">O desenho demonstra a operação, não prevê a saída de uma IA. Rack focus é uma mudança de foco; locked-off é câmera fixa. Teste arcos curtos antes de pedir uma volta completa.</p></section></div>`;
}

function simulator(id,t){
  const svg = document.querySelector('#simulation');
  if(!svg) return;
  let cx=0,cy=1.4,cz=8,f=510,yaw=0,pitch=0,roll=0;
  if(id==='dolly-in') cz=8-t*3;
  if(id==='dolly-out') cz=5+t*3;
  if(id==='zoom') f=510*(1+t*.65);
  if(id==='pan') yaw=(t-.5)*.32;
  if(id==='tilt') pitch=(t-.5)*.23;
  if(id==='truck') cx=1.3-t*2.6;
  if(id==='orbit'){let a=t*.7;cx=Math.sin(a)*8;cz=Math.cos(a)*8;yaw=Math.atan2(-cx,cz);}
  if(id==='pedestal') cy=.6+t*1.8;
  if(id==='tracking') cx=-t*2;
  if(id==='crane'){cy=1.4+t*2;cz=8+t*3;pitch=-t*.16;}
  if(id==='roll') roll=t*.21;
  if(id==='dolly-zoom'){cz=6+t*3;f=510*cz/6;}
  if(id==='arc-push'){let a=t*.45,r=8-t*3;cx=Math.sin(a)*r;cz=Math.cos(a)*r;yaw=Math.atan2(-cx,cz);}
  const spin=id==='turntable'?t*Math.PI/2:0;
  const project=([x,y,z])=>{
    x-=cx;y-=cy;const depth=cz-z;
    const horizontal=x*Math.cos(yaw)-depth*Math.sin(yaw);
    const forward=x*Math.sin(yaw)+depth*Math.cos(yaw);
    const vertical=y*Math.cos(pitch)-forward*Math.sin(pitch);
    const d=y*Math.sin(pitch)+forward*Math.cos(pitch);
    const px=f*horizontal/Math.max(.25,d),py=-f*vertical/Math.max(.25,d);
    return [400+px*Math.cos(roll)-py*Math.sin(roll),250+px*Math.sin(roll)+py*Math.cos(roll)];
  };
  const point=p=>project(p).map(n=>n.toFixed(2)).join(',');
  const poly=(pts,fill,stroke='#cbb98c35')=>`<polygon points="${pts.map(point).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
  const line=(a,b)=>`<line x1="${project(a)[0]}" y1="${project(a)[1]}" x2="${project(b)[0]}" y2="${project(b)[1]}" stroke="#79816238"/>`;
  // Faces are depth-sorted so rotated objects (turntable) and orbits occlude correctly.
  function box(x,y,z,w,h,d,color,rot=0){
    const turn=([px,py,pz])=>[x+(px-x)*Math.cos(rot)-(pz-z)*Math.sin(rot),py,z+(px-x)*Math.sin(rot)+(pz-z)*Math.cos(rot)];
    const a=turn([x-w/2,y,z+d/2]),b=turn([x+w/2,y,z+d/2]),c=turn([x+w/2,y+h,z+d/2]),e=turn([x-w/2,y+h,z+d/2]);
    const aa=turn([x-w/2,y,z-d/2]),bb=turn([x+w/2,y,z-d/2]),cc=turn([x+w/2,y+h,z-d/2]),ee=turn([x-w/2,y+h,z-d/2]);
    const depth=pts=>pts.reduce((sum,[px,,pz])=>sum+Math.hypot(px-cx,pz-cz),0)/pts.length;
    const faces=[[[aa,bb,cc,ee],color[0]],[[a,aa,ee,e],color[1]],[[b,bb,cc,c],color[1]],[[a,b,c,e],color[0]],[[e,c,cc,ee],color[2]]];
    return faces.sort((p,q)=>depth(q[0])-depth(p[0])).map(([pts,fill])=>poly(pts,fill)).join('');
  }
  let scene='<defs><radialGradient id="glow"><stop stop-color="#464632"/><stop offset="1" stop-color="#181b14"/></radialGradient><filter id="blur"><feGaussianBlur stdDeviation="5"/></filter></defs><rect width="800" height="500" fill="url(#glow)"/>';
  scene+='<g'+(id==='rack-focus'&&t<.5?' filter="url(#blur)"':'')+'>';
  for(let x=-9;x<=9;x+=2) scene+=box(x,0,-6,.45,6,.55,['#444b32','#313928','#62694b']);
  for(let x=-10;x<=10;x+=2) scene+=line([x,0,-12],[x,0,4]);
  for(let z=-12;z<=4;z+=2) scene+=line([-10,0,z],[10,0,z]);
  scene+='</g><g'+(id==='rack-focus'&&t>.5?' filter="url(#blur)"':'')+'>';
  const x=id==='tracking' ? -t*2 :0;
  scene+=box(x,0,0,2,.65,1.6,['#68654b','#494d36','#989074']);
  scene+=box(x,.65,0,1.1,1.75,.65,['#b3853d','#684e26','#e0b66b'],spin);
  scene+=box(x,2.4,0,.76,.38,.6,['#25271e','#1d2118','#53543d'],spin);
  // The label turns with the bottle and disappears once it faces away.
  const lx=.34*Math.cos(spin),lz=.331*Math.cos(spin),lo=.34*Math.sin(spin);
  if(Math.cos(spin)>.2)scene+=poly([[x-lx,1.05,lz+lo],[x+lx,1.05,lz-lo],[x+lx,1.65,lz-lo],[x-lx,1.65,lz+lo]],'#d6c5a7');
  scene+='</g>';
  scene+='<path d="M25 60v-25h25 M750 35h25v25 M25 440v25h25 M750 465h25v-25" fill="none" stroke="#d9d8be70"/><path d="M390 250h20 M400 240v20" stroke="#dedcc169"/><text x="35" y="452" fill="#c6c8ae" font-family="monospace" font-size="11">'+(id==='zoom'?'POSIÇÃO FIXA · AMPLIAÇÃO':id==='turntable'?'CÂMERA FIXA · OBJETO GIRA NO EIXO':id==='dolly-zoom'?'TAMANHO COMPENSADO · FUNDO VARIÁVEL':'PERSPECTIVA · PROFUNDIDADE · TRAJETÓRIA')+'</text>';
  svg.innerHTML=scene;
}

function lab(){
  return `${head('LABORATÓRIO DE DIREÇÃO','Dê forma ao <em>próximo plano.</em>','Combine decisões e leve um comando completo para sua ferramenta. Este construtor funciona no navegador; ele não chama modelos nem gera imagens ou vídeos.')}<div class="two-column"><form id="prompt-form" class="panel"><h2>Sua direção</h2><p>Use descrições em inglês nos campos livres para manter o prompt em um só idioma. Anexe sua referência aprovada à ferramenta de geração.</p><div class="form-grid"><label class="field full-width"><span>Tipo de saída</span><select name="mode"><option value="video">Vídeo a partir de referência</option><option value="image">Imagem a partir de referência</option></select></label><label class="field full-width"><span>Sujeito e identidade</span><textarea name="subject" required maxlength="800">the approved amber glass bottle, stationary on a stone plinth</textarea></label><label class="field full-width"><span>Ambiente</span><input name="environment" value="a quiet sandstone studio with a dark olive background" required maxlength="500"></label><label class="field"><span>Enquadramento</span><select name="framing"><option value="medium">Plano médio</option><option value="full">Inteiro / corpo inteiro</option><option value="close">Close-up</option><option value="macro">Macro / detalhe visível</option></select></label><label class="field"><span>Luz</span><select name="light"><option value="window">Janela difusa lateral</option><option value="hard">Dura e rasante</option><option value="back">Contraluz com preenchimento</option><option value="overcast">Dia encoberto</option></select></label><label class="field video-only"><span>Operação de câmera</span><select name="movement">${movements.map(m=>`<option value="${m.id}">${m.name}</option>`).join('')}</select></label><label class="field video-only"><span>Ritmo</span><select name="rhythm"><option value="slow">Lento e controlado</option><option value="moderate">Moderado e fluido</option><option value="fast">Rápido e legível</option></select></label><label class="field"><span>Proporção de trabalho</span><select name="format"><option>9:16</option><option>4:5</option><option>16:9</option><option>1:1</option></select></label><label class="field video-only"><span>Duração solicitada · segundos</span><input name="duration" type="number" min="2" max="10" value="4" required></label></div><p class="note">Renomeie o anexo para <strong>referencia-aprovada.png</strong>. A duração e a resolução reais precisam ser configuradas na ferramenta e podem diferir das opções deste planejamento.</p><button class="button" type="submit">Atualizar prompt <span aria-hidden="true">↗</span></button></form><section class="panel lab-output"><span class="eyebrow">COMANDO ESTRUTURADO</span><h2>Pronto para levar.</h2><p class="output-meta" id="output-meta">REFERÊNCIA OBRIGATÓRIA · REVISÃO HUMANA</p><label class="sr-only" for="prompt-output">Prompt gerado</label><textarea id="prompt-output" readonly spellcheck="false"></textarea><div class="actions">${copyButton('lab') }<button class="button secondary small" type="button" id="download-prompt">Baixar .txt ↓</button></div><p>O texto descreve intenção. A qualidade precisa ser verificada no resultado. Não há garantia de identidade, movimento exato ou rendimento comercial.</p></section></div>`;
}

function prompts(){
  return `${head('BIBLIOTECA DE PROMPTS','Comandos com <em>intenção.</em>','Exemplos autorais para imagem, vídeo e edição. Leia os anexos necessários, adapte ao produto e compare o resultado com a referência.')}<div class="filterbar"><label class="search"><span class="sr-only">Buscar prompts</span><input type="search" id="prompt-search" placeholder="Buscar por produto, retrato, textura…"></label>${['Todos','Produto','Modelo','Vídeo','Edição'].map((c,i)=>`<button class="chip" type="button" data-filter="${c}" aria-pressed="${i===0}">${c}</button>`).join('')}</div><p class="result-count" id="prompt-count" role="status" aria-live="polite"></p><div class="cards" id="prompt-results"></div><p class="note">Exemplos de imagem são candidatos conceituais. Exemplos de vídeo são prompts propostos, ainda não executados nos modelos citados. Os comandos com anexos exigem os arquivos descritos.</p>`;
}

function film(){
  return `${head('ESTUDO DE CRIATIVO · 15 SEGUNDOS','Cinco planos.<br><em>Uma ideia que fica.</em>','Estudo conceitual para um frasco fictício: revelar forma, material e atmosfera. Esta é uma proposta de storyboard com imagens estáticas; os clipes ainda precisam ser gerados e revisados.')}<div class="story-strip">${storyboard.map(s=>`<figure class="story-frame">${photo(s.image,`${s.name}: referência conceitual para ${s.shot}`,'loading="lazy"')}<figcaption><span class="time">${s.time}</span><h3>${s.name}</h3><p>${s.move}</p></figcaption></figure>`).join('')}</div><p class="note">As fotografias ilustram a linguagem visual, não são frames inicial/final exatos de cada plano. O frasco em cenários diferentes pode apresentar variações: aprove e fixe um único produto antes de produzir uma campanha real.</p><div class="timeline">${storyboard.map((s,i)=>`<article><span class="time">${s.time}</span><div><div class="card-tag">PLANO ${String(i+1).padStart(2,'0')} / ${s.shot.toUpperCase()}</div><h3>${s.name} · ${s.move}</h3><p>${s.detail}</p><details><summary>Ver direção para geração</summary><div class="prompt-text">${escapeHTML(s.prompt)}</div>${copyButton(`story:${i}`)}</details></div></article>`).join('')}</div><div class="two-column"><section class="panel"><h2>Desenhe o som.</h2><p>Um acento sonoro no início, textura ambiente baixa e uma pausa para o encerramento. Adicione apenas música e efeitos com uso autorizado. O estudo não contém um arquivo de áudio.</p></section><section class="panel"><h2>Teste a abertura.</h2><p>Variante A: vidro em macro. Variante B: silhueta inteira desde o início. Mantenha os demais planos e a oferta constantes. Compare retenção, cliques no link e conversões com base e janela declaradas.</p></section></div><div class="actions"><button class="button" id="download-story" type="button">Baixar shot list .txt ↓</button>${button('Revisar o resultado','#qualidade',true)}</div>`;
}

function models(){
  return `${head('MAPA DE FERRAMENTAS · 30.10.2026','Escolha pelo plano.<br><em>Não pelo hype.</em>','Imagem, movimento, edição e acabamento são etapas diferentes. Este catálogo registra ferramentas relevantes para este percurso, sem pretender listar todo o mercado.')}<p class="note"><strong>Ponto de partida editorial:</strong> teste Seedance para o movimento, GPT Image ou Nano Banana Pro para construir os frames e Magnific para acabamento quando necessário. Isso é uma hipótese de fluxo, não um ranking ou um benchmark realizado neste projeto.</p><div class="filterbar" role="group" aria-label="Tipo de ferramenta">${['Todas','Imagem','Vídeo','Plataforma','Acabamento'].map((x,i)=>`<button class="chip" type="button" data-tool-filter="${x}" aria-pressed="${i===0}">${x}</button>`).join('')}</div><div class="tool-grid">${tools.map(t=>`<article class="card tool-card" data-kind="${t.kind}"><div class="tool-title"><div><span class="maker">${t.maker.toUpperCase()}</span><h3>${t.name}</h3></div><span class="badge">${t.kind}</span></div><p>${t.role}</p><p class="tool-limit">${t.limit}</p><div class="tool-footer"><span>VERIFICADO ${t.checked.split('-').reverse().join('.')}</span><a href="${t.source}" target="_blank" rel="noopener noreferrer">${t.status} ↗</a></div></article>`).join('')}</div><div class="section-title"><div><small>UM TESTE QUE VOCÊ PODE REPETIR</small><h2>Compare com a sua cena.</h2></div></div><div class="table-wrap"><table><thead><tr><th>Critério</th><th>Como avaliar</th><th>Registrar</th></tr></thead><tbody><tr><td>Fidelidade</td><td>Mesmo produto e rosto, sem partes novas</td><td>Reprovação crítica + nota 1–5</td></tr><tr><td>Movimento</td><td>Trajetória e ponto de chegada pedidos</td><td>Nota 1–5 + falha observável</td></tr><tr><td>Continuidade</td><td>Início, meio, fim e frames próximos ao corte</td><td>Nota 1–5 + timestamp</td></tr><tr><td>Custo útil</td><td>Custo total dividido por planos aprovados</td><td>Tentativas, créditos, tempo e custo</td></tr><tr><td>Uso comercial</td><td>Termos, conta, referências e direitos</td><td>Fonte e data da consulta</td></tr></tbody></table></div><p class="intro">Use as mesmas referências, proporção e tarefa; adapte apenas a sintaxe exigida. Faça várias tentativas comparáveis. Rejeite falhas críticas antes de calcular a média. Preços e limites não estão congelados aqui: verifique-os na conta antes de gerar.</p>`;
}

function quality(){
  return `${head('CONTROLE DE QUALIDADE','Aprove com <em>critério.</em>','Um checklist de revisão, não uma certificação automática. As marcações ficam apenas neste navegador e não enviam arquivos ou dados.')}<div class="two-column"><section class="panel"><div class="section-title"><h2>Checklist de entrega</h2><output id="qa-count" aria-live="polite">0 / ${qaItems.length}</output></div><div class="check-progress" role="progressbar" aria-label="Revisão concluída" aria-valuenow="0" aria-valuemin="0" aria-valuemax="${qaItems.length}"><span></span></div><div>${qaItems.map((q,i)=>`<label class="check-row"><input type="checkbox" data-qa="${i}"><span>${q}</span></label>`).join('')}</div><div class="actions"><button class="button secondary small" id="reset-qa" type="button">Limpar checklist</button><button class="button small" id="download-qa" type="button">Baixar revisão ↓</button></div><p id="storage-note" class="muted"></p></section><section class="panel"><h2>Corrija uma coisa por vez.</h2><p>Feedback útil descreve o que pode ser observado e o que deve permanecer igual.</p><div class="prompt-text">FALHA: a tampa muda de altura.
ONDE: aos 2 segundos.
ESPERADO: a geometria do frame aprovado.
PRESERVAR: corpo do frasco, cenário, luz e câmera.
AÇÃO: tentar um reparo dirigido e comparar novamente.</div><p>Rejeite uma geração se ela inventar peças, alterar o rosto ou demonstrar um uso impossível. Volte ao frame aprovado quando os reparos acumularem novas falhas.</p><p class="note">Completar as marcações registra sua revisão. Não mede automaticamente a imagem e não substitui a aprovação de quem responde pela campanha.</p>${button('Ler critérios completos','#guia/qualidade',true)}</section></div>`;
}

function references(){
  return `${head('FONTES & MANUTENÇÃO','Repertório aberto.<br><em>Origem transparente.</em>','Os materiais enviados foram tratados como fontes de estudo. O site organiza conteúdo próprio, exemplos autorais e links para os originais. Revisão editorial e de ferramentas: 30 de outubro de 2026.')}<div class="source-list">${sources.map(s=>`<article class="source"><span>${s.type}</span><div><h3>${s.url?`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name} ↗</a>`:s.name}</h3><p>${s.note}</p></div></article>`).join('')}</div><div class="section-title"><div><small>DOCUMENTAÇÃO DE FABRICANTES</small><h2>Modelos e plataformas.</h2></div></div><div class="source-list">${tools.map(t=>`<article class="source"><span>${t.checked} · ${t.kind}</span><div><h3><a href="${t.source}" target="_blank" rel="noopener noreferrer">${t.name} · ${t.maker} ↗</a></h3><p>Fonte para a existência, o nome e o posicionamento da ferramenta. Não comprova superioridade universal. Disponibilidade e funções precisam ser conferidas no provedor.</p></div></article>`).join('')}</div><div class="two-column actions"><section class="panel"><h2>Como manter atual.</h2><p>Atualize o catálogo a cada lançamento relevante. Registre modelo exato, fonte oficial, data, modo testado e limitações. Preserve histórico; nunca transforme uma promessa do fabricante em resultado observado.</p><a class="text-link" href="./docs/ATUALIZACAO.md">Abrir protocolo de atualização ↗</a></section><section class="panel"><h2>Como retomar o projeto.</h2><p>Arquitetura, comandos, decisões e pontos pendentes ficam documentados para GPT, Claude e outros colaboradores. Materiais privados e credenciais permanecem fora do repositório.</p><a class="text-link" href="./docs/HANDOFF.md">Abrir instruções de continuidade ↗</a></section></div><p class="note">As imagens deste projeto foram produzidas com a ferramenta integrada de geração de imagens. Não são amostras geradas em Seedance, Nano Banana, Runway ou outros modelos do catálogo. Os prompts dos assets estão no registro de imagens do projeto.</p>`;
}

function download(filename,text,type='text/plain;charset=utf-8'){
  const url=URL.createObjectURL(new Blob([text],{type}));
  const a=document.createElement('a');a.href=url;a.download=filename;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function storageGet(key,fallback){try{const x=JSON.parse(localStorage.getItem(key));return Array.isArray(x)?x:fallback;}catch{return fallback;}}
function storageSet(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}

function bind(page,section){
  if(page==='biblioteca')dispose=mountGallery({id:section,notify,download});
  if(page==='studio')dispose=mountStudio({section,notify,download});
  if(page==='elenco')dispose=mountCast({id:section,notify});
  if(page==='fila')dispose=mountQueue({notify});
  if(page==='camera'){
    const current=movements.find(m=>m.id===section)||movements[0];
    const range=document.querySelector('#camera-position'), play=document.querySelector('#play');
    let frame=0,playing=false,start=0;
    const update=()=>{document.querySelector('#position-output').value=`${range.value}%`;simulator(current.id,Number(range.value)/100);};
    const stop=()=>{cancelAnimationFrame(frame);playing=false;play.textContent='Reproduzir ▷';};
    range.addEventListener('input',()=>{stop();update();});
    play.addEventListener('click',()=>{
      if(playing){stop();return;}
      if(matchMedia('(prefers-reduced-motion: reduce)').matches){notify('Movimento reduzido ativo. Use o controle de progresso para explorar.');return;}
      playing=true;play.textContent='Pausar Ⅱ';if(Number(range.value)>=100)range.value=0;
      start=performance.now()-Number(range.value)*40;
      const animate=now=>{range.value=Math.min(100,(now-start)/40);update();if(Number(range.value)<100)frame=requestAnimationFrame(animate);else stop();};
      frame=requestAnimationFrame(animate);
    });
    document.querySelectorAll('[data-move]').forEach(b=>b.addEventListener('click',()=>{location.hash=`camera/${b.dataset.move}`;}));
    dispose=stop;update();
    if(previousPage==='camera') document.querySelector(`[data-move="${current.id}"]`)?.focus({preventScroll:true});
  }
  if(page==='laboratorio'){
    const form=document.querySelector('#prompt-form');
    const output=document.querySelector('#prompt-output');
    const controls=[document.querySelector('[data-copy="lab"]'),document.querySelector('#download-prompt')];
    const update=()=>{
      // Enable conditional controls before reading FormData; otherwise switching
      // back to video silently drops the duration and selected movement once.
      const mode=form.elements.mode.value;
      document.querySelectorAll('.video-only').forEach(el=>{el.hidden=mode==='image';el.querySelector('input,select').disabled=mode==='image';});
      const values=Object.fromEntries(new FormData(form));
      const ready=form.checkValidity() && values.subject.trim().length>0 && values.environment.trim().length>0;
      controls.forEach(control=>{control.disabled=!ready;});
      if(!ready){output.value='';document.querySelector('#output-meta').textContent='Complete os campos e informe uma duração inteira de 2 a 10 segundos.';return false;}
      output.value=buildPrompt(values);
      document.querySelector('#output-meta').textContent=`${values.mode==='image'?'IMAGEM':`${values.duration}s SOLICITADOS`} · ${values.format} · REFERÊNCIA OBRIGATÓRIA`;
      return true;
    };
    form.addEventListener('input',update);form.addEventListener('change',update);
    form.addEventListener('submit',e=>{e.preventDefault();if(update())notify('Prompt atualizado. Confira os anexos antes de gerar.');});
    document.querySelector('#download-prompt').addEventListener('click',()=>download('frame-prompt.txt',document.querySelector('#prompt-output').value));update();
  }
  if(page==='prompts'){
    let category='Todos';const search=document.querySelector('#prompt-search');
    const render=()=>{
      const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
      const query=normalize(search.value);
      const list=promptLibrary.filter(p=>(category==='Todos'||p.category===category)&&normalize(`${p.title} ${p.description} ${p.prompt}`).includes(query));
      document.querySelector('#prompt-count').textContent=`${list.length} ${list.length===1?'prompt encontrado':'prompts encontrados'}`;
      document.querySelector('#prompt-results').innerHTML=list.length?list.map(p=>`<article class="card prompt-card"><div class="card-tag">${p.category.toUpperCase()} / ${p.id.toUpperCase()}</div><h3>${p.title}</h3><p>${p.description}</p><details><summary>Ver prompt completo</summary><div class="prompt-text">${escapeHTML(p.prompt)}</div></details>${copyButton(`prompt:${p.id}`)}</article>`).join(''):'<p class="empty full-width">Nenhum prompt encontrado. Experimente outro termo ou selecione Todos.</p>';
    };
    document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
    search.addEventListener('input',render);render();
  }
  if(page==='modelos') document.querySelectorAll('[data-tool-filter]').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('[data-tool-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    document.querySelectorAll('[data-kind]').forEach(card=>{card.hidden=b.dataset.toolFilter!=='Todas'&&card.dataset.kind!==b.dataset.toolFilter;});
  }));
  if(page==='storyboard') document.querySelector('#download-story').addEventListener('click',()=>download('frame-shot-list.txt',`FRAME · Estudo conceitual · 15 segundos\nRevisão ${reviewedAt}\nNão contém clipes gerados.\n\n`+storyboard.map((s,i)=>`PLANO ${i+1} · ${s.time}\n${s.name} | ${s.shot} | ${s.move}\n${s.detail}\nPROMPT:\n${s.prompt}`).join('\n\n')));
  if(page==='qualidade'){
    const checks=[...document.querySelectorAll('[data-qa]')];
    const saved=storageGet('frame-qa-v1',[]);checks.forEach(c=>{c.checked=saved.includes(Number(c.dataset.qa));});
    const update=()=>{const selected=checks.filter(x=>x.checked).map(x=>Number(x.dataset.qa));document.querySelector('#qa-count').value=`${selected.length} / ${qaItems.length}`;const progress=document.querySelector('.check-progress');progress.setAttribute('aria-valuenow',String(selected.length));progress.firstElementChild.style.width=`${selected.length/qaItems.length*100}%`;document.querySelector('#storage-note').textContent=storageSet('frame-qa-v1',selected)?'Salvo somente neste navegador.':'O navegador não permite salvar. Você ainda pode baixar a revisão.';};
    checks.forEach(c=>c.addEventListener('change',update));
    document.querySelector('#reset-qa').addEventListener('click',()=>{checks.forEach(c=>{c.checked=false;});update();notify('Checklist limpo.');});
    document.querySelector('#download-qa').addEventListener('click',()=>download('frame-revisao.txt',`FRAME · Revisão manual\nRegistro: ${new Date().toISOString()}\nCampanha/arquivo: preencher no registro de produção\n\n`+checks.map((c,i)=>`${c.checked?'[x]':'[ ]'} ${qaItems[i]}`).join('\n')+'\n\nMarcações humanas. Não constitui validação automática nem autorização de publicação.'));
    update();
  }
}

const shell=mountShell();
shell.setQueue(queueStats());
let previousPage;
function route(){
  dispose();dispose=()=>{};
  const [hashPage,section]=location.hash.slice(1).split('/');
  const raw=routeAliases[hashPage]||hashPage;
  const page=routeById(raw)?raw:'inicio';
  const renders={inicio:home,studio:studioMarkup,elenco:castMarkup,direcoes:directionsMarkup,fila:queueMarkup,guia:guide,camera,laboratorio:lab,prompts,storyboard:film,modelos:models,qualidade:quality,fontes:references,biblioteca:galleryMarkup,'como-usar':quickstartMarkup};
  const previousScroll=window.scrollY;
  main.innerHTML=renders[page](section);
  document.title=`${routeById(page).label} — FRAME Studio`;
  shell.setActive(page);
  if(page==='camera'&&previousPage==='camera')window.scrollTo({top:previousScroll,behavior:'instant'});
  else if(!section||page==='studio'){window.scrollTo({top:0,behavior:'instant'});}
  bind(page,section);
  if(previousPage!==undefined&&page!==previousPage)main.focus({preventScroll:true});
  previousPage=page;
}

document.addEventListener('click',async e=>{
  if(e.target.closest('.skip-link')){e.preventDefault();main.focus({preventScroll:true});main.scrollIntoView();return;}
  const b=e.target.closest('[data-copy]');if(!b)return;
  const [type,id]=b.dataset.copy.split(':');
  const text=type==='lab'?document.querySelector('#prompt-output')?.value:type==='move'?movements.find(x=>x.id===id)?.prompt:type==='prompt'?promptLibrary.find(x=>x.id===id)?.prompt:type==='story'?storyboard[Number(id)]?.prompt:undefined;
  if(!text)return;
  try{await navigator.clipboard.writeText(text);notify('Prompt copiado.');}catch{notify('Cópia indisponível. Selecione o texto do prompt ou baixe o arquivo.');}
});
window.addEventListener('hashchange',route);
route();
