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
| CAST-SC-01-ROSTO-FRENTE | 2026-10-31 | image_gen integrado | 2 | Âncora frontal, cabelo ondulado e pinta corrigida para o lado anatômico esquerdo. Origem: exec-74d3de28-34a3-430d-b02a-9130f2212353.png. |
| CAST-SC-02-ROSTO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Retrato frontal com bob preto e franja; orelhas e contorno facial legíveis. Origem: exec-e634c48f-b4f3-40d8-a5bb-761c73a16e28.png. |
| CAST-SC-03-ROSTO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Retrato frontal com cabelo crespo curto e textura de pele visível. Origem: exec-908b59fc-57da-4b98-9afa-36bc623709e4.png. |
| CAST-SC-04-ROSTO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Retrato frontal com sardas, olhos claros e cabelo cobre. Origem: exec-ddeb3d0e-4e61-4e5c-bba6-a189d4ddaa51.png. |
| CAST-SC-05-ROSTO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Retrato frontal com cachos e contorno facial cheio, sem afinar a identidade. Origem: exec-88579d22-0909-472a-8f67-4703b3151d9e.png. |
| CAST-SC-06-ROSTO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Retrato frontal com cabelo grisalho curto e linhas de expressão preservadas. Origem: exec-4bf14a7d-3a0d-44c6-9d9e-0d2448636fe9.png. |
| CAST-SC-07-ROSTO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Retrato frontal com cabelo preto longo e expressão neutra. Origem: exec-bb6f50cd-98d2-4d27-8723-8849e3d264ae.png. |
| CAST-SC-08-ROSTO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Retrato frontal masculino com barba curta e cabelo em fade. Origem: exec-f9cb3c57-ca40-42f8-ab9b-9bf874de8d78.png. |
| CAST-SC-09-ROSTO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Retrato frontal masculino com cabelo castanho e olhos claros; leve textura de barba natural. Origem: exec-42b7987c-43a6-4edf-a1ff-940c0b52c54a.png. |
| CAST-SC-10-ROSTO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Retrato frontal com tranças longas e pele sem plastificação. Origem: exec-a6b87e31-de60-4b9f-898c-43ed1ca10999.png. |
| SHOW-PECA-FRENTE | 2026-10-31 | image_gen integrado | 1 | Peça frontal inteira, alças finas, decote degagê e brilho de cetim legíveis; costas ainda dependem de outra vista. Origem: exec-c7ff1f0c-cd2e-485a-a6b7-7ab1b90fd7da.png. |
| CAST-SC-01-CORPO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Frente de corpo inteiro com cabeça e dois pés dentro do quadro, roupa neutra e sombra de apoio. Comparada visualmente à âncora do mesmo elenco; medidas da ficha não foram aferidas. Origem: exec-a9462876-eb4d-4ab9-b356-ea01f0e2e365.png. |
| CAST-SC-02-CORPO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Frente de corpo inteiro com cabeça e dois pés dentro do quadro, roupa neutra e sombra de apoio. Comparada visualmente à âncora do mesmo elenco; medidas da ficha não foram aferidas. Origem: exec-cdad73d6-b8fa-4f07-af10-38b22f12f364.png. |
| CAST-SC-03-CORPO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Frente de corpo inteiro com cabeça e dois pés dentro do quadro, roupa neutra e sombra de apoio. Comparada visualmente à âncora do mesmo elenco; medidas da ficha não foram aferidas. Origem: exec-e67df600-dd84-47af-a6d8-978045aa403d.png. |
| CAST-SC-04-CORPO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Frente de corpo inteiro com cabeça e dois pés dentro do quadro, roupa neutra e sombra de apoio. Comparada visualmente à âncora do mesmo elenco; medidas da ficha não foram aferidas. Origem: exec-d2e35ffa-e29f-46cc-a97b-024fcd930a71.png. |
| CAST-SC-05-CORPO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Frente de corpo inteiro com cabeça e dois pés dentro do quadro, roupa neutra e sombra de apoio. Comparada visualmente à âncora do mesmo elenco; medidas da ficha não foram aferidas. Origem: exec-410e26df-9929-45b0-a187-2ba17554439b.png. |
| CAST-SC-06-CORPO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Frente de corpo inteiro com cabeça e dois pés dentro do quadro, roupa neutra e sombra de apoio. Comparada visualmente à âncora do mesmo elenco; medidas da ficha não foram aferidas. Origem: exec-b8ef2150-5551-4d26-9c92-6b0b852fd98f.png. |
| CAST-SC-07-CORPO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Frente de corpo inteiro com cabeça e dois pés dentro do quadro, roupa neutra e sombra de apoio. Comparada visualmente à âncora do mesmo elenco; medidas da ficha não foram aferidas. Origem: exec-3753ee65-fa9c-4ab3-af23-4fba86ee8201.png. |
| CAST-SC-08-CORPO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Frente de corpo inteiro com cabeça e dois pés dentro do quadro, roupa neutra e sombra de apoio. Comparada visualmente à âncora do mesmo elenco; medidas da ficha não foram aferidas. Origem: exec-295c7872-01fd-444c-8653-d054b0ae04cb.png. |
| CAST-SC-09-CORPO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Frente de corpo inteiro com cabeça e dois pés dentro do quadro, roupa neutra e sombra de apoio. Comparada visualmente à âncora do mesmo elenco; medidas da ficha não foram aferidas. Origem: exec-d65f4762-9500-450d-a605-fd653e68df94.png. |
| CAST-SC-10-CORPO-FRENTE | 2026-10-31 | image_gen integrado | 1 | Frente de corpo inteiro com cabeça e dois pés dentro do quadro, roupa neutra e sombra de apoio. Comparada visualmente à âncora do mesmo elenco; medidas da ficha não foram aferidas. Origem: exec-cd7dbb04-5bfc-4db8-8bae-81fbf9a427fa.png. |
| SHOW-PECA-COSTAS | 2026-10-31 | image_gen integrado | 1 | Costas da peça com decote baixo e alças cruzadas visíveis; cor e brilho coerentes com a frente. Estudo de peça fictícia, sem SKU real. Origem: exec-194b4ff8-885a-4b03-a809-395641b0b2cb.png. |
| SHOW-PECA-DETALHE | 2026-10-31 | image_gen integrado | 1 | Detalhe do decote degagê, reguladores e costura nas alças; brilho de cetim e recorte legíveis, sem texto. Origem: exec-7dfadd50-48ee-4564-8c4c-47290ed569f9.png. |
| CAST-SC-01-CORPO-COSTAS | 2026-10-31 | image_gen integrado | 1 | Costas de corpo inteiro, cabelo ondulado até o meio das costas, roupa neutra e apoio dos dois pés legíveis. Origem: exec-c7e6ecf9-8ebd-482d-bd87-659e0850bc0f.png. |
| DIR-SEDA-JANELA-HERO | 2026-10-31 | image_gen integrado | 1 | Seda champagne sob janela lateral e cortina clara; rosto, caimento e sombra coerentes com a direção. Enquadramento mais aberto que um retrato fechado. Origem: exec-cabb90b5-0031-4a05-a56e-1ba0246b43e3.png. |
| DIR-CICLORAMA-MARFIM-HERO | 2026-10-31 | image_gen integrado | 2 | Alfaiataria clara com textura de linho e identidade plus size preservada visualmente; nova geração aproximou o enquadramento. Origem: exec-ab8b7ba6-dc99-428d-af91-3a0860ae75ee.png. |
| DIR-ATELIER-PROVADOR-HERO | 2026-10-31 | image_gen integrado | 1 | Camisa clara, calça caramelo e cabelos grisalhos reconhecíveis; espelho e arara constroem o provador sem texto. Origem: exec-20244dab-296b-4d21-a580-2f40dbabb0c4.png. |
| DIR-RUA-GOLDEN-HOUR-HERO | 2026-10-31 | image_gen integrado | 2 | Jaqueta denim sob contraluz dourado; nova geração aproxima rosto e construção da roupa e remove os pés da composição. Origem: exec-7d35ca3a-c0e5-4e86-b96c-32aa63e73611.png. |
| DIR-NOITE-FLASH-HERO | 2026-10-31 | image_gen integrado | 2 | Vestido assimétrico preto, flash frontal e reflexos vermelhos; nova geração enquadra mais perto. A lateral da alça varia entre tentativas não selecionadas. Origem: exec-60cf3849-7a9c-492e-9c73-b7162635b72c.png. |
| DIR-COLOR-BLOCK-HERO | 2026-10-31 | image_gen integrado | 2 | Azul cobalto e terracota separados por sombra firme; enquadramento mais próximo, modelo sentada com roupa legível. Origem: exec-18f05381-fec9-4ac0-b93c-9b3769e9bbde.png. |
| DIR-CONCRETO-MINIMAL-HERO | 2026-10-31 | image_gen integrado | 1 | Alfaiataria preta e gola clara em arquitetura de concreto; sombra geométrica com detalhes de tecido preservados. Origem: exec-5de78478-8c0d-4250-9034-cfd310e0eebf.png. |
| DIR-NATUREZA-LINHO-HERO | 2026-10-31 | image_gen integrado | 2 | Linho claro, cintura marcada e vegetação costeira; nova geração removeu o corte parcial dos pés ao aproximar para os joelhos. Origem: exec-acaf1bfd-7c54-4e17-a63e-2f8ee4e8abe6.png. |
| SHOW-S01-A | 2026-10-31 | image_gen integrado | 3 | Macro da costura lateral e pontas dos dedos após delimitar o detalhe. Duas tentativas anteriores foram rejeitadas automaticamente; sem resultado aproveitado. Origem: exec-1a5ee127-3fa7-4e90-8e26-29b7d10bd077.png. |
| SHOW-S02-A | 2026-10-31 | image_gen integrado | 2 | Retrato frontal com olhos em foco e pinta do lado anatômico esquerdo. Primeira tentativa sem arquivo retornado; segunda concluída. Origem: exec-4e094ac5-c58f-4639-9973-c5445a6f2b62.png. |
| SHOW-S03-A | 2026-10-31 | image_gen integrado | 2 | Corpo inteiro em três quartos, vestido e dois pés descalços visíveis. Nova tentativa removeu sandálias inventadas. Origem: exec-15d941b2-c290-428d-9441-df3824b1b70a.png. |
| SHOW-S04-A | 2026-10-31 | image_gen integrado | 2 | Posição frontal antes do giro, decote e braços visíveis. Nova tentativa corrigiu a imagem inicial que já mostrava as costas. Origem: exec-e44dcc24-7acd-45ab-9db3-8f550440015c.png. |
| SHOW-S05-A | 2026-10-31 | image_gen integrado | 1 | Passo frontal com vestido e pés descalços; luz lateral e barra legíveis. É uma pose estática, não teste de caminhada. Origem: exec-36e3d644-45ee-41a7-a247-f7cc3040037c.png. |
| SHOW-S06-A | 2026-10-31 | image_gen integrado | 1 | Plano frontal de encerramento com rosto e vestido legíveis; espaço do atelier claro. Não é clipe final nem CTA renderizado. Origem: exec-83375cba-1150-4ba1-95e5-8fe9acaeb8f4.png. |
| HOME-CAPA | 2026-10-31 | image_gen integrado | 1 | Capa horizontal com câmera, trilho e monitor em primeiro plano, modelo ao fundo e espaço livre à esquerda. Equipamento ilustrativo, sem marca legível. Origem: exec-2eeb9121-5aa7-4a1f-b494-48b048010cc9.png. |
| SHOW-S02-B | 2026-10-31 | image_gen integrado | 1 | Plano final mais aberto que o retrato inicial, com rosto e vestido legíveis; comparação estática, sem dolly testado. Origem: exec-0c09fe98-cf89-48ea-b044-94bd64b11e8c.png. |
| SHOW-S03-B | 2026-10-31 | image_gen integrado | 1 | Corpo inteiro frontal com pés descalços e vestido visíveis; preserva o styling aprovado do frame A. Origem: exec-8f9d06df-e30a-4a5e-bed0-9614306ce606.png. |
| SHOW-S04-B | 2026-10-31 | image_gen integrado | 2 | Costas diretas após o giro, alças cruzadas expostas e cabelo deslocado. O gerador aceita cinco referências: a vista frontal neutra redundante foi omitida; rosto, corpo de costas, frente e costas da peça e frame A foram mantidos. Origem: exec-e1dc3909-438a-49dc-a49e-6a4590766330.png. |
| SHOW-S05-B | 2026-10-31 | image_gen integrado | 1 | Segundo passo sugerido com peso no pé dianteiro e pés descalços; o ciclo de caminhada ainda precisa de teste em vídeo. Origem: exec-208cd9b2-5f19-4d13-b568-3238f97f2c88.png. |
| CAST-SC-01-ROSTO-34 | 2026-10-31 | image_gen integrado | 1 | Retrato em três quartos, olhar acompanhando a rotação e textura de pele visível; comparado à âncora frontal, sem medição biométrica. Origem: exec-78a8e1cf-4867-4f09-ae32-a084f7d8c4fe.png. |
| CAST-SC-01-PERFIL | 2026-10-31 | image_gen integrado | 1 | Perfil com nariz voltado à esquerda da imagem, contorno do nariz, queixo e cabelo legíveis; fundo neutro coerente. Origem: exec-8a9c8f23-aa11-425e-9e01-98477f6fbad3.png. |
| CAST-SC-01-CORPO-LATERAL | 2026-10-31 | image_gen integrado | 1 | Corpo inteiro de perfil para a direita da imagem, dois pés enquadrados, postura neutra e apoio no piso; medidas não aferidas. Origem: exec-67478ede-de88-40d2-9361-c472396110a5.png. |
| CAST-SC-02-ROSTO-34 | 2026-10-31 | image_gen integrado | 1 | Retrato em três quartos, olhar acompanhando a rotação e textura de pele visível; comparado à âncora frontal, sem medição biométrica. Origem: exec-96a7b97f-3886-44d0-90c6-7c49e68e3c87.png. |
| CAST-SC-02-PERFIL | 2026-10-31 | image_gen integrado | 1 | Perfil com nariz voltado à esquerda da imagem, contorno do nariz, queixo e cabelo legíveis; fundo neutro coerente. Origem: exec-8a0ca365-2023-48bd-b4f5-124da1d7b892.png. |
| CAST-SC-02-CORPO-COSTAS | 2026-10-31 | image_gen integrado | 1 | Costas com cabeça e dois pés no quadro, cabelo e roupa neutra coerentes. O rosto não é verificável nesta vista. Origem: exec-1038d773-59e8-491c-8508-11487a9eef2f.png. |
| CAST-SC-02-CORPO-LATERAL | 2026-10-31 | image_gen integrado | 1 | Corpo inteiro de perfil para a direita da imagem, dois pés enquadrados, postura neutra e apoio no piso; medidas não aferidas. Origem: exec-0ebf9551-7baf-4b62-9bdb-e37ceeba9b5e.png. |
| CAST-SC-03-ROSTO-34 | 2026-10-31 | image_gen integrado | 1 | Retrato em três quartos, olhar acompanhando a rotação e textura de pele visível; comparado à âncora frontal, sem medição biométrica. Origem: exec-03cdca6c-8486-4f17-b1f4-4c1bdf27876a.png. |
| CAST-SC-03-PERFIL | 2026-10-31 | image_gen integrado | 1 | Perfil com nariz voltado à esquerda da imagem, contorno do nariz, queixo e cabelo legíveis; fundo neutro coerente. Origem: exec-f1c91fbf-6c52-40ad-8c73-70f75820082b.png. |
| CAST-SC-03-CORPO-COSTAS | 2026-10-31 | image_gen integrado | 1 | Costas com cabeça e dois pés no quadro, cabelo e roupa neutra coerentes. O rosto não é verificável nesta vista. Origem: exec-66a4ed93-3cc7-4f60-ba34-0f4214bb938e.png. |
| CAST-SC-03-CORPO-LATERAL | 2026-10-31 | image_gen integrado | 1 | Corpo inteiro de perfil para a direita da imagem, dois pés enquadrados, postura neutra e apoio no piso; medidas não aferidas. Origem: exec-12f5defa-534b-4544-975b-fbb1d6f2f103.png. |
| CAST-SC-04-ROSTO-34 | 2026-10-31 | image_gen integrado | 1 | Retrato em três quartos, olhar acompanhando a rotação e textura de pele visível; comparado à âncora frontal, sem medição biométrica. Origem: exec-b1efa2b1-e329-4403-9817-88788d18017d.png. |
| CAST-SC-04-PERFIL | 2026-10-31 | image_gen integrado | 2 | Perfil com nariz voltado à esquerda da imagem, contorno do nariz, queixo e cabelo legíveis; fundo neutro coerente. Nova geração corrigiu o enquadramento de corpo inteiro indevido. Origem: exec-7b01f05f-d1cf-4bca-b39a-66b54dc8d9ac.png. |
| CAST-SC-04-CORPO-COSTAS | 2026-10-31 | image_gen integrado | 1 | Costas com cabeça e dois pés no quadro, cabelo e roupa neutra coerentes. O rosto não é verificável nesta vista. Origem: exec-c2d009cc-2084-481f-84cc-2bc528f2b35c.png. |
| CAST-SC-04-CORPO-LATERAL | 2026-10-31 | image_gen integrado | 1 | Corpo inteiro de perfil para a direita da imagem, dois pés enquadrados, postura neutra e apoio no piso; medidas não aferidas. Origem: exec-9e976e2d-a684-4957-8b9a-bfc16087b5ff.png. |
| CAST-SC-05-ROSTO-34 | 2026-10-31 | image_gen integrado | 1 | Retrato em três quartos, olhar acompanhando a rotação e textura de pele visível; comparado à âncora frontal, sem medição biométrica. Origem: exec-bed2c301-236d-406d-bee4-1a6773604558.png. |
| CAST-SC-05-PERFIL | 2026-10-31 | image_gen integrado | 1 | Perfil com nariz voltado à esquerda da imagem, contorno do nariz, queixo e cabelo legíveis; fundo neutro coerente. Origem: exec-50231b87-8852-4f9b-a959-fcf55c10f2aa.png. |
| CAST-SC-05-CORPO-COSTAS | 2026-10-31 | image_gen integrado | 1 | Costas com cabeça e dois pés no quadro, cabelo e roupa neutra coerentes. O rosto não é verificável nesta vista. Origem: exec-64270382-f82f-4040-8d42-e173a672a938.png. |
| CAST-SC-05-CORPO-LATERAL | 2026-10-31 | image_gen integrado | 1 | Corpo inteiro de perfil para a direita da imagem, dois pés enquadrados, postura neutra e apoio no piso; medidas não aferidas. Origem: exec-54948fdc-01ca-421a-8ceb-22338a5a7686.png. |
| CAST-SC-06-ROSTO-34 | 2026-10-31 | image_gen integrado | 1 | Retrato em três quartos, olhar acompanhando a rotação e textura de pele visível; comparado à âncora frontal, sem medição biométrica. Origem: exec-94b748ff-0c84-4e9d-a027-3019aafb26e8.png. |
| CAST-SC-06-PERFIL | 2026-10-31 | image_gen integrado | 1 | Perfil com nariz voltado à esquerda da imagem, contorno do nariz, queixo e cabelo legíveis; fundo neutro coerente. Origem: exec-2ba330a9-1007-48d3-a979-7095db690cf2.png. |
| CAST-SC-06-CORPO-COSTAS | 2026-10-31 | image_gen integrado | 1 | Costas com cabeça e dois pés no quadro, cabelo e roupa neutra coerentes. O rosto não é verificável nesta vista. Origem: exec-6c580696-b0fd-4ebd-ae5a-718980c535cb.png. |
| CAST-SC-06-CORPO-LATERAL | 2026-10-31 | image_gen integrado | 1 | Corpo inteiro de perfil para a direita da imagem, dois pés enquadrados, postura neutra e apoio no piso; medidas não aferidas. Origem: exec-efde5bc9-861f-47da-93ef-c8d717cd3c4e.png. |
| CAST-SC-07-ROSTO-34 | 2026-10-31 | image_gen integrado | 1 | Retrato em três quartos, olhar acompanhando a rotação e textura de pele visível; comparado à âncora frontal, sem medição biométrica. Origem: exec-7f4e0ffd-eb8c-4e90-8d69-6f171cb7f2aa.png. |
| CAST-SC-07-PERFIL | 2026-10-31 | image_gen integrado | 1 | Perfil com nariz voltado à esquerda da imagem, contorno do nariz, queixo e cabelo legíveis; fundo neutro coerente. Origem: exec-7fccb0ae-46ad-4412-817a-46ff3a751cd6.png. |
| CAST-SC-07-CORPO-COSTAS | 2026-10-31 | image_gen integrado | 1 | Costas com cabeça e dois pés no quadro, cabelo e roupa neutra coerentes. O rosto não é verificável nesta vista. Origem: exec-9737e6a6-b6c8-4616-b4c5-6f93f7704449.png. |
| CAST-SC-07-CORPO-LATERAL | 2026-10-31 | image_gen integrado | 1 | Corpo inteiro de perfil para a direita da imagem, dois pés enquadrados, postura neutra e apoio no piso; medidas não aferidas. Origem: exec-15b51f82-58d2-43fe-a4a4-696c8ef449f7.png. |
| CAST-SC-08-ROSTO-34 | 2026-10-31 | image_gen integrado | 1 | Retrato em três quartos, olhar acompanhando a rotação e textura de pele visível; comparado à âncora frontal, sem medição biométrica. Origem: exec-2b1feb68-2d75-492f-8b03-dc1c9af92488.png. |
| CAST-SC-08-PERFIL | 2026-10-31 | image_gen integrado | 2 | Perfil com nariz voltado à esquerda da imagem, contorno do nariz, queixo e cabelo legíveis; fundo neutro coerente. Nova geração corrigiu o enquadramento de corpo inteiro indevido. Origem: exec-7a71dffe-dc5a-4677-8147-678a2d740045.png. |
| CAST-SC-08-CORPO-COSTAS | 2026-10-31 | image_gen integrado | 1 | Costas com cabeça e dois pés no quadro, cabelo e roupa neutra coerentes. O rosto não é verificável nesta vista. Origem: exec-6f64ea50-8b7c-48ef-9d84-4a5f60579f98.png. |
| CAST-SC-08-CORPO-LATERAL | 2026-10-31 | image_gen integrado | 1 | Corpo inteiro de perfil para a direita da imagem, dois pés enquadrados, postura neutra e apoio no piso; medidas não aferidas. Origem: exec-c2c7f0f3-df27-4d95-9b6d-364bdbd32527.png. |
| CAST-SC-09-ROSTO-34 | 2026-10-31 | image_gen integrado | 1 | Retrato em três quartos, olhar acompanhando a rotação e textura de pele visível; comparado à âncora frontal, sem medição biométrica. Origem: exec-60984d78-625a-4f61-8ece-61fa431d2f15.png. |
| CAST-SC-09-PERFIL | 2026-10-31 | image_gen integrado | 2 | Perfil com nariz voltado à esquerda da imagem, contorno do nariz, queixo e cabelo legíveis; fundo neutro coerente. Nova geração corrigiu o enquadramento de corpo inteiro indevido. Origem: exec-1b2df40d-b619-4f5b-8bcb-545e0676f722.png. |
| CAST-SC-09-CORPO-COSTAS | 2026-10-31 | image_gen integrado | 1 | Costas com cabeça e dois pés no quadro, cabelo e roupa neutra coerentes. O rosto não é verificável nesta vista. Origem: exec-f3536902-d6e7-4bbd-84f5-8590f91a8a2a.png. |
| CAST-SC-09-CORPO-LATERAL | 2026-10-31 | image_gen integrado | 1 | Corpo inteiro de perfil para a direita da imagem, dois pés enquadrados, postura neutra e apoio no piso; medidas não aferidas. Origem: exec-cb5c62b9-7ea6-47f1-94bb-1573ad0e49ba.png. |
| CAST-SC-10-ROSTO-34 | 2026-10-31 | image_gen integrado | 1 | Retrato em três quartos, olhar acompanhando a rotação e textura de pele visível; comparado à âncora frontal, sem medição biométrica. Origem: exec-bf734039-8132-481e-af10-f5c48b0adb21.png. |
| CAST-SC-10-PERFIL | 2026-10-31 | image_gen integrado | 1 | Perfil com nariz voltado à esquerda da imagem, contorno do nariz, queixo e cabelo legíveis; fundo neutro coerente. Origem: exec-11d74712-4ebc-4c1e-915f-1a0edd59d6db.png. |
| CAST-SC-10-CORPO-COSTAS | 2026-10-31 | image_gen integrado | 1 | Costas com cabeça e dois pés no quadro, cabelo e roupa neutra coerentes. O rosto não é verificável nesta vista. Origem: exec-aeb68a90-48a0-4f80-aa41-309f454a875a.png. |
| CAST-SC-10-CORPO-LATERAL | 2026-10-31 | image_gen integrado | 1 | Corpo inteiro de perfil para a direita da imagem, dois pés enquadrados, postura neutra e apoio no piso; medidas não aferidas. Origem: exec-af8dcf0d-62e3-4536-bcfa-a4be42ffd3ca.png. |
| DIR-SEDA-JANELA-PLATE | 2026-10-31 | image_gen integrado | 1 | Janela, voile, piso claro e banco coberto sem pessoas; amplia o ambiente inferindo áreas fora da imagem-chave. Origem: exec-3f5f7a2f-4ae9-45e3-bfb5-34be2a1d86a5.png. |
| DIR-CICLORAMA-MARFIM-PLATE | 2026-10-31 | image_gen integrado | 1 | Ciclorama marfim vazio, horizonte contínuo e gradiente suave; ausência de objetos é intencional. Origem: exec-72c23aff-6db7-4711-adf8-79f78afa68ce.png. |
| DIR-ATELIER-PROVADOR-PLATE | 2026-10-31 | image_gen integrado | 1 | Provador vazio com espelho, latão, madeira, arara e cortina; fundo ampliado inferido, não reconstrução pixel a pixel. Origem: exec-86c2b7dd-9293-461e-863f-b2174a68e5cc.png. |
| DIR-RUA-GOLDEN-HOUR-PLATE | 2026-10-31 | image_gen integrado | 1 | Calçada e fachada sob sol baixo, sem pedestres; mesma linguagem de luz dourada da imagem-chave. Origem: exec-036bad4a-528c-4924-805f-9e5ad823aa0f.png. |
| DIR-NOITE-FLASH-PLATE | 2026-10-31 | image_gen integrado | 1 | Entrada noturna vazia com piso molhado, cordão e luz vermelha; carros distantes sem marca legível. Origem: exec-b32a269e-fcd9-4dee-868f-1c2ff8083933.png. |
| DIR-COLOR-BLOCK-PLATE | 2026-10-31 | image_gen integrado | 1 | Fundo terracota com cubo azul e sombra rígida; cenário vazio com leitura de escala. Origem: exec-3a048e81-39d3-4a9d-ae28-a0a220546953.png. |
| DIR-CONCRETO-MINIMAL-PLATE | 2026-10-31 | image_gen integrado | 1 | Concreto, colunas e luz recortada sem pessoas; verticais e sombra coerentes com a direção. Origem: exec-6b2f0bc3-5371-4257-b104-52af8a0990f8.png. |
| DIR-NATUREZA-LINHO-PLATE | 2026-10-31 | image_gen integrado | 1 | Duna, vegetação e mar sem pessoas; cenário horizontal com horizonte nivelado e espaço para compor. Origem: exec-95a286d0-a378-457f-ba84-68aa7ddf7ec0.png. |
| CAST-SC-01-EDITORIAL | 2026-10-31 | image_gen integrado | 1 | Retrato editorial com camisa marfim, luz lateral de janela e sinal facial coerente com a âncora selecionada. Origem: exec-b733d576-c98f-440d-8398-c239d18f9610.png. |
| CAST-SC-02-EDITORIAL | 2026-10-31 | image_gen integrado | 1 | Retrato editorial com cabelo escuro liso, camisa marfim e luz suave; rosto visualmente coerente com as referências. Origem: exec-99db44da-2fc7-4875-81f9-24a4ed077b80.png. |
| CAST-SC-03-EDITORIAL | 2026-10-31 | image_gen integrado | 1 | Retrato editorial com textura de cabelo e pele preservadas visualmente, camisa marfim e iluminação lateral suave. Origem: exec-e4b188d5-9042-4ade-8d91-0446e5f19680.png. |
| CAST-SC-04-EDITORIAL | 2026-10-31 | image_gen integrado | 1 | Retrato editorial com cabelo e traços coerentes com as âncoras, camisa marfim e enquadramento próximo. Origem: exec-30e53c54-98bb-4475-a6d8-05cb1fa064ea.png. |
| CAST-SC-05-EDITORIAL | 2026-10-31 | image_gen integrado | 1 | Retrato editorial com volume corporal coerente com a referência, camisa marfim e mãos visíveis plausíveis. Origem: exec-6b9c109a-4dd8-44ca-ae65-ceb2339bb600.png. |
| CAST-SC-06-EDITORIAL | 2026-10-31 | image_gen integrado | 1 | Retrato editorial com cabelo curto grisalho, textura de pele madura e camisa marfim; enquadramento até o quadril. Origem: exec-4c9927f3-6d24-4c1a-ad19-9682b73839c7.png. |
| CAST-SC-07-EDITORIAL | 2026-10-31 | image_gen integrado | 1 | Retrato editorial com cabelo longo escuro, camisa marfim e luz lateral suave; rosto coerente com as âncoras. Origem: exec-9a87a1d1-8898-46cd-b822-20d671716ee9.png. |
| CAST-SC-08-EDITORIAL | 2026-10-31 | image_gen integrado | 1 | Retrato editorial com cabelo curto cacheado, barba e camisa marfim; mãos nos bolsos e luz lateral suave. Origem: exec-4108b2fe-8a6c-44b7-8a89-4418015a38cd.png. |
| CAST-SC-09-EDITORIAL | 2026-10-31 | image_gen integrado | 1 | Retrato editorial com cabelo castanho ondulado, olhos claros e camisa marfim; luz de janela e enquadramento até o quadril. Origem: exec-eea089aa-86d8-496c-bd70-31a55fdcb476.png. |
| CAST-SC-10-EDITORIAL | 2026-10-31 | image_gen integrado | 1 | Retrato editorial com tranças, camisa marfim e luz suave; rosto e cabelo coerentes com as referências. Origem: exec-80df68cc-52cf-4b89-aeb3-5abe9a8ab782.png. |

