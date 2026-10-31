import {cp, mkdir, readdir, readFile, rm, stat, writeFile} from 'node:fs/promises';
import {resolve, dirname, basename} from 'node:path';
import {chapters, promptLibrary, movements} from '../data/content.js';
import {galleryStudies,galleryStudyText} from '../data/gallery.js';
import {galleryReviews} from '../data/gallery-review.js';
import {writeCodexQueue} from './codex-queue.mjs';

const root=resolve(import.meta.dirname,'..');
const output=resolve(root,'dist');
if(dirname(output)!==root || basename(output)!=='dist')throw new Error('Unsafe build output path.');
// The Codex queue is derived from data so the brief, the site and the ingest script never diverge.
await writeCodexQueue(root);
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
// Explicit publication allowlist prevents private references and credentials from shipping.
const entries=['index.html','styles.css','studio.css','app.js','assets','data','ui','docs','README.md','LICENSE'];
for(const name of entries) await cp(resolve(root,name),resolve(output,name),{recursive:true});
await writeFile(resolve(output,'.nojekyll'),'');
await writeFile(resolve(root,'docs/GUIA.md'),`# FRAME — Guia de direção de arte com IA\n\nConteúdo autoral · revisão 30.10.2026. Consulte o site para imagens e ferramentas interativas.\n\n`+chapters.map(c=>`## ${c.number} · ${c.title}\n\n${c.intro}\n\n`+c.items.map(([title,body])=>`### ${title}\n\n${body}`).join('\n\n')).join('\n\n')+'\n\n## Atlas de câmera\n\n'+movements.map(m=>`### ${m.name}\n\n${m.description}\n\nUso: ${m.use}\n\nRevisão: ${m.risk}\n\n\`\`\`text\n${m.prompt}\n\`\`\``).join('\n\n')+'\n\n## Prompts autorais\n\n'+promptLibrary.map(p=>`### ${p.title}\n\n${p.description}\n\n\`\`\`text\n${p.prompt}\n\`\`\``).join('\n\n')+'\n');
await cp(resolve(root,'docs/GUIA.md'),resolve(output,'docs/GUIA.md'));
await writeFile(resolve(root,'docs/BIBLIOTECA.md'),'# Biblioteca visual FRAME\n\n10 cenários · 30 frames individuais · imagens geradas em 30.10.2026. Direções de vídeo propostas, ainda não testadas.\n\n'+galleryStudies.map(s=>galleryStudyText(s)+'\n\nCuradoria visual: '+galleryReviews[s.id].strength+'\n\nRevisar: '+galleryReviews[s.id].caution).join('\n\n---\n\n'));
await cp(resolve(root,'docs/BIBLIOTECA.md'),resolve(output,'docs/BIBLIOTECA.md'));

async function totalSize(dir){let size=0;for(const entry of await readdir(dir,{withFileTypes:true})){const file=resolve(dir,entry.name);size+=entry.isDirectory()?await totalSize(file):(await stat(file)).size;}return size;}
const html=await readFile(resolve(output,'index.html'),'utf8');
if(/(?:src|href)="\/(?!\/)/.test(html))throw new Error('Root-absolute paths break project Pages deployments.');
console.log(`Site ready: dist/ (${Math.round(await totalSize(output)/1024)} KB). No dependencies or API keys required.`);
