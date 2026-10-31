// Brand profiles drive defaults in the Studio. Sarcenet follows the store's own image manual and the
// Vesper theme (read on 31.10.2026); when they change, the store's files win over this summary.
export const brandPresets = {
  sarcenet: {
    label: 'Sarcenet · loja',
    name: 'Sarcenet',
    status: 'Resumo do manual de imagens e do tema da loja, lidos em 31.10.2026. Em caso de conflito, vale o manual da loja.',
    segment: 'Moda feminina de noite e social · Reino Unido · sarcenet.uk',
    origin: 'Vestidos longos, blusas de cetim, conjuntos e tricôs para quem se veste para a noite. Copy em inglês britânico. O nome vem da sarsenet, uma seda fina e macia.',
    tone: ['Quiet elegance', 'Editorial', 'Calmo', 'Fiel à peça'],
    palette: [
      {name: 'Fundo do site', hex: '#F2ECE3'},
      {name: 'Tinta', hex: '#191512'},
      {name: 'Dourado', hex: '#8A6B2F'},
      {name: 'Parede do estúdio', hex: '#CFC3B4'},
      {name: 'Chão do estúdio', hex: '#DDD1C3'}
    ],
    rules: [
      'Fidelidade antes da estética: a foto do produto manda na cor e na construção. Nada de costas, forro, bolso ou trama inventados.',
      'Sem foto de costas, sem vista de costas. Sem foto macro, sem plano macro.',
      'Galeria em 3:4, no estúdio padrão, com luz suave pela esquerda. Nenhum equipamento no quadro.',
      'Anúncio em vídeo: cenário de uso real no Reino Unido, ação concreta, tempo real. Planos abertos cortam abaixo do joelho.',
      'Sem as palavras luxury, premium ou cinematic nos prompts: elas puxam o brilho de IA.',
      'Logo, texto e CTA entram na edição. Nenhuma avaliação escrita pela loja.'
    ],
    defaults: {direction: 'estudio-sarcenet', castId: 'loja-a', format: '9:16', objective: 'social'}
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