### Conclusão da execução — 2026-10-31

A fila Studio foi concluída com 100 imagens selecionadas e 100 miniaturas: 70 vistas do elenco fictício, 16 imagens de direção de arte (oito cenas com pessoa e oito cenários vazios), 13 imagens da campanha demonstrativa (três vistas da peça fictícia e dez keyframes) e uma capa. Geração pelo image_gen integrado ao Codex; o nome interno do modelo não é informado pela ferramenta. Nenhuma API externa ou chave foi utilizada.

A revisão foi visual pelo agente, em imagens estáticas, verificando enquadramento, anatomia aparente, roupa, cenário e continuidade com as referências. Não equivale a aprovação humana final, medição biométrica ou garantia de identidade. Os keyframes são propostas para animação; nenhum vídeo foi gerado ou testado nesta execução. As áreas de cenário antes ocultas pela pessoa foram inferidas nos plates, sem garantia de equivalência pixel a pixel.

Os originais foram preservados. WebP e miniaturas foram criados pelo importador oficial, sem recortar ou ampliar o arquivo principal. Oito keyframes vieram em proporção próxima de 9:16 (sete em 941×1672 e um em 940×1672), embora a fila pedisse arquivo 1024×1536 com composição 9:16. As dimensões nativas reais estão no registro. Para montagem, considerar esse enquadramento real; gerar outra tomada se for necessário espaço adicional de recorte. Os outros 92 arquivos mantêm 1024×1536 ou 1536×1024, conforme a orientação.

