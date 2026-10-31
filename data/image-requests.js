// The image production queue. This is the single source Codex (or any image
// agent) reads to know which images to generate, where they go and how they are
// accepted. docs/codex/FILA-DE-IMAGENS.md and fila.json are generated from it.
import {cast, castViews, castAssetPath, castFileName, castById} from './cast.js';
import {directions, directionAssetPath} from './directions.js';
import {createStudioProject, compileProject, keyframeAsset, projectSlug, lights, grades} from './studio.js';
import {generatedAssets} from './generated-assets.js';

export const SHOWCASE_ID = 'sarcenet-capsula-seda';
const realism = 'Photorealistic, shot on a full-frame digital camera. Natural skin texture with pores and fine vellus hair, no plastic smoothing or beauty filter. Anatomically correct hands with five fingers. Physically plausible seams, stitching and fabric weight. Believable contact shadows and true optical depth of field.';
const noMarks = 'No text, no logos, no watermarks, no borders, no extra panels.';
const fictional = 'Fictional adult model: not a real person and not resembling any celebrity or public figure.';
const id = (...parts) => parts.join('-').toUpperCase().replace(/[^A-Z0-9]+/g, '-');

function castRequests() {
  return cast.flatMap(m => castViews.map(v => {
    const refs = v.id === 'rosto-frente' ? [] : v.id === 'corpo-frente' ? [castAssetPath(m.id, 'rosto-frente')] : [castAssetPath(m.id, 'rosto-frente'), castAssetPath(m.id, 'corpo-frente')];
    const editorial = v.id === 'editorial';
    return {
      id: id('cast', m.id, v.id), group: 'Elenco', priority: v.priority, title: `${m.code} ${m.name} · ${v.label}`,
      target: castAssetPath(m.id, v.id), size: '1024x1536', references: refs, usedBy: `#elenco/${m.id}`,
      prompt: [
        `${editorial ? 'Editorial portrait' : 'Model agency digital (casting polaroid style)'} · ${v.label} · ${m.code} ${m.name}. ONE photograph, not a collage or contact sheet.`,
        refs.length ? `Attach and match exactly: ${refs.map(r => r.split('/').slice(-2).join('/')).join(', ')} (same face, hair, skin tone and body proportions).` : 'This is the identity anchor for every future image of this model.',
        `Identity: ${m.identity}.`,
        `Wardrobe: ${editorial ? 'plain ivory silk-satin button-up blouse, no jewelry' : m.digitals}.`,
        `View: ${v.view}`,
        editorial ? 'Set: warm off-white plaster wall, sheer ivory voile curtain at the edge of frame.' : 'Studio: seamless warm light-gray paper backdrop (#D9D6CF), large octabox above the camera with white fill from below, soft natural shadow on the floor.',
        realism,
        `Vertical 2:3 composition, 1024x1536. ${fictional} ${noMarks}`
      ].join('\n'),
      accept: [
        refs.length ? 'Identidade idêntica ao rosto-frente: formato do rosto, olhos, sobrancelhas, marcas, cabelo e tom de pele.' : 'Rosto frontal nítido, expressão neutra, orelhas visíveis, luz uniforme.',
        v.body ? 'Cabeça e os dois pés inteiros no quadro, com margem; proporções naturais.' : 'Cabeça e ombros centrados, sem cortar o queixo ou o topo do cabelo.',
        'Pele com textura real, mãos com cinco dedos, sem joias, logo ou texto.'
      ]
    };
  }));
}

