(() => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  const status = form.querySelector("[data-form-status]");
  const submit = form.querySelector("button[type='submit']");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const original = submit.textContent;
    const french = document.documentElement.lang === "fr";
    submit.disabled = true;
    submit.textContent = french ? "Envoi…" : "Sending…";
    status.textContent = "";
    status.className = "status";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      status.textContent = french ? "Merci. Votre message a été envoyé." : "Thank you. Your message has been sent.";
      status.className = "status success";
    } catch (_) {
      status.innerHTML = french
        ? 'L’envoi a échoué. Écrivez-nous à <a href="mailto:contact@deltaoperations.ca">contact@deltaoperations.ca</a>.'
        : 'Delivery failed. Email us at <a href="mailto:contact@deltaoperations.ca">contact@deltaoperations.ca</a>.';
      status.className = "status error";
    } finally {
      submit.disabled = false;
      submit.textContent = original;
    }
  });
})();