### Ajustes de prompt usados nesta execução

Validação final: `npm run check` passou com 38 testes. A auditoria dos 100 arquivos selecionados confirmou saídas únicas, dimensões nativas iguais às dos originais, miniaturas existentes e metadados consistentes. No navegador local, a fila mostrou 100/100, os dez cartões do elenco mostraram 7/7, as sete vistas da ficha SC-01 carregaram e a direção Seda & janela exibiu imagem principal e cenário vazio. Não houve transbordamento horizontal nas vistas conferidas, incluindo a ficha em tela ampla.

O prompt original de cada pedido permanece na fila gerada. Nos pedidos abaixo, foi acrescentada a instrução literal indicada, após o prompt original. As variantes descartadas ficaram fora dos arquivos publicados.

#### CAST-SC-01-ROSTO-FRENTE

```text
CORRECTION: The mole is on the wrong side. Remove the mole on the viewer-left side of the upper lip. Place one small natural mole just above the woman's anatomical LEFT upper lip, which is on the viewer-RIGHT side of this front-facing photograph. Keep everything else identical to the previous attempt and the attached reference.
```

#### DIR-CICLORAMA-MARFIM-HERO

```text
CORRECTION: The previous framing was too wide and included the feet. Make a NEW camera framing: a medium-long editorial portrait from just above the head down to the knees, with the lower image edge just below the knees. Feet and lower shins must be OUTSIDE the frame. Move the camera physically closer; do not copy the full-body framing of the casting reference. Keep the same fictional person, stated outfit, set, palette and light. The wardrobe must remain fully readable within this knee-up composition.
```

