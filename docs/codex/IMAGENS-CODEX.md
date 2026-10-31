# Protocolo de imagens para o Codex · FRAME Studio

**Sua única tarefa neste repositório é gerar imagens.** O código, os dados, os textos e a arquitetura já estão prontos e não devem ser alterados. Você produz os PNGs pedidos na fila, roda a ingestão e registra o que fez.

- Fila completa e ordem de trabalho: [FILA-DE-IMAGENS.md](FILA-DE-IMAGENS.md) (gerada a partir de `data/image-requests.js`).
- Versão para scripts: [fila.json](fila.json).
- Na interface: rota `#fila` do site (`npm run dev` → `http://127.0.0.1:4173/#fila`).

## 1. O que existe para gerar

| Grupo | Quantidade | Para quê |
| --- | --- | --- |
| Elenco | 70 (10 modelos × 7 vistas) | Fichas de identidade: rosto frente, corpo frente, três quartos, perfil, costas, lateral e editorial. São a base de consistência de todo o estúdio. |
| Direções | 18 (9 × imagem-chave + cenário vazio) | Mostram cada direção de arte e servem de referência de luz e locação. |
| Campanha Sarcenet | 13 (3 vistas da peça + 10 keyframes) | Demonstração completa da sequência “Cápsula Seda · 15s” do Studio, tomada por tomada. |
| Site | 1 | Capa da página inicial. |

**P0 = 44 imagens**: as âncoras de identidade de todo o elenco, todas as vistas da Helena (SC-01) usadas na campanha, as 9 imagens-chave, a peça, os keyframes e a capa. Comece por elas.

## 2. Ordem de trabalho

1. Leia `AGENTS.md`, este arquivo e a fila.
2. Gere **na ordem da tabela da fila**: prioridade (P0 → P1 → P2) e, dentro dela, **onda** (1 → 4). Uma imagem de onda 2 depende de uma de onda 1.
3. Para cada item:
   - Anexe **exatamente** as referências listadas em “Anexar” (caminhos do repositório). Se uma referência ainda não existe, gere-a antes.
   - Use o prompt do item **sem resumir**. Você pode acrescentar ao final uma linha de correção dirigida em uma nova tentativa (veja a seção 6).
   - Gere no tamanho indicado (`1024x1536` vertical 2:3, `1536x1024` horizontal 3:2). Não faça upscale nem recorte.
   - Salve como `incoming/<ID>.png`, com o ID exato da fila (ex.: `incoming/CAST-SC-01-ROSTO-FRENTE.png`).
4. Depois de um lote, rode:

   ```sh
   python scripts/ingest-images.py --dry-run
   python scripts/ingest-images.py
   npm run check
   ```

   A ingestão converte para WebP no destino, cria a miniatura, registra em `data/generated-assets.js` e move o original para `incoming/processed/` (fora do Git). O `npm run check` atualiza a fila e roda os testes.
5. Registre cada imagem aprovada em `docs/IMAGENS.md` (modelo na seção 8).
6. Faça commit apenas de: `assets/cast/`, `assets/directions/`, `assets/projects/`, `assets/studio/`, `data/generated-assets.js`, `docs/IMAGENS.md` e os arquivos regenerados em `docs/codex/` e `docs/GUIA.md`/`docs/BIBLIOTECA.md`. Mensagem sugerida: `Add generated images: <grupo> (<n>)`.

## 3. Regras inegociáveis

- **Pessoas fictícias e adultas.** Nenhum rosto pode imitar uma pessoa real, celebridade ou figura pública.
- **Sem texto, logo, marca, assinatura ou marca d'água dentro da imagem.** Logo e CTA entram na edição.
- **Uma imagem por arquivo.** Nada de colagem, grade, contact sheet ou painéis.
- **Identidade travada.** Depois que o `rosto-frente` de uma modelo for aprovado, todas as outras imagens dela anexam esse arquivo e precisam bater: formato do rosto, olhos, sobrancelhas, nariz, boca, marcas (ex.: a pinta da Helena acima do lábio, à esquerda), tom de pele (escala Monk indicada), cabelo e altura relativa.
- **Peça travada.** Na campanha, o vestido slip de seda champagne precisa ser o mesmo em todos os frames: alças finas, decote degagê, costas em U baixo com alças cruzadas, barra no meio da panturrilha, sem estampa.
- **Não altere código, dados, estilos ou textos.** Se um prompt parecer errado, gere a melhor versão possível e anote a observação em `docs/IMAGENS.md`.

## 4. Padrão de realismo (o que diferencia estúdio de “imagem de IA”)

