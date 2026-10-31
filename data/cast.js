// Fictional casting for the studio. Every model is an invented adult: no real
// person, celebrity or store employee is described here. Real store models can
// only be used through the private intake in references/ with recorded consent.

const digitals = {
  f: 'fitted plain black tank top, slim straight dark-indigo jeans, barefoot, no jewelry, no accessories, minimal natural makeup',
  m: 'fitted plain black crew-neck t-shirt, slim straight dark-indigo jeans, barefoot, no jewelry, no accessories, no makeup look'
};

export const castViews = [
  {id: 'rosto-frente', label: 'Rosto · frente', priority: 'P0', body: false, view: 'Head-and-shoulders portrait, facing the camera straight on, neutral relaxed expression, eyes to lens, both ears visible, hair falling naturally. Camera at eye level, 85mm.'},
  {id: 'corpo-frente', label: 'Corpo inteiro · frente', priority: 'P0', body: true, view: 'Full-body standing portrait facing the camera, arms relaxed at the sides, feet hip-width apart, head and both feet fully inside the frame with generous margins. Camera at chest height, 50mm, no distortion.'},
  {id: 'rosto-34', label: 'Rosto · três quartos', priority: 'P1', body: false, view: 'Head-and-shoulders portrait with the head turned 45 degrees to camera right, eyes following the head direction, same neutral expression. Camera at eye level, 85mm.'},
  {id: 'perfil', label: 'Perfil', priority: 'P1', body: false, view: 'Strict left-profile head-and-shoulders portrait (subject faces camera left), jawline, nose and ear clearly readable, same neutral expression. Camera at eye level, 85mm.'},
  {id: 'corpo-costas', label: 'Corpo inteiro · costas', priority: 'P1', body: true, view: 'Full-body standing portrait seen exactly from behind, arms relaxed, head and both feet fully in frame. Hairstyle and body proportions must match the front view. Camera at chest height, 50mm.'},
  {id: 'corpo-lateral', label: 'Corpo inteiro · lateral', priority: 'P1', body: true, view: 'Full-body standing portrait in strict right profile (subject faces camera right), natural posture, head and both feet fully in frame. Camera at chest height, 50mm.'},
  {id: 'editorial', label: 'Editorial · luz Sarcenet', priority: 'P2', body: false, view: 'Waist-up editorial portrait with a soft, barely-there smile, wearing a plain ivory silk-satin button-up blouse instead of the digitals wardrobe. Large diffused window light from camera left with sheer voile curtain, warm champagne tones, 85mm at f/2.'}
];

