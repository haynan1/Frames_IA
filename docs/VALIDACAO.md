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

## Limites

Não foi realizado benchmark de modelos, geração de clipes nas plataformas listadas, avaliação de conversão ou auditoria automática de arquivos de campanha. Deploy público não foi executado: o usuário escolheu publicar depois. Sessão GitHub verificada com rede disponível. Um build local aprovado não comprova publicação.
