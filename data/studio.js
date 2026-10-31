import {movements} from './content.js';
import {castById, castFileName, castAssetPath, castViews} from './cast.js';
import {directionById} from './directions.js';
import {storeModelById, storeFileName} from './store-models.js';
import {brandPresets} from './brand.js';
import {validateProduction} from './production.js';

export const STUDIO_VERSION = 2;
export const MAX_STUDIO_BYTES = 131072;
export const MAX_STUDIO_SHOTS = 16;
export const MAX_STUDIO_SECONDS = 120;

// Shot sizes follow the Brazilian shot vocabulary. `cover` is the vertical
// subject coverage in metres used to derive camera distance and framing previews.
export const shotSizes = {
  macro: {label: 'Macro de textura', abbr: 'MAC', cover: 0.045, aperture: 'f/8', en: 'true macro of the fabric, a field about 4 cm tall where yarns, stitches and sheen are readable'},
  ecu: {label: 'Plano detalhe', abbr: 'PD', cover: 0.14, aperture: 'f/5.6', en: 'extreme close-up of one garment detail, a field about 14 cm tall'},
  cu: {label: 'Primeiríssimo plano', abbr: 'PPP', cover: 0.32, aperture: 'f/2.8', en: 'tight close-up of the face'},
  mcu: {label: 'Primeiro plano', abbr: 'PP', cover: 0.55, aperture: 'f/2.8', en: 'medium close-up from the chest up'},
  ms: {label: 'Plano médio', abbr: 'PM', cover: 0.85, aperture: 'f/4', en: 'medium shot from the waist up'},
  mls: {label: 'Plano americano', abbr: 'PA', cover: 1.3, aperture: 'f/4', en: 'medium long shot from the knees up'},
  fs: {label: 'Plano inteiro', abbr: 'PI', cover: 2.05, aperture: 'f/5.6', en: 'full-body shot, head to toe with margins'},
  ws: {label: 'Plano de conjunto', abbr: 'PC', cover: 3.6, aperture: 'f/8', en: 'wide shot, full body small within the set'},
  ews: {label: 'Plano geral', abbr: 'PG', cover: 8, aperture: 'f/8', en: 'extreme wide establishing shot of the location'}
};
export const lenses = {24: '24mm · grande angular', 35: '35mm · documental', 50: '50mm · natural', 85: '85mm · retrato', 100: '100mm · macro', 135: '135mm · compressão'};
export const heights = {
  low: {label: 'Rente ao chão', m: 0.35, en: 'low camera near floor level looking slightly up'},
  knee: {label: 'Altura do joelho', m: 0.6, en: 'camera at knee height'},
  waist: {label: 'Altura da cintura', m: 1.0, en: 'camera at waist height'},
  chest: {label: 'Altura do peito', m: 1.3, en: 'camera at chest height'},
  eye: {label: 'Altura dos olhos', m: 1.6, en: 'camera at eye level'},
  high: {label: 'Plongée suave', m: 2.2, en: 'slightly high camera looking down'},
  overhead: {label: 'Zenital', m: 3.2, en: 'top-down overhead camera'}
};
export const angles = {'-90': 'Perfil esquerdo', '-45': 'Três quartos · esquerda', '0': 'Frontal', '45': 'Três quartos · direita', '90': 'Perfil direito', '135': 'Três quartos de costas', '180': 'Costas'};
const angleEn = {'-90': 'strict left profile', '-45': 'three-quarter view from camera left', '0': 'straight-on frontal view', '45': 'three-quarter view from camera right', '90': 'strict right profile', '135': 'three-quarter back view', '180': 'view from directly behind'};
export const degreeOptions = [0, 15, 30, 45, 90, 180, 360];
export const actions = {
  still: {label: 'Parada, respiração natural', en: 'holds still with calm natural breathing', rotation: 0},
  gaze: {label: 'Muda o olhar', en: 'slowly shifts the gaze toward the lens and holds', rotation: 0},
  adjust: {label: 'Ajusta a peça', en: 'makes one small natural adjustment of the garment with relaxed hands', rotation: 0},
  touch: {label: 'Mão toca o detalhe', en: 'lightly touches a visible detail of the garment with the fingertips', rotation: 0},
  walk: {label: 'Dois passos', en: 'takes two slow natural steps forward with grounded feet', rotation: 0},
  turn90: {label: 'Giro de 90°', en: 'turns 90 degrees in place with small natural steps', rotation: 90},
  turn180: {label: 'Meia-volta (180°)', en: 'turns 180 degrees in place with small steps, revealing the back of the garment', rotation: 180},
  hair: {label: 'Gesto no cabelo', en: 'brushes the hair away from the face with one hand', rotation: 0},
  sit: {label: 'Senta-se', en: 'sits down slowly and naturally on the seat, garment settling with gravity', rotation: 0},
  object: {label: 'Objeto imóvel', en: 'remains completely stationary as a rigid object', rotation: 0}
};
export const focusTargets = {
  face: {label: 'Rosto', y: 1.6, en: 'the eyes'},
  garment: {label: 'Peça inteira', y: 1.15, en: 'the garment'},
  detail: {label: 'Detalhe da peça', y: 1.05, en: 'the visible garment detail'},
  feet: {label: 'Pés e barra', y: 0.15, en: 'the hem and shoes'},
  product: {label: 'Produto', y: 0.9, en: 'the product'},
  environment: {label: 'Ambiente', y: 1.0, en: 'the environment'}
};
/** Sizes where the frame holds a garment detail rather than a person. */
export const TIGHT = ['macro', 'ecu'];
export const isTight = size => TIGHT.includes(size);
// Where a close-up lands on the garment. `y` is the height on a 1.75 m figure, used by the framing preview.
export const detailRegions = {
  fabric: {label: 'Superfície do tecido', y: 1.15, en: 'the fabric surface: weave, sheen and how the folds catch the light'},
  neckline: {label: 'Decote / gola', y: 1.45, en: 'the neckline'},
  shoulder: {label: 'Ombro e alças', y: 1.45, en: 'the shoulder and where the straps attach'},
  bodice: {label: 'Corpete / drapeado', y: 1.25, en: 'the bodice and its gathering or drape'},
  waist: {label: 'Cintura', y: 1.05, en: 'the waist seam and the fit at the waist'},
  closure: {label: 'Botões, zíper, laço', y: 1.2, en: 'the closure and its hardware'},
  cuff: {label: 'Punho e manga', y: 0.95, en: 'the cuff and lower sleeve'},
  slit: {label: 'Fenda', y: 0.6, en: 'the slit and the finish of its edge'},
  hem: {label: 'Barra', y: 0.2, en: 'the hem and its finish'},
  back: {label: 'Costas', y: 1.3, en: 'the back construction'}
};
export const speeds = {
  slow: {label: 'Lento com suavização', en: 'slow and smooth with gentle ease-in and ease-out'},
  constant: {label: 'Velocidade constante', en: 'at a steady constant speed'},
  settle: {label: 'Desacelera e assenta', en: 'starting with momentum and decelerating into a still final frame'},
  brisk: {label: 'Rápido e legível', en: 'brisk but readable, never blurred'}
};
export const transitions = {
  cut: {label: 'Corte seco', en: 'hard cut'},
  match: {label: 'Match cut', en: 'match cut on shape or movement'},
  whip: {label: 'Chicote (whip)', en: 'whip-pan transition in editing'},
  dissolve: {label: 'Fusão', en: 'short dissolve'}
};
export const formats = {
  '9:16': {label: '9:16 · Reels, TikTok, Stories', frameMM: 36, size: '1024x1536 → recorte 9:16'},
  '3:4': {label: '3:4 · Galeria da loja', frameMM: 32, size: '1536x2048 → WebP 1200x1600'},
  '4:5': {label: '4:5 · Feed', frameMM: 30, size: '1024x1536 → recorte 4:5'},
  '1:1': {label: '1:1 · Catálogo', frameMM: 24, size: '1024x1024'},
  '16:9': {label: '16:9 · Site, YouTube', frameMM: 20.25, size: '1536x1024 → recorte 16:9'}
};
export const objectives = {launch: 'Lançamento de coleção', catalog: 'Catálogo / e-commerce', social: 'Reels e redes sociais', lookbook: 'Lookbook editorial', ad: 'Anúncio de performance', institutional: 'Institucional'};
export const verticals = {fashion: 'Moda / roupa', accessory: 'Acessório', beauty: 'Beleza', product: 'Produto'};
export const categories = {dress: 'Vestido', top: 'Blusa / camisa', trousers: 'Calça', skirt: 'Saia', set: 'Conjunto', tailoring: 'Alfaiataria', outerwear: 'Jaqueta / casaco', knit: 'Tricô', denim: 'Jeans', active: 'Activewear', accessory: 'Acessório', object: 'Objeto / produto'};
export const fabrics = {
  silk: {label: 'Seda / cetim', en: 'silk-satin', behavior: 'liquid drape, soft specular sheen that travels with the light, fine natural creases, never stiff'},
  satin: {label: 'Cetim de poliéster', en: 'satin-finish polyester', behavior: 'fluid drape with a bright sheen that slides across the folds as the angle to the light changes, smooth surface, crisp falloff into the shadows of each fold, never stiff or plastic'},
  chiffon: {label: 'Chiffon / tule', en: 'sheer chiffon', behavior: 'light translucent layers that float and settle slowly, soft edges, visible layering only where the reference shows it'},
  ribbed: {label: 'Malha canelada', en: 'ribbed knit', behavior: 'vertical ribs that stretch over the body and relax at rest, matte surface, ribs stay parallel and evenly spaced'},
  linen: {label: 'Linho', en: 'linen', behavior: 'visible slub texture, natural relaxed wrinkles, matte surface, airy movement'},
  cotton: {label: 'Algodão', en: 'cotton', behavior: 'crisp matte weave, clean seams, soft folds'},
  jersey: {label: 'Malha', en: 'jersey knit', behavior: 'soft stretch, body-following drape, subtle knit texture'},
  wool: {label: 'Lã / alfaiataria', en: 'wool suiting', behavior: 'structured tailoring that keeps its shape, sharp lapels and pressed creases'},
  denim: {label: 'Jeans', en: 'denim', behavior: 'visible twill diagonal, realistic fading, sturdy weight, top-stitching readable'},
  leather: {label: 'Couro', en: 'leather', behavior: 'natural grain, soft creasing at joints, controlled satin highlights'},
  knitwear: {label: 'Tricô / crochê', en: 'chunky knit', behavior: 'readable stitch pattern, soft volume, gentle stretch'},
  technical: {label: 'Tecido técnico', en: 'technical fabric', behavior: 'smooth performance surface, clean bonded seams, opaque'},
  none: {label: 'Não se aplica', en: 'material as in the reference', behavior: 'material behavior identical to the reference'}
};
export const lights = {
  window: {label: 'Janela lateral difusa', en: 'large soft window light from camera left with gentle falloff'},
  softbox: {label: 'Luz suave a 45° (estúdio)', en: 'broad soft key light from camera left at about 45 degrees, slightly above eye level, gentle fill from the right, short soft shadows falling to the right, neutral daylight white balance'},
  highkey: {label: 'High-key de ciclorama', en: 'clean high-key studio light, large soft key with even fill and a bright seamless background'},
  backlight: {label: 'Contraluz com preenchimento', en: 'controlled backlight rimming hair and fabric edges with soft frontal fill'},
  golden: {label: 'Golden hour', en: 'low warm golden-hour sun from behind camera left with reflector fill on the face'},
  flash: {label: 'Flash direto editorial', en: 'direct on-camera flash with a crisp shadow and slight ambient drag'},
  hard: {label: 'Luz dura gráfica', en: 'hard directional light producing clean graphic shadows'},
  overcast: {label: 'Céu encoberto', en: 'soft bright open-shade daylight'}
};
export const grades = {
  natural: {label: 'Natural fiel', en: 'true-to-life neutral color'},
  'warm-film': {label: 'Filme quente', en: 'warm filmic grade with soft highlight roll-off and fine grain'},
  'clean-cool': {label: 'Limpo e frio', en: 'clean cool grade with crisp whites'},
  'high-contrast': {label: 'Alto contraste', en: 'rich high-contrast grade with deep blacks and preserved skin tone'},
  'soft-pastel': {label: 'Pastel suave', en: 'soft airy pastel grade with lifted shadows'}
};

