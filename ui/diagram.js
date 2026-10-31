// Camera previews for the Studio. Pure functions: numbers in, SVG out. Only
// internal numeric state and labels from fixed tables are rendered.
import {shotSizes, heights, focusTargets, coverOf, actions, moveControls} from '../data/studio.js';
import {escapeHTML as esc} from './html.js';

const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
const rad = d => d * Math.PI / 180;
const f2 = n => Number(n).toFixed(2);
const aspect = {'9:16': 9 / 16, '4:5': 4 / 5, '1:1': 1, '16:9': 16 / 9};
const planWidthMM = {'9:16': 20.25, '4:5': 24, '1:1': 24, '16:9': 36};
const centers = {ecu: 1.2, cu: 1.6, mcu: 1.47, ms: 1.32, mls: 1.12, fs: 0.92, ws: 0.95, ews: 1.2};

/** Interpolated camera state for a compiled shot at progress t (0–1). */
export function cameraState(shot, t) {
  const k = ease(Math.max(0, Math.min(1, t)));
  const orbit = ['orbit', 'arc-push'].includes(shot.move) ? shot.degrees : 0;
  const zoom = shot.move === 'zoom';
  const distance = zoom ? shot.distance.start : shot.move === 'crane' ? lerp(shot.distance.start, shot.distance.start * 1.25, k) : lerp(shot.distance.start, shot.distance.end, k);
  const subjectTurn = (shot.move === 'turntable' ? shot.degrees : 0) + (actions[shot.action]?.rotation || 0);
  const panSpan = shot.move === 'pan' ? (shot.degrees || 15) : 0;
  const lateral = shot.move === 'truck' ? lerp(.7, -.7, k) : 0;
  const track = shot.move === 'tracking' ? lerp(-.6, .6, k) : 0;
  const heightStart = heights[shot.height].m;
  const heightEnd = moveControls[shot.move]?.heightEnd ? heights[shot.heightEnd].m : heightStart;
  return {
    k, distance, lateral, track,
    angle: shot.angle + orbit * k,
    lens: zoom ? lerp(shot.lens, shot.lens * coverOf(shot.sizeStart) / coverOf(shot.sizeEnd), k) : shot.lens,
    aim: (k - .5) * panSpan,
    subject: subjectTurn * k,
    height: lerp(heightStart, heightEnd, k),
    cover: lerp(coverOf(shot.sizeStart), coverOf(shot.sizeEnd), k),
    size: k < .5 ? shot.sizeStart : shot.sizeEnd
  };
}

const ringRadius = d => 18 + 40 * Math.log2(1 + d);

