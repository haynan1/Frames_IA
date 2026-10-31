# Arquitetura

## Decisão

Site estático com HTML semântico, CSS e módulos ES nativos. Conteúdo e ferramentas são públicos e locais; não há requisito de API, autenticação ou processamento remoto. Um framework acrescentaria runtime, dependências e uma etapa de build sem uma necessidade proporcional neste escopo.

O roteamento usa fragmentos (`#camera/orbit`, `#guia/identidade`), funcionando sem regras de reescrita em GitHub Pages. Assets e documentos usam caminhos relativos, suportando domínio próprio ou subpasta de projeto. Não existe instalação de dependências.

## Mapa

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura, navegação persistente, metadados e CSP |
| `styles.css` | Tokens, composição, responsividade, foco, impressão e movimento reduzido |
| `app.js` | Roteamento, renderização, simulação, busca, clipboard, downloads e QA |
| `data/content.js` | Capítulos, movimentos, prompts, ferramentas, fontes e storyboard |
| `data/prompt-builder.js` | Função pura de composição de prompts |
| `data/production.js` | Esquema versionado, validação, timeline e exportação de projetos |
| `ui/production.js` | Editor de briefing e tomadas, rascunho local e importação reversível |
| `ui/html.js` | Escape compartilhado de texto e atributos |
| `assets/` | WebP locais e favicon SVG |
| `scripts/build.mjs` | Publicação por allowlist e geração do guia Markdown |
| `scripts/serve.mjs` | Prévia local com headers e proteção de caminhos |
| `tests/` | Integridade editorial e comportamento do construtor |
| `.github/workflows/pages.yml` | Verificação, artefato e implantação |

## Segurança e privacidade

A biblioteca visual separa roteiro e prompts (`data/gallery.js`), registro técnico dos assets (`data/gallery-assets.js`) e observações humanas (`data/gallery-review.js`). `ui/gallery.js` controla pesquisa, favoritos, seleção de frame e diálogo nativo; `ui/quickstart.js` apresenta o percurso de operação. Não há geração remota na interface. O build também deriva `docs/BIBLIOTECA.md` desses dados.

Cada frame tem uma imagem WebP na resolução nativa e uma miniatura de até 640 × 800. A listagem carrega miniaturas; a página do estudo carrega o frame selecionado. A preparação local usa Pillow em `scripts/prepare-gallery.py`, sem acrescentar dependência de runtime ou de build público. Os PNGs originais e os manifestos com caminhos locais ficam fora da publicação.

- Dados de formulário entram em `value`, nunca em HTML executável.
- O texto variável exibido no HTML passa por escape de caracteres.
- SVG de simulação é produzido apenas com estados e números internos.
- Não existe execução de código vindo de prompts, documentos ou links.
- Não há chamadas de API de geração, segredo no navegador ou telemetria.
- QA usa somente `localStorage`, com tratamento de acesso indisponível e validação do tipo lido.
- Produção usa um esquema estrito com campos permitidos, limites de tamanho, 1–12 tomadas e durações inteiras de 2–10s. Chaves desconhecidas de arquivos importados não são propagadas. Um arquivo inválido mantém o plano atual; uma importação válida oferece desfazer. Nenhuma mídia é enviada.
- Uma edição inválida limpa os comandos e bloqueia cópia/exportação. A última versão válida permanece no armazenamento. Se a restauração local falhar, o valor anterior não é sobrescrito silenciosamente.
- O build copia somente arquivos explicitamente permitidos. PDFs, `.work`, Git e arquivos de ambiente ficam fora de `dist`.
- CSP via meta funciona no Pages; headers adicionais da prévia são específicos do servidor local. Não afirmar que GitHub Pages entrega headers personalizados definidos pelo projeto.
- Workflow com ações fixadas por SHA, credenciais de checkout não persistidas e permissão de implantação separada.

## Performance e acessibilidade

Sem dependências de runtime ou webfonts remotas. Imagens em WebP, carregamento tardio abaixo da dobra e proporções reservadas. Navegação por teclado, skip link, nomes acessíveis, estado ativo, feedback de cópia e respeitar `prefers-reduced-motion`. A simulação só anima quando o usuário solicita e é encerrada ao trocar de página.

## Limitações deliberadas

Busca cobre os prompts. O site não interpreta imagens, não valida identidade automaticamente e não produz vídeo. Não há ranking automatizado ou cadastro remoto. O simulador usa geometria aproximada para explicar operações; não replica uma lente específica ou a física de um gerador.

Próxima evolução exige necessidade concreta: manter busca por capítulos pode continuar local; sincronização de campanhas e uploads privados exigiriam projeto separado de autenticação, armazenamento, retenção e controles de acesso.