// Realism rules learned in the Sarcenet production manual: identity from features only, mirrored-feet
// guard, light described by its effect so no equipment is drawn, and no fabricated micro-texture.
const realism = 'Photorealistic photograph with true optical depth of field and believable contact shadows. Identity comes from the facial features only: do not copy the retouching, skin smoothing or makeup gloss of the reference. Natural skin with pores, fine vellus hair and small irregularities; individual hair strands with a few loose flyaways. Anatomically correct hands with five fingers; feet read as one left and one right foot, never mirrored. Physically plausible seams, stitching and fabric weight. Light is described by its effect: no lamps, stands, reflectors or studio edges in frame.';
const macroRealism = 'Macro optics: a thin but readable plane of focus that falls off across the fabric, no oversharpening halos. Show only the weave, stitching and finish that the garment references resolve; never fabricate micro-texture, extra stitching or trims.';
const moveById = id => movements.find(m => m.id === id);
// Which extra controls each camera operation exposes in the inspector.
export const moveControls = {
  orbit: {degrees: true}, 'arc-push': {degrees: true}, turntable: {degrees: true}, pan: {degrees: true}, tilt: {degrees: true}, roll: {degrees: true},
  pedestal: {heightEnd: true}, crane: {heightEnd: true}
};

export const slugify = value => String(value).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'projeto';
export const coverOf = size => shotSizes[size]?.cover ?? 1;
/** Approximate subject-to-camera distance for a coverage and lens on full frame. */
export function cameraDistance(size, lens, format) {
  return coverOf(size) * Number(lens) / (formats[format]?.frameMM ?? 36);
}
export const metres = n => n < 0.5 ? `${Math.round(n * 100)} cm` : `${n < 1 ? n.toFixed(2) : n.toFixed(1)} m`.replace('.', ',');

function shot(title, intent, duration, sizeStart, sizeEnd, move, extra = {}) {
  return {title, intent, duration, sizeStart, sizeEnd, move, degrees: 0, lens: 50, height: 'chest', heightEnd: 'chest', angle: 0, action: 'still', focus: 'garment', speed: 'slow', transition: 'cut', detail: 'fabric', ...extra};
}

// A real Sarcenet product. Construction comes only from the verified fact sheet of its copy (satin-finish
// polyester, not silk); its photos stay in the store folder and are attached by the person.
const champagneGown = {vertical: 'fashion', name: 'Champagne Drape Satin Gown', category: 'dress', color: 'champagne', fabric: 'satin', details: 'floor-length close-fitting column gown, draped cowl neckline between wide straps, bodice gathered diagonally and caught at the hip, high front slit, no logo, no print', refFront: 'champagne-frente.png', refBack: '', refDetail: 'champagne-detalhe.png'};
const sarcenetBrief = (objective, message) => ({brandPreset: 'sarcenet', brand: 'Sarcenet', objective, format: '9:16', message, audience: 'Mulheres no Reino Unido que procuram um vestido longo para eventos à noite.', cta: 'Shop the gown · sarcenet.uk'});

