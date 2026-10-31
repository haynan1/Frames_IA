$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Set-Location -LiteralPath $projectRoot

function Assert-Exit([string]$message) {
    if ($LASTEXITCODE -ne 0) { throw $message }
}

Get-Command gh, git, node, npm -ErrorAction Stop | Out-Null
gh auth status
Assert-Exit 'Autenticação do GitHub indisponível. Execute gh auth login e depois tente novamente.'
$owner = (gh api user --jq '.login').Trim()
Assert-Exit 'Não foi possível confirmar a conta do GitHub.'
$repoName = 'direcao_de_arte_com_IA'
$fullName = "$owner/$repoName"

gh repo view $fullName --json name 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    throw "O repositório $fullName já existe. Inspecione-o antes de integrar; este script não sobrescreve repositórios."
}

npm run check
Assert-Exit 'Verificação falhou. Nada foi publicado.'

if (Test-Path -LiteralPath '.git') {
    $remote = git remote get-url origin 2>$null
    if ($LASTEXITCODE -eq 0) { throw "Já existe uma origem Git: $remote. Inspecione antes de publicar." }
    $branch = (git branch --show-current).Trim()
    Assert-Exit 'Não foi possível ler a branch.'
    if ($branch -ne 'main') { throw 'Publique a partir de main ou integre as alterações antes de continuar.' }
} else {
    git init -b main
    Assert-Exit 'Não foi possível inicializar Git.'
}

$publishFiles = @('index.html', 'styles.css', 'app.js', 'package.json', 'README.md', 'LICENSE', 'AGENTS.md', 'CONTRIBUTING.md', 'CHANGELOG.md', '.gitignore', '.github', 'assets', 'data', 'ui', 'docs', 'scripts', 'tests')
git add -- $publishFiles
Assert-Exit 'Não foi possível preparar os arquivos públicos.'
git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
    git commit -m 'Build FRAME art direction library and GitHub Pages site'
    Assert-Exit 'Commit falhou. Verifique nome e email configurados no Git.'
}

gh repo create $fullName --public --source . --remote origin --push --description 'Biblioteca visual e laboratório de direção de arte para criativos e vídeos com IA'
Assert-Exit 'Criação ou envio falhou. Inspecione o estado remoto antes de repetir.'

gh api --method POST "repos/$fullName/pages" -f build_type=workflow
if ($LASTEXITCODE -ne 0) {
    Write-Warning 'Código enviado. Ative Settings > Pages > Source > GitHub Actions e execute o workflow.'
    exit 1
}
gh workflow run pages.yml --repo $fullName
Assert-Exit 'Pages ativado. Execute o workflow pela aba Actions para concluir.'
Write-Output "Repositório: https://github.com/$fullName"
Write-Output 'Acompanhe build e deploy na aba Actions. Publicação só está concluída após deploy com sucesso.'
