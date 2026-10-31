# Referências privadas

Tudo nesta pasta, exceto este arquivo, é **ignorado pelo Git**. O repositório e o site são públicos: nada colocado aqui é publicado.

## Estrutura sugerida para a Sarcenet

```text
references/
└── sarcenet/
    ├── CONSENTIMENTO.md      # obrigatório para usar modelos reais
    ├── marca/                # logo, paleta, guia visual, fontes
    ├── produtos/             # fotos reais das peças: frente, costas, detalhe
    │   └── <codigo-da-peca>/
    ├── modelos/              # fotos das modelos da loja (somente com consentimento)
    │   └── <nome-ou-codigo>/
    └── lookbooks/            # campanhas anteriores, para referência de linguagem
```

## Consentimento

Para usar o rosto ou o corpo de uma modelo real como referência de IA, `CONSENTIMENTO.md` deve listar, por pessoa:

- nome ou código interno;
- autorização expressa de uso de imagem para geração com IA, com finalidade e prazo;
- data e responsável pela coleta da autorização;
- onde o documento assinado está arquivado (fora deste repositório).

Sem esse registro, use somente o elenco fictício do Studio. Imagens geradas a partir de pessoas reais ficam em `private-output/` e não vão para o site.

## Como usar no Studio

Na etapa **Peça & elenco**, escolha “Modelo própria” e informe apenas o **nome do arquivo** (ex.: `modelo-ana-frente.webp`). O Studio inclui esse nome nos prompts; o arquivo continua aqui, no seu computador.