/** Top-down plan: subject at centre, camera path, field of view and rings in metres. */
export function planSVG(shot, t, format) {
  const s = cameraState(shot, t);
  const cx = 160, cy = 132;
  const polar = (angle, d, offset = 0) => {
    const r = ringRadius(d);
    const a = rad(angle);
    return [cx + Math.sin(a) * r + Math.cos(a) * offset * 26, cy + Math.cos(a) * r - Math.sin(a) * offset * 26];
  };
  const start = cameraState(shot, 0), end = cameraState(shot, 1);
  let path = '';
  if (['orbit', 'arc-push'].includes(shot.move) && shot.degrees) {
    const steps = 28;
    path = Array.from({length: steps + 1}, (_, i) => { const st = cameraState(shot, i / steps); return polar(st.angle, st.distance).map(f2).join(','); }).join(' ');
  } else {
    const a = polar(start.angle, start.distance, start.lateral + start.track), b = polar(end.angle, end.distance, end.lateral + end.track);
    path = `${f2(a[0])},${f2(a[1])} ${f2(b[0])},${f2(b[1])}`;
  }
  const [x, y] = polar(s.angle, s.distance, s.lateral + s.track);
  const subjectX = cx + Math.cos(rad(s.angle)) * s.track * 26, subjectY = cy - Math.sin(rad(s.angle)) * s.track * 26;
  // Camera looks toward the subject, plus any pan offset.
  const look = Math.atan2(subjectX - x, subjectY - y) + rad(s.aim);
  const half = Math.atan(planWidthMM[format] / 2 / s.lens);
  const reach = Math.hypot(subjectX - x, subjectY - y) + 34;
  const ray = a => [x + Math.sin(a) * reach, y + Math.cos(a) * reach];
  const [l1, l2] = [ray(look - half), ray(look + half)];
  const ghost = ([gx, gy]) => `<circle cx="${f2(gx)}" cy="${f2(gy)}" r="5" class="plan-ghost"/>`;
  const facing = rad(s.subject);
  const nose = [subjectX + Math.sin(facing) * 15, subjectY + Math.cos(facing) * 15];
  const rings = [1, 2, 4, 8].map(d => `<circle cx="${cx}" cy="${cy}" r="${f2(ringRadius(d))}" class="plan-ring"/><text x="${cx + 4}" y="${f2(cy - ringRadius(d) - 3)}" class="plan-tick">${d} m</text>`).join('');
  const turn = shot.move === 'turntable' || actions[shot.action]?.rotation ? `<path d="M${cx - 24} ${cy - 6} A 24 24 0 1 1 ${cx - 6} ${cy + 23}" class="plan-turn"/>` : '';
  return `<svg viewBox="0 0 320 300" role="img" aria-label="Planta vista de cima: câmera a ${s.distance.toFixed(1).replace('.', ',')} metros do sujeito"><rect width="320" height="300" class="plan-bg"/>${rings}<line x1="${cx}" y1="8" x2="${cx}" y2="292" class="plan-axis"/><line x1="8" y1="${cy}" x2="312" y2="${cy}" class="plan-axis"/><polygon points="${f2(x)},${f2(y)} ${f2(l1[0])},${f2(l1[1])} ${f2(l2[0])},${f2(l2[1])}" class="plan-fov"/>${shot.move === 'static' && !turn ? '' : `<polyline points="${path}" class="plan-path"/>`}${ghost(polar(start.angle, start.distance, start.lateral + start.track))}${ghost(polar(end.angle, end.distance, end.lateral + end.track))}${turn}<g class="plan-subject"><ellipse cx="${f2(subjectX)}" cy="${f2(subjectY)}" rx="13" ry="7" transform="rotate(${f2(-s.subject)} ${f2(subjectX)} ${f2(subjectY)})"/><circle cx="${f2(subjectX)}" cy="${f2(subjectY)}" r="5.5"/><line x1="${f2(subjectX)}" y1="${f2(subjectY)}" x2="${f2(nose[0])}" y2="${f2(nose[1])}"/></g><g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(-look * 180 / Math.PI)})" class="plan-camera"><rect x="-7" y="-9" width="14" height="12" rx="2"/><rect x="-4" y="3" width="8" height="5" rx="1"/></g><text x="12" y="290" class="plan-tick">FRENTE DO SUJEITO ↓ · ${Math.round(s.lens)}mm</text></svg>`;
}

/** Side elevation: camera height and line of sight to the focus point. */
export function sideSVG(shot, t) {
  const s = cameraState(shot, t);
  const ground = 104, scale = 40, subjectX = 262;
  const camX = subjectX - Math.min(6.5, Math.max(.3, s.distance)) * 34;
  const camY = ground - s.height * scale;
  const focusY = ground - focusTargets[shot.focus].y * scale;
  const ticks = Object.values(heights).filter(h => h.m <= 2.3).map(h => `<line x1="10" x2="16" y1="${f2(ground - h.m * scale)}" y2="${f2(ground - h.m * scale)}" class="plan-axis"/>`).join('');
  return `<svg viewBox="0 0 320 120" role="img" aria-label="Vista lateral: câmera a ${s.height.toFixed(1).replace('.', ',')} metros de altura"><rect width="320" height="120" class="plan-bg"/>${ticks}<line x1="0" y1="${ground}" x2="320" y2="${ground}" class="plan-ground"/><line x1="${f2(camX)}" y1="${f2(camY)}" x2="${subjectX}" y2="${f2(focusY)}" class="plan-sight"/><g class="side-figure"><circle cx="${subjectX}" cy="${f2(ground - 1.62 * scale)}" r="4.4"/><path d="M${subjectX} ${f2(ground - 1.5 * scale)}V${f2(ground - .9 * scale)}M${subjectX - 9} ${f2(ground - 1.38 * scale)}H${subjectX + 9}M${subjectX} ${f2(ground - .9 * scale)}L${subjectX - 6} ${ground}M${subjectX} ${f2(ground - .9 * scale)}L${subjectX + 6} ${ground}"/></g><line x1="${f2(camX)}" y1="${ground}" x2="${f2(camX)}" y2="${f2(camY)}" class="plan-axis"/><g class="plan-camera" transform="translate(${f2(camX)} ${f2(camY)})"><rect x="-8" y="-6" width="16" height="12" rx="2"/></g><text x="22" y="16" class="plan-tick">ALTURA ${s.height.toFixed(1).replace('.', ',')} m · ${esc(heights[shot.height].label.toUpperCase())}</text></svg>`;
}

