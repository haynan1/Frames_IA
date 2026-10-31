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

## Biblioteca visual — edição 01

São **30 gerações individuais selecionadas**, em dez cenários, e **uma tentativa rejeitada** preservada para comparação. Seis cenários estudam roupas: trench na chuva, linho na costa, alfaiataria no concreto, activewear na pista, tricô na biblioteca e cápsula de três looks. Quatro estudam produto: perfume no deserto, bolsa no atelier, café na cozinha e sérum botânico.

Os prompts completos usados estão em `data/gallery.js`, um por frame, e no [catálogo derivado](BIBLIOTECA.md). Os frames 02 e 03 foram gerados anexando o frame 01 do mesmo estudo como referência. No lookbook, a mudança de roupa é intencional. Cada resultado tem seu próprio arquivo de geração: não são recortes de uma única contact sheet.

`data/gallery-assets.js` registra arquivo original de geração, data, dimensões nativas, bytes, referência e método. `assets/gallery/<estudo>/01.webp` a `03.webp` são versões otimizadas sem upscale nem recorte; arquivos `-thumb.webp` são miniaturas. `assets/gallery/overview.webp` é apenas uma montagem de navegação feita a partir dos frames existentes, não uma geração adicional.

A primeira tentativa do frame 02 do perfume repetiu o enquadramento da base. Foi preservada em `assets/gallery/ambar-deserto/tentativa-repetida.webp`. A nova tentativa usou o mesmo prompt acrescido da instrução explícita de afastar a câmera, limitar o frasco a 40% da altura e revelar o pedestal completo; essa versão integral está no prompt registrado do frame 02. A comparação aparece no estudo do perfume.

Observações específicas estão em `data/gallery-review.js`: por exemplo, o café durante o despejo já está quase cheio, e o primeiro frame do perfume mostra o frasco inteiro apesar da solicitação de detalhe. Esses desvios não foram ocultados. A revisão é visual e estática; animações, narrações e resultados de vendas não foram produzidos ou medidos.

## Simulação

O atlas usa SVG construído em código com projeção de perspectiva. Não é mídia gerada por IA. A função mostra trajetória e paralaxe usando um objeto geométrico simples; não se apresenta como render fotorrealista de vidro ou previsão de saída de vídeo.

## Edição 02 · Studio (fila do Codex)

A versão 2.0 define **100 imagens** a gerar pelo Codex: 70 do elenco fictício (10 modelos × 7 vistas), 16 das direções de arte (imagem-chave e cenário vazio), 13 da campanha demonstrativa Sarcenet (3 vistas da peça e 10 keyframes) e a capa do estúdio. Os prompts completos, referências, destinos e critérios de aceite estão em [codex/FILA-DE-IMAGENS.md](codex/FILA-DE-IMAGENS.md), gerada a partir de `data/image-requests.js`. Protocolo: [codex/IMAGENS-CODEX.md](codex/IMAGENS-CODEX.md).

Até a primeira ingestão, o site mostra placeholders “aguardando geração”. Cada imagem ingerida é registrada em `data/generated-assets.js` com dimensões, miniatura, ID do pedido, data e método. Registre abaixo a revisão humana de cada uma.

| ID | Data | Método | Tentativas | Revisão |
| --- | --- | --- | --- | --- |
