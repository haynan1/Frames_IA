// One stroke icon family (24px grid, 1.6 stroke, round joins). Decorative by
// default: callers provide the accessible name on the surrounding control.
const paths = {
  home: '<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v11.5h13V9"/><path d="M10 20.5v-6h4v6"/>',
  studio: '<rect x="3.5" y="10" width="17" height="10.5" rx="1.5"/><path d="m3.6 10 1.3-5.2 15.4 3.8-.4 1.4"/><path d="m8.6 5.9 1.8 3.6M13.6 7.1l1.8 3.6"/>',
  cast: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20c.9-3.5 3.3-5.4 6.2-5.4s5.3 1.9 6.2 5.4"/><path d="M15.6 4.8a3.4 3.4 0 0 1 0 6.4M17.7 14.9c1.8.7 3 2.4 3.5 5.1"/>',
  aperture: '<circle cx="12" cy="12" r="8.5"/><path d="m14.4 3.8-4.6 8M20.2 9.6h-9.2M18.1 17.9l-4.6-8M9.6 20.2l4.6-8M3.8 14.4H13M5.9 6.1l4.6 8"/>',
  queue: '<rect x="3.5" y="7" width="13" height="13.5" rx="1.5"/><path d="M7.5 3.5h11.5a1.5 1.5 0 0 1 1.5 1.5v11.5"/><path d="m3.5 16 3.8-3.8 3.7 3.7 2-2 3.5 3.5"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/>',
  video: '<rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="m15.5 10.4 6-3.4v10l-6-3.4"/>',
  text: '<path d="M4 5.5h16M4 10.5h16M4 15.5h10M4 20h6.5"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1z"/>',
  book: '<path d="M4.5 5A1.5 1.5 0 0 1 6 3.5h13.5v14.5H6a1.5 1.5 0 0 0-1.5 1.5z"/><path d="M4.5 19.5A1.5 1.5 0 0 0 6 21h13.5v-3"/>',
  film: '<rect x="3.5" y="3.5" width="17" height="17" rx="1.5"/><path d="M7.5 3.5v17M16.5 3.5v17M3.5 8h4M3.5 12h4M3.5 16h4M16.5 8h4M16.5 12h4M16.5 16h4"/>',
  sliders: '<path d="M4 6.5h9M17 6.5h3M4 12h3M11 12h9M4 17.5h11M19 17.5h1"/><circle cx="15" cy="6.5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17.5" r="2"/>',
  chip: '<rect x="6.5" y="6.5" width="11" height="11" rx="1.5"/><path d="M9.5 2.5v4M14.5 2.5v4M9.5 17.5v4M14.5 17.5v4M2.5 9.5h4M2.5 14.5h4M17.5 9.5h4M17.5 14.5h4"/>',
  check: '<circle cx="12" cy="12" r="8.5"/><path d="m8.2 12.4 2.6 2.6 5-5.6"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  copy: '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="1.5"/><path d="M15.5 8.5V5.5A1.5 1.5 0 0 0 14 4H5.5A1.5 1.5 0 0 0 4 5.5V14a1.5 1.5 0 0 0 1.5 1.5h3"/>',
  download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 20h14"/>',
  upload: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 20h14"/>',
  play: '<path d="M8 5.5v13l10-6.5z"/>',
  pause: '<path d="M9 5.5v13M15 5.5v13"/>',
  left: '<path d="m14.5 6-6 6 6 6"/>',
  right: '<path d="m9.5 6 6 6-6 6"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  duplicate: '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="1.5"/><path d="M4 15.5V5.5A1.5 1.5 0 0 1 5.5 4h10"/><path d="M14.2 11.7v5M11.7 14.2h5"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.4h.01"/>',
  sparkle: '<path d="M12 3.5c.6 4.3 2.2 5.9 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.6 5.9-2.2 6.5-6.5z"/><path d="M18.5 15.5c.3 1.8 1 2.5 2.8 2.8-1.8.3-2.5 1-2.8 2.8-.3-1.8-1-2.5-2.8-2.8 1.8-.3 2.5-1 2.8-2.8z"/>',
  camera: '<path d="M3.5 8.5A1.5 1.5 0 0 1 5 7h2.5L9 4.5h6L16.5 7H19a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18z"/><circle cx="12" cy="13" r="3.5"/>',
  sun: '<circle cx="12" cy="12" r="3.8"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5"/>',
  layers: '<path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8z"/><path d="m3.5 12 8.5 4.5 8.5-4.5"/><path d="m3.5 16 8.5 4.5 8.5-4.5"/>',
  arrow: '<path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"/>'
};

export const iconNames = Object.keys(paths);
export function icon(name, className = '') {
  return `<svg class="icon${className ? ` ${className}` : ''}" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.sparkle}</svg>`;
}
