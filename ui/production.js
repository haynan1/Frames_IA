import {movements} from '../data/content.js';
import {createProduction,parseProduction,validateProduction,productionTimeline,exportProductionText,productionOptions,MAX_PROJECT_BYTES,MAX_SHOTS} from '../data/production.js';
import {escapeHTML as esc} from './html.js';

const storageKey='frame-production-v1';
const options=(choices,value)=>Object.entries(choices).map(([id,label])=>`<option value="${esc(id)}"${id===value?' selected':''}>${esc(label)}</option>`).join('');
const field=(label,name,value,max,large=false)=>`<label class="field${large?' full-width':''}"><span>${label}</span>${large?`<textarea name="${name}" required maxlength="${max}">${esc(value)}</textarea>`:`<input name="${name}" required maxlength="${max}" value="${esc(value)}">`}</label>`;

function briefMarkup(b){
  return `<div class="form-grid">${field('Nome da produção','title',b.title,120)}${field('Arquivo de referência','reference',b.reference,120)}${field('Mensagem central · intenção editorial','message',b.message,600,true)}${field('Sujeito · em inglês para o prompt','subject',b.subject,800,true)}${field('Ambiente · em inglês para o prompt','environment',b.environment,500,true)}<label class="field"><span>Proporção</span><select name="format">${options(productionOptions.format,b.format)}</select></label><label class="field"><span>Luz</span><select name="light">${options(productionOptions.light,b.light)}</select></label><label class="field"><span>Ritmo</span><select name="rhythm">${options(productionOptions.rhythm,b.rhythm)}</select></label></div>`;
}

function shotMarkup(s,index){
  const number=index+1;
  return `<fieldset class="production-shot" data-shot="${index}"><legend>Tomada ${String(number).padStart(2,'0')}</legend><div class="shot-topline"><span class="shot-time" data-time-for="${index}"></span><button type="button" class="text-button" data-remove-shot="${index}" aria-label="Remover tomada ${number}">Remover</button></div><div class="form-grid">${field(`Título da tomada ${number}`,`shot-${index}-title`,s.title,100)}<label class="field"><span>Duração da tomada ${number} · segundos</span><input name="shot-${index}-duration" type="number" min="2" max="10" step="1" required value="${s.duration}"></label>${field(`Intenção da tomada ${number}`,`shot-${index}-intent`,s.intent,500,true)}<label class="field"><span>Câmera da tomada ${number}</span><select name="shot-${index}-movement">${options(Object.fromEntries(movements.map(m=>[m.id,m.name])),s.movement)}</select></label><label class="field"><span>Enquadramento da tomada ${number}</span><select name="shot-${index}-framing">${options(productionOptions.framing,s.framing)}</select></label></div></fieldset>`;
}

