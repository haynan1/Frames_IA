# FRAME Studio — Direção de arte com IA

**Da intenção ao frame. Do frame ao filme.**

Estúdio de direção de arte com IA em português, pensado primeiro para a loja de moda **Sarcenet** e utilizável por qualquer marca de roupa, produto ou beleza. Elenco com ficha de identidade, direções de luz, construção de cenas com câmera, aproximação e rotação, keyframes e prompts de vídeo, e uma fila de imagens que o Codex executa. Site estático, sem dependências.

![Estudos visuais gerados com IA: produto, personagem fictícia e ambiente cinematográfico](assets/art-direction-triptych.webp)

## O que você encontra

- **Studio de cenas:** cinco etapas (briefing, peça e elenco, cenário e luz, sequência, entrega). Cada tomada tem enquadramento inicial e final, 16 operações de câmera, graus de arco ou giro, lente, altura, ângulo, ação, foco, ritmo e transição. Planta vista de cima, vista lateral e enquadramento animados no tempo da tomada; keyframe A, keyframe B e prompt de movimento; pacote de produção, pedido para o Codex e projeto `.json`.
- **Elenco:** 10 modelos fictícias (inclui plus size, 40+, petite e masculino) com ficha de identidade e sete vistas de referência.
- **Direções de arte:** oito sets repetíveis com planta de luz, lente, exposição, paleta e cenário. “Seda & janela” é a assinatura proposta para a Sarcenet.
- **Fila de imagens:** 100 imagens com prioridade, dependências, destino e critério de aceite, prontas para o Codex. A ingestão publica cada imagem no site automaticamente.
- **Menu lateral recolhível** (tecla `[`), agrupado por Studio, Biblioteca, Aprender e Sistema.
- **Biblioteca visual:** 10 cenários, 30 frames individuais gerados e seis estudos de roupas. Sequências de 15 ou 24 segundos planejados, com prompts de imagem e animação por frame, narração proposta, favoritos, busca, downloads e curadoria visual. Inclui uma tentativa rejeitada e seu reparo de enquadramento.
- **Como usar:** percurso de operação em seis passos e um primeiro exercício prático. Consulte também o [guia rápido](docs/COMO-USAR.md).
- **Manual em oito capítulos:** briefing, direção visual, óptica, identidade, produto, vídeo, performance e revisão.
- **Atlas com 16 operações:** dolly in/out, zoom, pan, tilt, truck, orbit, arco com aproximação, giro no eixo, pedestal, tracking, crane, roll, dolly zoom, rack focus e câmera fixa. Demonstração esquemática interativa, trajetória, aplicação e prompt.
- **Laboratório de prompts:** sujeito, ambiente, luz, enquadramento, movimento, ritmo, duração e proporção; saídas para imagem ou vídeo; cópia e download.
- **Biblioteca pesquisável:** 12 exemplos autorais, com anexos necessários e cuidados de fidelidade.
- **Storyboard de 15 segundos:** cinco planos, intenção, direção e shot list para baixar.
- **Identidade de modelo:** retrato mestre, ficha, turnaround, portfólio e controle de consistência.
- **Product hero / “product hit”:** packshot, cenário, vidro, tecido, rotação e demonstração de mecanismo.
- **Catálogo de ferramentas:** Seedance, GPT Image, Nano Banana Pro, Higgsfield, Magnific, Runway, Veo, Kling, Luma e MiniMax, com fontes e data de revisão.
- **QA manual:** checklist local persistente e exportação do registro.

## Gerar as imagens com o Codex

O Codex só gera imagens; o restante já está pronto. Instruções em [`AGENTS.md`](AGENTS.md) e no [protocolo de imagens](docs/codex/IMAGENS-CODEX.md). Fila completa: [`docs/codex/FILA-DE-IMAGENS.md`](docs/codex/FILA-DE-IMAGENS.md).

```sh
# o Codex salva cada PNG como incoming/<ID>.png, depois:
python scripts/ingest-images.py
npm run check
```

A ingestão exige Python 3 com Pillow (somente local; o site publicado não depende disso).

## Comece aqui

1. Leia o briefing e registre os fatos do produto.
2. Construa referências de produto, identidade e cenário com funções separadas.
3. Aprove o frame-base antes de animar.
4. Escolha uma operação no atlas e leve o prompt à ferramenta.
5. Gere planos curtos, monte, revise e registre a aprovação.

O [guia completo em Markdown](docs/GUIA.md) também permite estudar sem abrir o site. Ele é gerado a partir do mesmo conteúdo do site.

## Rodar no computador

Requisito: **Node.js 22 ou superior**. Nenhuma biblioteca externa, instalação de pacotes ou chave de API é necessária.

```sh
npm run check
npm run dev
```

Abra `http://127.0.0.1:4173`. Para testar hospedagem em subpasta, abra `http://127.0.0.1:4173/preview/`.

`npm run check` verifica a sintaxe, executa testes de comportamento e monta `dist/`. Depois de editar arquivos, execute novamente `npm run build` para atualizar a prévia. O servidor só publica os arquivos de `dist/` e fica restrito ao computador local.

