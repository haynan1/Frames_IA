# Histórico

## 2.3.0 — 2026-11-01 · Tomadas prontas e revisão de produção

- **Tomadas prontas** (`#tomadas`): 5 tomadas pré-configuradas (matéria, retrato, caimento, costas, passo; 14 s). Escolhe-se a modelo (loja ou elenco) e nada mais muda. Cada tomada traz:
  - exemplo gerado, ficha técnica, planta e enquadramento;
  - imagens a gerar e arquivos a anexar;
  - prompts A, B e movimento, revisão e "se der errado";
  - "Produzir no Studio", que abre a sequência na tomada certa, com desfazer.
- As tomadas são as tomadas 1–5 da campanha Cápsula Seda; na Fila, cada keyframe "Tomada N" leva à descrição completa.
- **Como produzir** (antes "Como usar") reescrito como o caminho real: preparar fotos e modelos, escolher as tomadas, trocar a peça, conferir câmera, gerar, animar, montar e revisar. O treino com a biblioteca virou opcional.
- **Entrega:** novo painel **Montagem**, com a ordem dos cortes, as transições, o fecho com CTA e a exportação (formato, resolução, MP4 H.264, 30 fps). A tabela ganhou a coluna Saída.
- **Etapa 2:** orientação de como fotografar a peça. O seletor "Modelo de cena" mostra a descrição de cada modelo.
- **Checklist de qualidade** refeito para vídeo de moda e regras da loja (11 itens), com o exemplo de correção trocado de produto para roupa.
- **Correções:**
  - a página inicial trocava o botão "Abrir a sequência" por qualquer rascunho; agora leva às Tomadas prontas;
  - contagens fixas desatualizadas ("8 mundos", "Oito sets") agora são calculadas;
  - textos que ainda chamavam o perfil Sarcenet de proposta ou diziam que tudo era fictício foram atualizados;
  - links diretos (`#tomadas/3`) passaram a rolar para a tomada mesmo com a rolagem suave.
- Navegação: "Como produzir" e "Tomadas prontas" no grupo Studio, antes do Studio de cenas. 46 testes.

## 2.2.1 — 2026-10-31 · Refação de imagens

- Imagens já geradas podem ser reabertas em `data/image-revisions.js` com motivo, linha `CORRECTION` e novo critério de aceite. A fila mostra o item como **refazer** (topo do `FILA-DE-IMAGENS.md`, selo na página Fila, contador 101/102), e a versão antiga continua no site até a nova chegar.
- A ingestão grava a revisão no registro e fecha o pedido sozinha.
- Primeira refação: o cenário vazio do Estúdio Sarcenet (R1), que tinha linha de horizonte, proibida pelo padrão da loja.
- O texto da página inicial deixou de chamar o perfil Sarcenet de proposta.
- 45 testes.

## 2.2.0 — 2026-10-31 · Ultra close e a loja real

- **Macro de textura (MAC, campo de 4 cm)** e plano detalhe pousados numa **região da peça** (tecido, decote, alças, corpete, cintura, fecho, punho, fenda, barra, costas).
- Movimentos de detalhe: deslize macro, deslize vertical, órbita em volta do detalhe, giro lento da modelo com o brilho varrendo o tecido, rack focus nas dobras e aproximação ao macro. Distâncias em centímetros.
- **Fidelidade do manual da loja:** cada anexo tem papel declarado no prompt (identidade, corpo, autoridade da peça, detalhe, continuidade). O rosto sai dos planos fechados. Sem foto de detalhe, aviso e proibição de inventar trama. Novos alertas para giro acima de 45° no detalhe, modelo andando no macro e salto de escala de 8× ou mais.
- **Realismo:** identidade só pelos traços, sem copiar retoque; pés esquerdo e direito; luz descrita pelo efeito, sem equipamento no quadro; tempo real, sem câmera lenta; nada de luxury, premium ou cinematic.
- **Perfil Sarcenet** refeito a partir do manual de imagens e do tema Vesper: moda feminina de noite, Reino Unido, paleta do site e regras de fidelidade. Nova direção **Estúdio Sarcenet** (fundo infinito areia, luz suave pela esquerda) e formato **3:4** da galeria.
- **Modelos da loja:** MODELO-A e 20 fichas como referência privada; `npm run modelos` gera recortes limpos (rosto, corpo, costas) em `references/sarcenet/modelos/` sem tocar na pasta da loja.
- Modelos de cena com uma peça real (Champagne Drape Satin Gown, fatos da ficha verificada): **Ultra close no cetim · 14s** e **Anúncio em 3 takes · 8s**, na estrutura dos anúncios da loja.
- Cetim de poliéster, chiffon e malha canelada entre os materiais. Fila com 102 imagens (+2 da nova direção).
- 44 testes.

## 2.1.0 — 2026-10-31 · Guia de produção