export const templates = {
  'sarcenet-capsula-seda': {label: 'Sarcenet · Cápsula Seda · 15s', description: 'Lançamento vertical: matéria, rosto, caimento, costas, passo e assinatura.', build: () => ({
    version: STUDIO_VERSION,
    meta: {title: 'Sarcenet · Cápsula Seda'},
    brief: {brandPreset: 'sarcenet', brand: 'Sarcenet', objective: 'launch', format: '9:16', message: 'Apresentar o vestido slip de seda champagne pela matéria, pelo caimento e pelas costas, com calma e luz natural.', audience: 'Mulheres de 25 a 45 anos que compram peças versáteis para trabalho e eventos.', cta: 'Nova cápsula · disponível na loja'},
    product: {vertical: 'fashion', name: 'Vestido slip midi de seda', category: 'dress', color: 'champagne', fabric: 'silk', details: 'bias-cut midi slip dress, thin adjustable spaghetti straps, soft cowl neckline, low scoop back with crossed straps, hem at mid-calf, no logo, no print', refFront: 'peca-frente.webp', refBack: 'peca-costas.webp', refDetail: 'peca-detalhe.webp'},
    talent: {castId: 'sc-01', customRef: '', customDescription: ''},
    look: {direction: 'seda-janela', environment: directionById('seda-janela').environment, light: 'window', grade: 'warm-film'},
    shots: [
      shot('O toque da seda', 'Abrir pela matéria: o brilho líquido da seda sob a janela.', 2, 'ecu', 'ecu', 'rack-focus', {lens: 100, angle: 45, action: 'touch', focus: 'detail', transition: 'match'}),
      shot('O olhar', 'Do decote ao rosto: apresentar Helena sem pressa.', 3, 'cu', 'ms', 'dolly-out', {lens: 85, height: 'eye', heightEnd: 'eye', action: 'gaze', focus: 'face'}),
      shot('O caimento', 'Revelar o volume do vestido inteiro com um arco curto.', 3, 'fs', 'fs', 'orbit', {degrees: 30, angle: -45, action: 'still', focus: 'garment'}),
      shot('As costas', 'Mostrar o decote das costas e as alças cruzadas.', 3, 'mls', 'mls', 'static', {action: 'turn180', focus: 'garment', height: 'waist', heightEnd: 'waist', transition: 'whip'}),
      shot('Dois passos', 'O tecido em movimento: caimento vivo e real.', 2, 'fs', 'fs', 'tracking', {lens: 35, angle: 45, action: 'walk', focus: 'garment'}),
      shot('Assinatura', 'Plano limpo com respiro para logo e CTA na edição.', 2, 'mls', 'mls', 'static', {lens: 85, action: 'still', focus: 'face', transition: 'dissolve'})
    ]})},
  'sarcenet-ultra-close': {label: 'Sarcenet · Ultra close no cetim · 14s', description: 'Peça real da loja: trama, drapeado, franzido e fenda em macro, giro lento e revelação.', build: () => ({
    version: STUDIO_VERSION,
    meta: {title: 'Sarcenet · Champagne Drape · ultra close'},
    brief: sarcenetBrief('social', 'Mostrar o cetim de perto: o brilho que desliza no drapeado, o franzido preso no quadril e a fenda, antes de revelar o vestido inteiro.'),
    product: {...champagneGown},
    talent: {castId: 'loja-a', customRef: '', customDescription: ''},
    look: {direction: 'estudio-sarcenet', environment: directionById('estudio-sarcenet').environment, light: 'softbox', grade: 'natural'},
    shots: [
      shot('A trama', 'Abrir colado no cetim: o brilho desliza pela superfície.', 2, 'macro', 'macro', 'truck', {lens: 100, focus: 'detail', detail: 'fabric', transition: 'match'}),
      shot('O drapeado', 'Um arco curto em volta do decote: a luz percorre as dobras.', 3, 'ecu', 'ecu', 'orbit', {lens: 100, degrees: 30, focus: 'detail', detail: 'neckline', height: 'eye', heightEnd: 'eye'}),
      shot('O franzido', 'O foco atravessa as pregas presas no quadril.', 2, 'ecu', 'ecu', 'rack-focus', {lens: 100, angle: 45, focus: 'detail', detail: 'bodice'}),
      shot('O giro', 'A modelo gira devagar e o brilho varre o tecido.', 3, 'ecu', 'ecu', 'turntable', {lens: 85, degrees: 30, focus: 'detail', detail: 'bodice', height: 'waist', heightEnd: 'waist'}),
      shot('A fenda', 'A câmera desce pela fenda até a barra.', 2, 'ecu', 'ecu', 'pedestal', {lens: 85, focus: 'detail', detail: 'slit', height: 'waist', heightEnd: 'knee'}),
      shot('O vestido inteiro', 'Abrir para a coluna inteira, com respiro para o CTA.', 2, 'mls', 'fs', 'dolly-out', {lens: 50, focus: 'garment', height: 'waist', heightEnd: 'waist', transition: 'dissolve'})
    ]})},
  'sarcenet-anuncio': {label: 'Sarcenet · Anúncio em 3 takes · 8s', description: 'Estrutura dos anúncios da loja: aproximação, detalhe macro e arco, em uso real.', build: () => ({
    version: STUDIO_VERSION,
    meta: {title: 'Sarcenet · Champagne Drape · anúncio'},
    brief: sarcenetBrief('ad', 'Uso real: ela se arruma para a noite. A peça aparece em uso, de perto e em movimento, sem cara de anúncio.'),
    product: {...champagneGown},
    talent: {castId: 'loja-a', customRef: '', customDescription: ''},
    look: {direction: 'custom', environment: 'a lived-in London flat bedroom in the early evening, a tall sash window with sheer curtains, a warm lamp on a side table, an open wardrobe softly out of focus, worn wooden floor, ordinary details of a real home', light: 'window', grade: 'warm-film'},
    shots: [
      shot('Take 1 · aproximação', 'Ela ajusta a alça; a câmera se aproxima sem pressa.', 3, 'mls', 'ms', 'dolly-in', {lens: 50, angle: -45, action: 'adjust', focus: 'garment'}),
      shot('Take 2 · detalhe', 'O cetim de perto: deslize macro pelo drapeado.', 2, 'ecu', 'ecu', 'truck', {lens: 100, focus: 'detail', detail: 'neckline', transition: 'match'}),
      shot('Take 3 · arco', 'Arco curto revela o caimento antes de sair.', 3, 'ms', 'ms', 'orbit', {lens: 50, degrees: 30, action: 'gaze', focus: 'face'})
    ]})},
  'catalogo-giro': {label: 'Catálogo · giro da peça · 12s', description: 'E-commerce: frente, meia-volta, costas e retorno, câmera fixa.', build: () => base('Catálogo · giro da peça', 'fashion', 'catalog', '4:5', 'ciclorama-marfim', 'sc-05', [
    shot('Frente', 'A peça inteira, de frente, sem distração.', 2, 'fs', 'fs', 'static', {lens: 85}),
    shot('Meia-volta', 'Girar para revelar a lateral e as costas.', 4, 'fs', 'fs', 'static', {lens: 85, action: 'turn180'}),
    shot('Costas', 'Segurar as costas para leitura de costuras e barra.', 2, 'fs', 'fs', 'static', {lens: 85, angle: 180}),
    shot('Detalhe', 'Aproximar o acabamento mais importante.', 4, 'ms', 'mcu', 'dolly-in', {lens: 85, focus: 'detail'})])},
  'detalhe-tecido': {label: 'Detalhe de tecido · 8s', description: 'Textura, costura e acabamento em três planos fechados.', build: () => {
    const p = base('Detalhe de tecido', 'fashion', 'social', '9:16', 'seda-janela', 'sc-04', [
      shot('A trama', 'Mostrar a textura real do tecido.', 3, 'macro', 'macro', 'truck', {lens: 100, focus: 'detail', detail: 'fabric'}),
      shot('O acabamento', 'Costura e botão com foco que passeia.', 3, 'ecu', 'ecu', 'rack-focus', {lens: 100, focus: 'detail', detail: 'closure', action: 'touch'}),
      shot('A peça vestida', 'Abrir para a peça no corpo.', 2, 'mcu', 'ms', 'dolly-out', {lens: 85, focus: 'garment'})]);
    p.product.refDetail = 'peca-detalhe.webp';
    return p;
  }},
  'provador-reels': {label: 'Provador · Reels · 12s', description: 'Bastidor de loja: espelho, ajuste, giro e passo.', build: () => base('Provador · novidade da semana', 'fashion', 'social', '9:16', 'atelier-provador', 'sc-06', [
    shot('No espelho', 'Abrir no reflexo, criando proximidade.', 3, 'mls', 'mls', 'truck', {lens: 35, action: 'adjust'}),
    shot('O ajuste', 'A mão confirma o caimento.', 3, 'mcu', 'mcu', 'static', {lens: 50, action: 'touch', focus: 'detail'}),
    shot('O giro', 'Uma meia-volta mostra a silhueta.', 4, 'fs', 'fs', 'static', {lens: 35, action: 'turn180'}),
    shot('Saída', 'Dois passos para fora do provador.', 2, 'fs', 'fs', 'tracking', {lens: 35, action: 'walk'})])},
  'produto-hero': {label: 'Produto hero · 10s', description: 'Objeto sem modelo: macro, arco, giro e assinatura.', build: () => base('Produto hero', 'product', 'ad', '1:1', 'concreto-minimal', 'none', [
    shot('O material', 'Abrir no detalhe mais característico.', 2, 'ecu', 'macro', 'dolly-in', {lens: 100, action: 'object', focus: 'detail', detail: 'closure'}),
    shot('O volume', 'Arco curto para revelar a forma.', 3, 'ms', 'ms', 'orbit', {degrees: 30, action: 'object', focus: 'product'}),
    shot('O giro', 'Girar no eixo para mostrar a lateral.', 3, 'ms', 'ms', 'turntable', {degrees: 90, action: 'object', focus: 'product'}),
    shot('Assinatura', 'Plano estável com espaço para o CTA.', 2, 'ms', 'ms', 'static', {action: 'object', focus: 'product', transition: 'dissolve'})])},
  'em-branco': {label: 'Em branco · 1 tomada', description: 'Comece do zero com uma tomada.', build: () => base('Nova cena', 'fashion', 'social', '9:16', 'ciclorama-marfim', 'sc-01', [shot('Tomada 1', 'Descreva o que o espectador precisa perceber.', 4, 'fs', 'fs', 'static')])}
};