function directionRequests() {
  return directions.flatMap(d => {
    const m = castById(d.hero.castId);
    const palette = d.palette.map(c => `${c.name} ${c.hex}`).join(', ');
    return [
      {id: id('dir', d.id, 'hero'), group: 'Direções', priority: 'P0', title: `${d.name} · imagem-chave`, target: directionAssetPath(d.id, 'hero'), size: '1024x1536', usedBy: `#direcoes/${d.id}`,
        references: [castAssetPath(m.id, 'rosto-frente'), castAssetPath(m.id, 'corpo-frente')],
        prompt: [
          `Art direction key image · "${d.name}". ONE editorial fashion photograph for a clothing store campaign.`,
          `Attach and match exactly: ${castFileName(m.id, 'rosto-frente')}, ${castFileName(m.id, 'corpo-frente')}.`,
          `Talent: ${m.code} ${m.name}, a ${m.identity}.`,
          `Wardrobe: ${d.hero.wardrobe}; no logos, no visible brand.`,
          'Pose: natural confident editorial pose, three-quarter view, medium long shot from the knees up, garment construction fully readable.',
          `Set: ${d.environment}.`,
          `Light: ${lights[d.light].en}. Art direction: ${d.artDirection}. Lens and exposure feel: ${d.lens}. Color: ${grades[d.grade].en}. Palette: ${palette}.`,
          realism,
          `Vertical 2:3, 1024x1536, safe for 4:5 and 9:16 crops. ${fictional} ${noMarks}`
        ].join('\n'),
        accept: ['Mesma identidade da modelo indicada.', 'Peça descrita sem logos, construção legível.', 'Luz e paleta coerentes com a direção.']},
      {id: id('dir', d.id, 'plate'), group: 'Direções', priority: 'P1', title: `${d.name} · cenário vazio`, target: directionAssetPath(d.id, 'plate'), size: '1536x1024', usedBy: `#direcoes/${d.id}`,
        references: [directionAssetPath(d.id, 'hero')],
        prompt: [
          `Empty set plate · "${d.name}". ONE photograph of the location with nobody in it, used as a background and continuity reference.`,
          `Attach for location continuity: ${d.id}/hero.webp (same set, same light, no person).`,
          `Set: ${d.environment}.`,
          `Light: ${lights[d.light].en}. Art direction: ${d.artDirection}. Color: ${grades[d.grade].en}. Palette: ${palette}.`,
          'Camera at chest height, 35mm, wide establishing composition with clear floor area where a model could stand.',
          'Photorealistic architectural photography, true perspective, straight verticals, natural materials.',
          `Horizontal 3:2, 1536x1024. No people. ${noMarks}`
        ].join('\n'),
        accept: ['Nenhuma pessoa.', 'Mesmo cenário e direção de luz da imagem-chave.', 'Verticais retas, sem texto ou placas legíveis.']}
    ];
  });
}

function showcaseRequests() {
  const project = createStudioProject(SHOWCASE_ID);
  const slug = projectSlug(project);
  const base = `assets/projects/${slug}`;
  const garment = 'champagne silk-satin bias-cut midi slip dress, thin adjustable spaghetti straps, soft cowl neckline, low scoop back with crossed straps, hem at mid-calf, no logo, no print';
  const garmentShots = [
    ['peca-frente', 'Frente', 'front view, the full dress centered, straps and cowl neckline readable'],
    ['peca-costas', 'Costas', 'back view, the full dress centered, low scoop back and crossed straps clearly readable'],
    ['peca-detalhe', 'Detalhe', 'macro detail of the cowl neckline folds and strap attachment, silk sheen and fine weave visible']
  ].map(([key, label, view]) => ({
    id: id('show', key), group: 'Campanha Sarcenet', priority: 'P0', title: `Peça · ${label}`, target: `${base}/${key}.webp`, size: '1024x1536', usedBy: '#studio/2',
    references: key === 'peca-frente' ? [] : [`${base}/peca-frente.webp`],
    prompt: [
      `Product reference · ${label}. ONE e-commerce product photograph of a fictional garment, not a collage.`,
      key === 'peca-frente' ? 'This is the garment identity anchor for the whole campaign.' : 'Attach and match exactly: peca-frente.webp (same garment, color, cut and fabric).',
      `Garment: ${garment}.`,
      `View: ${view}. Presented on an invisible ghost mannequin with natural volume, on a seamless warm ivory background with a soft shadow.`,
      'Light: large soft key at 45 degrees with gentle fill; the silk shows a liquid specular sheen without blown highlights. True-to-life champagne color.',
      'Photorealistic, physically plausible seams and stitching.',
      `Vertical 2:3, 1024x1536. No mannequin visible, no hanger, no person. ${noMarks}`
    ].join('\n'),
    accept: ['Mesma peça em todas as vistas: cor, corte, alças e comprimento.', 'Seda com brilho natural, sem estourar.', 'Sem manequim, cabide, logo ou texto visíveis.']
  }));
  const resolve = name => {
    const castMatch = name.match(/^(sc-\d{2})-(.+)\.webp$/);
    if (castMatch) return castAssetPath(castMatch[1], castMatch[2]);
    const frame = name.match(new RegExp(`^${slug}-(s\\d{2})-([ab])\\.png$`));
    if (frame) return `${base}/${frame[1]}-${frame[2]}.webp`;
    return `${base}/${name}`;
  };
  const frames = compileProject(project).flatMap(c => [['a', c.keyA], ...(c.keyB ? [['b', c.keyB]] : [])].map(([which, prompt]) => {
    const attach = prompt.split('\n').find(l => l.startsWith('Attach and follow: ')).slice(19, -1).split(', ');
    return {
      id: id('show', `s${String(c.index + 1).padStart(2, '0')}`, which), group: 'Campanha Sarcenet', priority: 'P0',
      title: `Tomada ${c.index + 1} · ${c.title} · keyframe ${which.toUpperCase()}`, target: keyframeAsset(project, c.index, which), size: '1024x1536', usedBy: '#studio/4',
      references: attach.map(resolve), prompt,
      accept: ['Identidade de Helena e vestido idênticos às referências.', `Enquadramento e ângulo exatamente como descritos (${c.title}).`, 'Composição 9:16 segura; mãos, alças e barra plausíveis; sem texto.']
    };
  }));
  return [...garmentShots, ...frames];
}