/** What the lens sees: the frame rectangle over a 1,75 m figure, interpolated from start to end. */
export function framingSVG(shot, t, format) {
  const s = cameraState(shot, t);
  const scale = 128, base = 286, mid = 130;
  const tight = size => size === 'ecu' || (size === 'cu' && shot.focus !== 'face');
  const center = size => tight(size) ? focusTargets[shot.focus].y : centers[size];
  const cy = lerp(center(shot.sizeStart), center(shot.sizeEnd), s.k);
  const h = s.cover * scale, w = h * aspect[format];
  const fx = mid - w / 2, fy = base - cy * scale - h / 2;
  const Y = m => f2(base - m * scale);
  // Seen from behind when the camera sits more than 135° away from where the subject faces.
  const back = Math.abs((((s.angle - s.subject) % 360) + 540) % 360 - 180) >= 135;
  const figure = `<g class="frame-figure"><circle cx="${mid}" cy="${Y(1.62)}" r="${f2(.105 * scale)}"/><path d="M${mid - 5} ${Y(1.52)}h10v${f2(.06 * scale)}h-10z"/><path d="M${f2(mid - .2 * scale)} ${Y(1.44)}Q${mid} ${Y(1.49)} ${f2(mid + .2 * scale)} ${Y(1.44)}L${f2(mid + .15 * scale)} ${Y(1.02)}L${f2(mid + .25 * scale)} ${Y(.42)}L${f2(mid - .25 * scale)} ${Y(.42)}L${f2(mid - .15 * scale)} ${Y(1.02)}Z"/><path d="M${f2(mid - .2 * scale)} ${Y(1.43)}L${f2(mid - .27 * scale)} ${Y(.95)}M${f2(mid + .2 * scale)} ${Y(1.43)}L${f2(mid + .27 * scale)} ${Y(.95)}M${f2(mid - .07 * scale)} ${Y(.42)}L${f2(mid - .08 * scale)} ${Y(.02)}M${f2(mid + .07 * scale)} ${Y(.42)}L${f2(mid + .08 * scale)} ${Y(.02)}" class="frame-limbs"/></g>`;
  const mask = `<path class="frame-mask" fill-rule="evenodd" d="M-400 -400H660V700H-400Z M${f2(fx)} ${f2(fy)}h${f2(w)}v${f2(h)}h${f2(-w)}Z"/>`;
  const grid = [1, 2].map(i => `<line x1="${f2(fx + w * i / 3)}" x2="${f2(fx + w * i / 3)}" y1="${f2(fy)}" y2="${f2(fy + h)}" class="frame-third"/><line y1="${f2(fy + h * i / 3)}" y2="${f2(fy + h * i / 3)}" x1="${f2(fx)}" x2="${f2(fx + w)}" class="frame-third"/>`).join('');
  return `<svg viewBox="0 0 260 300" role="img" aria-label="Enquadramento ${esc(shotSizes[s.size].label)} sobre uma figura de 1,75 metro"><rect width="260" height="300" class="plan-bg"/><line x1="0" y1="${base}" x2="260" y2="${base}" class="plan-ground"/>${figure}${mask}<rect x="${f2(fx)}" y="${f2(fy)}" width="${f2(w)}" height="${f2(h)}" class="frame-rect"/>${grid}<text x="10" y="18" class="plan-tick">${esc(shotSizes[shot.sizeStart].abbr)} → ${esc(shotSizes[shot.sizeEnd].abbr)} · ${format}</text>${back ? '<text x="10" y="34" class="plan-tick accent-tick">VISTA DE COSTAS</text>' : ''}</svg>`;
}

