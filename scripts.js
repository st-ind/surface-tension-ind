// ── Mobile nav ──
;(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('button');
    backdrop.className = 'nav-backdrop';
    backdrop.type = 'button';
    backdrop.setAttribute('aria-label', 'Закрыть меню');
    document.body.appendChild(backdrop);
  }

  function closeMenu() {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
  }

  function openMenu() {
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Закрыть меню');
  }

  toggle.addEventListener('click', () => {
    document.body.classList.contains('nav-open') ? closeMenu() : openMenu();
  });

  backdrop.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

// ── Nav: in-page sections dropdown ──
;(function () {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  if (!dropdowns.length) return;

  function closeAll(except) {
    dropdowns.forEach(d => {
      if (d === except) return;
      d.classList.remove('open');
      const btn = d.querySelector('.nav-drop-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach(drop => {
    const btn = drop.querySelector('.nav-drop-btn');
    const panel = drop.querySelector('.nav-drop-menu');
    if (!btn || !panel) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = drop.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) closeAll(drop);
    });

    panel.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeAll());
    });
  });

  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAll();
  });
})();

// ── Orb parallax + float (all in JS) ──
;(function () {
  const cfg = [
    { sel: '.orb-1', px: 0.07,  py: 0.04,  fAmp: 30, fSpd: 0.00065, fPh: 0 },
    { sel: '.orb-2', px: -0.05, py: -0.03, fAmp: 22, fSpd: 0.00080, fPh: 2.1 },
    { sel: '.orb-3', px: 0.03,  py: 0.055, fAmp: 18, fSpd: 0.00055, fPh: 4.3 },
  ];

  const orbs = cfg.map(c => ({
    el: document.querySelector(c.sel),
    ...c, cx: 0, cy: 0
  })).filter(o => o.el);

  if (!orbs.length) return;

  let mX = 0, mY = 0;
  window.addEventListener('mousemove', e => {
    mX = (e.clientX / window.innerWidth  - 0.5);
    mY = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  function frame(t) {
    orbs.forEach(o => {
      // lerp toward mouse target
      o.cx += (mX * window.innerWidth  * o.px - o.cx) * 0.05;
      o.cy += (mY * window.innerHeight * o.py - o.cy) * 0.05;
      // sinusoidal float offset
      const fy = Math.sin(t * o.fSpd + o.fPh) * o.fAmp;
      o.el.style.transform = `translate(${o.cx.toFixed(1)}px, ${(o.cy + fy).toFixed(1)}px)`;
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// ── FAQ accordion ──
function toggle(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Card spotlight (all card types) ──
document.querySelectorAll('.ind-card, .pat-card, .free-card, .tpo-card, .how-card, .suite-card, .inc-card, .feat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
});

// ── TPO periods preview ──
const tpoColors = [
  '#E07040','#C85A20','#1A9E78','#B8861E','#7B5EA7','#2A8CB8',
  '#C84040','#E08030','#6AAE6A','#D4A030','#8066B8','#3890B0',
  '#D06030','#E09050','#4A9E68','#C89820','#9070C0','#2898C0',
  '#B85030','#E07838','#5AA060','#B88C18','#A078CC','#3090B8',
  '#A84828','#D87030'
];
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const tpoContainer = document.getElementById('tpoPeriods');
if (tpoContainer) {
  letters.forEach((letter, i) => {
    const block = document.createElement('div');
    block.className = 'tpo-pd';
    block.textContent = letter;
    block.style.background = tpoColors[i % tpoColors.length] + 'dd';
    block.style.opacity = '0';
    block.style.transition = 'opacity 0.25s';
    tpoContainer.appendChild(block);
    setTimeout(() => { block.style.opacity = '1'; }, 150 + i * 40);
  });
}
