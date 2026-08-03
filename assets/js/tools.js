(() => {
  const language = document.documentElement.lang === "fr" ? "fr" : "en";
  const money = new Intl.NumberFormat(language === "fr" ? "fr-CA" : "en-CA", {
    style: "currency", currency: "CAD", maximumFractionDigits: 0
  });
  const number = new Intl.NumberFormat(language === "fr" ? "fr-CA" : "en-CA", { maximumFractionDigits: 1 });

  const diagnostic = document.querySelector("[data-diagnostic]");
  if (diagnostic) {
    diagnostic.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!diagnostic.reportValidity()) return;
      const answers = [...new FormData(diagnostic).values()].map(Number);
      const score = Math.round(answers.reduce((sum, value) => sum + value, 0) / (answers.length * 4) * 100);
      const result = document.querySelector("[data-diagnostic-result]");
      const ring = result.querySelector("[data-score-ring]");
      ring.style.setProperty("--score", `${score}%`);
      ring.querySelector("strong").textContent = `${score}/100`;

      const bands = language === "fr"
        ? score < 40
          ? ["Potentiel à clarifier", "Commencez par documenter le processus et mesurer son volume réel."]
          : score < 70
            ? ["Bon candidat", "Le workflow présente plusieurs caractéristiques favorables à une automatisation ciblée."]
            : ["Priorité élevée", "Le processus est répétitif, mesurable et probablement prêt pour un prototype."]
        : score < 40
          ? ["Potential needs clarification", "Start by documenting the process and measuring its actual volume."]
          : score < 70
            ? ["Good candidate", "The workflow has several characteristics that support targeted automation."]
            : ["High priority", "The process is repetitive, measurable, and likely ready for a prototype."];
      result.querySelector("[data-score-title]").textContent = bands[0];
      result.querySelector("[data-score-summary]").textContent = bands[1];

      const recommendations = language === "fr" ? [
        [answers[0] >= 3 || answers[1] >= 3, "Cartographier les étapes, les décisions et les exceptions avant de choisir un outil."],
        [answers[2] >= 3 || answers[3] >= 3, "Prioriser la réduction des doubles saisies et connecter les systèmes existants."],
        [answers[4] >= 3 || answers[5] >= 3, "Standardiser les entrées et ajouter des contrôles de qualité automatiques."],
        [answers[6] >= 3 || answers[7] >= 3, "Créer un prototype limité avec un responsable, une mesure de référence et une validation humaine."],
        [answers[8] >= 3 || answers[9] >= 3, "Commencer par un cas fréquent et mesurable afin de démontrer rapidement la valeur."],
        [true, "Valider les accès, la confidentialité et les exceptions avant le déploiement."]
      ] : [
        [answers[0] >= 3 || answers[1] >= 3, "Map the steps, decisions, and exceptions before selecting a tool."],
        [answers[2] >= 3 || answers[3] >= 3, "Prioritize eliminating duplicate entry and connecting existing systems."],
        [answers[4] >= 3 || answers[5] >= 3, "Standardize inputs and add automated quality controls."],
        [answers[6] >= 3 || answers[7] >= 3, "Build a limited prototype with an owner, baseline measure, and human review."],
        [answers[8] >= 3 || answers[9] >= 3, "Start with a frequent, measurable case to demonstrate value quickly."],
        [true, "Validate access, privacy, and exception handling before rollout."]
      ];
      const selected = recommendations.filter(([condition]) => condition).slice(0, 3);
      result.querySelector("[data-recommendations]").innerHTML = selected.map(([, text]) => `<li>${text}</li>`).join("");
      result.classList.add("visible");
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  const roi = document.querySelector("[data-roi]");
  if (roi) {
    roi.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!roi.reportValidity()) return;
      const data = Object.fromEntries(new FormData(roi));
      const hours = Math.max(0, Number(data.hours));
      const employees = Math.max(1, Number(data.employees));
      const hourly = Math.max(0, Number(data.hourly));
      const automatable = Math.min(100, Math.max(0, Number(data.automatable))) / 100;
      const project = Math.max(0, Number(data.project));
      const recovered = hours * employees * 4.33 * automatable;
      const monthly = recovered * hourly;
      const annual = monthly * 12;
      const payback = monthly > 0 ? project / monthly : Infinity;
      const result = document.querySelector("[data-roi-result]");
      result.querySelector("[data-hours]").textContent = `${number.format(recovered)} h`;
      result.querySelector("[data-monthly]").textContent = money.format(monthly);
      result.querySelector("[data-annual]").textContent = money.format(annual);
      result.querySelector("[data-payback]").textContent = Number.isFinite(payback)
        ? `${number.format(payback)} ${language === "fr" ? "mois" : "months"}`
        : language === "fr" ? "Non calculable" : "Not calculable";
      const scenarios = [
        [language === "fr" ? "Prudent" : "Conservative", .65],
        [language === "fr" ? "Base" : "Base", 1],
        [language === "fr" ? "Optimiste" : "Optimistic", 1.25]
      ];
      result.querySelector("[data-scenarios]").innerHTML = scenarios.map(([label, factor]) =>
        `<div class="metric"><span>${label}</span><strong>${money.format(annual * factor)}</strong><span>${language === "fr" ? "économies/an" : "savings/year"}</span></div>`
      ).join("");
      result.classList.add("visible");
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  const brief = document.querySelector("[data-brief]");
  if (brief) {
    const steps = [...brief.querySelectorAll("[data-brief-step]")];
    const dots = [...brief.querySelectorAll("[data-step-dot]")];
    let current = 0;
    const show = (index) => {
      current = Math.max(0, Math.min(steps.length - 1, index));
      steps.forEach((step, i) => { step.hidden = i !== current; });
      dots.forEach((dot, i) => dot.classList.toggle("active", i <= current));
      brief.querySelector("[data-brief-progress]").textContent = `${current + 1} / ${steps.length}`;
    };
    brief.addEventListener("click", (event) => {
      const next = event.target.closest("[data-next]");
      const previous = event.target.closest("[data-previous]");
      if (next) {
        const required = [...steps[current].querySelectorAll("[required]")];
        if (required.some((field) => !field.reportValidity())) return;
        show(current + 1);
      }
      if (previous) show(current - 1);
    });
    brief.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!brief.reportValidity()) return;
      const data = Object.fromEntries(new FormData(brief));
      const fields = language === "fr" ? [
        ["CAHIER DES BESOINS — VERSION DE TRAVAIL", ""], ["1. Processus actuel", data.workflow],
        ["2. Utilisateurs et parties prenantes", data.users], ["3. Entrées et sources", data.inputs],
        ["4. Sorties attendues", data.outputs], ["5. Automatisations souhaitées", data.automations],
        ["6. Intégrations", data.integrations || "Aucune précisée"], ["7. Contraintes et exigences", data.constraints],
        ["8. Échéance", data.deadline || "À déterminer"], ["9. Critères de succès", data.success],
        ["10. Prochaine étape suggérée", "Valider ce document avec les utilisateurs concernés, prioriser les exigences et confirmer les hypothèses techniques avant l’estimation."]
      ] : [
        ["REQUIREMENTS BRIEF — WORKING DRAFT", ""], ["1. Current workflow", data.workflow],
        ["2. Users and stakeholders", data.users], ["3. Inputs and sources", data.inputs],
        ["4. Expected outputs", data.outputs], ["5. Desired automations", data.automations],
        ["6. Integrations", data.integrations || "None specified"], ["7. Constraints and requirements", data.constraints],
        ["8. Deadline", data.deadline || "To be determined"], ["9. Success criteria", data.success],
        ["10. Suggested next step", "Review this document with affected users, prioritize the requirements, and confirm technical assumptions before estimation."]
      ];
      const output = fields.map(([heading, value]) => value ? `${heading}\n${value}` : heading).join("\n\n");
      const result = document.querySelector("[data-brief-result]");
      result.querySelector("[data-brief-output]").textContent = output;
      result.classList.add("visible");
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    show(0);
  }

  document.querySelectorAll("[data-copy-brief]").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = document.querySelector("[data-brief-output]")?.textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = language === "fr" ? "Copié" : "Copied";
      } catch (_) {
        const range = document.createRange();
        range.selectNodeContents(document.querySelector("[data-brief-output]"));
        const selection = window.getSelection();
        selection.removeAllRanges(); selection.addRange(range);
        button.textContent = language === "fr" ? "Texte sélectionné" : "Text selected";
      }
    });
  });
  document.querySelectorAll("[data-print]").forEach((button) => button.addEventListener("click", () => window.print()));
})();
