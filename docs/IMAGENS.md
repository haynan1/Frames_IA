# Registro de imagens

Data: **2026-10-30**. Método: ferramenta integrada `image_gen`, sem API/CLI externa. O nome exato do modelo interno não foi retornado; não atribuir os resultados a um modelo específico do catálogo.

As imagens são estudos educativos de produto fictício e pessoas adultas fictícias. Não há referência a uma pessoa real ou marca comercial. Os arquivos PNG originais permanecem no armazenamento local de imagens geradas; o repositório inclui versões WebP otimizadas. Não são resultados de testes comerciais ou de identidade.

## Direção de produto e moda

Arquivos: `assets/art-direction-triptych.webp` e recortes `product.webp`, `model.webp`, `scene.webp`.

Prompt de geração:

```text
Create an original cinematic photographic triptych, one wide landscape image composed of three equally wide vertical panels with no margins, no text, no typography. For an educational Portuguese art direction website. Left panel: sculptural amber glass perfume bottle without any branding on dark smoked mirror, warm shaft of light, black background, luxurious macro product photograph. Center panel: fictional adult female fashion model with medium brown skin, short dark bob hair, wearing ivory tailored blazer, waist-up editorial portrait in brutalist stone interior, soft window light from left, thoughtful expression, real skin texture. Right panel: same type of amber perfume bottle standing on sculptural sandstone plinth in desert sunset, atmospheric cinematic product photography. Rich warm amber, cream, black and muted olive palette, editorial luxury art direction, realistic materials, distinct images each occupying exactly a third of canvas. No words, no watermarks. Save project image and return local saved path if supported.
```

Revisão: composição, luz e materialidade adequadas para ilustração editorial. A geração interpretou a tampa como vidro escultural. Há diferenças de proporção do frasco entre painéis; estes não são apresentados como uma campanha de SKU fiel ou frames contínuos. A personagem com blazer é um estudo separado da contact sheet abaixo.

## Contact sheet conceitual

Arquivo: `assets/identity.webp`.

Prompt de geração:

```text
Original educational photographic contact sheet with 4 equal panels in a 2 by 2 grid, no margins, no text. Same fictional adult female fashion model about 30 years old in every panel, medium brown skin, short straight dark bob hair tucked behind ears, oval face, brown eyes, wearing a plain ivory crew-neck t-shirt and ivory tailored trousers, absolutely no jewelry. Plain warm gray studio seamless backdrop, neutral even soft light. Top left front-facing head and shoulders identity portrait with neutral expression. Top right left-profile head and shoulders portrait of exactly the same woman, same expression. Bottom left three-quarter head and shoulders portrait of exactly the same woman. Bottom right full-body standing portrait with both shoes visible, exactly same woman and outfit. Photorealistic natural skin texture, consistent identity, clean casting portfolio art direction, no lettering, no watermark, no graphical elements. Each panel exactly half width and half height.
```

Revisão: quatro vistas legíveis, corpo inteiro com pés visíveis, fundo e roupa coerentes. É um candidato ilustrativo: a identidade ainda requer comparação detalhada antes de produção. A vista de corpo inteiro tem menos pixels de rosto do que os retratos; use vistas individuais em alta resolução para uma campanha real. O turnaround completo também precisaria de perfil oposto e costas aprovados.

## Simulação

O atlas usa SVG construído em código com projeção de perspectiva. Não é mídia gerada por IA. A função mostra trajetória e paralaxe usando um objeto geométrico simples; não se apresenta como render fotorrealista de vidro ou previsão de saída de vídeo.