#### DIR-RUA-GOLDEN-HOUR-HERO

```text
CORRECTION: The previous framing was too wide and included the feet. Make a NEW camera framing: a medium-long editorial portrait from just above the head down to the knees, with the lower image edge just below the knees. Feet and lower shins must be OUTSIDE the frame. Move the camera physically closer; do not copy the full-body framing of the casting reference. Keep the same fictional person, stated outfit, set, palette and light. The wardrobe must remain fully readable within this knee-up composition.
```

#### DIR-NOITE-FLASH-HERO

```text
CORRECTION: The previous framing was too wide and included the feet. Make a NEW camera framing: a medium-long editorial portrait from just above the head down to the knees, with the lower image edge just below the knees. Feet and lower shins must be OUTSIDE the frame. Move the camera physically closer; do not copy the full-body framing of the casting reference. Keep the same fictional person, stated outfit, set, palette and light. The wardrobe must remain fully readable within this knee-up composition.
```

#### DIR-COLOR-BLOCK-HERO

```text
CORRECTION: The previous framing was too wide and included the feet. Make a NEW camera framing: a medium-long editorial portrait from just above the head down to the knees, with the lower image edge just below the knees. Feet and lower shins must be OUTSIDE the frame. Move the camera physically closer; do not copy the full-body framing of the casting reference. Keep the same fictional person, stated outfit, set, palette and light. The wardrobe must remain fully readable within this knee-up composition.
```

