(() => {
  const fr = document.documentElement.lang === "fr";
  const locale = fr ? "fr-CA" : "en-CA";
  const currency = new Intl.NumberFormat(locale, { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
  const decimal = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });

  const diagnostic = document.querySelector("[data-diagnostic]");
  if (diagnostic) diagnostic.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!diagnostic.reportValidity()) return;
    const answers = [...new FormData(diagnostic).values()].map(Number);
    const score = Math.round(answers.reduce((a, b) => a + b, 0) / (answers.length * 4) * 100);
    const result = document.querySelector("[data-diagnostic-result]");
    const ring = result.querySelector("[data-score-ring]");
    ring.style.setProperty("--score", `${score}%`);
    ring.textContent = `${score}/100`;
    const band = score < 40
      ? (fr ? ["Potentiel à clarifier", "Documentez le processus et mesurez son volume avant de sélectionner un outil."] : ["Potential needs clarification", "Document the process and measure its volume before selecting a tool."])
      : score < 70
        ? (fr ? ["Bon candidat", "Le workflow présente plusieurs caractéristiques favorables à une automatisation ciblée."] : ["Good candidate", "The workflow has several characteristics that support focused automation."])
        : (fr ? ["Priorité élevée", "Le processus est répétitif, mesurable et probablement prêt pour un prototype contrôlé."] : ["High priority", "The process is repetitive, measurable, and likely ready for a controlled prototype."]);
    result.querySelector("[data-score-title]").textContent = band[0];
    result.querySelector("[data-score-summary]").textContent = band[1];
    const options = fr ? [
      [answers[0] >= 3 || answers[1] >= 3, "Cartographier les étapes, décisions et exceptions avant de choisir un outil."],
      [answers[2] >= 3 || answers[3] >= 3, "Prioriser les doubles saisies et les transferts entre systèmes."],
      [answers[4] >= 3 || answers[5] >= 3, "Standardiser les entrées et ajouter des contrôles de qualité."],
      [answers[6] >= 3 || answers[7] >= 3, "Créer un prototype limité avec un responsable et une validation humaine."],
      [answers[8] >= 3 || answers[9] >= 3, "Établir une mesure de référence avant l’implantation."],
      [true, "Valider accès, confidentialité et reprise manuelle avant le déploiement."]
    ] : [
      [answers[0] >= 3 || answers[1] >= 3, "Map steps, decisions, and exceptions before selecting a tool."],
      [answers[2] >= 3 || answers[3] >= 3, "Prioritize duplicate entry and handoffs between systems."],
      [answers[4] >= 3 || answers[5] >= 3, "Standardize inputs and add quality controls."],
      [answers[6] >= 3 || answers[7] >= 3, "Build a limited prototype with an owner and human review."],
      [answers[8] >= 3 || answers[9] >= 3, "Establish a baseline measure before implementation."],
      [true, "Validate access, privacy, and manual recovery before rollout."]
    ];
    result.querySelector("[data-recommendations]").innerHTML = options.filter(([test]) => test).slice(0, 3).map(([, text]) => `<li>${text}</li>`).join("");
    result.classList.add("visible");
    result.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  const roi = document.querySelector("[data-roi]");
  if (roi) roi.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!roi.reportValidity()) return;
    const data = Object.fromEntries(new FormData(roi));
    const recovered = Math.max(0, +data.hours) * Math.max(1, +data.employees) * 4.33 * Math.min(1, Math.max(0, +data.automatable / 100));
    const monthly = recovered * Math.max(0, +data.hourly);
    const annual = monthly * 12;
    const payback = monthly > 0 ? Math.max(0, +data.project) / monthly : Infinity;
    const result = document.querySelector("[data-roi-result]");
    result.querySelector("[data-hours]").textContent = `${decimal.format(recovered)} h`;
    result.querySelector("[data-monthly]").textContent = currency.format(monthly);
    result.querySelector("[data-annual]").textContent = currency.format(annual);
    result.querySelector("[data-payback]").textContent = Number.isFinite(payback) ? `${decimal.format(payback)} ${fr ? "mois" : "months"}` : (fr ? "Non calculable" : "Not calculable");
    const scenarios = [[fr ? "Prudent" : "Conservative", .65], [fr ? "Base" : "Base", 1], [fr ? "Optimiste" : "Optimistic", 1.25]];
    result.querySelector("[data-scenarios]").innerHTML = scenarios.map(([name, factor]) => `<div class="metric">${name}<strong>${currency.format(annual * factor)}</strong>${fr ? "économies/an" : "savings/year"}</div>`).join("");
    result.classList.add("visible");
    result.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  const brief = document.querySelector("[data-brief]");
  if (brief) {
    const steps = [...brief.querySelectorAll("[data-brief-step]")];
    let current = 0;
    const show = (index) => {
      current = Math.max(0, Math.min(steps.length - 1, index));
      steps.forEach((step, i) => step.hidden = i !== current);
      brief.querySelector("[data-brief-progress]").textContent = `${fr ? "Étape" : "Step"} ${current + 1} / ${steps.length}`;
    };
    brief.addEventListener("click", (event) => {
      if (event.target.closest("[data-next]")) {
        if ([...steps[current].querySelectorAll("[required]")].some((field) => !field.reportValidity())) return;
        show(current + 1);
      }
      if (event.target.closest("[data-previous]")) show(current - 1);
    });
    brief.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!brief.reportValidity()) return;
      const data = Object.fromEntries(new FormData(brief));
      const fields = fr ? [
        ["CAHIER DES BESOINS — VERSION DE TRAVAIL", ""], ["1. Processus actuel", data.workflow], ["2. Utilisateurs et parties prenantes", data.users], ["3. Entrées et sources", data.inputs], ["4. Sorties attendues", data.outputs], ["5. Automatisations souhaitées", data.automations], ["6. Intégrations", data.integrations || "Aucune précisée"], ["7. Contraintes et exigences", data.constraints], ["8. Échéance", data.deadline || "À déterminer"], ["9. Critères de succès", data.success], ["10. Prochaine étape", "Valider ce document avec les utilisateurs, prioriser les exigences et confirmer les hypothèses avant l’estimation."]
      ] : [
        ["REQUIREMENTS BRIEF — WORKING DRAFT", ""], ["1. Current workflow", data.workflow], ["2. Users and stakeholders", data.users], ["3. Inputs and sources", data.inputs], ["4. Expected outputs", data.outputs], ["5. Desired automations", data.automations], ["6. Integrations", data.integrations || "None specified"], ["7. Constraints and requirements", data.constraints], ["8. Deadline", data.deadline || "To be determined"], ["9. Success criteria", data.success], ["10. Next step", "Review with affected users, prioritize requirements, and confirm assumptions before estimation."]
      ];
      const result = document.querySelector("[data-brief-result]");
      result.querySelector("[data-brief-output]").textContent = fields.map(([heading, value]) => value ? `${heading}\n${value}` : heading).join("\n\n");
      result.classList.add("visible");
      result.scrollIntoView({ behavior: "smooth" });
    });
    show(0);
  }

  const audit = document.querySelector("[data-sme-audit]");
  if (audit) audit.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!audit.reportValidity()) return;
    const values = [...new FormData(audit).values()].map(Number);
    const groups = [
      { name: fr ? "Processus et responsabilités" : "Processes and ownership", indexes: [0, 1, 3, 11, 13] },
      { name: fr ? "Flux d’information et outils" : "Information flow and tools", indexes: [2, 6, 7, 8] },
      { name: fr ? "Délais, qualité et visibilité" : "Delay, quality, and visibility", indexes: [4, 5, 9] },
      { name: fr ? "Sécurité et adoption" : "Security and adoption", indexes: [10, 12] }
    ].map((group) => ({ ...group, score: group.indexes.reduce((sum, i) => sum + values[i], 0) / (group.indexes.length * 2) }));
    const total = Math.round(values.reduce((a, b) => a + b, 0) / (values.length * 2) * 100);
    const priorities = groups.sort((a, b) => a.score - b.score).slice(0, 3);
    const result = document.querySelector("[data-audit-result]");
    result.querySelector("[data-audit-title]").textContent = `${fr ? "Maturité opérationnelle" : "Operational maturity"}: ${total}%`;
    result.querySelector("[data-audit-summary]").textContent = total < 40 ? (fr ? "Commencez par documenter, attribuer les responsabilités et établir des mesures de référence." : "Start by documenting, assigning ownership, and establishing baseline measures.") : total < 70 ? (fr ? "Les fondations existent; concentrez-vous sur les trois zones les moins matures." : "Foundations exist; focus on the three least mature areas.") : (fr ? "La base est solide pour prioriser des améliorations ciblées et mesurables." : "The foundation is strong enough to prioritize focused, measurable improvements.");
    result.querySelector("[data-audit-opportunities]").innerHTML = priorities.map((item) => `<li><strong>${item.name}</strong> — ${Math.round(item.score * 100)}%</li>`).join("");
    const next = fr ? ["Choisir un seul processus prioritaire et nommer son responsable.", "Mesurer volume, temps, délais et erreurs pendant une période représentative.", "Cartographier les systèmes, les données sensibles et les exceptions avant de sélectionner une solution."] : ["Choose one priority process and name its owner.", "Measure volume, effort, delay, and errors over a representative period.", "Map systems, sensitive data, and exceptions before selecting a solution."];
    result.querySelector("[data-audit-next]").innerHTML = next.map((item) => `<li>${item}</li>`).join("");
    result.classList.add("visible");
    result.scrollIntoView({ behavior: "smooth" });
  });

  const checklist = document.querySelector("[data-checklist]");
  if (checklist) {
    const boxes = [...checklist.querySelectorAll("input[type='checkbox']")];
    const storageKey = checklist.dataset.storageKey;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      boxes.forEach((box) => box.checked = saved.includes(box.name));
    } catch (_) {}
    const update = () => {
      const checked = boxes.filter((box) => box.checked);
      checklist.querySelector("[data-checklist-score]").textContent = `${Math.round(checked.length / boxes.length * 100)}%`;
      const categories = [...new Set(boxes.map((box) => box.value))];
      const results = categories.map((category) => {
        const group = boxes.filter((box) => box.value === category);
        return { category, percent: Math.round(group.filter((box) => box.checked).length / group.length * 100) };
      });
      checklist.querySelector("[data-category-progress]").innerHTML = results.map((item) => `<div class="progress-line"><span>${item.category}</span><span class="bar"><i style="width:${item.percent}%"></i></span><strong>${item.percent}%</strong></div>`).join("");
      checklist.querySelector("[data-checklist-actions]").innerHTML = results.sort((a, b) => a.percent - b.percent).slice(0, 3).map((item) => `<li>${fr ? "Renforcer" : "Strengthen"} <strong>${item.category}</strong> (${item.percent}%).</li>`).join("");
      try { localStorage.setItem(storageKey, JSON.stringify(checked.map((box) => box.name))); } catch (_) {}
    };
    boxes.forEach((box) => box.addEventListener("change", update));
    checklist.querySelector("[data-checklist-reset]").addEventListener("click", () => {
      boxes.forEach((box) => box.checked = false);
      try { localStorage.removeItem(storageKey); } catch (_) {}
      update();
    });
    update();
  }

  document.querySelectorAll("[data-copy-brief]").forEach((button) => button.addEventListener("click", async () => {
    const text = document.querySelector("[data-brief-output]")?.textContent || "";
    try { await navigator.clipboard.writeText(text); button.textContent = fr ? "Copié" : "Copied"; }
    catch (_) { const range = document.createRange(); range.selectNodeContents(document.querySelector("[data-brief-output]")); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); }
  }));
  document.querySelectorAll("[data-print]").forEach((button) => button.addEventListener("click", () => print()));
})();
