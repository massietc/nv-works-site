// ==========================================================
// NV Works — site script
// 1) Starfield canvas animation (hero background)
// 2) Show/hide service-specific form fields
// 3) Submit the quote form to Formspree without a page reload
// 4) Footer year
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initServiceToggle();
  initFormSubmit();
  initFooterYear();
});

/* ---------- 1) Starfield ---------- */

function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let width, height;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    const count = Math.floor((width * height) / 6000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005
    }));
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw(t) {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      const twinkle = prefersReducedMotion ? 1 : 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 244, 245, ${0.15 + twinkle * 0.65})`;
      ctx.fill();
    }
    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
}

/* ---------- 2) Conditional service fields ---------- */

function initServiceToggle() {
  const serviceSelect = document.getElementById('service');
  if (!serviceSelect) return;

  const ambientGroup = document.getElementById('ambient-options');
  const starGroup = document.getElementById('star-options');

  function update() {
    const value = serviceSelect.value;
    ambientGroup.classList.toggle('hidden', !(value === 'Ambientenbeleuchtung' || value === 'Beides'));
    starGroup.classList.toggle('hidden', !(value === 'Sternenhimmel' || value === 'Beides'));
  }

  serviceSelect.addEventListener('change', update);
  update();
}

/* ---------- 3) Form submission (Formspree) ---------- */

function initFormSubmit() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  const status = document.getElementById('form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Wird gesendet...';
    status.className = 'form-status';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.textContent = 'Vielen Dank! Ihre Anfrage wurde gesendet. Ich melde mich in Kürze bei Ihnen.';
        status.className = 'form-status success';
        form.reset();
        document.getElementById('ambient-options').classList.add('hidden');
        document.getElementById('star-options').classList.add('hidden');
      } else {
        status.textContent = 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt.';
        status.className = 'form-status error';
      }
    } catch (err) {
      status.textContent = 'Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.';
      status.className = 'form-status error';
    }
  });
}

/* ---------- 4) Footer year ---------- */

function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
