/* ==========================================================================
   TEMPLATE SITE VITRINE — JS (vanilla, sans dépendance)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  initBackToTop();
  initContactForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* --- Header : fond opaque après défilement --- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const toggle = () => header.classList.toggle('scrolled', window.scrollY > 40);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* --- Menu mobile (burger) --- */
function initMobileMenu() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --- Animations légères au scroll (IntersectionObserver) --- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

/* --- Bouton retour en haut --- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  const toggle = () => btn.classList.toggle('visible', window.scrollY > 500);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* --- Formulaire de contact : validation + simulation d'envoi ---
   Ce template n'envoie pas réellement d'e-mail : brancher ici un service
   (Formspree, EmailJS, back-end du client...) selon les besoins. */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  const validators = {
    name: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message: (v) => v.trim().length >= 10,
  };

  const messages = {
    name: 'Veuillez indiquer votre nom (2 caractères minimum).',
    email: 'Veuillez saisir une adresse e-mail valide.',
    message: 'Votre message doit contenir au moins 10 caractères.',
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.hidden = true;

    let isValid = true;

    Object.keys(validators).forEach((field) => {
      const input = form.elements[field];
      const group = input.closest('.form-group');
      const errorEl = form.querySelector(`.error-message[data-for="${field}"]`);
      const valid = validators[field](input.value);

      group.classList.toggle('has-error', !valid);
      errorEl.textContent = valid ? '' : messages[field];
      if (!valid) isValid = false;
    });

    if (!isValid) return;

    // Simulation d'envoi réussi (à remplacer par un vrai appel API/service).
    successMsg.hidden = false;
    form.reset();
  });
}
