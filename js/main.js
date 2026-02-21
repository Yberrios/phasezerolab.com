(function () {
  'use strict';

  var form = document.getElementById('signup-form');
  var feedback = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var emailInput = form.querySelector('input[type="email"]');
    var button = form.querySelector('button[type="submit"]');
    var email = emailInput.value.trim();

    // Clear previous feedback
    feedback.textContent = '';
    feedback.className = 'signup__feedback';

    // Basic validation
    if (!email || !isValidEmail(email)) {
      feedback.textContent = 'Please enter a valid email address.';
      feedback.classList.add('signup__feedback--error');
      return;
    }

    // Check if Formspree endpoint has been configured
    var action = form.getAttribute('action');
    if (!action || action.indexOf('YOUR_FORM_ID') !== -1) {
      feedback.textContent = 'Thank you for your interest! (Form endpoint not yet configured.)';
      feedback.classList.add('signup__feedback--success');
      emailInput.value = '';
      return;
    }

    // Submit to Formspree
    button.disabled = true;
    button.textContent = 'Sending\u2026';

    fetch(action, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    })
      .then(function (response) {
        if (response.ok) {
          feedback.textContent = 'You\u2019re on the list. We\u2019ll be in touch.';
          feedback.classList.add('signup__feedback--success');
          emailInput.value = '';
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(function () {
        feedback.textContent = 'Something went wrong. Please try again.';
        feedback.classList.add('signup__feedback--error');
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = 'Notify Me';
      });
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();