const cover = {
  id: 'HOME-CAPA', group: 'Site', priority: 'P0', title: 'Capa do studio', target: 'assets/studio/capa.webp', size: '1536x1024', usedBy: '#inicio',
  references: [castAssetPath('sc-01', 'rosto-frente'), castAssetPath('sc-01', 'corpo-frente'), `assets/projects/${SHOWCASE_ID}/peca-frente.webp`],
  prompt: [
    'Cinematic behind-the-scenes photograph of a fashion film set. ONE photograph.',
    'Attach and match exactly: sc-01-rosto-frente.webp, sc-01-corpo-frente.webp, peca-frente.webp.',
    `Talent: SC-01 Helena, a ${castById('sc-01').identity}, wearing the champagne silk-satin bias-cut midi slip dress from peca-frente.webp, standing calmly in the middle ground.`,
    'Set: a warm ivory cyclorama studio; tall window light through sheer voile from the left; a large octabox on a stand at the edge of frame; in the soft-focus foreground, a cinema camera on a dolly with a short track, a monitor showing the framed shot. No crew faces visible.',
    'Mood: calm, precise, premium craft. Warm champagne and ivory palette with deep warm shadows. 35mm lens look, shallow depth of field on the camera, the talent in focus.',
    realism,
    `Horizontal 3:2, 1536x1024, with quiet negative space on the left third for a headline added later in code. ${fictional} ${noMarks}`
  ].join('\n'),
  accept: ['Helena e o vestido reconhecíveis.', 'Equipamento plausível, sem marcas legíveis.', 'Espaço vazio à esquerda para título.']
};

function withDependencies(list) {
  const byTarget = new Map(list.map(r => [r.target, r]));
  for (const r of list) r.dependsOn = r.references.filter(path => byTarget.has(path)).map(path => byTarget.get(path).id);
  // A request that a P0 image depends on must be generated first, so it inherits P0.
  let changed = true;
  while (changed) {
    changed = false;
    for (const r of list) if (r.priority === 'P0') for (const dep of r.dependsOn) {
      const target = list.find(x => x.id === dep);
      if (target.priority !== 'P0') { target.priority = 'P0'; changed = true; }
    }
  }
  const wave = new Map();
  const level = r => {
    if (wave.has(r.id)) return wave.get(r.id);
    wave.set(r.id, 0);
    const value = r.dependsOn.length ? 1 + Math.max(...r.dependsOn.map(d => level(list.find(x => x.id === d)))) : 1;
    wave.set(r.id, value);
    return value;
  };
  list.forEach(r => { r.wave = level(r); r.incoming = `incoming/${r.id}.png`; });
  const rank = {P0: 0, P1: 1, P2: 2};
  return list.sort((a, b) => rank[a.priority] - rank[b.priority] || a.wave - b.wave);
}

export const imageRequests = withDependencies([...castRequests(), ...directionRequests(), ...showcaseRequests(), cover]);
export const requestGroups = ['Elenco', 'Direções', 'Campanha Sarcenet', 'Site'];
export const isGenerated = path => Object.hasOwn(generatedAssets, path);
export const assetSrc = (path, thumb = false) => isGenerated(path) ? `./${thumb && generatedAssets[path].thumb ? generatedAssets[path].thumb : path}` : null;
export function queueStats(list = imageRequests) {
  const done = list.filter(r => isGenerated(r.target)).length;
  return {total: list.length, done, pending: list.length - done, p0: list.filter(r => r.priority === 'P0').length, p0Done: list.filter(r => r.priority === 'P0' && isGenerated(r.target)).length};
}
