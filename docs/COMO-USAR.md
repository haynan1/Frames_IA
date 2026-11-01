# Como operar o FRAME Studio

## O caminho de produção (resumo)

1. **Antes de começar:**
   - fotografe a peça: frente, costas e um detalhe bem próximo, salvos como `peca-frente.png`, `peca-costas.png` e `peca-detalhe.png`;
   - se for usar as modelos da loja, rode `npm run modelos` uma vez.
2. **Tomadas prontas** (`#tomadas`): escolha a modelo e clique em “Abrir as 5 tomadas no Studio”.
3. **Etapa 2 do Studio:** troque a peça (nome, cor, material, construção em inglês e os nomes das fotos).
4. **Etapas 3 e 4:** confira cenário e câmera e resolva os alertas laranja.
5. **Painel Produzir de cada tomada:**
   - gere a imagem A (e a B) no ChatGPT;
   - anime na ferramenta de vídeo;
   - marque o que foi aprovado.

   Comece pela tomada 2, o retrato.
6. **Entrega:** monte na ordem do painel Montagem, exporte em 9:16 e passe pelo Controle de qualidade.

## Tomadas prontas

Cinco tomadas pré-configuradas, num total de 14 s, no cenário Seda & janela:

| # | Tomada | Câmera | Ação | Imagens |
| --- | --- | --- | --- | --- |
| 1 | Matéria | PD, rack focus, 100 mm | Mão toca o decote | A |
| 2 | Retrato | PPP → PM, dolly out, 85 mm | Muda o olhar | A + B |
| 3 | Caimento | PI, arco de 30° | Parada | A + B |
| 4 | Costas | PA, câmera fixa | Meia-volta | A + B |
| 5 | Passo | PI, tracking, 35 mm | Dois passos | A + B |

Só a modelo muda: a câmera, a lente, a ação, a duração e a transição continuam iguais. Cada tomada traz:
- um exemplo gerado (tomadas 1–5 da campanha Cápsula Seda);
- a ficha técnica, o que gerar e o que anexar;
- os prompts A, B e de movimento, já com a modelo escolhida;
- o que revisar e o que fazer se der errado.

“Produzir no Studio” abre a sequência na tomada escolhida. O rascunho anterior pode ser recuperado com Desfazer.

## Construir uma cena no Studio

1. Abra **Studio de cenas** (menu lateral ou botão “Abrir Studio”). O modelo **Sarcenet · Cápsula Seda · 15s** abre por padrão; troque em “Modelo de cena”.
2. **Briefing:** escolha o perfil de marca (aplica direção, modelo e formato sugeridos, com desfazer), objetivo, formato (9:16, 4:5, 1:1, 16:9), mensagem, público e CTA. Logo e textos entram só na edição.
3. **Peça & elenco:** descreva a construção exata da peça em inglês (decote, fechos, costuras, comprimento e o que não existe) e informe os nomes dos arquivos de referência. Escolha uma modelo do elenco, “sem modelo” ou “modelo própria” (referência privada, com autorização).
4. **Cenário & luz:** escolha uma direção de arte. Ela preenche cenário, luz e cor; ajuste o texto se precisar. A planta de luz mostra a montagem.
5. **Sequência:** selecione uma tomada na linha do tempo (ou use as setas). Defina enquadramento inicial e final, operação de câmera, graus, lente, altura, ângulo, ação, foco, ritmo e transição. Arraste o progresso ou clique em **Reproduzir**: a planta, a lateral e o enquadramento mostram a câmera se aproximando, girando ou subindo. Alertas apontam combinações arriscadas.
6. **Entrega:** resolva pendências (cada uma leva ao campo), copie ou baixe o **pacote de produção**, o **pedido para o Codex** ou o **projeto .json**.

## Do Studio ao vídeo: quem faz o quê

