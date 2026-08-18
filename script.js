// Reveal elements with a minimal fade + slide as they scroll into view.
// Uses IntersectionObserver — no scroll-event polling, so it's cheap and smooth.
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function (el) { observer.observe(el); });
})();

// Contact form → submits silently to Formspree, which stores the
// submission in your Formspree dashboard and emails it to you.
// ⚠️ REPLACE THE LINE BELOW: swap YOUR_FORM_ID for the real endpoint
// Formspree gives you after you create a form at formspree.io
(function () {
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrpzogap';

  var form = document.getElementById('quote-form');
  if (!form) return;

  var statusEl = document.getElementById('form-status');
  var submitBtn = form.querySelector('.form-submit');
  var formLoadTime = Date.now();

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot + timing check to filter out bots.
    var honeypot = document.getElementById('hp_confirm_9x2');
    var filledTooFast = (Date.now() - formLoadTime) < 1200;
    if ((honeypot && honeypot.value.trim() !== '') || filledTooFast) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (statusEl) {
      statusEl.textContent = 'Sending…';
      statusEl.className = 'form-status';
    }
    if (submitBtn) submitBtn.disabled = true;

    var payload = new FormData();
    payload.append('name', document.getElementById('name').value.trim());
    payload.append('phone', document.getElementById('phone').value.trim());
    payload.append('email', document.getElementById('email').value.trim());
    payload.append('coverage', document.getElementById('coverage').value);
    payload.append('message', document.getElementById('message').value.trim());
    payload.append('_subject', 'New quote request — MotorWise Insurance');

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: payload
    })
      .then(function (response) {
        if (response.ok) {
          if (statusEl) {
            statusEl.textContent = "Thanks! We've received your details and will reach out shortly.";
            statusEl.className = 'form-status success';
          }
          form.reset();
        } else {
          return response.json().then(function (data) {
            console.error('Formspree rejected the submission:', data);
            throw new Error('Submission failed');
          });
        }
      })
      .catch(function (err) {
        console.error('Form submission error:', err);
        if (statusEl) {
          statusEl.textContent = "Something went wrong. Please call us directly at +91 80800 08300.";
          statusEl.className = 'form-status error';
        }
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();