function base(title, vertical, objective, format, direction, castId, shots) {
  const d = directionById(direction);
  return {
    version: STUDIO_VERSION, meta: {title},
    brief: {brandPreset: vertical === 'product' ? 'product' : 'fashion', brand: vertical === 'product' ? 'Meu produto' : 'Minha marca', objective, format, message: 'Descreva o que a peça precisa comunicar, sem prometer resultados.', audience: 'Descreva quem compra esta peça.', cta: 'Adicionar na edição'},
    product: vertical === 'product'
      ? {vertical, name: 'Bolsa estruturada', category: 'object', color: 'cognac', fabric: 'leather', details: 'structured top-handle bag, single flap with a brushed brass clasp, contrast edge paint, no logo', refFront: 'produto-frente.webp', refBack: '', refDetail: 'produto-detalhe.webp'}
      : {vertical, name: 'Peça da coleção', category: 'top', color: 'ivory', fabric: 'cotton', details: 'describe the exact construction: neckline, closures, seams, length and fit', refFront: 'peca-frente.webp', refBack: 'peca-costas.webp', refDetail: ''},
    talent: {castId, customRef: '', customDescription: ''},
    look: {direction, environment: d.environment, light: d.light, grade: d.grade},
    shots
  };
}

export const createStudioProject = (id = 'sarcenet-capsula-seda') => (templates[id] || templates['sarcenet-capsula-seda']).build();

// ---------- validation ----------
/** Production checkpoints of a shot: start keyframe, end keyframe, video clip. */
export const PROGRESS = ['a', 'b', 'clip'];
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const FILE = /^[\p{L}\p{N}_. -]{1,96}\.(png|jpe?g|webp)$/iu;
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/;

/** Collects every field problem without throwing, so the UI can explain each one in place. */
export function studioIssues(value) {
  const issues = [];
  const add = (path, message) => issues.push({path, message});
  if (!record(value) || value.version !== STUDIO_VERSION) return [{path: 'version', message: 'Formato incompatível. Use um projeto exportado pelo FRAME Studio.'}];
  const text = (obj, key, path, label, max, optional = false) => {
    const v = obj?.[key];
    if (optional && (v === '' || v === undefined)) return;
    if (typeof v !== 'string' || !v.trim() || v.length > max) add(path, `${label}: preencha de 1 a ${max} caracteres.`);
    else if (CONTROL.test(v)) add(path, `${label}: remova caracteres de controle.`);
  };
  const pick = (obj, key, path, label, choices) => { if (typeof obj?.[key] !== 'string' || !Object.hasOwn(choices, obj[key])) add(path, `${label}: escolha uma opção disponível.`); };
  const file = (obj, key, path, label, optional) => {
    const v = obj?.[key];
    if (optional && v === '') return;
    if (typeof v !== 'string' || !FILE.test(v) || v.includes('..')) add(path, `${label}: informe só o nome de um arquivo .png, .jpg ou .webp, sem pastas ou links.`);
  };
  for (const key of ['meta', 'brief', 'product', 'talent', 'look']) if (!record(value[key])) add(key, 'Seção ausente no projeto.');
  if (issues.length) return issues;
  const {meta, brief, product, talent, look} = value;
  text(meta, 'title', 'meta.title', 'Nome do projeto', 100);
  pick(brief, 'brandPreset', 'brief.brandPreset', 'Perfil de marca', {...brandPresets, custom: 1});
  text(brief, 'brand', 'brief.brand', 'Marca', 60);
  pick(brief, 'objective', 'brief.objective', 'Objetivo', objectives);
  pick(brief, 'format', 'brief.format', 'Formato', formats);
  text(brief, 'message', 'brief.message', 'Mensagem central', 600);
  text(brief, 'audience', 'brief.audience', 'Público', 300);
  text(brief, 'cta', 'brief.cta', 'CTA', 120);
  pick(product, 'vertical', 'product.vertical', 'Categoria do projeto', verticals);
  text(product, 'name', 'product.name', 'Nome da peça', 120);
  pick(product, 'category', 'product.category', 'Tipo de peça', categories);
  text(product, 'color', 'product.color', 'Cor', 60);
  pick(product, 'fabric', 'product.fabric', 'Material', fabrics);
  text(product, 'details', 'product.details', 'Construção da peça', 800);
  file(product, 'refFront', 'product.refFront', 'Referência frontal', false);
  file(product, 'refBack', 'product.refBack', 'Referência de costas', true);
  file(product, 'refDetail', 'product.refDetail', 'Referência de detalhe', true);
  if (!(talent.castId === 'none' || talent.castId === 'custom' || castById(talent.castId) || storeModelById(talent.castId))) add('talent.castId', 'Elenco: escolha uma modelo, “sem modelo” ou “modelo própria”.');
  if (talent.castId === 'custom') {
    file(talent, 'customRef', 'talent.customRef', 'Referência da modelo', false);
    text(talent, 'customDescription', 'talent.customDescription', 'Descrição da modelo', 600);
  } else {
    if (talent.customRef !== '' && talent.customRef !== undefined) file(talent, 'customRef', 'talent.customRef', 'Referência da modelo', true);
    if (talent.customDescription !== '' && talent.customDescription !== undefined) text(talent, 'customDescription', 'talent.customDescription', 'Descrição da modelo', 600, true);
  }
  if (!(look.direction === 'custom' || directionById(look.direction))) add('look.direction', 'Direção de arte: escolha uma opção disponível.');
  text(look, 'environment', 'look.environment', 'Cenário', 600);
  pick(look, 'light', 'look.light', 'Luz', lights);
  pick(look, 'grade', 'look.grade', 'Cor', grades);
  if (!Array.isArray(value.shots) || value.shots.length < 1 || value.shots.length > MAX_STUDIO_SHOTS) { add('shots', `A sequência precisa ter de 1 a ${MAX_STUDIO_SHOTS} tomadas.`); return issues; }
  let total = 0;
  value.shots.forEach((s, i) => {
    const p = `shots.${i}`, n = `Tomada ${i + 1}`;
    if (!record(s)) { add(p, `${n}: dados inválidos.`); return; }
    text(s, 'title', `${p}.title`, `${n} · título`, 80);
    text(s, 'intent', `${p}.intent`, `${n} · intenção`, 400);
    if (typeof s.duration !== 'number' || !Number.isInteger(s.duration) || s.duration < 2 || s.duration > 10) add(`${p}.duration`, `${n}: duração inteira de 2 a 10 segundos.`);
    else total += s.duration;
    pick(s, 'sizeStart', `${p}.sizeStart`, `${n} · enquadramento inicial`, shotSizes);
    pick(s, 'sizeEnd', `${p}.sizeEnd`, `${n} · enquadramento final`, shotSizes);
    if (!moveById(s.move)) add(`${p}.move`, `${n}: movimento de câmera desconhecido.`);
    if (!degreeOptions.includes(s.degrees)) add(`${p}.degrees`, `${n}: escolha os graus disponíveis.`);
    if (!Object.hasOwn(lenses, String(s.lens)) || typeof s.lens !== 'number') add(`${p}.lens`, `${n}: escolha uma lente.`);
    pick(s, 'height', `${p}.height`, `${n} · altura`, heights);
    pick(s, 'heightEnd', `${p}.heightEnd`, `${n} · altura final`, heights);
    if (typeof s.angle !== 'number' || !Object.hasOwn(angles, String(s.angle))) add(`${p}.angle`, `${n}: escolha um ângulo.`);
    pick(s, 'action', `${p}.action`, `${n} · ação`, actions);
    pick(s, 'focus', `${p}.focus`, `${n} · foco`, focusTargets);
    pick(s, 'speed', `${p}.speed`, `${n} · ritmo`, speeds);
    pick(s, 'transition', `${p}.transition`, `${n} · transição`, transitions);
    if (s.detail !== undefined) pick(s, 'detail', `${p}.detail`, `${n} · região do detalhe`, detailRegions);
    if (s.status !== undefined && !(record(s.status) && Object.entries(s.status).every(([k, v]) => PROGRESS.includes(k) && typeof v === 'boolean'))) add(`${p}.status`, `${n}: progresso de produção inválido.`);
  });
  if (total > MAX_STUDIO_SECONDS) add('shots', `A sequência tem ${total}s. O limite do planejador é ${MAX_STUDIO_SECONDS}s.`);
  return issues;
}