export const cast = [
  {id: 'sc-01', code: 'SC-01', name: 'Helena', line: 'Feminina', age: 27, height: 1.76, size: '38', mst: 6,
    traits: ['Pele morena média (MST 6)', 'Cabelo castanho-escuro longo e ondulado, risca ao meio', 'Pinta pequena acima do lábio, à esquerda'],
    energy: 'Serena, olhar direto, gestos lentos.',
    bestFor: ['seda-janela', 'atelier-provador', 'ciclorama-marfim'],
    identity: 'fictional Brazilian woman, 27 years old, 1.76 m tall, slim natural build; medium brown skin (Monk skin tone 6) with warm undertone; oval face with high cheekbones, softly defined jaw; almond-shaped dark brown eyes; thick straight dark brows; full natural lips; a small mole just above the left side of the upper lip; long wavy dark brown hair, center part, reaching mid-back',
    digitals: digitals.f},
  {id: 'sc-02', code: 'SC-02', name: 'Aiko', line: 'Feminina', age: 31, height: 1.68, size: '36', mst: 3,
    traits: ['Brasileira de ascendência japonesa (MST 3)', 'Bob preto liso na altura do queixo, franja reta', 'Rosto estreito, sobrancelhas retas finas'],
    energy: 'Gráfica, precisa, postura ereta.',
    bestFor: ['concreto-minimal', 'color-block', 'ciclorama-marfim'],
    identity: 'fictional Brazilian woman of Japanese descent, 31 years old, 1.68 m tall, slender build; light skin with neutral undertone (Monk skin tone 3); narrow oval face, straight fine brows; dark brown monolid eyes; small straight nose; glossy straight black blunt bob at chin length with a straight full fringe',
    digitals: digitals.f},
  {id: 'sc-03', code: 'SC-03', name: 'Dandara', line: 'Feminina', age: 29, height: 1.80, size: '40', mst: 9,
    traits: ['Pele retinta (MST 9)', 'Cabelo natural crespo bem curto (TWA)', 'Maxilar marcado, sorriso largo'],
    energy: 'Presença forte, movimento amplo e seguro.',
    bestFor: ['color-block', 'noite-flash', 'concreto-minimal'],
    identity: 'fictional Brazilian woman, 29 years old, 1.80 m tall, athletic long-limbed build; deep dark brown skin (Monk skin tone 9) with cool undertone; strong defined jawline, high cheekbones; wide dark brown eyes; broad natural smile; very short natural black coily hair (teeny weeny afro), neat shape',
    digitals: digitals.f},
  {id: 'sc-04', code: 'SC-04', name: 'Lívia', line: 'Feminina', age: 24, height: 1.72, size: '36', mst: 2,
    traits: ['Pele clara com sardas (MST 2)', 'Cabelo acobreado liso na altura dos ombros', 'Olhos verdes'],
    energy: 'Leve, espontânea, sorriso fácil.',
    bestFor: ['natureza-linho', 'seda-janela', 'rua-golden-hour'],
    identity: 'fictional Brazilian woman, 24 years old, 1.72 m tall, slim build; fair skin (Monk skin tone 2) with natural freckles across nose and cheeks; heart-shaped face; green eyes; light copper brows; straight copper-red hair at shoulder length, side part',
    digitals: digitals.f},
  {id: 'sc-05', code: 'SC-05', name: 'Bianca', line: 'Feminina · plus', age: 33, height: 1.70, size: '50', mst: 5,
    traits: ['Plus size, manequim 50 (MST 5)', 'Cachos volumosos 3B com luzes caramelo', 'Rosto redondo, lábios cheios'],
    energy: 'Calorosa, confiante, gestos abertos.',
    bestFor: ['ciclorama-marfim', 'rua-golden-hour', 'atelier-provador'],
    identity: 'fictional Brazilian plus-size woman, 33 years old, 1.70 m tall, Brazilian size 50, curvy full figure with natural proportions; light-medium tan skin (Monk skin tone 5) with golden undertone; round face, full lips, warm dark brown eyes; voluminous shoulder-length 3B curly dark brown hair with soft caramel highlights',
    digitals: digitals.f},
  {id: 'sc-06', code: 'SC-06', name: 'Marta', line: 'Feminina · 40+', age: 46, height: 1.69, size: '42', mst: 4,
    traits: ['46 anos (MST 4)', 'Pixie grisalho prateado', 'Linhas de expressão finas, olhos castanho-claros'],
    energy: 'Elegância tranquila, autoridade gentil.',
    bestFor: ['concreto-minimal', 'seda-janela', 'atelier-provador'],
    identity: 'fictional Brazilian woman, 46 years old, 1.69 m tall, slim toned build; light olive skin (Monk skin tone 4) with fine natural expression lines around the eyes; refined oval face; light hazel-brown eyes; natural silver-gray hair in a short textured pixie cut',
    digitals: digitals.f},
  {id: 'sc-07', code: 'SC-07', name: 'Iara', line: 'Feminina · petite', age: 26, height: 1.60, size: '34', mst: 7,
    traits: ['Ascendência indígena brasileira (MST 7)', 'Cabelo preto liso até a cintura', 'Petite, 1,60 m'],
    energy: 'Delicada e firme, olhar profundo.',
    bestFor: ['natureza-linho', 'rua-golden-hour', 'seda-janela'],
    identity: 'fictional Brazilian woman of Indigenous Brazilian heritage, 26 years old, petite 1.60 m tall, slim build; medium-deep brown skin (Monk skin tone 7) with warm undertone; broad cheekbones, soft rounded jaw; dark almond-shaped eyes; straight black brows; very long straight jet-black hair reaching the waist, center part',
    digitals: digitals.f},
  {id: 'sc-08', code: 'SC-08', name: 'Rafael', line: 'Masculina', age: 30, height: 1.85, size: '42 · camisa M', mst: 7,
    traits: ['Pele morena (MST 7)', 'Degradê curto, barba aparada', 'Porte atlético'],
    energy: 'Descontraído, passos firmes.',
    bestFor: ['rua-golden-hour', 'concreto-minimal', 'noite-flash'],
    identity: 'fictional Brazilian man, 30 years old, 1.85 m tall, athletic build; medium-deep brown skin (Monk skin tone 7); square face, defined jaw with a neatly trimmed short full beard; dark brown eyes; short black hair in a low fade with textured top',
    digitals: digitals.m},
  {id: 'sc-09', code: 'SC-09', name: 'Theo', line: 'Masculina', age: 25, height: 1.80, size: '40 · camisa P', mst: 3,
    traits: ['Pele clara (MST 3)', 'Cabelo castanho-claro médio, despenteado', 'Rosto barbeado, porte esguio'],
    energy: 'Casual, curioso, leve ironia.',
    bestFor: ['natureza-linho', 'color-block', 'ciclorama-marfim'],
    identity: 'fictional Brazilian man, 25 years old, 1.80 m tall, slim lean build; light skin (Monk skin tone 3) with warm undertone; long oval face, clean-shaven; gray-blue eyes; medium-length tousled light brown hair falling to the eyebrows',
    digitals: digitals.m},
  {id: 'sc-10', code: 'SC-10', name: 'Nina', line: 'Feminina', age: 35, height: 1.74, size: '40', mst: 8,
    traits: ['Pele negra (MST 8)', 'Tranças box longas pretas', 'Maçãs do rosto definidas'],
    energy: 'Magnética, editorial, ritmo noturno.',
    bestFor: ['noite-flash', 'seda-janela', 'rua-golden-hour'],
    identity: 'fictional Brazilian woman, 35 years old, 1.74 m tall, slim toned build; deep brown skin (Monk skin tone 8) with warm undertone; defined high cheekbones, elegant long neck; dark brown eyes; full lips; long black box braids reaching the lower back, worn loose',
    digitals: digitals.f}
];

export const castById = id => cast.find(model => model.id === id);
export const castAssetPath = (id, view) => `assets/cast/${id}/${view}.webp`;
export const castFileName = (id, view) => `${id}-${view}.webp`;
