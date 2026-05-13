/* ===================================================
   Pizzeria Marienkäfer – JavaScript
   =================================================== */

(function () {
  'use strict';

  /* ---- Navigation scroll effect ---- */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ---- Pages without hero get solid navbar ---- */
  if (!document.querySelector('.hero')) {
    navbar && navbar.classList.add('solid');
  }

  /* ---- Mobile menu toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Active nav link (based on pathname) ---- */
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    const page = link.dataset.page;
    const isHome = page === 'home' && (path === '/' || path.endsWith('/index.html') || path === '');
    const isPage = page !== 'home' && path.includes('/' + page);
    if (isHome || isPage) {
      link.classList.add('active');
    }
  });

  /* ---- Hero parallax ---- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.28}px)`;
    }, { passive: true });
  }

  /* ---- Hero scroll button ---- */
  const heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      const target = document.querySelector('.info-strip') || document.querySelector('.section');
      target && target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---- Fade-in on scroll ---- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && fadeEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- Back to top ---- */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- Menu tabs ---- */
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      tabs.forEach(t   => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ---- Contact form (AJAX via FormSubmit.co) ---- */
  const contactForm   = document.getElementById('contactForm');
  const formSuccess   = document.getElementById('formSuccess');
  const formError     = document.getElementById('formError');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (formSuccess) formSuccess.style.display = 'none';
      if (formError)   formError.style.display   = 'none';

      const submitBtn = contactForm.querySelector('[type="submit"]');
      const origText  = submitBtn.textContent;
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Wird gesendet …';

      const formData = new FormData(contactForm);

      try {
        const res = await fetch('https://formsubmit.co/ajax/kontakt@pizzeria-marienkaefer.de', {
          method:  'POST',
          body:    formData,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          if (formSuccess) formSuccess.style.display = 'block';
          contactForm.reset();
          formSuccess && formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          throw new Error('Server error');
        }
      } catch (_) {
        if (formError) formError.style.display = 'block';
      } finally {
        submitBtn.disabled    = false;
        submitBtn.textContent = origText;
      }
    });
  }

})();