- **Painel Produzir** em cada tomada: passos numerados (imagem inicial, imagem final quando houver, clipe), com a ferramenta de cada passo, as referências a anexar e o prompt a copiar.
- **Referências baixáveis**: cada referência mostra miniatura e baixa com o nome exato citado no prompt. Fotos próprias da peça e da modelo aparecem como “sua foto”, com o nome esperado.
- **Progresso por tomada** (imagem A, imagem B, clipe) salvo no projeto e no `.json`; keyframes já ingeridos contam como prontos. Bolinhas na linha do tempo, contador no painel, coluna e total na Entrega.
- Faixa **Como funciona** no topo do Studio: quem faz o quê entre FRAME, ferramenta de imagem, ferramenta de vídeo e edição. Recolhível e lembrada.
- Entrega com as referências do filme em cartões baixáveis.
- O compilador passa a expor as referências de cada keyframe como dados (`refs.a`, `refs.b`, `projectReferences`); o prompt e a interface usam a mesma lista.
- 40 testes: referências idênticas ao prompt, progresso com ida e volta no JSON, progresso inválido rejeitado e escape no painel Produzir.

## 2.0.0 — 2026-10-31 · FRAME Studio

- **Studio de cenas** em cinco etapas (briefing, peça e elenco, cenário e luz, sequência, entrega) com estado e pendências por etapa, erros por campo e desfazer.
- Tomadas com enquadramento inicial e final (PD a PG), 16 operações de câmera, graus de arco/giro, lente, altura inicial e final, ângulo, ação do sujeito, foco, ritmo e transição.
- **Pré-visualização de câmera**: planta vista de cima, vista lateral e enquadramento sobre figura de 1,75 m, com progresso e reprodução no tempo da tomada. Distância câmera–sujeito calculada pela óptica.
- **Keyframe A, keyframe B e movimento** por tomada, com referências de costas quando a câmera ou a modelo giram. Alertas de direção (ex.: dolly in que abre o plano, arco ≥ 90°, caminhada em close).
- Saídas: pacote de produção, **pedido de keyframes para o Codex** e projeto `.json` (esquema v2, 128 KB, migração automática de planos v1).
- Seis modelos de cena, incluindo a campanha demonstrativa **Sarcenet · Cápsula Seda · 15s**.
- **Elenco** de 10 modelos fictícias com ficha de identidade e 7 vistas; **8 direções de arte** com planta de luz, lente, exposição e paleta; perfis de marca (Sarcenet proposta, moda, produto, beleza).
- **Fila de 100 imagens** para o Codex com prioridade, ondas de dependência, destino e aceite; protocolo em `docs/codex/`; ingestão `scripts/ingest-images.py` que publica WebP e miniatura e atualiza o site sozinho.
- Novo shell: **menu lateral agrupado e recolhível** (tecla `[`, persistente, dicas no trilho), gaveta acessível no celular, barra superior com status da fila.
- Atlas com **giro no eixo** e **arco com aproximação**; simulador com faces ordenadas por profundidade.
- Página inicial refeita como painel do estúdio. Tokens de cor e tipografia refinados.
- Referências privadas em `references/` (ignorado), com protocolo de consentimento para modelos reais.
- 38 testes, incluindo importação hostil, XSS em todos os campos do Studio, geometria finita dos diagramas e integridade da fila.

## 1.1.0 — 2026-10-30

- Plano de produção próprio: briefing, 1–12 tomadas, duração e câmera por tomada, timeline e prompts com nome de referência configurável.
- Rascunho local, pacote de texto e projeto JSON; importação limitada a 64 KB, validação estrita e desfazer a substituição.
- Remoção de tomada com desfazer e proteção da última versão válida diante de dados incompletos.
- Laboratório limpa o prompt e bloqueia exportação com campos inválidos; corrigida perda temporária de movimento e duração ao alternar imagem/vídeo.
- Retorno de foco ao fechar o menu com Escape e tamanho de campos adequado em tela estreita.
- Corrigida duração do prompt de orbit no storyboard: três segundos, correspondendo ao intervalo 06–09s.
- Quinze testes automatizados, incluindo round trip de projeto, timeline, duração e dados importados inválidos.
- Publicação mantida adiada.

## 1.0.0 — 2026-10-30

- Biblioteca pública preparada para GitHub Pages, com design escuro e imagens conceituais próprias.
- Manual em oito capítulos, atlas de 14 operações e simulador esquemático.
- Laboratório local, 12 prompts, storyboard de 15 segundos e checklist de qualidade.
- Catálogo inicial de dez ferramentas e famílias com origem e data de consulta.
- Testes de conteúdo e construtor, build por allowlist, workflow com ações fixadas e instruções de continuidade.
- Publicação remota adiada por escolha do usuário; sessão GitHub verificada, sem criar ou alterar repositório remoto.
