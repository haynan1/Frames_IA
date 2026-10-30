import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {movements,chapters,promptLibrary,tools,storyboard,qaItems,reviewedAt} from '../data/content.js';
import {buildPrompt} from '../data/prompt-builder.js';

test('Content identifiers are unique and every section is substantive',()=>{
  for(const list of [movements,chapters,promptLibrary,tools])assert.equal(new Set(list.map(x=>x.id)).size,list.length);
  for(const c of chapters){assert.ok(c.items.length>=4);for(const [title,body] of c.items){assert.ok(title.length>5);assert.ok(body.length>100);}}
  assert.equal(movements.length,14);assert.equal(promptLibrary.length,12);assert.equal(storyboard.length,5);assert.equal(qaItems.length,10);
});
test('All camera modes generate distinct actionable instructions',()=>{
  const generated=movements.map(m=>buildPrompt({movement:m.id,mode:'video',duration:4,format:'9:16'}));
  assert.equal(new Set(generated).size,movements.length);
  for(const prompt of generated){assert.match(prompt,/referencia-aprovada.png/);assert.match(prompt,/4-second/);assert.match(prompt,/Human|Review/);assert.doesNotMatch(prompt,/undefined|null|\[object/);}
  assert.match(generated[movements.findIndex(m=>m.id==='zoom')],/position stays fixed/);
  assert.match(generated[movements.findIndex(m=>m.id==='orbit')],/object does not rotate/);
});
test('Image mode removes video motion, duration and audio instructions',()=>{
  const prompt=buildPrompt({mode:'image',duration:9,movement:'orbit',subject:'approved linen jacket',format:'4:5'});
  assert.match(prompt,/photographic still/);assert.match(prompt,/4:5/);assert.match(prompt,/approved linen jacket/);assert.doesNotMatch(prompt,/9-second|clockwise|dialogue|music/);
});
test('Invalid parameters receive bounded defaults',()=>{
  const prompt=buildPrompt({duration:900,format:'bogus',movement:'missing'});
  assert.match(prompt,/10-second/);assert.match(prompt,/9:16/);assert.doesNotMatch(prompt,/undefined/);
  assert.match(buildPrompt({duration:-4}),/2-second/);
});
test('Tool claims have HTTPS official sources and explicit review dates',()=>{
  for(const tool of tools){assert.equal(new URL(tool.source).protocol,'https:');assert.match(tool.checked,/^\d{4}-\d{2}-\d{2}$/);assert.ok(Date.parse(tool.checked)<=Date.parse(reviewedAt));assert.ok(tool.limit.length>40);}
});
test('Published HTML uses a content security policy and relative assets',async()=>{
  const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
  assert.match(html,/Content-Security-Policy/);assert.match(html,/lang="pt-BR"/);assert.doesNotMatch(html,/(?:src|href)="\/(?!\/)/);
  for(const file of ['product.webp','model.webp','scene.webp','identity.webp'])assert.ok((await readdir(new URL('../assets',import.meta.url))).includes(file));
});
test('Production has no third-party runtime requests or HTML interpolation of user fields',async()=>{
  const app=await readFile(new URL('../app.js',import.meta.url),'utf8');
  assert.doesNotMatch(app,/eval\(|new Function|fetch\(|https?:\/\//);
  assert.match(app,/prompt-output'\)\.value=buildPrompt/);
  const build=await readFile(new URL('../scripts/build.mjs',import.meta.url),'utf8');
  assert.doesNotMatch(build,/cp\(root,/);assert.match(build,/publication allowlist/);
});
