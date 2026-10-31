import {navGroups, routeById} from './routes.js';
import {icon} from './icons.js';
import {escapeHTML as esc} from './html.js';

const storageKey = 'frame-sidebar-v1';
const desktop = matchMedia('(min-width: 1024px)');
const $ = selector => document.querySelector(selector);

function readCollapsed() { try { return localStorage.getItem(storageKey) === 'collapsed'; } catch { return false; } }
function writeCollapsed(value) { try { localStorage.setItem(storageKey, value ? 'collapsed' : 'expanded'); } catch { /* preference is per visit */ } }
const typing = target => target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

function navMarkup() {
  return navGroups.map(group => `<div class="nav-group" role="group" aria-labelledby="nav-${group.id}"><span class="nav-label" id="nav-${group.id}">${esc(group.label)}</span>${group.routes.map(route => `<a href="#${route.id}" data-page="${route.id}" data-tip="${esc(route.label)}">${icon(route.icon)}<span class="nav-text">${esc(route.label)}</span>${route.badge ? `<small class="nav-badge">${esc(route.badge)}</small>` : ''}</a>`).join('')}</div>`).join('');
}

export function mountShell() {
  const shell = $('.app-shell'), sidebar = $('#sidebar'), toggle = $('#sidebar-toggle'), menu = $('#menu-button'), scrim = $('#scrim'), workspace = $('.workspace');
  $('#navigation').innerHTML = navMarkup();
  document.querySelectorAll('[data-icon]').forEach(el => { el.outerHTML = icon(el.dataset.icon); });

  function applyCollapsed(collapsed) {
    shell.dataset.sidebar = collapsed ? 'collapsed' : 'expanded';
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.querySelector('.sr-only').textContent = collapsed ? 'Expandir menu' : 'Recolher menu';
    toggle.dataset.tip = collapsed ? 'Expandir menu  [' : 'Recolher menu  [';
  }
  function setDrawer(open, {restoreFocus = true} = {}) {
    shell.classList.toggle('drawer-open', open);
    menu.setAttribute('aria-expanded', String(open));
    scrim.hidden = !open;
    workspace.inert = open;
    // preventScroll: focusing inside a sliding drawer must not scroll its containers sideways.
    if (open) (sidebar.querySelector('a[aria-current="page"]') || sidebar.querySelector('a'))?.focus({preventScroll: true});
    else if (restoreFocus && !desktop.matches) menu.focus({preventScroll: true});
  }
  applyCollapsed(readCollapsed());
  toggle.addEventListener('click', () => { const next = shell.dataset.sidebar !== 'collapsed'; applyCollapsed(next); writeCollapsed(next); });
  menu.addEventListener('click', () => setDrawer(!shell.classList.contains('drawer-open')));
  $('#drawer-close').addEventListener('click', () => setDrawer(false));
  scrim.addEventListener('click', () => setDrawer(false));
  desktop.addEventListener('change', () => { if (desktop.matches) setDrawer(false, {restoreFocus: false}); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && shell.classList.contains('drawer-open')) { event.preventDefault(); setDrawer(false); return; }
    if (event.key === '[' && !event.metaKey && !event.ctrlKey && !event.altKey && desktop.matches && !typing(event.target)) { event.preventDefault(); toggle.click(); }
    // Keep keyboard focus inside the open drawer.
    if (event.key === 'Tab' && shell.classList.contains('drawer-open')) {
      const items = [...sidebar.querySelectorAll('a,button')].filter(el => el.offsetParent !== null);
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
    }
  });
  return {
    setActive(page) {
      const route = routeById(page);
      document.querySelectorAll('[data-page]').forEach(a => { if (a.dataset.page === page) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
      $('#crumb-group').textContent = route.group.toUpperCase();
      $('#breadcrumb').textContent = route.label.toUpperCase();
      if (shell.classList.contains('drawer-open')) setDrawer(false, {restoreFocus: false});
    },
    setQueue({done, total}) {
      const pill = $('#queue-pill');
      pill.querySelector('[data-queue-count]').textContent = `${done}/${total}`;
      pill.setAttribute('aria-label', `Fila de imagens: ${done} de ${total} geradas`);
    }
  };
}