O FRAME escreve a direção e os prompts. Ele não gera imagem nem vídeo e não envia nada para fora do navegador. Você não precisa conectar o site a nenhuma ferramenta: o trabalho é copiar, anexar e colar.

| Ferramenta | Papel |
| --- | --- |
| FRAME Studio | Monta a cena, calcula a câmera e escreve os prompts de cada tomada. Diz o que anexar. |
| ChatGPT ou outra ferramenta de imagem | Gera as imagens inicial (A) e final (B) de cada tomada. |
| Ferramenta de vídeo (Kling, Runway, Veo…) | Anima a tomada a partir de A, ou de A e B no modo primeiro e último quadro. |
| CapCut, Premiere ou similar | Junta os clipes na ordem, com texto, logo e música. |
| Codex (opcional) | Gera todos os keyframes de uma vez a partir do pedido baixado na Entrega. |

## Produzir uma tomada (painel Produzir)

Na etapa **Sequência**, embaixo da câmera, o painel **Produzir** mostra a tomada selecionada em passos numerados:

1. **Gere a imagem inicial.** Baixe as referências listadas (modelo, peça) pelo botão **Baixar**: o arquivo já sai com o nome que o prompt cita. Se a referência é a sua foto da peça, use a foto com o nome informado na etapa 2. Abra um chat novo, anexe tudo, clique em **Copiar prompt A**, cole e gere. Salve com o nome indicado.
2. **Gere a imagem final** (só quando a câmera ou a modelo mudam durante a tomada). Anexe as mesmas referências e a imagem A, copie o **prompt B** e gere.
3. **Anime a tomada.** Na ferramenta de vídeo, envie A como primeiro quadro (e B como último, quando houver), copie o **prompt de movimento** e configure a duração e o formato mostrados.

Marque **Imagem aprovada** e **Clipe aprovado** à medida que avança. O progresso aparece na linha do tempo (bolinhas em cada tomada) e na Entrega, fica salvo no navegador e vai junto no `.json` exportado. Keyframes que já estão no acervo do site contam como prontos. **Próxima tomada** leva à seguinte; na última, **Ir para a entrega**.

Use **Ver o texto** para ler o prompt antes de copiar. A faixa **Como funciona**, no topo do Studio, resume o fluxo e pode ser recolhida.

## Ultra close e giros na peça

Para planos colados no tecido, use o modelo **Sarcenet · Ultra close no cetim · 14s** (peça real da loja) ou monte a tomada assim:

1. Em **Plano**, escolha **MAC · Macro de textura** (campo de cerca de 4 cm: trama, costura e brilho) ou **PD · Plano detalhe** (cerca de 14 cm: decote, botão, fenda). Use a lente de 100 mm.
2. Escolha a **Região do detalhe**: superfície do tecido, decote, ombro e alças, corpete, cintura, fecho, punho, fenda, barra ou costas. O enquadramento mostra uma lupa sobre a região, o campo em centímetros e a ampliação.
3. Escolha o movimento. No plano fechado, cada operação vira um movimento de detalhe:

| Operação | No plano fechado |
| --- | --- |
| Truck / slider | Deslize macro pela superfície; o brilho corre pelas dobras |
| Pedestal | Deslize vertical ao longo da região (ex.: descer pela fenda) |
| Orbit | Arco de 15–30° em volta do detalhe, com a luz varrendo o tecido |
| Giro no eixo | A modelo gira devagar 15–30° e o brilho atravessa a peça |
| Rack focus | O foco atravessa as camadas do drapeado |
| Dolly in | Aproximação lenta do PD para o macro |

4. Informe a **referência de detalhe** na etapa 2: uma foto nítida e próxima da peça real. Sem ela, o Studio avisa e o prompt manda não inventar trama. Essa é a regra do manual da loja: sem foto macro, não existe plano macro honesto.

O Studio também avisa quando o giro passa de 45° num plano fechado, quando a modelo caminha num macro e quando a mesma tomada salta 8× ou mais de escala. Nesse último caso, divida em duas tomadas com corte.

