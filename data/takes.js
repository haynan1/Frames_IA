// Direction notes for the ready-made 5-take kit. Camera, framing and timing live in the Studio template
// 'tomadas-prontas' (data/studio.js); this file only explains each take, so the two never disagree.
import {createStudioProject, validateStudio} from './studio.js';

export const KIT_TEMPLATE = 'tomadas-prontas';
// Takes 1–5 are shots 1–5 of the Cápsula Seda campaign, whose keyframes are generated examples.
export const KIT_EXAMPLE_SLUG = 'sarcenet-capsula-seda';

export const kitRules = [
  'A mesma modelo e a mesma peça nas cinco tomadas. Troque a modelo aqui; a peça, na etapa 2 do Studio.',
  'Uma luz só: janela suave pela esquerda, com a mesma cor do começo ao fim.',
  'Formato 9:16 e lentes da mesma família (35, 50, 85 e 100 mm). Nada de grande angular no rosto.',
  'A câmera ou a modelo se movem, nunca as duas ao mesmo tempo. A tomada 5 é a exceção controlada: câmera e passo andam juntos.',
  'Tempo real, sem câmera lenta. Cada tomada termina num quadro estável para o corte.'
];

export const kitOrder = [
  'Gere primeiro a imagem A da tomada 2 (retrato). Ela confirma o rosto antes de gastar as outras gerações.',
  'Depois gere as imagens A e B de todas as tomadas, na ordem. Aprove cada par antes de animar.',
  'Anime as cinco tomadas e monte na ordem 1 → 5, com as transições indicadas. Total: 14 segundos.'
];

export const takeNotes = [
  {role: 'Abertura', feeling: 'Desejo tátil antes de qualquer rosto.',
    why: 'Abrir pela matéria faz o espectador sentir o tecido. O foco que passa dos dedos para o brilho cria o primeiro movimento sem mover a câmera.',
    frames: {a: 'Dedos tocando o decote, foco nos dedos, brilho do tecido desfocado ao fundo.'},
    review: ['Cinco dedos, unhas e articulações plausíveis.', 'Brilho do tecido sem estourar.', 'Trama igual à foto de detalhe: nada inventado.'],
    fix: 'Mão deformada ou tecido com cara de plástico: refaça só a imagem A com a foto de detalhe anexada e a correção “relaxed natural fingers”.'},
  {role: 'Apresentação', feeling: 'Conhecer quem veste.',
    why: 'O recuo do rosto até a cintura apresenta a modelo e revela o decote. É a tomada que fixa a identidade do filme.',
    frames: {a: 'Primeiríssimo plano do rosto, olhar a caminho da lente.', b: 'Plano médio da cintura para cima, olhar na lente.'},
    review: ['O mesmo rosto em A e em B: olhos, sobrancelhas, sinais.', 'Olhar vivo, sem aspecto vidrado.', 'Decote e alças iguais à peça.'],
    fix: 'O rosto muda no recuo: reduza para 2 s ou gere o B anexando o A aprovado como continuidade.'},
  {role: 'Volume', feeling: 'Ver a peça inteira em três dimensões.',
    why: 'Um arco curto de 30° em volta da modelo parada mostra o caimento e o volume que uma foto de frente não mostra.',
    frames: {a: 'Corpo inteiro em três quartos pela esquerda.', b: 'Corpo inteiro, 30° adiante no arco.'},
    review: ['Quem gira é a câmera: a modelo continua parada.', 'Pé esquerdo e pé direito corretos, sombra de contato no chão.', 'Barra e comprimento idênticos em A e B.'],
    fix: 'A modelo gira junto com a câmera: reforce “the subject does not rotate” e mantenha 30° no máximo.'},
  {role: 'Revelação', feeling: 'A surpresa das costas.',
    why: 'Com a câmera fixa, a meia-volta da modelo revela as costas da peça. Só funciona com foto real das costas.',
    frames: {a: 'Plano americano de frente, prestes a girar.', b: 'Plano americano de costas, alças cruzadas visíveis.'},
    review: ['Costas iguais à foto de costas da peça: alças, decote, fechos.', 'Cabelo afastado, sem esconder as costas.', 'O giro não faz os pés deslizarem.'],
    fix: 'Sem foto de costas: troque a ação por um giro de 90° (perfil) e não mostre as costas.'},
  {role: 'Fecho', feeling: 'A peça viva, em movimento real.',
    why: 'Dois passos com a câmera acompanhando de lado mostram o tecido respondendo ao corpo. O final estável abre espaço para logo e CTA na edição.',
    frames: {a: 'Corpo inteiro, peso no pé de trás, prestes a dar o primeiro passo.', b: 'Meio do segundo passo, peso no pé da frente.'},
    review: ['Os pés alternam corretamente, sem deslizar.', 'O tecido tem peso: balança e assenta.', 'Termina estável, com espaço livre para o CTA.'],
    fix: 'Passo deslizando ou em câmera lenta: encurte para dois passos curtos e abra o plano.'}
];

/** The kit as a Studio project with the chosen talent; the camera and timing never change. */
export function createKitProject(castId) {
  const p = createStudioProject(KIT_TEMPLATE);
  if (castId) p.talent.castId = castId;
  return validateStudio(p);
}
