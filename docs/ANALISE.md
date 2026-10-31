# Análise do projeto · de biblioteca a estúdio

Revisão de 31.10.2026, versão 1.2 → 2.0.

## Onde o projeto estava (v1.2)

Uma biblioteca editorial sólida: 30 frames gerados em 10 cenários, manual em 8 capítulos, atlas de 14 movimentos com simulação, laboratório de prompt, storyboard de 15s, planejador de produção com JSON validado, catálogo de ferramentas e QA. Site estático, CSP restrita, testes e deploy no GitHub Pages funcionando.

### O que faltava para virar um estúdio de direção de arte para uma loja

| Lacuna | Impacto | Resposta na 2.0 |
| --- | --- | --- |
| Não havia elenco. Cada estudo inventava uma pessoa diferente. | Sem identidade recorrente não existe campanha, só imagens soltas. | **Elenco de 10 modelos fictícias** com ficha de identidade em inglês, medidas, tom de pele na escala Monk, energia de pose e 7 vistas de referência cada. |
| A direção visual era por estudo, não reutilizável. | Cada cena começava do zero; luz e cor variavam sem critério. | **8 direções de arte** com planta de luz, lente, exposição, paleta, cenário, o que evitar e imagem-chave. Aplicam cenário, luz e cor de uma vez. |
| O planejador só tinha câmera e enquadramento único por tomada. | Não descrevia aproximação, rotação, altura, lente, ação do modelo nem frame final. | **Studio de cenas** em 5 etapas: enquadramento inicial e final, operação, graus, lente, altura, ângulo, ação, foco, ritmo e transição por tomada. |
| Nenhuma visualização da câmera da tomada do usuário. | Difícil entender “dolly out de PPP para PM” ou “arco de 30°”. | **Planta vista de cima, vista lateral e enquadramento sobre a figura**, com controle de progresso e reprodução no tempo real da tomada. Distância câmera–sujeito calculada pela óptica. |
| Um prompt por tomada. | Ferramentas atuais trabalham com primeiro e último frame. | **Keyframe A, keyframe B e prompt de movimento** por tomada, com referências certas (inclui costas quando a câmera ou a modelo giram). |
| Imagens dependiam de geração manual sem fila. | Ninguém sabia o que faltava gerar, em que ordem e onde salvar. | **Fila de 100 imagens** com ID, prioridade, onda de dependência, destino, referências e critério de aceite; **ingestão automática** que publica no site. |
| Nenhuma camada de marca. | O estúdio não falava com a Sarcenet. | **Perfil Sarcenet (proposta)** com origem do nome, tom, paleta e regras, além de perfis para moda, produto e beleza. |
| Menu lateral fixo de 10 itens sem grupos. | Navegação longa, sem foco no fluxo de produção. | **Shell novo**: menu agrupado (Studio, Biblioteca, Aprender, Sistema), **recolhível** com tecla `[`, persistente, com dicas no modo trilho e gaveta acessível no celular. |

### O que já estava bom e foi preservado

Arquitetura estática sem dependências, CSP sem `unsafe-inline`, escape de todo campo livre, importação com esquema estrito, testes de conteúdo, build por allowlist e workflow com ações fixadas por SHA. A 2.0 mantém tudo isso.

## Decisões de arquitetura

- **Continua estático.** Um estúdio de planejamento não precisa de servidor. A geração acontece no provedor ou no Codex; o site organiza, valida e compila a direção. Evita custo, login e superfície de ataque.
- **Dados como fonte única.** `data/studio.js` define o esquema e compila prompts; `data/image-requests.js` deriva a fila do elenco, das direções e da própria campanha do Studio. A fila em Markdown e JSON é gerada no build. Os keyframes da campanha Sarcenet são exatamente os prompts que o Studio produz — se o compilador melhorar, a fila acompanha.
- **Esquema v2 com migração.** Planos v1 do planejador antigo são convertidos ao importar e ao abrir o Studio pela primeira vez.
- **Ingestão determinística.** O Codex só gera PNG. `scripts/ingest-images.py` valida ID, tamanho mínimo e caminho, converte para WebP sem upscale, cria miniatura, registra proveniência e move o original para fora do Git. O site passa a exibir a imagem sem tocar no código.
- **Privacidade por padrão.** Fotos reais da loja e das modelos vão para `references/` (ignorado). Consentimento registrado é pré-requisito para usar rosto real; resultados com pessoas reais não são publicados.

## Riscos e limites honestos

- O perfil Sarcenet é uma **hipótese**. Não encontrei site ou perfil público da loja; paleta, tom e público precisam de validação.
- Distâncias de câmera são aproximações ópticas (cobertura × focal ÷ lado do sensor), boas para direção, não para medição de set.
- Nenhum vídeo foi gerado ou testado nesta entrega. As 100 imagens estão pendentes até o Codex executá-las.
- Consistência de identidade em modelos de imagem não é garantida; por isso há âncora, referências obrigatórias e critério de aceite por item.

## Próximos ciclos recomendados

1. **Gerar a fila P0 (43 imagens)** com o Codex e revisar a identidade de cada modelo antes do P1.
2. **Validar o perfil Sarcenet** com a loja: logo, paleta real, público, peças da próxima coleção. Substituir o vestido fictício por uma peça real fotografada.
3. **Produzir os 6 clipes** da campanha a partir dos keyframes aprovados e registrar custo por plano aprovado.
4. **Múltiplos looks por cena** (lookbook): permitir peça por tomada, mantendo a modelo.
5. **Biblioteca de projetos** no navegador (vários rascunhos nomeados) e exportação em lote.
6. **Aprovação por keyframe** no Studio (aprovado/reprovado/nota), alimentando o QA.