/** Fully static, meaningful placeholder for images the queue has not produced yet. */
export function placeholderSVG({label, id, ratio = '2:3', person = true}) {
  const [w, h] = ratio === '3:2' ? [300, 200] : ratio === '1:1' ? [240, 240] : [200, 300];
  const cx = w / 2, by = h * .9, sc = h * .45;
  const figure = person ? `<g class="ph-figure"><circle cx="${cx}" cy="${f2(by - sc * 1.62)}" r="${f2(sc * .1)}"/><path d="M${f2(cx - sc * .2)} ${f2(by - sc * 1.43)}Q${cx} ${f2(by - sc * 1.49)} ${f2(cx + sc * .2)} ${f2(by - sc * 1.43)}L${f2(cx + sc * .26)} ${f2(by - sc * .42)}L${f2(cx - sc * .26)} ${f2(by - sc * .42)}Z"/></g>` : `<g class="ph-figure"><rect x="${f2(cx - w * .16)}" y="${f2(h * .35)}" width="${f2(w * .32)}" height="${f2(h * .4)}" rx="3"/></g>`;
  return `<svg class="ph" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}: imagem aguardando geração"><rect width="${w}" height="${h}" class="ph-bg"/><path d="M12 28V12h16M${w - 28} 12h16v16M12 ${h - 28}v16h16M${w - 28} ${h - 12}h16v-16" class="ph-marks"/>${figure}<text x="${cx}" y="${f2(h * .1 + 14)}" text-anchor="middle" class="ph-title">AGUARDANDO GERAÇÃO</text><text x="${cx}" y="${h - 18}" text-anchor="middle" class="ph-id">${esc(id)}</text></svg>`;
}

/** Top-down lighting plan for an art direction. */
export function lightingSVG(direction) {
  const cx = 170, cy = 120, k = 34;
  const colors = {key: 'light-key', fill: 'light-fill', rim: 'light-rim', bg: 'light-bg', practical: 'light-practical', sun: 'light-sun', flash: 'light-key', bounce: 'light-bounce', window: 'light-sun'};
  const items = direction.setup.map((l, i) => {
    const x = cx + l.x * k, y = cy + l.y * k;
    const angle = Math.atan2(cx - x, cy - y) * 180 / Math.PI;
    return `<g class="${colors[l.kind]}"><line x1="${f2(x)}" y1="${f2(y)}" x2="${cx}" y2="${cy}" class="light-ray"/><rect x="${f2(x - 9)}" y="${f2(y - 5)}" width="18" height="10" rx="2" transform="rotate(${f2(-angle)} ${f2(x)} ${f2(y)})"/><text x="${f2(x)}" y="${f2(y + (l.y >= 0 ? 20 : -12))}" text-anchor="middle" class="plan-tick">${i + 1}</text></g>`;
  }).join('');
  return `<svg viewBox="0 0 340 240" role="img" aria-label="Planta de luz de ${esc(direction.name)}, vista de cima"><rect width="340" height="240" class="plan-bg"/>${[1, 2, 3].map(m => `<circle cx="${cx}" cy="${cy}" r="${m * k}" class="plan-ring"/>`).join('')}${items}<g class="plan-subject"><ellipse cx="${cx}" cy="${cy}" rx="12" ry="7"/><circle cx="${cx}" cy="${cy}" r="5"/></g><g class="plan-camera" transform="translate(${cx} ${cy + 3.2 * k})"><rect x="-8" y="-6" width="16" height="12" rx="2"/></g><text x="${cx + 14}" y="${f2(cy + 3.2 * k + 4)}" class="plan-tick">CÂMERA</text><text x="10" y="232" class="plan-tick">ANÉIS DE 1 m · VISTA DE CIMA</text></svg>`;
}
