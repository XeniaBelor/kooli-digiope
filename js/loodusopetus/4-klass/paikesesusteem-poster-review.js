(() => {
  const step = document.querySelector(
    '.journey-step[data-step="6"]'
  );

  const data = window.paikesesusteemData;
  const storageKey = window.lessonConfig?.storageKey;

  if (!step || !data || !storageKey) return;

  const el = id => step.querySelector(`#${id}`);

  const nodes = {
    poster: el("review-poster"),
    bg: el("review-bg"),
    planet: el("review-planet"),
    title: el("review-title"),
    subtitle: el("review-subtitle"),
    facts: el("review-facts"),
    team: el("review-team"),
    form: el("poster-review-form"),
    names: el("review-names"),
    comment: el("review-comment"),
    message: el("review-message"),
    next: el("review-next")
  };

  if (Object.values(nodes).some(node => !node)) return;

  nodes.names.required = true;

  let currentPoster = null;
  let currentSignature = "";

  function getProgress() {
    try {
      const value = JSON.parse(
        localStorage.getItem(storageKey) || "{}"
      );

      return value && typeof value === "object"
        ? value
        : {};
    } catch {
      return {};
    }
  }

  function imageNumber(value, max) {
    const number = Number(value);

    return Number.isInteger(number) &&
      number >= 1 &&
      number <= max
        ? number
        : null;
  }

  function setImage(element, type, number, max) {
    const valid = imageNumber(number, max);

    if (!valid) {
      element.hidden = true;
      element.removeAttribute("src");
      return;
    }

    element.src = data.imageUrl(type, valid);
    element.hidden = false;
  }

  function renderPoster(poster) {
    const planet = data.planets.find(
      item => item.id === poster.planet
    );

    nodes.title.textContent = planet?.name || "Planeet";
    nodes.subtitle.textContent = poster.subtitle || "";
    nodes.team.textContent =
      `Autorid: ${poster.authors || "..."}`;

    setImage(
      nodes.bg,
      "taust",
      poster.background || 6,
      7
    );

    setImage(
      nodes.planet,
      "planeet",
      poster.planetImage,
      8
    );

    const decorations = Array.isArray(poster.decorations)
      ? poster.decorations
      : poster.decoration
        ? [poster.decoration]
        : [];

    for (let i = 1; i <= 3; i++) {
      const decoration = el(`review-decor-${i}`);

      if (!decoration) continue;

      setImage(
        decoration,
        "kaunistus",
        decorations[i - 1],
        8
      );
    }

    nodes.facts.replaceChildren();

    const facts = Array.isArray(poster.factTexts) &&
      poster.factTexts.length
        ? poster.factTexts
        : (poster.facts || []).map(index =>
            data.facts[poster.planet]?.[Number(index)]?.[0]
          );

    facts.forEach(fact => {
      if (!fact) return;

      const item = document.createElement("li");
      item.className = "poster-fact";
      item.textContent = String(fact);

      nodes.facts.append(item);
    });
  }

  function addFeedback(title, description, status = "") {
    const line = document.createElement("div");
    line.className = `review-feedback-item ${status}`;

    const heading = document.createElement("strong");
    heading.textContent = title;

    const text = document.createElement("p");
    text.textContent = description;

    line.append(heading, text);
    nodes.message.append(line);
  }

  function showMessage(text) {
    nodes.message.replaceChildren();
    nodes.message.textContent = text;
    nodes.message.className = "learning-box";
    nodes.message.hidden = false;
  }

  function checkPoster(poster) {
    const expectedPlanet = data.planets.find(
      planet => planet.id === poster.planet
    );

    const picturedPlanet = data.planets.find(
      planet => planet.image === Number(poster.planetImage)
    );

    const imageCorrect = Boolean(
      expectedPlanet &&
      picturedPlanet?.id === expectedPlanet.id
    );

    addFeedback(
      "Planeedi nime ja pildi kontroll",
      imageCorrect
        ? "Planeedi nimi ja pilt sobivad kokku."
        : "Planeedi nimi ja pilt ei sobi kokku.",
      imageCorrect ? "is-correct" : "is-wrong"
    );

    const selected = Array.isArray(poster.facts)
      ? poster.facts.map(Number)
      : [];

    const factBank = data.facts[poster.planet] || [];

    const validIndices = selected.length === 3 &&
      new Set(selected).size === 3 &&
      selected.every(index =>
        Number.isInteger(index) &&
        index >= 0 &&
        index < factBank.length
      );

    const correctFacts = validIndices &&
      selected.every(index => factBank[index]?.[1] === true);

    addFeedback(
      "Planeedi faktide kontroll",
      correctFacts
        ? "Kõik kolm valitud fakti on õiged."
        : "Mõni valitud fakt on vale või fakte ei ole kolm.",
      correctFacts ? "is-correct" : "is-wrong"
    );

    if (validIndices && !correctFacts) {
      selected.forEach(index => {
        const fact = factBank[index];

        if (fact && fact[1] !== true) {
          addFeedback(
            "Kontrolli seda väidet",
            fact[0],
            "is-wrong"
          );
        }
      });
    }
  }

  function fillForm(review) {
    nodes.names.value = review.reviewers || "";
    nodes.comment.value = review.comment || "";

    ["match", "facts", "design"].forEach(name => {
      nodes.form
        .querySelectorAll(`input[name="${name}"]`)
        .forEach(input => {
          input.checked = input.value === review[name];
        });
    });
  }
  
  function displayReview(review) {
    nodes.message.replaceChildren();
    nodes.message.className = "review-results";
  
    // Kinnitus, et tagasiside on salvestatud
    addFeedback(
      "Tagasiside salvestatud",
      `Hindajad: ${review.reviewers}`,
      "is-correct"
    );
  
    const savedCard = nodes.message.lastElementChild;
  
    // Plakati automaatkontroll
    if (currentPoster) {
      checkPoster(currentPoster);
    }
  
    // Eemaldame õigete vastuste teated
    for (const card of [...nodes.message.children]) {
      if (
        card !== savedCard &&
        !card.classList.contains("is-wrong")
      ) {
        card.remove();
      }
    }
  
    // Eemaldame üldise veateate, kui konkreetsed
    // valed faktid on juba eraldi välja toodud
    const cards = [...nodes.message.children];
  
    const hasWrongFacts = cards.some(card =>
      card.querySelector("strong")?.textContent ===
      "Kontrolli seda väidet"
    );
  
    if (hasWrongFacts) {
      cards.forEach(card => {
        if (
          card.querySelector("strong")?.textContent ===
          "Planeedi faktide kontroll"
        ) {
          card.remove();
        }
      });
    }
  
    // Kui automaatkontroll vigu ei leidnud
    if (nodes.message.children.length === 1) {
      addFeedback(
        "Plakati kontroll",
        "Automaatkontrollis vigu ei leitud.",
        "is-correct"
      );
    }
  
    // Teise paari kirjutatud soovitus
    if (review.comment) {
      addFeedback("Meie soovitus", review.comment);
    }
  
    nodes.message.hidden = false;
    nodes.next.hidden = false;
  }

  function loadPoster() {
    const progress = getProgress();
    const poster = progress.responses?.poster;

    const validPoster = poster &&
      data.planets.some(item => item.id === poster.planet);

    if (!validPoster) {
      currentPoster = null;
      currentSignature = "";

      nodes.poster.hidden = true;
      nodes.next.hidden = true;

      nodes.form
        .querySelectorAll("input, textarea, button")
        .forEach(input => {
          input.disabled = true;
        });

      showMessage(
        "Plakatit ei leitud. Avage see etapp arvutis, " +
        "kus plakat koostati ja salvestati."
      );

      return;
    }

    nodes.poster.hidden = false;

    nodes.form
      .querySelectorAll("input, textarea, button")
      .forEach(input => {
        input.disabled = false;
      });

    const signature = JSON.stringify(poster);

    if (signature !== currentSignature) {
      currentPoster = poster;
      currentSignature = signature;
      renderPoster(poster);
    }

    const review = progress.responses?.posterReview;

    if (
      review &&
      review.posterSignature === currentSignature
    ) {
      fillForm(review);
      displayReview(review);
    } else {
      nodes.form.reset();
      nodes.message.hidden = true;
      nodes.next.hidden = true;
    }
  }

  nodes.form.addEventListener("submit", event => {
    event.preventDefault();

    if (!currentPoster || !nodes.form.reportValidity()) {
      return;
    }

    const values = new FormData(nodes.form);

    const review = {
      posterSignature: currentSignature,
      reviewers: String(
        values.get("reviewers") || ""
      ).trim(),
      match: String(values.get("match") || ""),
      facts: String(values.get("facts") || ""),
      design: String(values.get("design") || ""),
      comment: String(values.get("comment") || "").trim()
    };

    if (
      !review.reviewers ||
      !["jah", "vajab"].includes(review.match) ||
      !["jah", "vajab"].includes(review.facts) ||
      !["vaga", "meeldib", "parem"].includes(review.design)
    ) {
      showMessage("Palun vastake kõigile küsimustele.");
      return;
    }

    document.dispatchEvent(
      new CustomEvent("lesson:save-response", {
        detail: {
          id: "posterReview",
          step: 6,
          value: review
        }
      })
    );

    displayReview(review);
  });

  nodes.form.addEventListener("input", () => {
    nodes.next.hidden = true;
    nodes.message.hidden = true;
  });

  nodes.next.addEventListener("click", () => {
    const nextStep = document.querySelector(
      '.journey-step[data-step="7"]'
    );

    if (!nextStep) return;

    step.open = false;
    nextStep.open = true;

    nextStep.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth",
      block: "start"
    });
  });

  step.addEventListener("toggle", () => {
    if (step.open) loadPoster();
  });

  document.addEventListener("lesson:save-response", event => {
    if (event.detail?.id === "poster") {
      loadPoster();
    }
  });

  loadPoster();
})();