/** Strict copy: only known fields survive, so imported keys never reach app state. */
export function validateStudio(value) {
  const issues = studioIssues(value);
  if (issues.length) throw new Error(issues[0].message);
  const {meta, brief, product, talent, look} = value;
  const t = v => v.trim();
  return {
    version: STUDIO_VERSION,
    meta: {title: t(meta.title)},
    brief: {brandPreset: brief.brandPreset, brand: t(brief.brand), objective: brief.objective, format: brief.format, message: t(brief.message), audience: t(brief.audience), cta: t(brief.cta)},
    product: {vertical: product.vertical, name: t(product.name), category: product.category, color: t(product.color), fabric: product.fabric, details: t(product.details), refFront: product.refFront, refBack: product.refBack || '', refDetail: product.refDetail || ''},
    talent: {castId: talent.castId, customRef: talent.customRef || '', customDescription: talent.customDescription ? t(talent.customDescription) : ''},
    look: {direction: look.direction, environment: t(look.environment), light: look.light, grade: look.grade},
    shots: value.shots.map(s => ({title: t(s.title), intent: t(s.intent), duration: s.duration, sizeStart: s.sizeStart, sizeEnd: s.sizeEnd, move: s.move, degrees: s.degrees, lens: s.lens, height: s.height, heightEnd: s.heightEnd, angle: s.angle, action: s.action, focus: s.focus, speed: s.speed, transition: s.transition, detail: s.detail ?? 'fabric', status: Object.fromEntries(PROGRESS.map(k => [k, s.status?.[k] === true]))}))
  };
}

/** Accepts v2 projects and migrates v1 production plans from the previous planner. */
export function parseStudio(serialized) {
  if (typeof serialized !== 'string' || new TextEncoder().encode(serialized).length > MAX_STUDIO_BYTES) throw new Error('O arquivo de projeto deve ter no máximo 128 KB.');
  let value;
  try { value = JSON.parse(serialized); } catch { throw new Error('Não foi possível ler o JSON. Selecione um projeto exportado pelo FRAME.'); }
  if (record(value) && value.version === 1) return migrateProduction(value);
  return validateStudio(value);
}

export function migrateProduction(v1) {
  const p = validateProduction(v1);
  const framing = {full: 'fs', medium: 'ms', close: 'cu', macro: 'ecu'};
  const light = {window: 'window', hard: 'hard', back: 'backlight', overcast: 'overcast'};
  const speed = {slow: 'slow', moderate: 'constant', fast: 'brisk'};
  return validateStudio({
    version: STUDIO_VERSION, meta: {title: p.brief.title.slice(0, 100)},
    brief: {brandPreset: 'custom', brand: 'Minha marca', objective: 'social', format: p.brief.format, message: p.brief.message, audience: 'Defina o público desta campanha.', cta: 'Adicionar na edição'},
    product: {vertical: 'product', name: p.brief.title.slice(0, 120), category: 'object', color: 'as in reference', fabric: 'none', details: p.brief.subject, refFront: p.brief.reference, refBack: '', refDetail: ''},
    talent: {castId: 'none', customRef: '', customDescription: ''},
    look: {direction: 'custom', environment: p.brief.environment.slice(0, 600), light: light[p.brief.light], grade: 'natural'},
    shots: p.shots.map(s => ({title: s.title.slice(0, 80), intent: s.intent.slice(0, 400), duration: s.duration, sizeStart: framing[s.framing], sizeEnd: framing[s.framing], move: s.movement, degrees: moveControls[s.movement]?.degrees ? 30 : 0, lens: 50, height: 'chest', heightEnd: 'chest', angle: 0, action: 'object', focus: 'product', speed: speed[p.brief.rhythm], transition: 'cut'}))
  });
}

// ---------- compilation ----------
export function shotTimeline(project) {
  let elapsed = 0;
  return project.shots.map((s, index) => { const start = elapsed; elapsed += s.duration; return {...s, index, start, end: elapsed}; });
}

/** True when the last frame differs enough from the first to deserve its own keyframe. */
export function needsEndFrame(s) {
  if (s.sizeStart !== s.sizeEnd || actions[s.action]?.rotation || s.action === 'walk' || s.action === 'sit') return true;
  return ['orbit', 'arc-push', 'turntable', 'pedestal', 'crane', 'dolly-zoom', 'pan', 'tilt', 'truck', 'tracking', 'dolly-in', 'dolly-out', 'zoom'].includes(s.move);
}

/** Final camera angle and subject rotation, in degrees, after the shot's movement. */
export function endPose(s) {
  const orbiting = ['orbit', 'arc-push'].includes(s.move) ? s.degrees : 0;
  const rotating = (s.move === 'turntable' ? s.degrees : 0) + (actions[s.action]?.rotation || 0);
  return {cameraAngle: s.angle + orbiting, subjectRotation: rotating};
}

const normalizeAngle = a => { let x = ((a % 360) + 540) % 360 - 180; if (x === -180) x = 180; return x; };
function viewEn(cameraAngle, subjectRotation) {
  const relative = normalizeAngle(cameraAngle - subjectRotation);
  const snapped = [-90, -45, 0, 45, 90, 135, 180, -135].reduce((best, a) => Math.abs(normalizeAngle(relative - a)) < Math.abs(normalizeAngle(relative - best)) ? a : best, 0);
  return angleEn[String(snapped)] || (snapped === -135 ? 'three-quarter back view from camera left' : angleEn['0']);
}

