import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {imageRequests, queueStats, isGenerated} from '../data/image-requests.js';

const code = value => `\`${value}\``;
const fence = '```';

/** Writes docs/codex/fila.json (for scripts) and FILA-DE-IMAGENS.md (for people and agents). */
export async function writeCodexQueue(root) {
  const dir = resolve(root, 'docs/codex');
  await mkdir(dir, {recursive: true});
  const stats = queueStats();
  const requests = imageRequests.map(({id, group, priority, wave, title, target, incoming, size, references, dependsOn}) => ({id, group, priority, wave, title, target, incoming, size, references, dependsOn, generated: isGenerated(target)}));
  await writeFile(resolve(dir, 'fila.json'), `${JSON.stringify({generatedFrom: 'data/image-requests.js', total: stats.total, requests}, null, 2)}\n`);
  const table = imageRequests.map((r, i) => `| ${i + 1} | ${code(r.id)} | ${r.priority} | ${r.wave} | ${r.size} | ${code(r.target)} | ${isGenerated(r.target) ? 'gerada' : 'pendente'} |`).join('\n');
  const details = imageRequests.map(r => [
    `## ${r.id}`, '',
    `${r.title} · ${r.group} · ${r.priority} · onda ${r.wave}`, '',
    `- Salvar como: ${code(r.incoming)}`,
    `- Destino: ${code(r.target)} (${r.size})`,
    `- Anexar: ${r.references.length ? r.references.map(code).join(', ') : 'nenhuma (imagem âncora)'}`,
    ...(r.dependsOn.length ? [`- Depende de: ${r.dependsOn.map(code).join(', ')}`] : []),
    '- Aceite:', ...r.accept.map(a => `  - ${a}`), '',
    `${fence}text`, r.prompt, fence
  ].join('\n')).join('\n\n');
  const markdown = [
    '# Fila de imagens · FRAME Studio', '',
    `Gerado por ${code('npm run build')} a partir de ${code('data/image-requests.js')}. Não edite à mão.`, '',
    `**${stats.done}/${stats.total} geradas** · P0: ${stats.p0Done}/${stats.p0}. Siga a ordem da tabela (prioridade, depois onda). Protocolo completo: [IMAGENS-CODEX.md](IMAGENS-CODEX.md).`, '',
    '| # | ID | Prioridade | Onda | Tamanho | Destino | Status |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    table, '', details, ''
  ].join('\n');
  await writeFile(resolve(dir, 'FILA-DE-IMAGENS.md'), markdown);
}
