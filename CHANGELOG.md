# Histórico

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
