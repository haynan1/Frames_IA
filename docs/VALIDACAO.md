# Validação

## Verificações automáticas

`npm run check` valida a sintaxe, executa os testes abaixo e produz o site publicável em `dist/`:

- IDs únicos e seções com conteúdo.
- As 14 operações produzem instruções distintas.
- Modo imagem remove movimento, duração e áudio de vídeo.
- Parâmetros inválidos recebem limites e valores seguros.
- Catálogo com HTTPS, fonte e data individual.
- Assets esperados, idioma, CSP e caminhos relativos.
- Ausência de chamadas remotas ou execução de código nos fluxos de produção.
- Separação entre publicação e materiais privados.

## Revisão de navegador

Registrar os resultados observados ao final da execução, sem confundir protocolo com evidência:

1. Abrir início, manual, atlas, laboratório, prompts, storyboard, modelos, QA e fontes.
2. Testar uma busca com resultado e uma sem resultado, filtros e abertura de prompt.
3. Alterar câmera e progresso; iniciar, pausar e trocar a página.
4. Alterar modo imagem/vídeo no laboratório; verificar a saída e baixar o comando.
5. Marcar QA, navegar, retornar e confirmar persistência; limpar e exportar.
6. Testar navegação e menu em largura de celular e por teclado.
7. Abrir uma rota direta dentro de `/preview/`, simulando subpasta do Pages.

## Evidência observada · 30.10.2026

- Sete testes automatizados passaram; verificação de sintaxe e build concluídos.
- Prévia respondeu HTTP 200 no caminho raiz e em `/preview/`, com módulos e imagens em caminhos relativos.
- Página inicial revisada visualmente em composição desktop e tela estreita; não foi observado overflow horizontal na largura medida durante a revisão.
- Laboratório mudou de vídeo para imagem, removeu os campos de movimento e duração e incorporou a alteração do sujeito ao comando. Cópia foi acionada; o conteúdo efetivo do clipboard não foi auditado.
- Busca encontrou um prompt por “textura”; consulta sem correspondência exibiu estado vazio.
- Checklist registrou duas marcações e as preservou após navegação; limpeza também foi executada.
- Orbit foi selecionado, o controle alcançou 100% e a geometria permaneceu renderizada. O menu responsivo expandiu corretamente.
- Catálogo mostrou dez ferramentas; filtro Imagem deixou duas visíveis.
- Manual mostrou oito capítulos e a contact sheet carregou corretamente. Storyboard mostrou cinco planos e o download da shot list produziu um arquivo `.txt`.
- Fontes mostrou dezesseis registros. Nenhum erro de console foi retornado na consulta feita após esses fluxos.
- Os quatro commits fixados das ações do workflow foram conferidos com os respectivos repositórios oficiais. O script PowerShell passou pela análise de sintaxe.

Não foi feita uma auditoria completa com leitor de tela, medição de Core Web Vitals, ensaio automatizado de todos os breakpoints ou execução de deploy remoto. Melhorias de foco e skip link foram revisadas no código; não são apresentadas como certificação de acessibilidade.

## Evidência observada · versão 1.1

- Quinze testes automatizados passaram, incluindo projeto exportado/importado, continuidade dos intervalos e bloqueio de dados inválidos.
- No navegador, a duração total mudou de 15s para 17s ao alterar a primeira tomada de 3s para 5s.
- Ao informar 0s, o plano mostrou o erro e desabilitou a exportação.
- Remover uma tomada mudou a contagem para quatro; desfazer a remoção restaurou cinco.
- O nome editado do projeto foi recuperado depois de recarregar a página.
- Um JSON válido substituiu o plano; desfazer restaurou o anterior. Um JSON inválido exibiu erro sem alterar o nome ou apagar o rascunho.
- Alternar o laboratório vídeo → imagem → vídeo preservou orbit e 7s no prompt. Limpar o sujeito esvaziou o comando e bloqueou a cópia.
- Na revisão responsiva, viewport de 1366px mostrou duas colunas (520px e 441px). Em 390px, o editor passou para uma coluna de 331px; não houve overflow horizontal nas duas medidas.
- Nenhum erro de console foi retornado na consulta após esses fluxos.

Importação foi exercitada no navegador; os bytes dos arquivos baixados desta versão e o conteúdo efetivo do clipboard não foram auditados por comparação. A exportação de texto e a serialização foram verificadas em testes de função pura.

## Limites

## Evidência observada · versão 1.2

