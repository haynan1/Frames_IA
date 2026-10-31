import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {galleryStudies,gallerySearch,galleryStudyText,findGalleryStudy} from '../data/gallery.js';
import {galleryAssets} from '../data/gallery-assets.js';
import {galleryReviews} from '../data/gallery-review.js';
import {movements} from '../data/content.js';

test('The visual library contains ten distinct scenarios, six clothing stories and thirty individual frames',()=>{
  assert.equal(galleryStudies.length,10);assert.equal(galleryStudies.filter(s=>s.category==='Clothing').length,6);
  assert.equal(new Set(galleryStudies.map(s=>s.id)).size,10);
  const frames=galleryStudies.flatMap(s=>s.frames);assert.equal(frames.length,30);assert.equal(new Set(frames.map(f=>f.asset)).size,30);
  for(const s of galleryStudies){assert.equal(s.frames.length,3);assert.ok(s.wardrobe.length>20);assert.ok(s.avoid.length>40);assert.ok(s.repair.length>40);}
});

test('Every frame has separate image and animation direction with matching planned duration',()=>{
  for(const s of galleryStudies)for(const f of s.frames){
    assert.match(f.imagePrompt,/ONE individual photographic image/);
    assert.ok(f.imagePrompt.length>500);assert.ok(f.animationPrompt.length>200);
    assert.ok(f.animationPrompt.includes(`${s.duration/3}-second shot`));
    assert.ok(f.animationPrompt.includes(`${s.id}-0${f.number}.webp`));
    assert.ok(movements.some(m=>m.id===f.move));
    if(f.number>1)assert.match(f.imagePrompt,/Reference image 1/);
  }
  const lookbook=findGalleryStudy('capsula-tres-looks');
  assert.match(lookbook.frames[1].imagePrompt,/wardrobe change.*intentional/);
  assert.match(lookbook.frames[2].animationPrompt,/not a morph/);
});

test('All original generated files and lightweight thumbnails exist as distinct WebP assets',async()=>{
  const filenames=new Set();
  for(const s of galleryStudies)for(const f of s.frames){
    const meta=galleryAssets[f.asset];assert.ok(meta,`Missing metadata: ${f.asset}`);
    assert.ok(Number.isInteger(meta.width)&&meta.width>=800);assert.ok(Number.isInteger(meta.height)&&meta.height>=800);
    assert.equal(meta.upscaled,false);assert.equal(meta.method,'built-in image_gen');assert.ok(meta.thumbnailWidth<=640);assert.ok(meta.thumbnailHeight<=800);
    assert.equal(meta.referenceFrame,f.number===1?null:`${s.id}-01.webp`);
    filenames.add(meta.sourceFilename);
    for(const path of [f.asset,f.thumb]){
      assert.match(path,/^\.\/assets\/gallery\/[a-z0-9-]+\/0[1-3](-thumb)?\.webp$/);
      const bytes=await readFile(new URL('../'+path.slice(2),import.meta.url));
      assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
    }
    assert.equal((await stat(new URL('../'+f.asset.slice(2),import.meta.url))).size,meta.bytes);
  }
  assert.equal(filenames.size,30,'Each frame must originate from its own generation output.');
  assert.equal(Object.keys(galleryAssets).length,30);
});

test('Search handles Portuguese accents, category filters and an empty result',()=>{
  assert.equal(gallerySearch('linho','Clothing')[0].id,'linho-costa');
  assert.ok(gallerySearch('trico','Clothing').some(s=>s.id==='tricot-biblioteca'));
  assert.equal(gallerySearch('','Produto').length,4);assert.equal(gallerySearch('nao-existe-estudo').length,0);
});

test('Curated visual observations exist for each story without claiming a video benchmark',()=>{
  for(const s of galleryStudies){const r=galleryReviews[s.id];assert.ok(r,`Missing visual review: ${s.id}`);assert.ok(r.strength.length>70);assert.ok(r.caution.length>70);assert.equal(r.videoTested,false);}
  assert.doesNotMatch(JSON.stringify(galleryAssets),/[A-Z]:\\|api[_-]?key|base64/);
});

test('Exported study includes every prompt, proposed narration and explicit limits',()=>{
  const s=galleryStudies[0],text=galleryStudyText(s);
  for(const f of s.frames){assert.ok(text.includes(f.imagePrompt));assert.ok(text.includes(f.animationPrompt));}
  assert.ok(text.includes(s.voice));assert.match(text,/ainda precisam ser gerados/);assert.match(text,/Estudo conceitual/);
});
