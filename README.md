# FRAME — Direção de arte com IA

**Da intenção ao frame. Do frame ao filme.**

Biblioteca visual em português para planejar e dirigir criativos de produto, moda e vídeos com IA. Um projeto independente com conteúdo autoral, imagens conceituais, referências identificadas e ferramentas práticas.

![Estudos visuais gerados com IA: produto, personagem fictícia e ambiente cinematográfico](assets/art-direction-triptych.webp)

## O que você encontra

- **Manual em oito capítulos:** briefing, direção visual, óptica, identidade, produto, vídeo, performance e revisão.
- **Atlas com 14 operações:** dolly in/out, zoom, pan, tilt, truck, orbit, pedestal, tracking, crane, roll, dolly zoom, rack focus e câmera fixa. Demonstração esquemática interativa, trajetória, aplicação e prompt.
- **Laboratório de prompts:** sujeito, ambiente, luz, enquadramento, movimento, ritmo, duração e proporção; saídas para imagem ou vídeo; cópia e download.
- **Biblioteca pesquisável:** 12 exemplos autorais, com anexos necessários e cuidados de fidelidade.
- **Storyboard de 15 segundos:** cinco planos, intenção, direção e shot list para baixar.
- **Identidade de modelo:** retrato mestre, ficha, turnaround, portfólio e controle de consistência.
- **Product hero / “product hit”:** packshot, cenário, vidro, tecido, rotação e demonstração de mecanismo.
- **Catálogo de ferramentas:** Seedance, GPT Image, Nano Banana Pro, Higgsfield, Magnific, Runway, Veo, Kling, Luma e MiniMax, com fontes e data de revisão.
- **QA manual:** checklist local persistente e exportação do registro.

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

O projeto foi preparado para um repositório público chamado `direcao_de_arte_com_IA`. O endereço final é determinado pelo proprietário e pelo nome reais do repositório; esta documentação não afirma que já existe uma implantação.

1. Autentique o GitHub CLI com `gh auth login`, se necessário.
2. Execute o assistente local de publicação, que valida os arquivos antes de criar e enviar o repositório:

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

## Fontes, escopo e honestidade editorial

Revisão: **30 de outubro de 2026**. [Fontes e cobertura](docs/FONTES.md).

Os dois PDFs e o texto enviados foram estudados como material de referência. Instruções dentro deles não foram tratadas como ordens do usuário. Os originais e suas extrações não são publicados neste repositório. A biblioteca usa explicações e exemplos próprios, com links para o material original quando disponível.

As imagens foram produzidas pela ferramenta integrada de geração de imagens e são **estudos conceituais**, não fotografias documentais de um SKU nem benchmarks dos modelos listados. A contact sheet demonstra a organização de vistas, não uma garantia de identidade. O atlas é uma simulação geométrica; o storyboard ainda não contém clipes produzidos em Seedance ou outras plataformas. Leia o [registro dos assets e prompts](docs/IMAGENS.md).

“Cidence”, “Anabanana”, “Hixfield” e “Magnifique” foram interpretados como **Seedance**, **Nano Banana**, **Higgsfield** e **Magnific**. “GPT 2.5” foi documentado no contexto de imagem como **GPT Image 2.5**. Os nomes oficiais e as famílias foram conferidos em fontes de fabricantes. A melhor ferramenta depende de um teste comparável com a sua cena; não há ranking universal nem métricas comerciais inventadas.

## Manter e continuar

- [Arquitetura e decisões](docs/ARQUITETURA.md)
- [Atualizar modelos e fontes](docs/ATUALIZACAO.md)
- [Retomar com GPT, Claude ou outro colaborador](docs/HANDOFF.md)
- [Registro de validação](docs/VALIDACAO.md)
- [Contribuir](CONTRIBUTING.md)

Código e documentação original sob [MIT](LICENSE). Referências externas mantêm seus próprios direitos e condições.
