// The Sarcenet store's own AI models. Their images stay private: they live in the store folder and,
// after `npm run modelos`, as crops in references/sarcenet/modelos/ (ignored by Git, never published).
// Identity text describes visible features only; the attached face crop is the authority.

export const STORE_REF_DIR = 'references/sarcenet/modelos';

const sheet = (n, look, identity) => ({id: `loja-${n}`, code: `LOJA-${n}`, name: `Ficha ${n}`, source: `06 - MODELOS SARCENET · ficha ${n}`, look, identity});

export const storeModels = [
  {id: 'loja-a', code: 'MODELO-A', name: 'Modelo da galeria', source: '04 - MANUAL DE GERAÇÃO DE IMAGENS · MODELO LOJA',
    look: 'Pele clara, cabelo castanho preso em coque baixo solto, olhos esverdeados. A modelo de todas as fotos de produto.',
    identity: 'adult woman in her late twenties, fair skin with a warm undertone, light chestnut-brown hair in a loose low updo with soft face-framing strands, hazel-green eyes, straight defined brows, oval face with high cheekbones, slim straight nose, full lips in a natural rose tone, slim build'},
  sheet('01', 'Pele morena clara oliva, cabelo castanho-escuro longo e ondulado.', 'adult woman in her mid twenties, light olive skin, long dark-brown wavy hair with a middle part, warm brown eyes, full defined brows, soft oval face, full lips'),
  sheet('02', 'Pele clara, chanel preto liso na altura do queixo.', 'adult woman in her mid twenties, fair skin, glossy black blunt bob at jaw length, hazel-green eyes, dark straight brows, defined cheekbones'),
  sheet('03', 'Pele negra retinta, cachos pretos volumosos e longos.', 'adult woman in her mid twenties, deep brown skin, long voluminous tight black curls, dark brown eyes, full lips, high cheekbones'),
  sheet('04', 'Pele clara, cabelo ruivo acobreado longo e ondulado.', 'adult woman in her mid twenties, fair skin with a warm undertone, long wavy auburn-copper hair, hazel eyes, soft brows, rounded cheekbones'),
  sheet('05', 'Pele clara, traços do leste asiático, rabo de cavalo preto alto.', 'adult woman in her mid twenties of East Asian appearance, fair skin, long straight black hair in a high ponytail, dark brown eyes, delicate features'),
  sheet('06', 'Pele morena clara, cabelo castanho na altura dos ombros com ondas.', 'adult woman in her mid twenties, light olive skin, shoulder-length brown hair with caramel tones and loose waves, brown eyes, full brows'),
  sheet('07', 'Pele morena, cachos escuros curtos e volumosos.', 'adult woman in her mid twenties, medium brown skin, short voluminous dark curls at chin length, brown eyes, soft round face'),
  sheet('08', 'Pele morena clara, cabelo castanho liso e longo.', 'adult woman in her mid twenties, light-medium skin, long straight brown hair with a middle part, brown eyes, defined brows, oval face'),
  sheet('09', 'Pele clara com sardas, cabelo loiro mel longo e ondulado.', 'adult woman in her mid twenties, fair skin with light freckles, long wavy honey-blonde hair, light hazel eyes, soft brows'),
  sheet('10', 'Pele negra retinta, tranças box braids pretas longas.', 'adult woman in her mid twenties, deep brown skin, long black box braids, dark brown eyes, sculpted brows, full lips'),
  sheet('11', 'Pele morena clara oliva, cabelo castanho-escuro nos ombros.', 'adult woman in her mid twenties, light olive skin, shoulder-length dark-brown hair with soft waves, brown eyes, full brows, oval face'),
  sheet('12', 'Pele negra retinta, rabo de cavalo alto com ondas longas.', 'adult woman in her mid twenties, deep brown skin, black hair in a sleek high ponytail with long wavy lengths, dark brown eyes, defined brows, full lips'),
  sheet('13', 'Pele clara, traços do leste asiático, chanel preto.', 'adult woman in her mid twenties of East Asian appearance, fair skin, black blunt bob just below the jaw, dark brown eyes, soft features'),
  sheet('14', 'Pele clara com sardas, cabelo loiro-acobreado longo.', 'adult woman in her mid twenties, fair skin with freckles, long wavy strawberry-copper blonde hair, light eyes, soft brows'),
  sheet('15', 'Pele morena, cachos escuros longos e volumosos.', 'adult woman in her mid twenties, medium brown skin, long voluminous dark curls, brown eyes, full brows, defined cheekbones'),
  sheet('16', 'Pele morena oliva, cabelo castanho-escuro liso e longo.', 'adult woman in her mid twenties, medium olive skin, long straight dark-brown hair, brown eyes, strong brows, oval face'),
  sheet('17', 'Pele clara, cabelo loiro claro longo com raiz escura.', 'adult woman in her mid twenties, light skin, long wavy light-blonde hair with darker roots, light eyes, soft brows'),
  sheet('18', 'Pele negra retinta, tranças pretas longas.', 'adult woman in her mid twenties, deep brown skin, long black knotless braids, dark brown eyes, defined brows, full lips'),
  sheet('19', 'Pele morena dourada, cabelo castanho-escuro longo levemente ondulado.', 'adult woman in her mid twenties, medium golden-tan skin, long dark-brown hair with a slight wave, brown eyes, full brows'),
  sheet('20', 'Pele negra retinta, cachos curtos escuros.', 'adult woman in her mid twenties, deep brown skin, short dark tapered curls, brown eyes, high cheekbones, full lips')
];

export const storeModelById = id => storeModels.find(m => m.id === id) || null;
/** Private file name of one view of a store model, as written by scripts/prepare-store-models.py. */
export const storeFileName = (id, view) => `sarcenet-modelo-${id.slice(5)}-${view}.png`;
