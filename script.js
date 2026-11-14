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
    '.section-header, .about__pillar, .about__visual, .about__content > .btn, .footer__inner > *, .process__step, .contact__channel, .contact__form, .portfolio__note, .tcard, .pricing__note'
  );
  singleTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const groupTargets = document.querySelectorAll('.services__grid, .about__stats, .portfolio__grid, .process__steps, .testi__grid, .pricing__grid');
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

/* ─── 6. Contact Form (Web3Forms) ─────────────────────────────────────── */
(function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const btn    = form ? form.querySelector('.form__submit') : null;
  if (!form || !status || !btn) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name    = form.querySelector('#cf-name').value.trim();
    const email   = form.querySelector('#cf-email').value.trim();
    const service = form.querySelector('#cf-service').value;
    const message = form.querySelector('#cf-message').value.trim();

    if (!name || !email || !service || !message) {
      status.textContent = 'Please fill in all required fields.';
      status.className = 'form__note form__note--error';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'form__note';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const data = await res.json();
      if (data.success) {
        status.textContent = '✅ Message sent! We’ll reply within 24 hours.';
        status.className = 'form__note form__note--success';
        form.reset();
      } else {
        throw new Error(data.message);
      }
    } catch {
      status.textContent = '❌ Something went wrong. Please WhatsApp or email us directly.';
      status.className = 'form__note form__note--error';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });
})();

/* ─── 7. Smooth Scroll Polyfill (for older Safari) ─────────────── */
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