export function projectSlug(project) { return slugify(project.meta.title); }
export const keyframeFile = (project, index, which) => `${projectSlug(project)}-s${String(index + 1).padStart(2, '0')}-${which}.png`;
export const keyframeAsset = (project, index, which) => `assets/projects/${projectSlug(project)}/s${String(index + 1).padStart(2, '0')}-${which}.webp`;

/// A reference is what the person attaches: the file name the prompt cites, what it shows, the role the
// prompt gives it and where the site keeps it (null when it is private).
const castRef = (m, view, role) => ({file: castFileName(m.id, view), kind: 'cast', role, label: `${m.code} ${m.name} · ${castViews.find(v => v.id === view).label.toLowerCase()}`, path: castAssetPath(m.id, view)});
const storeRef = (m, view, role) => ({file: storeFileName(m.id, view), kind: 'store', role, label: `${m.code} · ${{rosto: 'rosto', corpo: 'corpo inteiro', costas: 'costas'}[view]}`, path: null});
const productRef = (project, file, side, role) => ({file, kind: 'product', role, label: `Peça · ${side}`, path: `assets/projects/${projectSlug(project)}/${file}`});

// What each attachment is allowed to govern. Separating identity from garment is what keeps both faithful.
const refRoles = {
  identity: 'identity only: facial features, adult age, hair and skin tone. Ignore its clothing, makeup gloss, retouching, light and background',
  body: 'body proportions and height only. Ignore its clothing and setting',
  'body-back': 'how the hair and body read from behind only. Ignore its clothing',
  garment: 'the garment authority: construction, colour, fit, lengths, seams, closures and asymmetry. Do not copy its person, props or setting',
  'garment-back': 'the documented back construction of the garment only',
  'garment-detail': 'only the documented detail and the texture it resolves; colour still follows the garment authority',
  continuity: 'continuity only: set, light, pose and framing of the start frame. The garment references still govern the garment'
};

function talentBlock(project) {
  const {talent} = project;
  if (talent.castId === 'none') return {text: project.product.vertical === 'fashion' ? 'No person in frame: the garment is presented on an invisible ghost mannequin with natural volume.' : 'No person in frame: the product stands alone as a rigid object.', refs: [], person: false};
  if (talent.castId === 'custom') return {text: `The same adult model as in ${talent.customRef}: ${talent.customDescription}. Match the face and hair exactly to the reference.`, refs: [{file: talent.customRef, kind: 'custom', role: 'identity', label: 'Sua modelo · referência privada', path: null}], person: true};
  const store = storeModelById(talent.castId);
  if (store) return {text: `${store.code}, an ${store.identity}.`, refs: [storeRef(store, 'rosto', 'identity'), storeRef(store, 'corpo', 'body')], person: true, store};
  const m = castById(talent.castId);
  return {text: `${m.code} ${m.name}, a ${m.identity}.`, refs: [castRef(m, 'rosto-frente', 'identity'), castRef(m, 'corpo-frente', 'body')], person: true, model: m};
}

function garmentRefs(project, s, sizeKey, showsBack) {
  const refs = [productRef(project, project.product.refFront, 'frente', 'garment')];
  if (showsBack && project.product.refBack) refs.push(productRef(project, project.product.refBack, 'costas', 'garment-back'));
  if ((s.focus === 'detail' || isTight(sizeKey)) && project.product.refDetail) refs.push(productRef(project, project.product.refDetail, 'detalhe', 'garment-detail'));
  return refs;
}

/** Everything to attach when generating keyframe A (end = false) or B (end = true) of a shot, in attachment order. */
function frameRefs(project, s, index, end) {
  const pose = end ? endPose(s) : {cameraAngle: s.angle, subjectRotation: 0};
  const size = end ? s.sizeEnd : s.sizeStart;
  const backVisible = Math.abs(normalizeAngle(pose.cameraAngle - pose.subjectRotation)) >= 135;
  const talent = talentBlock(project);
  const back = backVisible ? talent.model ? [castRef(talent.model, 'corpo-costas', 'body-back')] : talent.store ? [storeRef(talent.store, 'costas', 'body-back')] : [] : [];
  // A close-up holds only fabric: a face reference there invites the generator to draw a face. The body keeps skin tone and scale.
  return [
    ...talent.refs.filter(r => !(isTight(size) && r.role === 'identity')),
    ...back,
    ...garmentRefs(project, s, size, backVisible),
    ...(end ? [{file: keyframeFile(project, index, 'a'), kind: 'keyframe', role: 'continuity', label: 'Keyframe A desta tomada', path: keyframeAsset(project, index, 'a')}] : [])
  ];
}

const distanceEn = d => d < 1 ? `${Math.round(d * 100)} cm` : `${d.toFixed(1)} m`;
const detailOf = s => detailRegions[s.detail] || detailRegions.fabric;

function keyframePrompt(project, s, index, which) {
  const end = which === 'B';
  const pose = end ? endPose(s) : {cameraAngle: s.angle, subjectRotation: 0};
  const size = end ? s.sizeEnd : s.sizeStart;
  const tight = isTight(size);
  const lens = end && s.move === 'zoom' ? Math.round(s.lens * coverOf(s.sizeStart) / coverOf(s.sizeEnd)) : s.lens;
  const heightKey = end && moveControls[s.move]?.heightEnd ? s.heightEnd : s.height;
  const d = cameraDistance(size, lens, project.brief.format);
  const view = viewEn(pose.cameraAngle, pose.subjectRotation);
  const talent = talentBlock(project);
  const refs = frameRefs(project, s, index, end);
  const fabric = fabrics[project.product.fabric];
  const direction = directionById(project.look.direction);
  const action = actions[s.action];
  const moment = end ? (action.rotation ? `has completed the turn and now ${action.rotation >= 180 ? 'faces away from the camera' : 'shows one side to the camera'}` : s.action === 'walk' ? 'is mid-way through the second step, weight on the front foot' : s.action === 'sit' ? 'is seated, garment settled' : `${action.en}, final moment`) : (s.action === 'walk' ? 'is about to take the first step, weight on the back foot' : action.rotation ? 'faces the camera, about to turn' : action.en);
  const subject = tight ? `${shotSizes[size].en}, filled by ${detailOf(s).en}` : shotSizes[size].en;
  const noDetailRef = tight && !refs.some(r => r.role === 'garment-detail');
  return [
    `KEYFRAME ${which} · SHOT ${index + 1} · "${s.title}". ONE photographic still frame for a fashion film; not a collage, not a contact sheet.`,
    `Attach and follow: ${refs.map(r => r.file).join(', ')}.`,
    ...refs.map((r, i) => `Image ${i + 1} (${r.file}) = ${refRoles[r.role]}.`),
    talent.person ? `Talent: ${talent.text} The talent ${moment}.${tight ? ' The face stays out of frame; only the hands may enter, relaxed, without folding the fabric.' : ''}` : `${talent.text}`,
    `Wardrobe: ${project.product.name} in ${project.product.color} ${fabric.en}; construction: ${project.product.details}. Fabric behavior: ${fabric.behavior}.`,
    `Camera: ${subject}, ${view}, ${heights[heightKey].en}, ${lens}mm full-frame look at ${shotSizes[size].aperture}, about ${distanceEn(d)} from ${tight ? 'the fabric' : 'the subject'}. Focus on ${tight ? detailOf(s).en : focusTargets[s.focus].en}.`,
    `Set: ${project.look.environment}.`,
    `Light: ${lights[project.look.light].en}.${direction ? ` Art direction: ${direction.artDirection}.` : ''} Color: ${grades[project.look.grade].en}; the garment keeps the exact colour of the garment authority under this light.`,
    realism,
    ...(tight ? [macroRealism] : []),
    ...(noDetailRef ? ['There is no close-up reference of this detail: keep the surface as smooth and simple as the garment authority shows it and add nothing.'] : []),
    `Composition: ${project.brief.format} (${formats[project.brief.format].size}). Keep identical across every frame of this film: face, hair, garment construction, color and light direction.`,
    `No text, logos, watermarks, borders or extra panels.${talent.person ? ' The talent is a fictional adult.' : ''}`
  ].join('\n');
}

