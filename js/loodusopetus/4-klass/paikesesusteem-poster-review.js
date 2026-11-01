(() => {
  const root = document.querySelector("#poster-review");
  const data = window.paikesesusteemData;
  if (!root || !data) return;

  const storageKey = window.lessonConfig.storageKey;
  const el = id => root.querySelector(`#${id}`);

  const empty = el("poster-review-empty");
  const layout = el("poster-review-layout");
  const formPanel = el("poster-review-form-panel");
  const form = el("poster-review-form");
  const resultPanel = el("poster-review-results");
  const peer = el("poster-review-peer");
  const check = el("poster-review-check");

  if (
    !empty || !layout || !formPanel ||
    !form || !resultPanel || !peer || !check
  ) return;

  let currentPoster = null;
  let currentSignature = "";

  function getProgress() {
    try {
      return JSON.parse(
        localStorage.getItem(storageKey) || "{}"
      );
    } catch {
      return {};
    }
  }

  function addLine(parent, heading, value, status = "") {
    const line = document.createElement("div");
    line.className = `poster-review-line ${status}`;

    const title = document.createElement("strong");
    title.textContent = heading;

    const text = document.createElement("p");
    text.textContent = value;

    line.append(title, text);
    parent.append(line);
  }

  function renderPoster(poster) {
    const planet = data.planets.find(
      item => item.id === poster.planet
    );

    el("poster-review-title").textContent =
      planet?.name || "Planeet";

    el("poster-review-subtitle").textContent =
      poster.subtitle || "";

    el("poster-review-bg").src = data.imageUrl(
      "taust",
      Number(poster.background) || 6
    );

    const image = el("poster-review-planet");
    const imageNumber = Number(poster.planetImage);

    if (
      Number.isInteger(imageNumber) &&
      imageNumber >= 1 &&
      imageNumber <= 8
    ) {
      image.src = data.imageUrl("planeet", imageNumber);
      image.hidden = false;
    } else {
      image.removeAttribute("src");
      image.hidden = true;
    }

    const decorationContainer =
      el("poster-review-decorations");

    decorationContainer.replaceChildren();

    const decorations = Array.isArray(poster.decorations)
      ? poster.decorations
      : poster.decoration
        ? [poster.decoration]
        : [];

    decorations.forEach(value => {
      const number = Number(value);

      if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > 8
      ) return;

      const layer = document.createElement("img");
      layer.className = "poster-layer poster-decor";
      layer.src = data.imageUrl("kaunistus", number);
      layer.alt = "";

      decorationContainer.append(layer);
    });

    const list = el("poster-review-facts");
    list.replaceChildren();

    const factTexts = Array.isArray(poster.factTexts)
      ? poster.factTexts
      : (poster.facts || []).map(
          index => data.facts[poster.planet]?.[Number(index)]?.[0]
        );

    factTexts.forEach(value => {
      if (!value) return;

      const item = document.createElement("li");
      item.className = "poster-fact";
      item.textContent = String(value);
      list.append(item);
    });

    el("poster-review-authors").textContent =
      `Autorid: ${poster.authors || ""}`;
  }

  function displayReview(review) {
    formPanel.hidden = true;
    resultPanel.hidden = false;

    peer.replaceChildren();
    check.replaceChildren();

    addLine(peer, "Hindajad", review.reviewers);

    addLine(
      peer,
      "Kas planeedi nimi ja pilt sobivad kokku?",
      review.image === "jah" ? "Jah" : "Vajab parandamist"
    );

    addLine(
      peer,
      "Kas kõik kolm fakti on õiged?",
      review.facts === "jah" ? "Jah" : "Vajab parandamist"
    );

    addLine(
      peer,
      "Kas plakatit on lihtne lugeda?",
      review.design === "jah" ? "Jah" : "Vajab parandamist"
    );

    if (review.comment) {
      addLine(peer, "Meeskonna soovitus", review.comment);
    }

    const expectedPlanet = data.planets.find(
      planet => planet.id === currentPoster.planet
    );

    const picturedPlanet = data.planets.find(
      planet =>
        planet.image === Number(currentPoster.planetImage)
    );

    if (
      expectedPlanet &&
      picturedPlanet?.id === expectedPlanet.id
    ) {
      addLine(
        check,
        "Planeedi pilt",
        "Pilt sobib planeedi nimega.",
        "is-correct"
      );
    } else {
      addLine(
        check,
        "Planeedi pilt",
        `Pilt ei sobi pealkirjaga. Pealkiri: ${
          expectedPlanet?.name || "–"
        }. Valitud pilt: ${
          picturedPlanet?.name || "tundmatu planeet"
        }.`,
        "is-wrong"
      );
    }

    const indices = Array.isArray(currentPoster.facts)
      ? currentPoster.facts.map(Number)
      : [];

    const bank = data.facts[currentPoster.planet] || [];

    const texts = Array.isArray(currentPoster.factTexts)
      ? currentPoster.factTexts
      : [];

    const mistakes = indices
      .map((index, position) => ({
        correct: bank[index]?.[1] === true,
        text:
          texts[position] ||
          bank[index]?.[0] ||
          `Väide ${position + 1}`
      }))
      .filter(item => !item.correct);

    if (indices.length === 3 && mistakes.length === 0) {
      addLine(
        check,
        "Planeedi faktid",
        "Kõik kolm fakti sobivad valitud planeedi kohta.",
        "is-correct"
      );
    } else {
      addLine(
        check,
        "Planeedi faktid",
        "Mõni fakt vajab parandamist.",
        "is-wrong"
      );

      mistakes.forEach(item => {
        addLine(
          check,
          "Kontrolli seda väidet",
          item.text,
          "is-wrong"
        );
      });

      if (indices.length !== 3) {
        addLine(
          check,
          "Faktide arv",
          "Plakatil peab olema kolm fakti.",
          "is-wrong"
        );
      }
    }
  }

  function fillForm(review) {
    el("poster-review-reviewers").value =
      review.reviewers || "";

    el("poster-review-comment").value =
      review.comment || "";

    ["image", "facts", "design"].forEach(name => {
      form.querySelectorAll(`input[name="${name}"]`)
        .forEach(input => {
          input.checked = input.value === review[name];
        });
    });
  }

  function loadPoster() {
    const progress = getProgress();
    const poster = progress.responses?.poster;

    if (
      !poster ||
      !data.planets.some(planet => planet.id === poster.planet)
    ) {
      currentPoster = null;
      currentSignature = "";

      empty.hidden = false;
      layout.hidden = true;
      return;
    }

    empty.hidden = true;
    layout.hidden = false;

    const signature = JSON.stringify(poster);

    if (signature !== currentSignature) {
      currentPoster = poster;
      currentSignature = signature;
      renderPoster(poster);
    }

    const review = progress.responses?.posterReview;

    if (review?.posterSignature === currentSignature) {
      fillForm(review);
      displayReview(review);
    } else {
      form.reset();
      formPanel.hidden = false;
      resultPanel.hidden = true;
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!currentPoster || !form.reportValidity()) return;

    const values = new FormData(form);

    const review = {
      posterSignature: currentSignature,
      reviewers: String(
        values.get("reviewers") || ""
      ).trim(),
      image: String(values.get("image") || ""),
      facts: String(values.get("facts") || ""),
      design: String(values.get("design") || ""),
      comment: String(values.get("comment") || "").trim()
    };

    if (
      !review.reviewers ||
      [review.image, review.facts, review.design]
        .some(value => !["jah", "ei"].includes(value))
    ) return;

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

  el("poster-review-edit").addEventListener("click", () => {
    formPanel.hidden = false;
    resultPanel.hidden = true;
    form.querySelector("input")?.focus();
  });

  root.closest(".journey-step")
    ?.addEventListener("toggle", event => {
      if (event.currentTarget.open) {
        loadPoster();
      }
    });

  document.addEventListener("lesson:save-response", event => {
    if (event.detail?.id === "poster") {
      loadPoster();
    }
  });

  loadPoster();
})();