#### DIR-NATUREZA-LINHO-HERO

```text
CORRECTION: The previous image included nearly the full body and clipped the feet. Use the requested medium-long editorial framing from just above the head to just below the knees. No feet or lower shins in this composition. Keep the stated dress, location, light and the same fictional model from the attached references.
```

#### SHOW-S01-A

```text
CORRECTION: Define the visible garment detail as the OUTER SIDE SEAM of the opaque satin at waist level, with only the adult model's relaxed fingertips lightly touching that seam. Extreme close-up of fabric weave, stitching and fingertips only; chest, bust, neckline, face and legs are outside the image. This is a technical clothing-construction photograph. Keep the same champagne satin color and left window light. Source image vertical 2:3, 1024x1536, with no panels.
```

#### SHOW-S03-A

```text
CORRECTION: Remove the invented high-heeled sandals. Helena must be barefoot, matching the attached casting full-body reference and the other campaign shots. Keep the full-body three-quarter starting pose, identical champagne dress, location and light. Render the full source as vertical 2:3, 1024x1536, preserving the entire head and both bare feet with margins; the later 9:16 crop is an editing instruction, not the source aspect ratio.
```

#### SHOW-S04-A

```text
CORRECTION: This is keyframe A BEFORE the turn, not the back-view ending frame. The model must face straight toward the camera: FRONT of her face and FRONT cowl neckline visible, shoulders and chest frontal, arms relaxed. Do not show her back or crossed back straps in this starting frame. Frame from head to knees, camera at waist height. Keep the identical person, dress, set and left window light from the references. Source image vertical 2:3, 1024x1536; the later 9:16 crop is for editing.
```

