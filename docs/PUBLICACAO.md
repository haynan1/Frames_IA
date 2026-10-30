# Publicação no GitHub Pages

O destino solicitado é um repositório **público** com GitHub Pages. Não se usa hospedagem Sites ou qualquer plano pago como substituição.

## Preparação

`npm run check` precisa passar. Confira que `dist/` não contém PDFs, `.work/`, arquivos de ambiente ou credenciais. O workflow gera o site a partir dos fontes rastreados.

## Publicação assistida

`scripts/publish.ps1` valida os arquivos, consulta o usuário autenticado no GitHub CLI, inicializa Git quando necessário, cria um commit dos arquivos explícitos do projeto, cria o repositório público `direcao_de_arte_com_IA` e envia `main`.

Se esse repositório já existir, o script encerra antes de alterar seu conteúdo: o colaborador deve inspecionar a origem e decidir como integrar, sem sobrescrever trabalho remoto. Uma origem existente também exige inspeção prévia em vez de substituição automática.

Após o push, a API de Pages deve ser ativada com `build_type=workflow`. Se a conta não permitir, a seleção fica em **Settings → Pages → Source → GitHub Actions**. O script relança o workflow depois da ativação.

## Autenticação

Na sessão inicial, uma restrição de rede fez a checagem local de autenticação falhar. Uma nova checagem com acesso à rede confirmou sessão válida da conta `haynan1`. A publicação foi adiada por escolha explícita do usuário. Nenhum repositório remoto foi criado ou modificado.

O conector do aplicativo conseguiu ler o perfil, mas suas ferramentas disponíveis não incluem criação de repositório ou configuração do Pages. O script usa o GitHub CLI autenticado. Se uma execução restrita voltar a falhar, distinguir acesso de rede de credencial inválida antes de pedir novo login.

Faça login pela interface oficial do GitHub CLI ou GitHub; não cole tokens no chat, README ou arquivos. Após o login, o mesmo projeto pode ser publicado sem reconstrução da arquitetura.

## Evidência de sucesso

1. Repositório remoto existe e está público.
2. O commit publicado corresponde aos arquivos validados.
3. Workflow `Validate and deploy GitHub Pages` passa nos jobs `build` e `deploy`.
4. A API de Pages informa o endereço HTTPS e a página abre sem erro.

Não apresentar endereço presumido como site publicado. Uma URL de prévia local também não é uma implantação pública.
