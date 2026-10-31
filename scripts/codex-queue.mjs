import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {imageRequests, queueStats, isGenerated, isDone, needsRedo} from '../data/image-requests.js';

const code = value => `\`${value}\``;
const fence = '```';
const status = r => needsRedo(r) ? `**refazer (${r.revision})**` : isDone(r) ? 'gerada' : 'pendente';

/** Writes docs/codex/fila.json (for scripts) and FILA-DE-IMAGENS.md (for people and agents). */
export async function writeCodexQueue(root) {
  const dir = resolve(root, 'docs/codex');
  await mkdir(dir, {recursive: true});
  const stats = queueStats();
  const requests = imageRequests.map(({id, group, priority, wave, title, target, incoming, size, references, dependsOn, revision}) => ({id, group, priority, wave, title, target, incoming, size, references, dependsOn, generated: isGenerated(target), ...(revision ? {revision, done: isDone({target, revision})} : {done: isGenerated(target)})}));
  await writeFile(resolve(dir, 'fila.json'), `${JSON.stringify({generatedFrom: 'data/image-requests.js', total: stats.total, requests}, null, 2)}\n`);
  const table = imageRequests.map((r, i) => `| ${i + 1} | ${code(r.id)} | ${r.priority} | ${r.wave} | ${r.size} | ${code(r.target)} | ${status(r)} |`).join('\n');
  const redo = imageRequests.filter(needsRedo);
  const redoSection = redo.length ? [
    '## Refazer primeiro', '',
    'Estas imagens foram geradas, mas reprovaram na revisão. Gere de novo com o prompt do item (a última linha `CORRECTION` diz o que mudar), anexe as mesmas referências (a versão atual serve só para comparar, nunca como referência), salve com o mesmo nome em `incoming/` e rode a ingestão. A versão antiga fica no site até a nova ser ingerida.', '',
    ...redo.map(r => `- ${code(r.id)} · revisão ${r.revision}: ${r.revisionReason}`), ''
  ] : [];
  const details = imageRequests.map(r => [
    `## ${r.id}`, '',
    `${r.title} · ${r.group} · ${r.priority} · onda ${r.wave}${needsRedo(r) ? ` · **refazer (${r.revision})**` : ''}`, '',
    ...(needsRedo(r) ? [`- Motivo da refação: ${r.revisionReason}`, `- Comparar com a versão atual: ${code(r.target)}`] : []),
    `- Salvar como: ${code(r.incoming)}`,
    `- Destino: ${code(r.target)} (${r.size})`,
    `- Anexar: ${r.references.length ? r.references.map(code).join(', ') : 'nenhuma (imagem âncora)'}`,
    ...(r.dependsOn.length ? [`- Depende de: ${r.dependsOn.map(code).join(', ')}`] : []),
    '- Aceite:', ...r.accept.map(a => `  - ${a}`), '',
    `${fence}text`, r.prompt, fence
  ].join('\n')).join('\n\n');
  const markdown = [
    '# Fila de imagens · FRAME Studio', '',
    `Gerado por ${code('npm run build')} a partir de ${code('data/image-requests.js')} e ${code('data/image-revisions.js')}. Não edite à mão.`, '',
    `**${stats.done}/${stats.total} concluídas**${stats.redo ? ` · **${stats.redo} para refazer**` : ''} · P0: ${stats.p0Done}/${stats.p0}. Siga a ordem da tabela (prioridade, depois onda). Protocolo completo: [IMAGENS-CODEX.md](IMAGENS-CODEX.md).`, '',
    ...redoSection,
    '| # | ID | Prioridade | Onda | Tamanho | Destino | Status |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    table, '', details, ''
  ].join('\n');
  await writeFile(resolve(dir, 'FILA-DE-IMAGENS.md'), markdown);
}
