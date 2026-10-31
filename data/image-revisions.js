// Images that were generated but failed review. A revision reopens its request: the queue shows it as
// "refazer", the prompt gains the correction line, and the request counts as done again only when
// ingestion registers an image carrying this revision id. The old image stays on the site until then.
export const imageRevisions = {
  'DIR-ESTUDIO-SARCENET-PLATE': {
    id: 'R1',
    since: '2026-10-31',
    reason: 'A parede encontra o chão numa linha de horizonte nítida. O padrão da loja exige fundo infinito em curva, sem horizonte (manual 14, §2 e §7).',
    correction: 'CORRECTION: The wall meets the floor in a hard horizontal line. The backdrop must be ONE continuous sheet of paper that sweeps softly from wall to floor like a cyclorama: the transition is a smooth tonal gradient with no visible edge, seam, crease or horizon line anywhere in the frame. Keep the colours, the soft light falloff toward the upper right, the fine paper grain and the empty set identical to the previous attempt.',
    accept: 'Nenhuma linha de horizonte: parede e chão formam uma curva contínua, só com gradiente de tom.'
  }
};