- Vinte e um testes passaram, incluindo presença dos trinta WebP individuais e miniaturas, metadados, seis estudos de roupas, pesquisa com acentos, duração dos prompts e exportação dos roteiros.
- Os trinta resultados selecionados e a tentativa rejeitada foram inspecionados visualmente. Não houve upscale; os arquivos finais preservam as dimensões nativas.
- No navegador, Clothing mostrou seis estudos e Produto mostrou quatro; a busca por linho mostrou um. Consulta sem resultado exibiu a opção de limpar filtros, que restaurou dez estudos.
- Salvar um estudo e filtrar Meus salvos manteve o resultado; a marcação de teste foi removida ao final.
- No estudo de linho, selecionar o frame 02 e a aba de animação mostrou a referência correta e cinco segundos solicitados. A ampliação avançou para o frame 03 com seta, fechou com Escape e devolveu o foco ao botão de ampliar.
- Os quatro elementos de imagem da área visual carregaram. A comparação de enquadramento do perfume tem duas imagens, tentativa e reparo.
- O guia mostrou seis etapas e primeiro exercício com links para as telas correspondentes. O menu de celular abriu e navegou para a biblioteca.
- Não houve overflow horizontal nas medidas de 390, 768 e 1366 pixels verificadas. A revisão foi executada em `/preview/`, simulando uma subpasta de GitHub Pages.
- Prompts de animação foram ajustados à imagem observada: o linho começa na composição de corpo inteiro; o café termina o despejo quase imediatamente para acomodar o nível já alto.

As exportações de roteiro foram verificadas em função pura; nesta versão, não houve nova comparação dos bytes baixados pelo navegador nem auditoria do clipboard.

## Evidência observada · versão 2.0 (31.10.2026)

- `npm run check`: sintaxe de 26 módulos, **38 testes** aprovados e build concluído. Testes novos cobrem os seis modelos de cena (ida e volta JSON), linha do tempo contínua de 15s, keyframes A/B e referências de costas, óptica da distância, alertas de direção, neutralidade de gênero nos prompts, 16 importações hostis (incluindo `__proto__`, caminhos com `..`, URLs, 17 tomadas e 130s), migração de planos v1, exportações sem `undefined`, escape de `<img onerror>` em todos os campos das cinco etapas, geometria finita dos diagramas em todos os modelos e tempos, integridade do elenco, das direções e da fila (IDs, destinos, dependências e ordem) e regras de privacidade do Git.
- Segurança: nenhuma dependência de runtime ou de desenvolvimento; busca por padrões de segredo no código e no histórico sem resultado; `incoming/`, `references/*` e `private-output/` ignorados; nenhum atributo `style` inline (CSP preservada); nenhum `eval`, `Function` ou `fetch`.
- Navegador em 1440 px: briefing com nome vazio mostrou erro no campo, `aria-invalid`, contador 1 na etapa e manteve a última versão válida salva; a pendência na Entrega levou o foco ao campo; título com `<b>` foi exibido como texto.
- Sequência: remover tomada (6 → 5) e desfazer (5 → 6); duplicar e mover antes; trocar a operação para pedestal mostrou “altura final” e para orbit mostrou graus (30°) e escondeu a altura final; duração 12s mostrou erro e bloqueou os prompts; setas navegaram na linha do tempo e nas abas, pulando o keyframe B indisponível.
- Importação: JSON quebrado mostrou erro sem alterar o rascunho; plano v1 foi migrado (1 tomada) e desfazer restaurou o anterior; aplicar “Produto hero” e desfazer; trocar o perfil de marca para Produto aplicou marca e formato 1:1, e desfazer voltou para Sarcenet.
- Câmera: na tomada 3 (orbit 30°) a 60% a planta, a lateral e o enquadramento renderizaram sem a falsa indicação de costas (corrigida nesta revisão); na tomada 4 o keyframe B anexa as costas da modelo e da peça.
- Menu: recolher no desktop levou a barra para 76 px, persistiu após navegar e atualizou rótulo e `aria-expanded`. Em 375 px, a gaveta abriu com o conteúdo `inert`, foco no item atual, Escape fechou e devolveu o foco ao botão; sem rolagem horizontal.
- Fila: 100 itens; filtro “Campanha Sarcenet” mostrou 13; busca `s04` mostrou A e B; busca sem resultado mostrou estado vazio. Ingestão exercitada com imagens sintéticas: ID desconhecido ignorado, imagem de 300 px recusada, imagens válidas publicadas com miniatura e exibidas no elenco e no contador (1/100). Os arquivos de teste foram removidos.

Não verificado nesta versão: leitor de tela real, Core Web Vitals medidos, bytes dos arquivos baixados e conteúdo do clipboard. As 100 imagens da fila ainda não foram geradas; nenhum clipe foi produzido.

## Limites atuais

Não foi realizado benchmark de modelos, geração de clipes nas plataformas listadas, avaliação de conversão ou auditoria automática de arquivos de campanha. Envio ao repositório e implantação de Pages são eventos distintos. Um build local aprovado não comprova publicação do site.
