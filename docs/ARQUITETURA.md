# Arquitetura

## Decisão

Site estático com HTML semântico, CSS e módulos ES nativos. O FRAME Studio planeja, valida e compila direção de arte; a geração de imagem e vídeo acontece no provedor escolhido ou no Codex. Não há servidor, login, banco ou dependência de runtime. Um framework acrescentaria runtime, dependências e etapa de build sem necessidade proporcional.

O roteamento usa fragmentos (`#studio/4`, `#elenco/sc-01`, `#direcoes/seda-janela`), funcionando sem regras de reescrita no GitHub Pages. Assets e documentos usam caminhos relativos. `#producao` continua funcionando como alias de `#studio`.

## Mapa

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Shell: menu lateral, barra superior, CSP e metadados |
| `styles.css` | Tokens e páginas editoriais (manual, atlas, biblioteca, laboratório) |
| `studio.css` | Shell recolhível, Studio, elenco, direções, fila e início |
| `app.js` | Roteador, páginas editoriais, simulador do atlas, cópia e downloads |
| `ui/routes.js` | Registro de rotas, grupos do menu e aliases |
| `ui/shell.js` | Menu recolhível (desktop), gaveta (celular), atalho `[`, persistência e breadcrumb |
| `ui/icons.js` | Família única de ícones SVG em traço |
| `ui/studio.js` | Studio de cenas em 5 etapas, linha do tempo, inspetor, saídas e importação |
| `ui/diagram.js` | Planta de câmera, vista lateral, enquadramento, planta de luz e placeholders (SVG puro) |
| `ui/pages.js` | Elenco, direções de arte e fila de imagens |
| `ui/gallery.js`, `ui/quickstart.js` | Biblioteca visual e guia de uso |
| `ui/html.js` | Escape compartilhado de texto e atributos |
| `data/content.js` | Capítulos, 16 movimentos, prompts, ferramentas, fontes e storyboard |
| `data/studio.js` | Esquema v2, vocabulário de câmera, modelos de cena, validação, migração v1 e compilação de prompts |
| `data/brand.js` | Perfis de marca (Sarcenet proposta, moda, produto, beleza) |
| `data/cast.js` | Elenco fictício e vistas de referência |
| `data/directions.js` | Direções de arte com planta de luz |
| `data/image-requests.js` | Fila de imagens derivada de elenco, direções e campanha |
| `data/generated-assets.js` | Registro de imagens ingeridas (escrito pelo script) |
| `data/production.js` | Esquema v1, mantido para migração |
| `scripts/build.mjs` | Publicação por allowlist, guia, biblioteca e fila do Codex |
| `scripts/codex-queue.mjs` | Gera `docs/codex/FILA-DE-IMAGENS.md` e `fila.json` |
| `scripts/ingest-images.py` | Converte `incoming/` em WebP + miniatura e registra proveniência |
| `scripts/check-syntax.mjs` | Verificação sintática de todos os módulos |
| `tests/` | Conteúdo, biblioteca, produção, Studio, elenco, direções e fila |

## Fluxo de dados do Studio

```text
templates / importação / rascunho local
        │
        ▼
studioIssues ──► mensagens por campo e por etapa (UI)
        │ sem pendências
        ▼
validateStudio (cópia estrita: só campos conhecidos)
        │
        ├─► compileShot ──► keyframe A · keyframe B · movimento · distâncias · alertas
        │                         │
        │                         └─► diagram.js (planta, lateral, enquadramento)
        ├─► exportStudioText (pacote)    ├─► exportCodexRequest (Markdown)
        └─► localStorage (somente versão válida)
```

A fila de imagens chama o mesmo compilador para a campanha Sarcenet: os prompts dos keyframes da fila são os prompts do Studio.

## Segurança e privacidade

- Todo texto livre passa por `escapeHTML` antes de entrar em HTML; os testes injetam `<img onerror>` em todos os campos do Studio.
- Importação limitada a 128 KB, esquema estrito, enumerações fechadas, inteiros validados, nomes de arquivo sem pastas ou URLs. Chaves desconhecidas são descartadas; `__proto__` não polui o estado. Importar oferece desfazer.
- `setPath` só aceita caminhos de seção conhecidos, de dois níveis, e rejeita `__proto__`, `constructor` e `prototype`.
- SVGs são gerados apenas com números internos e rótulos de tabelas fixas.
- CSP sem `unsafe-inline`: cores de paleta usam atributo `fill` em SVG; larguras dinâmicas usam CSSOM.
- `localStorage` guarda só a última versão válida; um rascunho ilegível é preservado em `frame-studio-v2-backup` antes de abrir o modelo padrão.
- `incoming/`, `references/*` e `private-output/` são ignorados pelo Git e ficam fora da allowlist de publicação.
- Ingestão valida ID contra a fila, slug e nome por regex, destino dentro de `assets/` e tamanho mínimo.

## Performance e acessibilidade

Sem fontes remotas ou bibliotecas. Imagens WebP com miniaturas; placeholders são SVG leves. Menu com grupos rotulados, `aria-current`, dicas no modo trilho, atalho `[` que respeita campos de texto, gaveta com `inert` no conteúdo, Escape e foco preso. Etapas com estado anunciado, erros por campo com `aria-describedby`, abas com setas, linha do tempo navegável por setas e botões para reordenar (sem arrastar). Reprodução da câmera respeita `prefers-reduced-motion`.

## Limitações deliberadas

O Studio não gera mídia, não interpreta imagens e não mede identidade automaticamente. Distâncias são aproximações ópticas. Sincronização entre dispositivos, uploads privados e aprovação multiusuário exigiriam backend com autenticação, armazenamento e retenção — fora do escopo até haver necessidade concreta.
