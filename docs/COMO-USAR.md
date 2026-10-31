# Como operar o FRAME Studio

## Construir uma cena no Studio

1. Abra **Studio de cenas** (menu lateral ou botão “Abrir Studio”). O modelo **Sarcenet · Cápsula Seda · 15s** abre por padrão; troque em “Modelo de cena”.
2. **Briefing:** escolha o perfil de marca (aplica direção, modelo e formato sugeridos, com desfazer), objetivo, formato (9:16, 4:5, 1:1, 16:9), mensagem, público e CTA. Logo e textos entram só na edição.
3. **Peça & elenco:** descreva a construção exata da peça em inglês (decote, fechos, costuras, comprimento e o que não existe) e informe os nomes dos arquivos de referência. Escolha uma modelo do elenco, “sem modelo” ou “modelo própria” (referência privada, com autorização).
4. **Cenário & luz:** escolha uma direção de arte. Ela preenche cenário, luz e cor; ajuste o texto se precisar. A planta de luz mostra a montagem.
5. **Sequência:** selecione uma tomada na linha do tempo (ou use as setas). Defina enquadramento inicial e final, operação de câmera, graus, lente, altura, ângulo, ação, foco, ritmo e transição. Arraste o progresso ou clique em **Reproduzir**: a planta, a lateral e o enquadramento mostram a câmera se aproximando, girando ou subindo. Alertas apontam combinações arriscadas.
6. **Entrega:** resolva pendências (cada uma leva ao campo), copie ou baixe o **pacote de produção**, o **pedido para o Codex** ou o **projeto .json**.

Em cada tomada: gere o **keyframe A** (e o **B**, quando a composição muda) na ferramenta de imagem com as referências listadas na primeira linha do prompt. Depois leve o **movimento** para a ferramenta de vídeo, com A como primeiro frame e B como último quando a ferramenta aceitar.

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