function moveSentence(project, s) {
  const f = project.brief.format;
  const dA = cameraDistance(s.sizeStart, s.lens, f), dB = cameraDistance(s.sizeEnd, s.lens, f);
  const A = shotSizes[s.sizeStart].en, B = shotSizes[s.sizeEnd].en;
  const dir = s.degrees >= 0 ? 'clockwise' : 'counter-clockwise';
  const lensEnd = Math.round(s.lens * coverOf(s.sizeStart) / coverOf(s.sizeEnd));
  const detail = detailOf(s).en;
  // Close-up versions: the camera works the fabric surface, and the light moving across the folds is the event.
  if (isTight(s.sizeStart) && isTight(s.sizeEnd)) {
    const close = {
      truck: `Camera glides slowly sideways on a slider about ${distanceEn(dA)} from the fabric, the plane of focus riding along ${detail}; the sheen travels across the folds as the angle to the light changes. The garment does not move.`,
      pedestal: `Camera glides vertically along ${detail} at about ${distanceEn(dA)}, lens kept level, focus riding the surface; folds and seams pass through the frame in order. The garment does not move.`,
      orbit: `Camera arcs ${s.degrees} degrees ${dir} around ${detail} at a constant ${distanceEn(dA)}, lens locked on the detail; the sheen sweeps across the folds as the angle to the key light changes. The garment does not move.`,
      'arc-push': `Camera arcs ${s.degrees} degrees ${dir} around ${detail} while easing closer from about ${distanceEn(dA)} to ${distanceEn(dB)}; the highlight slides along the folds.`,
      turntable: `Camera locked on ${detail} at about ${distanceEn(dA)}. The talent turns ${s.degrees} degrees very slowly in place so the light sweeps across the fabric; the detail stays centred in frame.`,
      'rack-focus': `Camera locked at about ${distanceEn(dA)}. Focus pulls from the nearest fold of ${detail} to the plane behind it, revealing the depth of the fabric; geometry unchanged.`,
      'dolly-in': `Camera creeps forward from about ${distanceEn(dA)} to ${distanceEn(dB)}, from ${A} into ${B} of ${detail}; focus follows the surface.`,
      static: `Camera locked at about ${distanceEn(dA)} on ${detail}; only the light on the fabric and a breath of movement change.`
    };
    if (close[s.move]) return close[s.move];
  }
  const lines = {
    'dolly-in': `Camera dollies physically forward from a ${A} (about ${distanceEn(dA)}) to a ${B} (about ${distanceEn(dB)}) with a fixed ${s.lens}mm focal length; foreground parallax stronger than background.`,
    'dolly-out': `Camera dollies physically backward from a ${A} (about ${distanceEn(dA)}) to a ${B} (about ${distanceEn(dB)}) with a fixed ${s.lens}mm focal length, revealing more of the ${isTight(s.sizeStart) ? 'garment' : 'set'}.`,
    zoom: `Camera position stays fixed. The lens zooms from ${s.lens}mm to about ${lensEnd}mm, going from a ${A} to a ${B}; no perspective change.`,
    pan: `Camera pans ${s.degrees || 15} degrees on a fixed tripod head, ending with the subject centered. No lateral translation.`,
    tilt: `Camera tilts upward ${s.degrees || 15} degrees from a fixed height, ending on the face. No pedestal movement.`,
    truck: 'Camera slides laterally left on a slider, keeping the subject stationary; foreground passes faster than background.',
    orbit: `Camera arcs ${s.degrees} degrees ${dir} around the stationary subject at a constant distance of about ${distanceEn(dA)}, keeping the subject centered. The subject does not rotate.`,
    'arc-push': `Camera arcs ${s.degrees} degrees ${dir} while dollying forward from a ${A} to a ${B}; fixed focal length, subject centered.`,
    turntable: `Camera locked. The subject rotates ${s.degrees} degrees in place on a slow steady turntable; background and light stay fixed.`,
    pedestal: `Camera rises vertically from ${heights[s.height].en.replace('camera at ', '')} to ${heights[s.heightEnd].en.replace('camera at ', '')} with the lens kept level. No tilt.`,
    tracking: `Camera tracks laterally alongside the subject at a constant distance of about ${distanceEn(dA)}, matching the subject's pace.`,
    crane: `Camera cranes from ${heights[s.height].en.replace('camera at ', '')} up to ${heights[s.heightEnd].en.replace('camera at ', '')} while retreating slightly to reveal the set.`,
    roll: `Camera rolls ${s.degrees || 12} degrees clockwise around the lens axis and settles.`,
    'dolly-zoom': 'Camera dollies backward while zooming in to keep subject size constant; the background perspective visibly stretches.',
    'rack-focus': 'Camera locked. Focus pulls from the foreground detail to the second visible plane; geometry unchanged.',
    static: 'Camera locked off on a tripod; nothing moves except the subject action.'
  };
  return lines[s.move];
}

export function shotWarnings(project, s) {
  const w = [];
  const a = coverOf(s.sizeStart), b = coverOf(s.sizeEnd);
  const tight = isTight(s.sizeStart) || isTight(s.sizeEnd);
  if (['dolly-in', 'zoom', 'arc-push'].includes(s.move) && b >= a) w.push('Este movimento aproxima: o enquadramento final deve ser mais fechado que o inicial.');
  if (['dolly-out', 'crane'].includes(s.move) && b < a) w.push('Este movimento afasta: o enquadramento final deve ser igual ou mais aberto.');
  if (moveControls[s.move]?.degrees && s.degrees === 0) w.push('Defina os graus do movimento.');
  if (['orbit', 'arc-push'].includes(s.move) && s.degrees >= 90) w.push('Arcos de 90° ou mais exigem vistas laterais e de costas aprovadas. Comece com 15–45°.');
  if (s.move === 'turntable' && s.degrees === 360) w.push('Giro de 360° tem alto risco de deriva. Prefira dois giros de 180° com corte.');
  if (s.action === 'walk' && ['macro', 'ecu', 'cu', 'mcu'].includes(s.sizeStart)) w.push('Caminhada em plano fechado perde a leitura dos passos. Use plano americano ou inteiro.');
  if (s.lens <= 24 && ['cu', 'mcu'].includes(s.sizeStart)) w.push('24mm em close deforma o rosto. Prefira 85mm.');
  const pose = endPose(s);
  if (Math.abs(normalizeAngle(pose.cameraAngle - pose.subjectRotation)) >= 135 && project.product.vertical !== 'product' && !project.product.refBack) w.push('As costas aparecem nesta tomada: informe a referência de costas da peça.');
  if (s.duration >= 8 && s.move !== 'static') w.push('Tomadas longas com movimento acumulam deriva. Considere dividir em duas.');
  if (s.move !== 'static' && s.move !== 'rack-focus' && (s.action === 'walk' || actions[s.action].rotation) && s.move !== 'tracking') w.push('Câmera e modelo se movendo juntos aumentam o risco. Fixe a câmera ou simplifique a ação.');
  // Close-up fidelity, from the store manual: without a close photo there is no honest macro.
  if (tight && !project.product.refDetail) w.push('Plano fechado sem foto de detalhe da peça: o gerador inventa trama e costura. Informe a referência de detalhe na etapa 2.');
  if (tight && s.detail === 'back' && !project.product.refBack) w.push('Detalhe das costas sem foto de costas da peça. Informe a referência de costas ou escolha outra região.');
  if (tight && (s.action === 'walk' || actions[s.action].rotation)) w.push('No plano fechado, a modelo fica parada: o movimento vem da câmera ou de um giro lento (operação “Giro no eixo”).');
  if (tight && ['turntable', 'orbit', 'arc-push'].includes(s.move) && s.degrees > 45) w.push('No plano fechado, giros acima de 45° tiram o detalhe do quadro e mostram lados sem referência. Use 15–30°.');
  if (Math.max(a, b) / Math.min(a, b) >= 8) w.push(`Salto de escala de cerca de ${Math.round(Math.max(a, b) / Math.min(a, b))}× numa só tomada: o gerador perde a peça no caminho. Divida em duas tomadas com corte.`);
  return w;
}

