// Brand profiles drive defaults in the Studio. Sarcenet is a working proposal:
// nothing here is an official brand guideline until the store validates it.
export const brandPresets = {
  sarcenet: {
    label: 'Sarcenet · proposta',
    name: 'Sarcenet',
    status: 'Perfil proposto pelo FRAME. Validar paleta, tom e público com a loja antes de publicar campanhas.',
    segment: 'Loja de moda · coleções femininas e masculinas',
    origin: 'Sarcenet (ou sarsenet) é o nome de uma fita de seda muito fina e macia, de tela simples, hoje usada sobretudo em forros. A proposta visual parte dessa matéria: brilho líquido, toque leve e luz suave.',
    tone: ['Sofisticado sem distância', 'Luminoso', 'Tátil', 'Brasileiro e contemporâneo'],
    palette: [
      {name: 'Champagne', hex: '#D8C3A5'},
      {name: 'Marfim', hex: '#F2EDE4'},
      {name: 'Rosé seco', hex: '#B88A7E'},
      {name: 'Oliva profundo', hex: '#4B4F3A'},
      {name: 'Grafite', hex: '#2B2A28'}
    ],
    rules: [
      'A peça é a protagonista: tecido, caimento e construção sempre legíveis.',
      'Pele real, sem plastificação. Mãos e costuras plausíveis em todo frame.',
      'Logo e textos entram na edição, nunca gerados dentro da imagem.',
      'Elenco fictício até haver autorização registrada das modelos da loja.'
    ],
    defaults: {direction: 'seda-janela', castId: 'sc-01', format: '9:16', objective: 'launch'}
  },
  fashion: {
    label: 'Moda · genérico',
    name: 'Minha marca',
    status: 'Perfil neutro para qualquer loja de roupas.',
    segment: 'Moda',
    origin: 'Use este perfil para marcas sem guia visual definido. Ajuste nome, objetivo e direção.',
    tone: ['Claro', 'Editorial', 'Comercial'],
    palette: [
      {name: 'Off-white', hex: '#EEEBE4'},
      {name: 'Areia', hex: '#CDBFA8'},
      {name: 'Carvão', hex: '#262624'}
    ],
    rules: ['A peça precisa ser reconhecível em todos os planos.', 'Uma intenção por tomada.'],
    defaults: {direction: 'ciclorama-marfim', castId: 'sc-05', format: '4:5', objective: 'catalog'}
  },
  product: {
    label: 'Produto · objeto',
    name: 'Meu produto',
    status: 'Perfil para objetos sem modelo: bolsas, calçados, perfumes, decoração.',
    segment: 'Produto',
    origin: 'Sem pessoa em cena. A câmera e a luz descrevem volume, material e escala.',
    tone: ['Preciso', 'Material', 'Silencioso'],
    palette: [
      {name: 'Pedra', hex: '#BDB4A6'},
      {name: 'Âmbar', hex: '#B9874A'},
      {name: 'Preto quente', hex: '#1E1C19'}
    ],
    rules: ['Geometria, rótulo e proporção idênticos à referência.', 'Arcos curtos antes de giros completos.'],
    defaults: {direction: 'concreto-minimal', castId: 'none', format: '1:1', objective: 'ad'}
  },
  beauty: {
    label: 'Beleza · cuidado',
    name: 'Minha marca de beleza',
    status: 'Perfil para cosméticos, cabelo e cuidado pessoal.',
    segment: 'Beleza',
    origin: 'Pele, textura e gesto contam a história. Nenhuma promessa de resultado.',
    tone: ['Sensorial', 'Limpo', 'Honesto'],
    palette: [
      {name: 'Pêssego', hex: '#E7C2A8'},
      {name: 'Leite', hex: '#F6F1EA'},
      {name: 'Cacau', hex: '#5A3F33'}
    ],
    rules: ['Sem antes/depois ou alegação de eficácia.', 'Textura de pele preservada.'],
    defaults: {direction: 'seda-janela', castId: 'sc-10', format: '9:16', objective: 'social'}
  }
};

export const brandPresetIds = Object.keys(brandPresets);
