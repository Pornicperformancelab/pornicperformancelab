/* Pornic Performance Lab — comportements partagés (menu, filtres, formulaire) */
(() => {
  'use strict';

  /* ---- Menu mobile ---- */
  const nav = document.querySelector('.nav');
  const toggle = nav?.querySelector('.nav__toggle');
  const links = nav?.querySelector('.nav__links');

  if (nav && toggle && links) {
    const onEscape = (e) => { if (e.key === 'Escape') { setOpen(false); toggle.focus(); } };
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document[open ? 'addEventListener' : 'removeEventListener']('keydown', onEscape);
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  }

  /* ---- Filtres de la page Bilan ---- */
  const filters = document.querySelector('[data-filters]');
  if (filters) {
    const buttons = filters.querySelectorAll('button[data-filter]');
    const items = document.querySelectorAll('[data-cat]');
    const count = document.querySelector('[data-count]');
    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const cat = btn.dataset.filter;
      let n = 0;
      items.forEach((el) => {
        const show = cat === 'all' || el.dataset.cat === cat;
        el.hidden = !show;
        if (show) n += 1;
      });
      if (count) count.textContent = String(n);
    });
  }

  /* ---- Formulaire de réservation (Netlify Forms) ---- */
  const form = document.getElementById('contactForm');
  if (form) {
    const btn = form.querySelector('[type="submit"]');
    const error = document.getElementById('formError');
    const wrap = document.getElementById('formWrap');
    const done = document.getElementById('confirmation');
    const labelHTML = btn.innerHTML;

    // Les puces n'ont pas de name : leurs valeurs cochées sont jointes dans les champs cachés
    const checked = (group) =>
      Array.from(form.querySelectorAll(`[data-group="${group}"] input:checked`), (input) => input.value.trim()).join(', ');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      form.elements.objectifs.value = checked('objectifs');
      form.elements.disponibilites.value = checked('disponibilites');

      error.hidden = true;
      btn.disabled = true;
      btn.innerHTML = '<svg class="i is-spinning" aria-hidden="true"><use href="#i-loader"/></svg> Envoi en cours…';

      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString(),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        wrap.hidden = true;
        done.hidden = false;
        done.focus();
      } catch (err) {
        btn.disabled = false;
        btn.innerHTML = labelHTML;
        error.hidden = false;
      }
    });
  }
})();
