// ── Mobile nav ──
;(function () {
  const toggle = document.querySelector('.runhead__toggle');
  const menu = document.getElementById('runhead-menu');
  if (!toggle || !menu) return;

  const isEn = document.documentElement.lang === 'en';
  const labelOpen = isEn ? 'Open menu' : 'Открыть меню';
  const labelClose = isEn ? 'Close menu' : 'Закрыть меню';

  let backdrop = document.querySelector('.runhead-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('button');
    backdrop.className = 'runhead-backdrop';
    backdrop.type = 'button';
    backdrop.setAttribute('aria-label', labelClose);
    document.body.appendChild(backdrop);
  }

  function closeMenu() {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', labelOpen);
  }

  function openMenu() {
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', labelClose);
  }

  toggle.addEventListener('click', () => {
    document.body.classList.contains('nav-open') ? closeMenu() : openMenu();
  });

  backdrop.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

// ── FAQ accordion ──
function toggleFaq(row) {
  const wasOpen = row.classList.contains('open');
  document.querySelectorAll('.faq-row.open').forEach(r => r.classList.remove('open'));
  if (!wasOpen) row.classList.add('open');
}

document.querySelectorAll('.faq-row__q').forEach(q => {
  q.addEventListener('click', () => toggleFaq(q.closest('.faq-row')));
});

// ── Scroll reveal (blur rise) ──
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ── Console metric cycling (hero) ──
function cycleMetric(el, states, interval) {
  if (!el) return;
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % states.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = states[idx];
      el.style.opacity = '1';
    }, 250);
  }, interval);
}

document.querySelectorAll('[data-cycle]').forEach((el) => {
  const states = el.getAttribute('data-cycle').split('|');
  const interval = 2800 + Math.round(Math.random() * 1800);
  if (states.length > 1) cycleMetric(el, states, interval);
});

// ── In-page dropdown (generic, supports multiple [data-dropdown] instances) ──
document.querySelectorAll('[data-dropdown]').forEach((dd) => {
  const btn = dd.querySelector('.runhead__dropdown-btn');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = dd.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  dd.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    dd.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  }));
});
document.addEventListener('click', () => {
  document.querySelectorAll('[data-dropdown].is-open').forEach((dd) => {
    dd.classList.remove('is-open');
    dd.querySelector('.runhead__dropdown-btn')?.setAttribute('aria-expanded', 'false');
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('[data-dropdown].is-open').forEach((dd) => dd.classList.remove('is-open'));
  }
});

// ── Typewriter (generic — reads words from el.dataset.typewriter, pipe-separated) ──
function initTypewriter(el) {
  const words = (el.dataset.typewriter || '').split('|').filter(Boolean);
  if (!words.length) return;
  let idx = 0, pos = 0, deleting = false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = words[0];
    return;
  }
  (function typeStep() {
    const w = words[idx];
    if (!deleting) {
      el.textContent = w.slice(0, ++pos);
      if (pos === w.length) { deleting = true; setTimeout(typeStep, 1800); return; }
    } else {
      el.textContent = w.slice(0, --pos);
      if (pos === 0) { deleting = false; idx = (idx + 1) % words.length; }
    }
    setTimeout(typeStep, deleting ? 45 : 85);
  })();
}

document.querySelectorAll('[data-typewriter]').forEach(initTypewriter);

// ── Doc sidebar scroll-spy (product strategy-guide pages; no-op if #docSidebar is absent) ──
(function () {
  const sidebar = document.getElementById('docSidebar');
  if (!sidebar) return;
  const links = Array.from(sidebar.querySelectorAll('a'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;

  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const link = sidebar.querySelector(`a[href="#${e.target.id}"]`);
      if (!link) return;
      if (e.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });

  sections.forEach(s => spy.observe(s));
})();
