/**
 * jr.CorTechX — script.js
 * Hamburger Mobile Menu · Smooth Scrolling · Scroll Reveal · Active Nav · Year
 */

/* ─── DOM Ready ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initMobileMenu();
  initScrollHeader();
  initScrollReveal();
  initActiveNav();
});

/* ─── 1. Footer Year ─────────────────────────────────────────────── */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ─── 2. Mobile Hamburger Menu ──────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navList   = document.getElementById('navList');

  if (!hamburger || !navList) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  function openMenu() {
    navList.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navList.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = navList.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navList.classList.contains('open')) closeMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navList.classList.contains('open')) closeMenu();
  });

  // Close if viewport expands past mobile breakpoint
  const mq = window.matchMedia('(min-width: 769px)');
  mq.addEventListener('change', e => {
    if (e.matches) closeMenu();
  });
}

/* ─── 3. Header Shadow on Scroll ────────────────────────────────── */
function initScrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
  );

  // Observe a sentinel at top of page
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
  document.body.prepend(sentinel);
  observer.observe(sentinel);
}

/* ─── 4. Scroll Reveal Animations ──────────────────────────────── */
function initScrollReveal() {
  // Mark elements for reveal
  const singleTargets = document.querySelectorAll(
    '.section-header, .about__pillar, .about__visual, .about__content > .btn, .footer__inner > *'
  );
  singleTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const groupTargets = document.querySelectorAll('.services__grid, .about__stats');
  groupTargets.forEach(el => el.setAttribute('data-reveal-group', ''));

  const allReveal = document.querySelectorAll('[data-reveal], [data-reveal-group]');

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    allReveal.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  allReveal.forEach(el => observer.observe(el));
}

/* ─── 5. Active Nav Link on Scroll ─────────────────────────────── */
function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  function setActive(id) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { threshold: 0, rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach(section => observer.observe(section));
}

/* ─── 6. Smooth Scroll Polyfill (for older Safari) ─────────────── */
(function smoothScrollPolyfill() {
  if ('scrollBehavior' in document.documentElement.style) return; // native support

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
