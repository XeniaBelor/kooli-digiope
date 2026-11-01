(() => {
  const root = document.querySelector("#poster-review");
  if (!root) return;

  const imagePath = new URL(
    "../../images/loodusopetus/poster/",
    document.currentScript.src
  ).href;

  const imageUrl = (type, number) =>
    `${imagePath}4-klass_poster-${type}${number}.webp`;

  const planetNames = [
    "Merkuur", "Veenus", "Maa", "Marss",
    "Jupiter", "Saturn", "Uraan", "Neptuun"
  ];

  const planetIds = [
    "merkuur", "veenus", "maa", "marss",
    "jupiter", "saturn", "uraan", "neptuun"
  ];

  const correctFactIndices = new Set([0, 2, 4]);

  const storageKey =
    window.lessonConfig?.storageKey || "digiope-paikesesusteem";

  const el = id => root.querySelector(`#${id}`);

  const empty = el("poster-review-empty");
  const layout = el("poster-review-layout");
  const preview = el("poster-review-preview");
  const formPanel = el("poster-review-form-panel");
  const form = el("poster-review-form");
  const resultPanel = el("poster-review-results");
  const peer = el("poster-review-peer");
  const check = el("poster-review-check");

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

  function addLine(parent, label, value, status = "") {
    const line = document.createElement("div");
    line.className = `poster-review-line ${status}`;

    const heading = document.createElement("strong");
    heading.textContent = label;

    const text = document.createElement("p");
    text.textContent = value;

    line.append(heading, text);
    parent.append(line);
  }

  function renderPoster(poster) {
    const image = el("poster-review-planet");
    const background = el("poster-review-bg");
    const decorationContainer =
      el("poster-review-decorations");
    const title = el("poster-review-title");
    const subtitle = el("poster-review-subtitle");
    const facts = el("poster-review-facts");
    const authors = el("poster-review-authors");

    const index = planetIds.indexOf(poster.planet);

    title.textContent =
      index >= 0 ? planetNames[index] : "Planeet";

    subtitle.textContent = poster.subtitle || "";

    background.src = imageUrl(
      "taust",
      Number(poster.background) || 1
    );

    image.src = imageUrl(
      "planeet",
      Number(poster.planetImage) || 1
    );

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
      layer.src = imageUrl("kaunistus", number);
      layer.alt = "";

      decorationContainer.append(layer);
    });

    facts.replaceChildren();

    const factTexts = Array.isArray(poster.factTexts)
      ? poster.factTexts
      : [];

    factTexts.forEach(value => {
      const item = document.createElement("li");
      item.className = "poster-fact";
      item.textContent = String(value);
      facts.append(item);
    });

    authors.textContent =
      `Autorid: ${poster.authors || ""}`;
  }

  function displayReview(review) {
    formPanel.hidden = true;
    resultPanel.hidden = false;

    peer.replaceChildren();
    check.replaceChildren();

    addLine(
      peer,
      "Hindajad",
      review.reviewers
    );

    addLine(
      peer,
      "Kas pilt sobib planeedi nimega?",
      review.image === "jah"
        ? "Jah"
        : "Vajab parandamist"
    );

    addLine(
      peer,
      "Kas kõik kolm fakti on õiged?",
      review.facts === "jah"
        ? "Jah"
        : "Vajab parandamist"
    );

    addLine(
      peer,
      "Kas plakat on selge ja loetav?",
      review.design === "jah"
        ? "Jah"
        : "Vajab parandamist"
    );

    if (review.comment) {
      addLine(
        peer,
        "Meeskonna soovitus",
        review.comment
      );
    }

    const expectedImage =
      planetIds.indexOf(currentPoster.planet) + 1;

    const chosenImage =
      Number(currentPoster.planetImage);

    if (chosenImage === expectedImage) {
      addLine(
        check,
        "Planeedi pilt",
        "Pilt vastab planeedi nimele.",
        "is-correct"
      );
    } else {
      addLine(
        check,
        "Planeedi pilt",
        `Pilt ei vasta nimele. Pealkiri: ${
          planetNames[expectedImage - 1] || "–"
        }. Pildil: ${
          planetNames[chosenImage - 1] || "tundmatu planeet"
        }.`,
        "is-wrong"
      );
    }

    const indices = Array.isArray(currentPoster.facts)
      ? currentPoster.facts.map(Number)
      : [];

    const texts = Array.isArray(currentPoster.factTexts)
      ? currentPoster.factTexts
      : [];

    const incorrectFacts = indices
      .map((value, index) => ({
        value,
        text: String(
          texts[index] || `Fakt ${index + 1}`
        )
      }))
      .filter(item =>
        !correctFactIndices.has(item.value)
      );

    if (
      indices.length === 3 &&
      incorrectFacts.length === 0
    ) {
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
        "Need väited ei sobi valitud planeedi kohta:",
        "is-wrong"
      );

      incorrectFacts.forEach(item => {
        addLine(
          check,
          "Vajab parandamist",
          item.text,
          "is-wrong"
        );
      });
    }
  }

  function fillForm(review) {
    el("poster-review-reviewers").value =
      review.reviewers || "";

    el("poster-review-comment").value =
      review.comment || "";

    ["image", "facts", "design"].forEach(name => {
      form.querySelectorAll(
        `input[name="${name}"]`
      ).forEach(input => {
        input.checked =
          input.value === review[name];
      });
    });
  }

  function loadPoster() {
    const progress = getProgress();
    const poster = progress.responses?.poster;

    if (
      !poster ||
      !planetIds.includes(poster.planet)
    ) {
      empty.hidden = false;
      layout.hidden = true;
      return;
    }

    empty.hidden = true;
    layout.hidden = false;

    const newSignature = JSON.stringify(poster);

    if (newSignature !== currentSignature) {
      currentPoster = poster;
      currentSignature = newSignature;
      renderPoster(poster);
    }

    const savedReview =
      progress.responses?.posterReview;

    if (
      savedReview?.posterSignature ===
      currentSignature
    ) {
      fillForm(savedReview);
      displayReview(savedReview);
    } else {
      form.reset();
      formPanel.hidden = false;
      resultPanel.hidden = true;
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!currentPoster) return;

    const data = new FormData(form);

    const review = {
      posterSignature: currentSignature,
      reviewers: String(
        data.get("reviewers") || ""
      ).trim(),
      image: String(data.get("image") || ""),
      facts: String(data.get("facts") || ""),
      design: String(data.get("design") || ""),
      comment: String(
        data.get("comment") || ""
      ).trim()
    };

    const answers = [
      review.image,
      review.facts,
      review.design
    ];

    if (
      !review.reviewers ||
      answers.some(value =>
        !["jah", "ei"].includes(value)
      )
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

  el("poster-review-edit").addEventListener(
    "click",
    () => {
      formPanel.hidden = false;
      resultPanel.hidden = true;
      form.querySelector("input")?.focus();
    }
  );

  root.closest(".journey-step")
    ?.addEventListener("toggle", event => {
      if (event.currentTarget.open) {
        loadPoster();
      }
    });

  document.addEventListener(
    "lesson:save-response",
    event => {
      if (event.detail?.id === "poster") {
        loadPoster();
      }
    }
  );

  loadPoster();
})();