#### SHOW-S04-B

```text
CORRECTION: The five attached references, in order, are the face identity anchor, neutral full-body BACK casting view, garment FRONT, garment BACK, and the approved FRONT starting keyframe A. The redundant front casting body photograph is omitted because the tool accepts at most five references. Use the last image for set, framing scale and light continuity, and the back garment reference for the crossed straps. This ending keyframe must show a straight-on BACK view after a 180-degree turn, not a front or over-the-shoulder pose. Hair can rest over one shoulder so the crossed back straps stay legible.
```

#### CAST-SC-04-PERFIL

```text
CORRECTION: The previous result was full-body, but this request is a CLOSE head-and-shoulders identity portrait. Bring the camera much closer: frame only the full head, neck and shoulder tops, no waist, jeans, hands or feet. Strict side profile with the nose pointing toward the LEFT edge of the image. Keep the same copper hair, freckles, facial structure and neutral studio light from the attached identity reference.
```

#### CAST-SC-08-PERFIL

```text
CORRECTION: This is a CLOSE head-and-shoulders identity portrait, not a full-body digital. Frame only the full head, neck and tops of the shoulders, with no waist, jeans, hands or feet. Strict side profile: nose points toward the LEFT edge of the image. Bring the camera much closer. Match the face, facial hair if present, hair texture and skin of the attached face identity anchor; the second reference controls identity only, never its full-body framing.
```