export function productionMarkup(){
  const initial=createProduction();
  return `<div class="production-banner"><img src="./assets/art-direction-triptych.webp" alt="Estudos conceituais de produto, pessoa fictícia e cenário de pedra" width="1881" height="836"><div><span class="eyebrow">DA REFERÊNCIA À SHOT LIST</span><p>Um briefing.<br><em>Cada tomada com uma função.</em></p></div></div><div class="production-toolbar"><div class="actions"><button type="button" class="button small" id="export-project">Exportar projeto .json ↓</button><button type="button" class="button secondary small" id="import-project">Importar projeto ↑</button><input type="file" id="project-file" accept=".json,application/json" hidden></div><p id="production-storage" role="status">Seu rascunho fica neste navegador.</p></div><p id="import-error" role="alert" hidden></p><div class="production-layout"><form id="production-form" novalidate><section class="panel"><span class="eyebrow">01 / BRIEFING</span><h2>O que precisa ficar.</h2><p>Mensagem e intenção orientam a montagem. Os prompts usam sujeito, ambiente e câmera; adicione a ação específica de cada cena depois de revisar a tomada. Apenas o nome da imagem é salvo aqui.</p><div id="production-brief">${briefMarkup(initial.brief)}</div></section><section class="panel production-takes"><span class="eyebrow">02 / SEQUÊNCIA</span><h2>Construa o percurso.</h2><p>De 2 a 10 segundos solicitados por tomada. Os intervalos abaixo são planejamento de montagem; confirme a duração disponível na ferramenta.</p><div id="production-shots">${initial.shots.map(shotMarkup).join('')}</div><div class="actions"><button type="button" class="button secondary small" id="add-shot">Adicionar tomada +</button><button type="button" class="button secondary small" id="undo-shot" hidden>Desfazer remoção</button></div></section></form><section class="panel production-delivery"><span class="eyebrow">03 / PACOTE DE PRODUÇÃO</span><h2>Leve a direção com você.</h2><div class="production-stats"><div><strong id="production-duration">15s</strong><span>DURAÇÃO PLANEJADA</span></div><div><strong id="production-count">5</strong><span>TOMADAS</span></div></div><p id="production-validation" role="status" aria-live="polite"></p><label class="field"><span>Shot list e prompts completos</span><textarea id="production-output" readonly spellcheck="false"></textarea></label><div class="actions"><button type="button" class="button small" id="copy-production">Copiar pacote ↗</button><button type="button" class="button secondary small" id="download-production">Baixar pacote .txt ↓</button></div><p class="note">Exportar salva briefing e tomadas, sem enviar dados. Importar substitui este rascunho local e oferece a opção de desfazer. O arquivo não inclui imagens, credenciais nem clipes gerados.</p><button type="button" class="text-button" id="undo-import" hidden>Desfazer importação</button></section></div>`;
}