Os prompts já trazem este bloco; use-o como critério de revisão:

- Pele com poros, penugem fina e variação natural de tom. Nada de pele plástica, brilho de filtro ou olhos “vidrados”.
- Mãos com cinco dedos, unhas plausíveis e contato real com o tecido.
- Tecido com peso: seda escorre e brilha com a luz; linho amassa; alfaiataria mantém a forma; costuras e barras coerentes.
- Luz com direção única e motivada (janela, softbox, sol). Sombra de contato sob os pés. Sem luz “de todos os lados”.
- Óptica real: profundidade de campo compatível com a lente indicada, perspectiva correta, verticais retas em arquitetura.
- Cor: paleta da direção, sem saturação exagerada nem HDR.

## 5. Critério de aceite (todas as imagens)

Aprove somente se **todas** forem verdadeiras:

- [ ] Enquadramento, ângulo e altura de câmera exatamente como pedidos.
- [ ] Identidade e peça idênticas às referências anexadas.
- [ ] Corpo inteiro com cabeça e os dois pés dentro do quadro quando o prompt pedir corpo inteiro.
- [ ] Nenhum texto, logo, marca ou artefato (dedos extras, membros fundidos, objetos derretidos).
- [ ] Resolução nativa do gerador, lado menor ≥ 768 px (a ingestão recusa menores).
- [ ] Os critérios específicos do item (campo “Aceite” na fila).

## 6. Reparar uma geração

Corrija **uma coisa por vez**, mantendo o prompt original e acrescentando ao final:

```text
CORRECTION: <o que está errado, visível>. Keep everything else identical to the previous attempt and the attached references.
```

Exemplos: `the left hand has six fingers`, `the camera must be much farther away: full body with both feet visible`, `the mole above the upper lip is missing`. Depois de três tentativas sem sucesso, gere de novo do zero com as referências e registre o problema.

### 6.1 Imagens para refazer

Uma imagem já ingerida pode ser reprovada depois, na revisão do fundador. Ela volta à fila com status **refazer (R1, R2…)** e aparece em “Refazer primeiro”, no topo de `FILA-DE-IMAGENS.md`. A refação é registrada em `data/image-revisions.js`, e o prompt do item já termina com a linha `CORRECTION` certa. Para refazer:

1. Gere de novo com o prompt completo do item e as mesmas referências. Use a versão atual (o arquivo em “Destino”) só para comparar, nunca como referência de geração.
2. Confira o novo critério de aceite, o último da lista do item.
3. Salve com o mesmo nome (`incoming/<ID>.png`) e rode a ingestão. Ela substitui o WebP e grava a revisão no registro, e o item volta a contar como concluído.
4. Registre em `docs/IMAGENS.md` a revisão, o motivo e a `CORRECTION` usada.

Não edite `data/image-revisions.js`: quem abre e fecha revisões é o fundador.

## 7. Referências reais da Sarcenet (opcional e privado)

O repositório é **público**. Fotos reais da loja e das modelos da loja **nunca** entram no Git:

- Coloque-as em `references/sarcenet/` (ignorado pelo Git). Estrutura em [references/README.md](../../references/README.md).
- **Peças reais** (fotos de produto da loja) podem ser usadas como referência de roupa para gerar imagens de campanha.
- **Modelos reais** só podem ser usadas como referência de identidade se existir `references/sarcenet/CONSENTIMENTO.md` com autorização de uso de imagem para IA, assinada, por modelo. Sem esse arquivo: use apenas o elenco fictício.
- Imagens geradas a partir de pessoas reais vão para `private-output/` (ignorado), **não** para `assets/`, e não são ingeridas no site público.

## 8. Registro em `docs/IMAGENS.md`

Acrescente uma linha por imagem aprovada na seção “Edição 02 · Studio”:

```markdown
| CAST-SC-01-ROSTO-FRENTE | 2026-11-01 | Codex image generation | 1 tentativa | Aprovada: identidade âncora, luz uniforme. |
```

Se o prompt final tiver uma linha `CORRECTION`, copie-a na observação. Não declare teste de vídeo: estas são imagens estáticas.

## 9. Pedidos vindos do Studio

Na etapa **Entrega** do Studio, “Pedido para o Codex” exporta um Markdown com os keyframes de qualquer cena criada pelo usuário. Esses arquivos seguem o mesmo protocolo, mas são salvos como `incoming/projects/<slug>/sNN-a.png` (e `-b`), e a ingestão os publica em `assets/projects/<slug>/`. Se o pedido envolver pessoa real, siga a seção 7.
