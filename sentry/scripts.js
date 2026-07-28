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

// ── Chart lightbox ──
const lightbox = document.getElementById('chart-lightbox');
if (lightbox) {
  let lastFocus = null;

  const openLightbox = () => {
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    lightbox.querySelector('[data-chart-close].lightbox__close')?.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  document.querySelectorAll('[data-chart-open]').forEach((btn) => {
    btn.addEventListener('click', openLightbox);
  });

  lightbox.querySelectorAll('[data-chart-close]').forEach((el) => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}