export function mountProduction({notify,download}){
  let draft=createProduction(),valid=null,undoShot=null,undoImport=null,disposed=false;
  const form=document.querySelector('#production-form');
  const output=document.querySelector('#production-output');
  const storageStatus=document.querySelector('#production-storage');
  const validation=document.querySelector('#production-validation');
  const importError=document.querySelector('#import-error');
  const exportButton=document.querySelector('#export-project');
  const copyButton=document.querySelector('#copy-production');
  const downloadButton=document.querySelector('#download-production');
  let storageAvailable=true;

  try{
    const saved=localStorage.getItem(storageKey);
    if(saved)draft=parseProduction(saved);
  }catch{
    storageAvailable=false;
    storageStatus.textContent='Não foi possível restaurar o rascunho. O conteúdo anterior não será sobrescrito; exporte seu novo plano para guardar.';
  }

  function readForm(){
    const values=Object.fromEntries(new FormData(form));
    draft={version:1,brief:Object.fromEntries(['title','reference','message','subject','environment','format','light','rhythm'].map(key=>[key,values[key]])),shots:[...form.querySelectorAll('[data-shot]')].map((_,i)=>({title:values[`shot-${i}-title`],intent:values[`shot-${i}-intent`],movement:values[`shot-${i}-movement`],framing:values[`shot-${i}-framing`],duration:Number(values[`shot-${i}-duration`])}))};
  }

  function update(){
    try{
      valid=validateProduction(draft);
      const timeline=productionTimeline(valid);
      output.value=exportProductionText(valid);
      document.querySelector('#production-duration').textContent=`${timeline.at(-1).end}s`;
      document.querySelector('#production-count').textContent=String(timeline.length);
      timeline.forEach(s=>{document.querySelector(`[data-time-for="${s.index}"]`).textContent=`${String(s.start).padStart(2,'0')}—${String(s.end).padStart(2,'0')}s`;});
      validation.textContent='Plano pronto para exportar. Anexe a referência indicada em cada ferramenta de geração.';
      validation.classList.remove('field-error');
      if(storageAvailable){
        try{localStorage.setItem(storageKey,JSON.stringify(valid));storageStatus.textContent='Rascunho salvo somente neste navegador. Exporte uma cópia para guardar.';}
        catch{storageAvailable=false;storageStatus.textContent='O navegador não permite salvar. Seu plano continua disponível para exportação.';}
      }
    }catch(error){
      valid=null;output.value='';validation.textContent=error.message;validation.classList.add('field-error');
      document.querySelector('#production-duration').textContent='—';
      document.querySelector('#production-count').textContent=String(draft.shots.length);
      document.querySelectorAll('[data-time-for]').forEach(el=>{el.textContent='Intervalo pendente de validação';});
      if(storageAvailable)storageStatus.textContent='Há campos pendentes. A última versão válida continua salva neste navegador.';
    }
    exportButton.disabled=copyButton.disabled=downloadButton.disabled=!valid;
    document.querySelector('#add-shot').disabled=draft.shots.length>=MAX_SHOTS;
    document.querySelectorAll('[data-remove-shot]').forEach(b=>{b.disabled=draft.shots.length<=1;});
  }

  function renderShots(){document.querySelector('#production-shots').innerHTML=draft.shots.map(shotMarkup).join('');update();}
  function renderAll(){document.querySelector('#production-brief').innerHTML=briefMarkup(draft.brief);renderShots();}
  renderAll();
  form.addEventListener('input',()=>{readForm();update();});
  form.addEventListener('change',()=>{readForm();update();});
  form.addEventListener('submit',e=>e.preventDefault());
  form.addEventListener('click',e=>{
    const button=e.target.closest('[data-remove-shot]');if(!button)return;
    readForm();if(draft.shots.length<=1)return;
    const index=Number(button.dataset.removeShot);
    undoShot={shot:structuredClone(draft.shots[index]),index};draft.shots.splice(index,1);
    renderShots();document.querySelector('#undo-shot').hidden=false;
    document.querySelector('#undo-shot').focus({preventScroll:true});notify('Tomada removida. Você pode desfazer a remoção.');
  });
  document.querySelector('#add-shot').addEventListener('click',()=>{
    readForm();if(draft.shots.length>=MAX_SHOTS)return;
    draft.shots.push({title:'Nova tomada',intent:'Descreva o que o espectador precisa perceber.',movement:'static',framing:'medium',duration:3});renderShots();
    form.querySelector(`[name="shot-${draft.shots.length-1}-title"]`).focus();
  });
  document.querySelector('#undo-shot').addEventListener('click',()=>{
    if(!undoShot || draft.shots.length>=MAX_SHOTS){notify('Remova uma tomada para poder restaurar a anterior.');return;}
    readForm();const index=Math.min(undoShot.index,draft.shots.length);draft.shots.splice(index,0,undoShot.shot);undoShot=null;renderShots();document.querySelector('#undo-shot').hidden=true;form.querySelector(`[name="shot-${index}-title"]`).focus();
  });
  exportButton.addEventListener('click',()=>{if(valid)download('frame-producao.json',JSON.stringify(valid,null,2),'application/json;charset=utf-8');});
  downloadButton.addEventListener('click',()=>{if(valid)download('frame-pacote-producao.txt',exportProductionText(valid));});
  copyButton.addEventListener('click',async()=>{if(!valid)return;try{await navigator.clipboard.writeText(exportProductionText(valid));if(!disposed)notify('Pacote de produção copiado.');}catch{if(!disposed)notify('Cópia indisponível. Baixe o pacote em .txt.');}});

  const fileInput=document.querySelector('#project-file');
  document.querySelector('#import-project').addEventListener('click',()=>fileInput.click());
  fileInput.addEventListener('change',async()=>{
    const file=fileInput.files?.[0];if(!file)return;
    importError.hidden=true;
    try{
      if(file.size>MAX_PROJECT_BYTES)throw new Error('O arquivo de projeto deve ter no máximo 64 KB.');
      const candidate=parseProduction(await file.text());
      if(disposed)return;
      readForm();undoImport=structuredClone(draft);draft=candidate;undoShot=null;
      document.querySelector('#undo-shot').hidden=true;document.querySelector('#undo-import').hidden=false;
      renderAll();notify('Projeto importado. A substituição do rascunho pode ser desfeita.');
    }catch(error){if(!disposed){importError.hidden=false;importError.textContent=error.message;}}
    finally{if(!disposed)fileInput.value='';}
  });
  document.querySelector('#undo-import').addEventListener('click',()=>{
    if(!undoImport)return;
    draft=undoImport;undoImport=null;undoShot=null;document.querySelector('#undo-shot').hidden=true;document.querySelector('#undo-import').hidden=true;renderAll();notify('Rascunho anterior restaurado.');
  });
  return ()=>{disposed=true;};
}
