// Art directions: repeatable photographic worlds for fashion campaigns.
// Lighting plans are top-down, in metres, with the subject at (0,0) facing the
// camera on the positive Y axis. They describe intent, not a measured set.

export const directions = [
  {id: 'seda-janela', name: 'Seda & janela', tagline: 'Matéria líquida, luz de manhã.',
    use: 'Assinatura proposta para a Sarcenet: lançamentos, peças fluidas, seda, cetim, malhas finas.',
    mood: ['Íntimo', 'Luminoso', 'Tátil'], light: 'window', grade: 'warm-film', lens: '85mm · f/2', exposure: 'ISO 400 · 1/250 · balanço 5200K',
    palette: [{name: 'Champagne', hex: '#D8C3A5'}, {name: 'Marfim', hex: '#F2EDE4'}, {name: 'Rosé seco', hex: '#B88A7E'}, {name: 'Sombra quente', hex: '#5B4B3E'}],
    setup: [
      {kind: 'window', label: 'Janela alta + voil', x: -2.4, y: 0.8, modifier: 'Difusão natural 2 × 3 m'},
      {kind: 'bounce', label: 'Rebatedor marfim', x: 1.6, y: 1.2, modifier: 'Painel 1 × 2 m'},
      {kind: 'bg', label: 'Cortina de linho', x: 0, y: -1.8, modifier: 'Fundo a 1,8 m'}
    ],
    environment: 'a quiet sunlit apartment atelier with a tall window dressed in sheer ivory voile curtains, pale limestone floor, warm off-white plaster walls, a single linen-covered stool, generous empty space',
    artDirection: 'soft directional window light from camera left wrapping the face and making silk glow, gentle falloff into warm shadows, champagne and ivory palette, calm luxury, no clutter',
    hero: {castId: 'sc-01', wardrobe: 'a champagne silk-satin bias-cut midi slip dress with thin straps and a soft cowl neckline'},
    avoid: 'Brilho estourado no cetim, pele plastificada, cortina competindo com a peça.'},
  {id: 'ciclorama-marfim', name: 'Ciclorama marfim', tagline: 'Verdade de produto, sem ruído.',
    use: 'E-commerce premium, catálogo, giros de peça e comparação de tamanhos.',
    mood: ['Limpo', 'Preciso', 'Comercial'], light: 'highkey', grade: 'natural', lens: '50–85mm · f/8', exposure: 'ISO 100 · 1/160 · flash 5600K',
    palette: [{name: 'Marfim', hex: '#EEE9E0'}, {name: 'Areia', hex: '#D8CDBB'}, {name: 'Grafite', hex: '#2B2A28'}],
    setup: [
      {kind: 'key', label: 'Octa 150 cm', x: -1.4, y: 1.6, modifier: 'Key a 45°, acima dos olhos'},
      {kind: 'fill', label: 'Painel de preenchimento', x: 1.8, y: 2.0, modifier: '−1,5 stop'},
      {kind: 'bg', label: 'Luz de fundo × 2', x: 0, y: -2.6, modifier: 'Ciclorama +1 stop'},
      {kind: 'rim', label: 'Strip de recorte', x: 1.2, y: -1.0, modifier: 'Contorno sutil'}
    ],
    environment: 'a seamless warm ivory cyclorama studio with a soft floor-to-wall curve, no visible horizon line, subtle grounded contact shadow under the feet',
    artDirection: 'clean high-key commercial fashion lighting, large soft key at 45 degrees with gentle fill, true-to-life fabric color, crisp edges, shadow detail preserved',
    hero: {castId: 'sc-05', wardrobe: 'a sand-colored relaxed linen-blend blazer worn over a matching wide-leg trouser and a plain white tee'},
    avoid: 'Fundo cinza sujo, sombra dupla, cor da peça alterada pelo balanço.'},
  {id: 'atelier-provador', name: 'Atelier & provador', tagline: 'Os bastidores vendem confiança.',
    use: 'Reels de provador, novidades da semana, ajuste e escolha de tamanho.',
    mood: ['Próximo', 'Quente', 'Real'], light: 'softbox', grade: 'warm-film', lens: '35mm · f/2.8', exposure: 'ISO 800 · 1/200 · 3800K',
    palette: [{name: 'Nogueira', hex: '#6E4E37'}, {name: 'Latão', hex: '#B08D57'}, {name: 'Creme', hex: '#EFE5D3'}],
    setup: [
      {kind: 'key', label: 'Softbox 90 cm', x: -1.2, y: 1.4, modifier: 'Key suave, 3800K'},
      {kind: 'practical', label: 'Arandelas do espelho', x: 0.8, y: -0.9, modifier: 'Práticas quentes'},
      {kind: 'bounce', label: 'Parede creme', x: 1.6, y: 0.6, modifier: 'Rebatimento natural'}
    ],
    environment: 'an elegant boutique fitting room with a tall brass-framed mirror, walnut clothing rail with a few neutral garments, cream velvet curtain, warm wall sconces, small round ottoman',
    artDirection: 'warm intimate interior light, practical sconces glowing softly, honest behind-the-scenes boutique atmosphere, natural skin, readable garment color',
    hero: {castId: 'sc-06', wardrobe: 'an ivory silk blouse tucked into high-waisted camel tailored trousers'},
    avoid: 'Reflexos impossíveis no espelho, araras lotadas, marcas reais nas peças de fundo.'},
  {id: 'rua-golden-hour', name: 'Rua · golden hour', tagline: 'A cidade como passarela.',
    use: 'Coleções casuais e jeans, peças de verão, campanhas de rua.',
    mood: ['Livre', 'Dourado', 'Urbano'], light: 'golden', grade: 'warm-film', lens: '50mm · f/2.8', exposure: 'ISO 200 · 1/500 · luz natural',
    palette: [{name: 'Sol baixo', hex: '#E2A25E'}, {name: 'Tijolo', hex: '#A55F45'}, {name: 'Azul sombra', hex: '#46576A'}],
    setup: [
      {kind: 'sun', label: 'Sol baixo em contraluz', x: -2.6, y: -2.6, modifier: 'Recorte dourado no cabelo'},
      {kind: 'bounce', label: 'Rebatedor dourado', x: 1.0, y: 1.6, modifier: 'Preenche o rosto'}
    ],
    environment: 'a quiet tree-lined Brazilian city street at golden hour, warm stone sidewalk, low modernist buildings with brise-soleil, no readable signage, no crowds, a few soft out-of-focus leaves',
    artDirection: 'low warm sun backlighting the hair and fabric edges, golden reflector fill on the face, long soft shadows, lively but natural color, real street depth',
    hero: {castId: 'sc-08', wardrobe: 'a light-wash relaxed denim jacket over a white heavyweight tee, stone-colored straight chinos and white minimal sneakers'},
    avoid: 'Placas e marcas legíveis, multidão inventada, flare cobrindo o rosto.'},
  {id: 'noite-flash', name: 'Noite · flash', tagline: 'Energia de evento, textura de filme.',
    use: 'Festa, peças com brilho, coleções noturnas e conteúdo de impacto.',
    mood: ['Noturno', 'Direto', 'Magnético'], light: 'flash', grade: 'high-contrast', lens: '35mm · f/5.6', exposure: 'ISO 400 · 1/15 drag shutter · flash direto',
    palette: [{name: 'Preto', hex: '#121212'}, {name: 'Cromo', hex: '#C9CDD2'}, {name: 'Vermelho noite', hex: '#8E2B2B'}],
    setup: [
      {kind: 'flash', label: 'Flash direto na câmera', x: 0.2, y: 2.4, modifier: 'Frontal, sombra recortada'},
      {kind: 'practical', label: 'Luzes da cidade', x: -1.8, y: -3.2, modifier: 'Arrasto de movimento'}
    ],
    environment: 'a city sidewalk at night outside an unnamed venue, wet asphalt reflecting distant warm and red lights, dark background with soft bokeh, no readable signs',
    artDirection: 'on-camera direct flash freezing the subject with a crisp hard shadow behind, slight ambient motion trails from a slow shutter, deep blacks, glossy editorial night energy',
    hero: {castId: 'sc-10', wardrobe: 'a black satin one-shoulder mini dress with a structured neckline and black strappy heels'},
    avoid: 'Olhos vermelhos, pele estourada, fundo totalmente preto sem profundidade.'},
  {id: 'color-block', name: 'Color block', tagline: 'Cor sólida, gesto gráfico.',
    use: 'Linha jovem, básicos coloridos, anúncios de alto contraste e lançamentos de cor.',
    mood: ['Gráfico', 'Jovem', 'Pop'], light: 'hard', grade: 'clean-cool', lens: '35mm · f/8', exposure: 'ISO 100 · 1/200 · flash com gel',
    palette: [{name: 'Terracota', hex: '#C0603F'}, {name: 'Cobalto', hex: '#2747A8'}, {name: 'Amarelo argila', hex: '#D9A441'}],
    setup: [
      {kind: 'key', label: 'Refletor parabólico', x: -1.0, y: 2.0, modifier: 'Luz dura, sombra gráfica'},
      {kind: 'bg', label: 'Fundo de papel colorido', x: 0, y: -1.6, modifier: 'Cor sólida saturada'}
    ],
    environment: 'a seamless saturated terracotta paper backdrop with a matching floor, a single cobalt-blue painted cube as a seat, nothing else in the set',
    artDirection: 'hard crisp key light casting a clean graphic shadow on the colored backdrop, saturated but accurate garment color, playful confident posing',
    hero: {castId: 'sc-03', wardrobe: 'a cobalt-blue oversized poplin shirt worn open over a white tank, high-waisted cobalt tailored shorts and white loafers'},
    avoid: 'Cor do fundo contaminando a peça, sombra dupla, pele com dominante.'},
  {id: 'concreto-minimal', name: 'Concreto minimal', tagline: 'Arquitetura, linha e silhueta.',
    use: 'Alfaiataria, peças estruturadas, preto e neutros, campanhas institucionais.',
    mood: ['Arquitetônico', 'Sóbrio', 'Preciso'], light: 'hard', grade: 'natural', lens: '50mm · f/5.6', exposure: 'ISO 200 · 1/250 · sol direto',
    palette: [{name: 'Concreto', hex: '#9E9A93'}, {name: 'Preto', hex: '#1A1A1A'}, {name: 'Linho cru', hex: '#D6CCBA'}],
    setup: [
      {kind: 'sun', label: 'Feixe de sol por fresta', x: -2.2, y: 0.4, modifier: 'Luz dura, recorte geométrico'},
      {kind: 'bounce', label: 'Parede de concreto', x: 1.4, y: -0.4, modifier: 'Preenchimento frio'}
    ],
    environment: 'a minimalist brutalist concrete gallery with tall columns, a narrow vertical slit window casting a geometric beam of sunlight across the floor and wall, polished concrete floor',
    artDirection: 'hard directional sunlight carving geometric light and shadow, structured silhouettes, restrained neutral palette, shadow detail preserved in black fabric',
    hero: {castId: 'sc-02', wardrobe: 'a black double-breasted oversized wool blazer with matching wide-leg trousers and a white fine-knit turtleneck'},
    avoid: 'Pretos esmagados, linhas tortas, poses exageradas que desmontam a alfaiataria.'},
  {id: 'natureza-linho', name: 'Natureza & linho', tagline: 'Vento leve, tecido vivo.',
    use: 'Resort, verão, linho, peças leves e campanhas de viagem.',
    mood: ['Solar', 'Aberto', 'Respirado'], light: 'overcast', grade: 'soft-pastel', lens: '85mm · f/2.8', exposure: 'ISO 100 · 1/1000 · céu aberto',
    palette: [{name: 'Linho', hex: '#E6DCC8'}, {name: 'Verde sálvia', hex: '#9AA88B'}, {name: 'Azul mar', hex: '#7FA3B5'}],
    setup: [
      {kind: 'sun', label: 'Céu aberto difuso', x: -1.0, y: 3.0, modifier: 'Luz envolvente'},
      {kind: 'bounce', label: 'Areia clara', x: 0, y: 1.2, modifier: 'Rebatimento do chão'}
    ],
    environment: 'a natural coastal dune landscape with pale sand, tall soft grasses moving in a light breeze and a calm sea far behind, open bright sky with thin high clouds',
    artDirection: 'soft bright open-shade daylight, airy pastel palette, light breeze moving loose fabric and hair naturally, tactile linen slub texture, relaxed resort mood',
    hero: {castId: 'sc-07', wardrobe: 'an oatmeal linen long-sleeve shirt dress with a tie waist and flat tan leather sandals'},
    avoid: 'Vento de tempestade, tecido transparente inventado, horizonte torto.'}
];

export const directionById = id => directions.find(direction => direction.id === id);
export const directionAssetPath = (id, kind) => `assets/directions/${id}/${kind}.webp`;