#### CAST-SC-09-PERFIL

```text
CORRECTION: This is a CLOSE head-and-shoulders identity portrait, not a full-body digital. Frame only the full head, neck and tops of the shoulders, with no waist, jeans, hands or feet. Strict side profile: nose points toward the LEFT edge of the image. Bring the camera much closer. Match the face, facial hair if present, hair texture and skin of the attached face identity anchor; the second reference controls identity only, never its full-body framing.
```

Para SHOW-S04-B, a ferramenta aceitou no máximo cinco referências por chamada. Foram usadas rosto-frente.webp, corpo-costas.webp (SC-01), peca-frente.webp, peca-costas.webp e s04-a.webp (campanha sarcenet-capsula-seda). A referência redundante de corpo-frente neutro foi omitida. A primeira tentativa não produziu imagem por exceder esse limite. SHOW-S01-A teve duas tentativas sem imagem antes da variante selecionada; SHOW-S02-A teve uma tentativa sem imagem e foi repetida com o mesmo prompt.
### Complemento · Estúdio Sarcenet — 2026-10-31

| Pedido | Data | Método | Tentativas | Revisão e origem |
| --- | --- | --- | --- | --- |
| DIR-ESTUDIO-SARCENET-HERO | 2026-10-31 | image_gen integrado | 3 | Selecionada: plano dos joelhos para cima, cetim champagne opaco, alças largas, decote drapeado, fundo areia-cinza e luz suave da esquerda. Traços e sinal facial visualmente coerentes com as duas referências fictícias SC-01. Origem: exec-09bcb075-1428-4eba-b6af-2ce9ae49c36d.png. |
| DIR-ESTUDIO-SARCENET-PLATE | 2026-10-31 | image_gen integrado | 1 | Cenário vazio em papel contínuo areia-cinza, piso claro, sem objetos ou pessoas; luz suave coerente com a imagem-chave anexada. Origem: exec-c67a2f35-8b97-4307-83ce-b085649abedc.png. |