export function compileShot(project, index) {
  const timeline = shotTimeline(project);
  const s = timeline[index];
  const f = project.brief.format;
  const end = needsEndFrame(s);
  const files = {a: keyframeFile(project, index, 'a'), b: end ? keyframeFile(project, index, 'b') : null};
  const motion = [
    `SHOT ${index + 1} · ${s.start}–${s.end}s · "${s.title}"`,
    `Intent: ${s.intent}`,
    `Start frame: ${files.a}.${files.b ? ` End frame: ${files.b} (use first/last-frame mode when the tool supports it).` : ''}`,
    `One continuous ${s.duration}-second shot in real time (no slow motion), ${speeds[s.speed].en}. The set stays physically stable.`,
    `Camera: ${moveSentence(project, s)}`,
    talentBlock(project).person ? `Talent: ${actions[s.action].en}.` : `Subject: ${actions[s.action].en}.`,
    `Focus: ${focusTargets[s.focus].en}.`,
    `Preserve identity, garment construction, ${fabrics[project.product.fabric].en} behavior and light direction exactly as in the start frame. No morphing, no new accessories, no text.`,
    `End with a brief stable hold. Edit: ${transitions[s.transition].en} into the next shot.`,
    'Configure the real duration, resolution and aspect ratio in the video tool. Review the start, middle and end frames before approving.'
  ].join('\n');
  return {
    ...s, files, motion,
    refs: {a: frameRefs(project, s, index, false), b: end ? frameRefs(project, s, index, true) : null},
    keyA: keyframePrompt(project, s, index, 'A'),
    keyB: end ? keyframePrompt(project, s, index, 'B') : null,
    distance: {start: cameraDistance(s.sizeStart, s.lens, f), end: cameraDistance(s.sizeEnd, s.move === 'zoom' ? s.lens * coverOf(s.sizeStart) / coverOf(s.sizeEnd) : s.lens, f)},
    pose: endPose(s),
    warnings: shotWarnings(project, s)
  };
}

export const compileProject = project => project.shots.map((_, i) => compileShot(project, i));
export const totalDuration = project => project.shots.reduce((sum, s) => sum + (Number.isInteger(s.duration) ? s.duration : 0), 0);

/** Unique references the whole film needs, excluding keyframes the film itself produces. */
export function projectReferences(project) {
  const refs = new Map();
  for (const c of compileProject(project)) for (const r of [...c.refs.a, ...(c.refs.b || [])]) if (r.kind !== 'keyframe' && !refs.has(r.file)) refs.set(r.file, r);
  return [...refs.values()];
}
export const requiredReferences = project => projectReferences(project).map(r => r.file);

export function exportStudioText(input) {
  const p = validateStudio(input);
  const shots = compileProject(p);
  const model = castById(p.talent.castId);
  const direction = directionById(p.look.direction);
  return [
    'FRAME STUDIO · PACOTE DE PRODUÇÃO',
    `${p.meta.title} · ${p.brief.brand}`,
    `${objectives[p.brief.objective]} · ${p.brief.format} · ${totalDuration(p)}s · ${p.shots.length} tomadas`,
    '',
    'MENSAGEM', p.brief.message, `Público: ${p.brief.audience}`, `CTA (na edição): ${p.brief.cta}`,
    '',
    'PEÇA', `${p.product.name} · ${categories[p.product.category]} · ${p.product.color} · ${fabrics[p.product.fabric].label}`, `Construção: ${p.product.details}`, `Referências: ${[p.product.refFront, p.product.refBack, p.product.refDetail].filter(Boolean).join(', ')}`,
    '',
    'ELENCO', model ? `${model.code} ${model.name} · ${model.age} anos · ${model.height.toFixed(2).replace('.', ',')} m · manequim ${model.size}` : p.talent.castId === 'custom' ? `Modelo própria · ${p.talent.customRef}` : 'Sem modelo em cena',
    '',
    'DIREÇÃO', direction ? `${direction.name} · ${direction.lens} · ${direction.exposure}` : 'Personalizada', `Cenário: ${p.look.environment}`, `Luz: ${lights[p.look.light].label} · Cor: ${grades[p.look.grade].label}`,
    '',
    'REFERÊNCIAS A ANEXAR', requiredReferences(p).map(r => `- ${r}`).join('\n'),
    '',
    ...shots.flatMap(c => [
      '────────────────────────────────────────',
      `TOMADA ${c.index + 1} · ${c.start}–${c.end}s · ${c.title}`,
      `Intenção: ${c.intent}`,
      `Plano: ${shotSizes[c.sizeStart].abbr} → ${shotSizes[c.sizeEnd].abbr} · ${moveById(c.move).name}${moveControls[c.move]?.degrees ? ` ${c.degrees}°` : ''} · ${c.lens}mm · ${heights[c.height].label} · ${angles[String(c.angle)]}`,
      `Distância aproximada: ${metres(c.distance.start)} → ${metres(c.distance.end)} · Ação: ${actions[c.action].label} · Transição: ${transitions[c.transition].label}`,
      ...(c.warnings.length ? ['Atenção:', ...c.warnings.map(w => `- ${w}`)] : []),
      '', 'KEYFRAME A', c.keyA,
      ...(c.keyB ? ['', 'KEYFRAME B', c.keyB] : []),
      '', 'MOVIMENTO (imagem → vídeo)', c.motion, ''
    ]),
    'Planejamento local. Nenhuma imagem ou clipe foi gerado por este pacote. Distâncias são aproximações ópticas para orientar a direção.'
  ].join('\n');
}

/** Markdown brief that Codex (or any image agent) can execute keyframe by keyframe. */
export function exportCodexRequest(input) {
  const p = validateStudio(input);
  const slug = projectSlug(p);
  const items = compileProject(p).flatMap(c => [['a', c.keyA], ...(c.keyB ? [['b', c.keyB]] : [])].map(([which, prompt]) => ({c, which, prompt})));
  return [
    `# Pedido de imagens · ${p.meta.title}`,
    '',
    `Projeto exportado do FRAME Studio · ${p.brief.format} · ${items.length} keyframes · slug \`${slug}\`.`,
    '',
    '## Regras',
    '',
    '- Leia `AGENTS.md` e `docs/codex/IMAGENS-CODEX.md` antes de gerar.',
    '- Gere uma imagem por item, na ordem. O keyframe B de cada tomada usa o keyframe A como referência.',
    `- Salve cada PNG em \`incoming/projects/${slug}/\` com o nome indicado e rode \`python scripts/ingest-images.py\`.`,
    '- Não gere texto, logo ou marca dentro da imagem. Registre o prompt final em `docs/IMAGENS.md`.',
    '',
    '## Referências necessárias',
    '',
    ...requiredReferences(p).map(r => `- \`${r}\``),
    '',
    ...items.flatMap(({c, which, prompt}) => [
      `## ${String(c.index + 1).padStart(2, '0')}${which.toUpperCase()} · ${c.title}`,
      '',
      `- Arquivo: \`incoming/projects/${slug}/s${String(c.index + 1).padStart(2, '0')}-${which}.png\``,
      `- Destino após ingestão: \`${keyframeAsset(p, c.index, which)}\``,
      `- Aceite: identidade e peça idênticas às referências; enquadramento ${shotSizes[which === 'a' ? c.sizeStart : c.sizeEnd].label.toLowerCase()}; mãos e costuras plausíveis; sem texto.`,
      '',
      '```text', prompt, '```', ''
    ])
  ].join('\n');
}

