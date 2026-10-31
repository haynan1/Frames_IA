import {movements} from './content.js';
import {buildPrompt} from './prompt-builder.js';

export const PRODUCTION_VERSION = 1;
export const MAX_PROJECT_BYTES = 65536;
export const MAX_SHOTS = 12;
export const productionOptions = {
  framing: {full:'Inteiro / corpo inteiro',medium:'Plano médio',close:'Close-up',macro:'Macro / detalhe'},
  light: {window:'Janela difusa lateral',hard:'Dura e rasante',back:'Contraluz com preenchimento',overcast:'Dia encoberto'},
  rhythm: {slow:'Lento e controlado',moderate:'Moderado e fluido',fast:'Rápido e legível'},
  format: {'9:16':'9:16','4:5':'4:5','16:9':'16:9','1:1':'1:1'}
};

export function createProduction(){
  return {
    version:PRODUCTION_VERSION,
    brief:{title:'Estudo de produto · 15 segundos',subject:'the approved amber glass bottle, stationary on a stone plinth',environment:'a quiet sandstone studio with a dark olive background',reference:'referencia-aprovada.png',format:'9:16',light:'window',rhythm:'slow',message:'Revelar a forma e a materialidade do produto, sem alegar benefícios não confirmados.'},
    shots:[
      {title:'A pergunta',intent:'Abrir com um detalhe reconhecível do produto.',movement:'dolly-in',framing:'close',duration:3},
      {title:'A revelação',intent:'Mostrar a silhueta inteira e seu apoio.',movement:'dolly-out',framing:'close',duration:3},
      {title:'O volume',intent:'Revelar uma nova face com um arco curto.',movement:'orbit',framing:'medium',duration:3},
      {title:'O detalhe',intent:'Descrever a superfície sem inventar acabamento.',movement:'truck',framing:'macro',duration:3},
      {title:'O encerramento',intent:'Manter o produto legível para o CTA na edição.',movement:'static',framing:'medium',duration:3}
    ]
  };
}

function record(value){return value!==null && typeof value==='object' && !Array.isArray(value);}
function text(value,name,max){
  if(typeof value!=='string' || !value.trim() || value.length>max)throw new Error(`${name}: preencha de 1 a ${max} caracteres.`);
  if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value))throw new Error(`${name}: remova os caracteres de controle.`);
  return value.trim();
}
function option(value,choices,name){
  if(typeof value!=='string' || !Object.hasOwn(choices,value))throw new Error(`${name}: escolha uma opção disponível.`);
  return value;
}

/** A strict, bounded schema. Never spread imported objects into application state. */
export function validateProduction(value){
  if(!record(value) || value.version!==PRODUCTION_VERSION || !record(value.brief))throw new Error('Formato de projeto incompatível. Use um arquivo exportado pelo FRAME, versão 1.');
  const b=value.brief;
  const brief={
    title:text(b.title,'Nome da produção',120),subject:text(b.subject,'Sujeito',800),environment:text(b.environment,'Ambiente',500),
    reference:text(b.reference,'Nome da referência',120),message:text(b.message,'Mensagem central',600),
    format:option(b.format,productionOptions.format,'Proporção'),light:option(b.light,productionOptions.light,'Luz'),rhythm:option(b.rhythm,productionOptions.rhythm,'Ritmo')
  };
  if(!/^[\p{L}\p{N}_. -]+\.(png|jpe?g|webp)$/iu.test(brief.reference) || brief.reference.includes('..'))throw new Error('Referência: informe somente um nome de imagem .png, .jpg ou .webp, sem pastas ou links.');
  if(!Array.isArray(value.shots) || value.shots.length<1 || value.shots.length>MAX_SHOTS)throw new Error(`A produção precisa ter de 1 a ${MAX_SHOTS} tomadas.`);
  const shots=Array.from(value.shots,(s,index)=>{
    if(!record(s))throw new Error(`Tomada ${index+1}: dados inválidos.`);
    if(typeof s.duration!=='number' || !Number.isInteger(s.duration) || s.duration<2 || s.duration>10)throw new Error(`Tomada ${index+1}: a duração deve ser um número inteiro entre 2 e 10 segundos.`);
    if(!movements.some(m=>m.id===s.movement))throw new Error(`Tomada ${index+1}: movimento desconhecido.`);
    return {title:text(s.title,`Título da tomada ${index+1}`,100),intent:text(s.intent,`Intenção da tomada ${index+1}`,500),movement:s.movement,framing:option(s.framing,productionOptions.framing,`Enquadramento da tomada ${index+1}`),duration:s.duration};
  });
  return {version:PRODUCTION_VERSION,brief,shots};
}

export function parseProduction(serialized){
  if(typeof serialized!=='string' || new TextEncoder().encode(serialized).length>MAX_PROJECT_BYTES)throw new Error('O arquivo de projeto deve ter no máximo 64 KB.');
  let value;
  try{value=JSON.parse(serialized);}catch{throw new Error('Não foi possível ler o JSON. Selecione um projeto exportado pelo FRAME.');}
  return validateProduction(value);
}

export function productionTimeline(project){
  const {brief,shots}=validateProduction(project);
  let elapsed=0;
  return shots.map((s,index)=>{
    const start=elapsed;elapsed+=s.duration;
    const prompt=buildPrompt({...brief,...s,mode:'video'});
    return {...s,index,start,end:elapsed,prompt};
  });
}

export function exportProductionText(project){
  const p=validateProduction(project);
  const timeline=productionTimeline(p);
  const duration=timeline.at(-1).end;
  return `FRAME · PLANO DE PRODUÇÃO\n${p.brief.title}\n\nMENSAGEM / INTENÇÃO EDITORIAL\n${p.brief.message}\n\nBRIEFING\nSujeito: ${p.brief.subject}\nAmbiente: ${p.brief.environment}\nReferência a anexar: ${p.brief.reference}\nProporção: ${p.brief.format}\nDuração planejada: ${duration}s\n\n`+
    timeline.map(s=>`TOMADA ${s.index+1} · ${s.start}–${s.end}s · ${s.title}\nINTENÇÃO: ${s.intent}\nCÂMERA: ${movements.find(m=>m.id===s.movement).name}\nPROMPT PARA GERAÇÃO:\n${s.prompt}`).join('\n\n')+
    '\n\nOs intervalos são o plano de montagem. A duração, a resolução e as referências precisam ser configuradas e conferidas na ferramenta. As intenções editoriais não comprovam fatos sobre um produto. Nenhum clipe foi gerado por este planejador.\n';
}