Os prompts originais completos estão na fila de imagens, pedidos acima. A imagem-chave usou exatamente as duas referências indicadas; o plate usou a imagem-chave selecionada. A primeira versão da imagem-chave ficou de corpo inteiro e foi descartada. A segunda tentativa não produziu arquivo por rejeição automática de saída. A terceira acrescentou as duas correções literais abaixo ao prompt original e foi selecionada:

```text
CORRECTION: The camera is too far away: frame from just below the knees to a little above the head, not full body. Keep the small mole above the anatomical left side of the upper lip visible (viewer right), matching the face reference. Keep everything else identical to the previous attempt and the attached references.
CORRECTION: This is a fully clothed adult catalogue photograph. The satin gown is opaque, with a modest draped neckline covering the chest; keep the high slit below the upper thigh, no underwear or intimate detail visible. The pose is neutral and professional.
```

Arquivos principais nativos: hero 1024×1536 e plate 1536×1024, convertidos para WebP pelo importador oficial sem recorte ou ampliação; miniaturas derivadas separadamente. Revisão visual de imagens estáticas pelo agente, sem teste de animação ou garantia de identidade. O plate infere as áreas antes ocultas pela pessoa.

### Refação R1 · Estúdio Sarcenet, cenário vazio — 2026-10-31

| Pedido | Revisão | Método | Tentativas | Revisão e origem |
| --- | --- | --- | --- | --- |
| DIR-ESTUDIO-SARCENET-PLATE | R1 | image_gen integrado (Codex) | 2 | Reprovada a versão anterior por linha de horizonte nítida, que o padrão da loja proíbe (manual 14, §2 e §7). Selecionada a segunda tentativa: varredura ampla e gradual, sem fronteira identificável entre parede e chão, paleta areia-cinza e grão de papel preservados. Referência anexada: `hero.webp`; a versão reprovada foi só comparada. Origem: exec-2173ef47-ca40-4255-98ef-e3ebdea0fd25.png. Revisão visual pelo Claude antes da ingestão. |

Prompt final: o prompt completo do pedido, incluindo a correção R1 de `data/image-revisions.js`, mais esta linha da segunda tentativa:

```text
CORRECTION: The previous result still has a narrow horizontal transition band across the lower third. Remove that band completely. Use a very large-radius infinity sweep: a broad, gradual tonal change spread across most of the image height, with absolutely no identifiable wall-floor boundary, no straight horizontal band, no local dark stripe, no crease. The viewer must be unable to point to where wall ends and floor begins. Preserve the subtle paper texture and warm sand-grey palette.
```

Arquivo nativo 1536×1024 convertido para WebP pelo importador, sem recorte nem ampliação. A ingestão gravou `revision: R1` no registro e fechou o pedido.