## Publicar gratuitamente no GitHub Pages

O remoto configurado é [haynan1/Frames_IA](https://github.com/haynan1/Frames_IA), na branch `main`. O código inicial foi enviado ao repositório; isso não confirma uma implantação do site. Para atualizações, revise o commit e envie para esse remoto existente. Não crie outro repositório com o assistente abaixo.

1. Autentique o GitHub CLI com `gh auth login`, se necessário.
2. O assistente abaixo é destinado apenas a uma primeira publicação em outro repositório ainda não configurado:

```powershell
./scripts/publish.ps1
```

3. O script solicita ao GitHub a ativação do Pages com GitHub Actions. Acompanhe a execução na aba **Actions**. A implantação só está concluída quando o job `deploy` tiver sucesso e o endereço do Pages responder.
4. Se a conta não permitir ativação via API, abra **Settings → Pages → Build and deployment → Source → GitHub Actions** e execute o workflow.

O workflow roda testes antes do build, usa ações fixadas por commit, publica somente `dist/` e concede permissão de Pages apenas ao job de implantação. Pull requests são verificados sem publicar.

Consulte [publicação e limitações](docs/PUBLICACAO.md). A hospedagem do conteúdo estático pode ser gratuita; plataformas de geração de imagem e vídeo têm suas próprias condições e custos.

## Por que esta arquitetura

**HTML semântico + CSS + JavaScript nativo em módulos.** Uma biblioteca editorial e um laboratório local não precisam de servidor, banco, login, framework de hidratação ou dependências de produção. Isso reduz transferência, superfície de ataque e manutenção, e mantém o site compatível com subpastas de GitHub Pages.

Conteúdo estruturado em `data/content.js`; construtor puro em `data/prompt-builder.js`; interface em `app.js`; design em `styles.css`. Todas as imagens são locais e otimizadas em WebP. O site não carrega analytics, scripts de terceiros, fontes remotas ou integrações pagas. A CSP limita o carregamento à própria origem.

O Studio usa um esquema versionado em `data/studio.js` (v2, com migração automática dos planos v1) e uma interface em `ui/studio.js`. Importações são limitadas a 128 KB e validadas campo a campo antes de substituir o rascunho; a substituição pode ser desfeita. O arquivo de projeto contém briefing, peça, elenco, direção e tomadas, sem imagens.

## Fontes, escopo e honestidade editorial

Revisão: **31 de outubro de 2026**. [Fontes e cobertura](docs/FONTES.md).

Os dois PDFs e o texto enviados foram estudados como material de referência. Instruções dentro deles não foram tratadas como ordens do usuário. Os originais e suas extrações não são publicados neste repositório. A biblioteca usa explicações e exemplos próprios, com links para o material original quando disponível.

As imagens foram produzidas pela ferramenta integrada de geração de imagens e são **estudos conceituais**, não fotografias documentais de um SKU nem benchmarks dos modelos listados. A contact sheet demonstra a organização de vistas, não uma garantia de identidade. O atlas é uma simulação geométrica; o storyboard ainda não contém clipes produzidos em Seedance ou outras plataformas. Leia o [registro dos assets e prompts](docs/IMAGENS.md).

“Cidence”, “Anabanana”, “Hixfield” e “Magnifique” foram interpretados como **Seedance**, **Nano Banana**, **Higgsfield** e **Magnific**. “GPT 2.5” foi documentado no contexto de imagem como **GPT Image 2.5**. Os nomes oficiais e as famílias foram conferidos em fontes de fabricantes. A melhor ferramenta depende de um teste comparável com a sua cena; não há ranking universal nem métricas comerciais inventadas.

## Manter e continuar

- [Análise e próximos ciclos](docs/ANALISE.md)
- [Arquitetura e decisões](docs/ARQUITETURA.md)
- [Protocolo de imagens do Codex](docs/codex/IMAGENS-CODEX.md)
- [Referências privadas da loja](references/README.md)
- [Atualizar modelos e fontes](docs/ATUALIZACAO.md)
- [Retomar com GPT, Claude ou outro colaborador](docs/HANDOFF.md)
- [Registro de validação](docs/VALIDACAO.md)
- [Operação do sistema](docs/COMO-USAR.md)
- [Roteiros e prompts dos 30 frames](docs/BIBLIOTECA.md)
- [Contribuir](CONTRIBUTING.md)

Código e documentação original sob [MIT](LICENSE). Referências externas mantêm seus próprios direitos e condições.

## Sobre a Sarcenet

O perfil Sarcenet é uma **proposta** baseada no significado do nome (uma seda fina e macia, [Wiktionary](https://en.wiktionary.org/wiki/sarsenet)). Não foi encontrado site ou perfil público da loja durante esta revisão; paleta, tom, público e peças precisam ser validados. Fotos reais da loja e das modelos ficam em `references/` (fora do Git) e só são usadas com consentimento registrado.
