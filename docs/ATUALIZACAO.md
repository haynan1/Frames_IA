# Protocolo de atualização

Última revisão editorial: **2026-10-30**. Datas no formato ISO, independentemente do fuso do executor.

1. Abra a página oficial do fabricante e confira nome, família e identificador. Não use só snippets, posts afiliados ou o nome do agregador.
2. Separe **modelo**, **plataforma**, **preset**, **modo de entrada** e **ferramenta de acabamento**.
3. Confira no provedor da conta: região, acesso, proporção, resolução, duração, áudio, referências, edição, preço e direitos comerciais. Não presuma equivalência entre API e interface.
4. Atualize `tools` em `data/content.js`: nome, função, limite, URL e data. Atualize `reviewedAt` somente quando a revisão correspondente for real. Preserve a última data de itens não revistos.
5. Registre alterações no `CHANGELOG.md`. Não atualize apenas a data para fazer parecer recente.
6. Para afirmar desempenho, teste a mesma cena com as mesmas referências e um orçamento comparável. Adapte apenas a sintaxe necessária; registre várias tentativas, rejeições e custo por tomada aprovada.
7. Rejeite falhas críticas de produto, anatomia e operação antes de uma nota agregada. Separe **alegação do fabricante**, **hipótese editorial** e **resultado observado**.
8. Rode `npm run check`, faça a revisão de navegador descrita em `VALIDACAO.md` e publique via revisão normal.

## Modelo de registro de teste

```text
Data:
Responsável:
Ferramenta e provedor:
Modelo / identificador exato:
Modo (texto→vídeo, imagem→vídeo, edição):
Referências e versões:
Prompt literal:
Configurações reais:
Tentativas:
Tempo total:
Custo total / moeda / data:
Planos aprovados:
Falhas críticas e timestamps:
Fidelidade / movimento / continuidade (1–5):
Hipótese e conclusão limitada ao teste:
Fonte dos termos de uso / data:
```

Esta rotina é manual; não há monitor periódico ou automação de pesquisa habilitada neste projeto.
