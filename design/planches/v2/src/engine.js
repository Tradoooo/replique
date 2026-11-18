// Reveal-on-scroll + replay toggle. Reduced motion: everything visible at once.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rv = [...document.querySelectorAll('.rv')];
  if (reduce || !('IntersectionObserver' in window)) rv.forEach(e => e.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
    rv.forEach(e => io.observe(e));
  }
  // What-if toggle (P4): swaps baseline / what-if, state written in text, keyboard-operable.
  const btn = document.querySelector('[data-whatif-btn]');
  if (btn) btn.addEventListener('click', () => {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(on));
    document.querySelectorAll('[data-run]').forEach(el => { el.hidden = (el.dataset.run === 'whatif') !== on; });
    btn.textContent = on ? 'Show baseline' : 'Pull the what-if: tid 402 → prio 20';
  });
})();
