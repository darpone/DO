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

  document.querySelectorAll("[data-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

  document.querySelectorAll("[data-language-choice]").forEach((link) => {
    link.addEventListener("click", () => {
      try { localStorage.setItem("opdelta-language", link.dataset.languageChoice); } catch (_) {}
    });
  });

  const leadForm = document.querySelector("[data-contact-form]");
  if (leadForm) {
    const status = leadForm.querySelector("[data-form-status]");
    const submit = leadForm.querySelector("button[type='submit']");
    leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!leadForm.reportValidity()) return;
      const original = submit.textContent;
      submit.disabled = true;
      submit.textContent = leadForm.lang === "fr" ? "Envoi…" : "Sending…";
      status.textContent = "";
      status.className = "status";
      try {
        const response = await fetch(leadForm.action, {
          method: "POST",
          body: new FormData(leadForm),
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error("Submission failed");
        leadForm.reset();
        status.textContent = leadForm.lang === "fr"
          ? "Merci. Votre message a été envoyé."
          : "Thank you. Your message has been sent.";
        status.className = "status success";
      } catch (_) {
        status.innerHTML = leadForm.lang === "fr"
          ? 'L’envoi a échoué. Écrivez-nous à <a href="mailto:contact@deltaoperations.ca">contact@deltaoperations.ca</a>.'
          : 'Delivery failed. Email us at <a href="mailto:contact@deltaoperations.ca">contact@deltaoperations.ca</a>.';
        status.className = "status error";
      } finally {
        submit.disabled = false;
        submit.textContent = original;
      }
    });
  }
})();
