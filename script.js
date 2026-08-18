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

// Contact form → opens the user's email app with a pre-filled draft
// addressed to MotorWise. Nothing is sent automatically — the user
// still has to hit "Send" themselves in their own mail app.
(function () {
  var form = document.getElementById('quote-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot: if this hidden field got filled in, it's a bot — do nothing.
    var honeypot = document.getElementById('company_website');
    if (honeypot && honeypot.value.trim() !== '') return;

    // Run the browser's normal required/pattern validation first.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var name = document.getElementById('name').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var email = document.getElementById('email').value.trim();
    var coverage = document.getElementById('coverage').value;
    var message = document.getElementById('message').value.trim();

    var subject = 'Quote Request — ' + name;
    var body =
      'Name: ' + name + '\n' +
      'Phone: ' + phone + '\n' +
      'Email: ' + email + '\n' +
      'Coverage interested in: ' + coverage + '\n\n' +
      (message || 'No additional details provided.');

    var mailtoUrl =
      'mailto:motorwise1234@gmail.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    window.location.href = mailtoUrl;
  });
})();

