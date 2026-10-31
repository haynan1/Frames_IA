import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createProduction,validateProduction,parseProduction,productionTimeline,exportProductionText} from '../data/production.js';
import {buildPrompt} from '../data/prompt-builder.js';

test('A project round trip preserves the briefing and produces a contiguous 15-second timeline',()=>{
  const p=createProduction();const restored=parseProduction(JSON.stringify(p));assert.deepEqual(restored,p);
  const timeline=productionTimeline(restored);assert.equal(timeline[0].start,0);assert.equal(timeline.at(-1).end,15);
  timeline.forEach((s,i)=>{assert.equal(s.end-s.start,s.duration);if(i)assert.equal(s.start,timeline[i-1].end);assert.match(s.prompt,new RegExp(`${s.duration}-second`));});
});
test('Each shot receives the custom briefing and reference in its exported prompt',()=>{
  const p=createProduction();p.brief.reference='produto-v2.webp';p.brief.subject='the approved green bottle';p.shots[1].duration=7;
  const output=exportProductionText(p);assert.match(output,/Duração planejada: 19s/);assert.match(output,/3–10s/);assert.match(output,/7-second/);
  for(const s of productionTimeline(p)){assert.match(s.prompt,/produto-v2.webp/);assert.match(s.prompt,/the approved green bottle/);}
});
test('Invalid imports fail before state replacement',()=>{
  assert.throws(()=>parseProduction('{broken'),/JSON/);
  assert.throws(()=>parseProduction(' '.repeat(65537)),/64 KB/);
  const base=createProduction();
  for(const mutate of [p=>p.version=2,p=>p.brief=null,p=>p.shots=[],p=>p.shots[0].duration='3',p=>p.shots[0].duration=0,p=>p.shots[0].duration=Infinity,p=>p.shots[0].duration=3.5,p=>p.shots[0].movement='unknown',p=>p.brief.format='__proto__',p=>p.brief.reference='../../secret.png',p=>p.brief.reference='https://example.com/a.png']){
    const candidate=structuredClone(base);mutate(candidate);assert.throws(()=>validateProduction(candidate));
  }
  assert.deepEqual(base,createProduction());
});
test('Imported unknown keys and prototype names are not propagated',()=>{
  const p=JSON.parse(JSON.stringify(createProduction()));p.unwanted='drop';p.brief.apiKey='drop';p.shots[0].html='drop';
  const data=JSON.stringify(p).replace('"version":1','"__proto__":{"polluted":true},"version":1');
  const clean=parseProduction(data);assert.equal(Object.hasOwn(clean,'__proto__'),false);assert.equal(Object.hasOwn(clean,'unwanted'),false);assert.equal(clean.brief.apiKey,undefined);assert.equal(clean.shots[0].html,undefined);assert.equal({}.polluted,undefined);
});
test('Non-ASCII oversized files, sparse arrays and blank fields are rejected',()=>{
  assert.throws(()=>parseProduction('ã'.repeat(33000)),/64 KB/);
  const p=createProduction();p.shots=new Array(2);assert.throws(()=>validateProduction(p),/dados inválidos/);
  p.shots=createProduction().shots;p.brief.title='  ';assert.throws(()=>validateProduction(p),/Nome da produção/);
});
test('Duration fallbacks cannot emit Infinity, decimals or non-finite camera durations',()=>{
  for(const value of [Infinity,-Infinity,'nonsense',undefined])assert.match(buildPrompt({duration:value}),/4-second/);
  assert.match(buildPrompt({duration:3.6}),/4-second/);
  assert.match(buildPrompt({reference:'produto.webp'}),/produto.webp/);
  assert.doesNotMatch(buildPrompt({reference:'../../other.png'}),/other.png/);
});