## Modelos da loja

A MODELO-A (a modelo da galeria) e as 20 fichas de `06 - MODELOS SARCENET` aparecem na etapa 2, em **Modelos da loja**. As imagens não vão para o site. Para gerar os recortes limpos de rosto, corpo e costas, rode uma vez:

```bash
npm run modelos -- --origem "C:/…/LOJA SARCENET/07 - VESTUARIO"
```

O script só lê a pasta da loja e grava em `references/sarcenet/modelos/`, que o Git ignora. O painel Produzir pede os arquivos pelo nome, por exemplo `sarcenet-modelo-a-rosto.png`. Em planos fechados, o rosto não é anexado: só o corpo, para o tom de pele e a escala.

Atalho: `[` recolhe ou expande o menu lateral no computador.


## Primeiro exercício

1. Abra **Biblioteca visual → Linho em movimento**.
2. Selecione o frame 02 e clique em **Baixar imagem**.
3. Abra **Animar o frame** e copie o prompt.
4. Na sua ferramenta de vídeo, anexe essa imagem como primeiro frame e configure o modo imagem → vídeo, proporção e duração disponíveis.
5. Gere a tomada, compare roupa, rosto, pés e movimento com a imagem e revise antes de montar a sequência.

Esse exercício usa um estudo fictício. Não precisa cadastrar um produto nem ler o manual completo para experimentar.

## Operação completa

**Escolher:** filtre Clothing / roupas ou Produto na biblioteca. Cada estudo reúne três frames individuais em uma história de 15 ou 24 segundos planejados. Salve os estudos que quiser consultar depois.

**Entender:** abra os frames e leia a função de cada plano, a roupa/objeto, a paleta e a curadoria. “Funciona visualmente” descreve a imagem observada; não é resultado de teste de vídeo ou vendas.

**Gerar imagens próprias:** use o prompt do frame 01 para construir sua base. Gere os próximos frames com essa base como referência. Para produto real, anexe fotografias autorizadas da peça; não use uma ficção como prova de SKU, material ou benefício.

**Planejar:** abra o Studio de cenas, preencha as cinco etapas e confira a duração. Exporte o projeto para poder retomar depois. Importe esse JSON para continuar editando no mesmo navegador ou em outro.

**Animar:** em cada frame da biblioteca, copie a aba de animação e anexe a imagem correspondente no provedor. No primeiro teste, use uma câmera e uma ação simples. Configure de fato a duração e a resolução no provedor, em vez de depender apenas das palavras do prompt.

**Montar:** escolha os trechos estáveis, faça os cortes e adicione fala, música, legendas e CTA na edição. No lookbook de três roupas, faça a troca por corte; não peça que uma roupa derreta e se transforme em outra.

**Revisar:** use Controle de qualidade e compare o vídeo inteiro com as referências. Exporte a revisão e registre o responsável pela aprovação antes de publicar.

## O que cada arquivo faz

| Arquivo | Para que serve |
| --- | --- |
| Imagem `.webp` do estudo | Referência visual ou primeiro frame para praticar animação. |
| Roteiro e prompts `.txt` do estudo | Conceito, sequência, prompts, narração proposta e pontos de revisão. |
| Projeto `.frame.json` do Studio | Campos editáveis para retomar a cena. Não inclui imagens. Planos antigos também são aceitos. |
| Pacote `.txt` do Studio | Briefing, distâncias, keyframes e movimento de cada tomada. |
| Pedido `.md` para o Codex | Keyframes da cena com referências, destino e critério de aceite. |
| Revisão `.txt` | Registro das marcações humanas do checklist. |

O site não gera vídeos, não envia arquivos e não usa créditos de provedores. Favoritos e rascunhos ficam no navegador; exporte o que deseja guardar. As plataformas externas de geração têm suas próprias condições e custos.
