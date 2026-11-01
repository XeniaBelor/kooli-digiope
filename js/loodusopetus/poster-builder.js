(() => {
  const root = document.querySelector("#poster-builder");
  if (!root) return;

  // Image paths are relative to this JavaScript file
  const imagePath = new URL(
    "../../images/loodusopetus/poster/",
    document.currentScript.src
  ).href;

  function imageUrl(type, number) {
    return `${imagePath}4-klass_poster-${type}${number}.webp`;
  }

  // Planets
  const planets = [
    { id: "merkuur", name: "Merkuur", image: 1 },
    { id: "veenus", name: "Veenus", image: 2 },
    { id: "maa", name: "Maa", image: 3 },
    { id: "marss", name: "Marss", image: 4 },
    { id: "jupiter", name: "Jupiter", image: 5 },
    { id: "saturn", name: "Saturn", image: 6 },
    { id: "uraan", name: "Uraan", image: 7 },
    { id: "neptuun", name: "Neptuun", image: 8 }
  ];

  // Short introductions
  const subtitles = [
    "Avastame ühe põneva planeedi!",
    "Kolm huvitavat fakti meie planeedist.",
    "Meie avastusretk Päikesesüsteemis.",
    "Mis teeb selle planeedi eriliseks?"
  ];

  // Poster backgrounds
  const backgrounds = [
    { number: 1, name: "Punane", color: "#c54a50" },
    { number: 2, name: "Oranž", color: "#d77a24" },
    { number: 3, name: "Kollane", color: "#a88100" },
    { number: 4, name: "Roheline", color: "#26834e" },
    { number: 5, name: "Helesinine", color: "#197eac" },
    { number: 6, name: "Sinine", color: "#2764c1" },
    { number: 7, name: "Violetne", color: "#7851b6" }
  ];

  // Three correct and three incorrect facts per planet
  const factBank = {
    merkuur: [
      {
        text: "See on Päikesesüsteemi kõige väiksem planeet. 🪨",
        correct: true
      },
      {
        text: "Sellel planeedil on suured rõngad. 🪐",
        correct: false
      },
      {
        text: "See asub Päikesele kõige lähemal. ☀️",
        correct: true
      },
      {
        text: "Sellel planeedil on kaks kuud. 🌙",
        correct: false
      },
      {
        text: "Sellel planeedil ei ole kuusid. 🔭",
        correct: true
      },
      {
        text: "See on Päikesesüsteemi kõige suurem planeet. 🌍",
        correct: false
      }
    ],

    veenus: [
      {
        text: "See on Päikesest teine planeet. ☀️",
        correct: true
      },
      {
        text: "See on Päikesesüsteemi kõige väiksem planeet. 🪨",
        correct: false
      },
      {
        text: "See on Päikesesüsteemi kõige kuumem planeet. 🔥",
        correct: true
      },
      {
        text: "Sellel planeedil elavad inimesed. 🏠",
        correct: false
      },
      {
        text: "Sellel planeedil ei ole kuusid. 🔭",
        correct: true
      },
      {
        text: "See asub Päikesest kõige kaugemal. 🌌",
        correct: false
      }
    ],

    maa: [
      {
        text: "See on Päikesest kolmas planeet. ☀️",
        correct: true
      },
      {
        text: "See on Päikesesüsteemi kõige suurem planeet. 🌍",
        correct: false
      },
      {
        text: "Sellel planeedil on üks looduslik kaaslane. 🌙",
        correct: true
      },
      {
        text: "See on Päikesest teine planeet. 🔭",
        correct: false
      },
      {
        text: "See on ainus teadaolev planeet, kus leidub elu. 🌱",
        correct: true
      },
      {
        text: "See on tuntud suurte rõngaste poolest. 🪐",
        correct: false
      }
    ],

    marss: [
      {
        text: "Seda tuntakse punase planeedina. 🔴",
        correct: true
      },
      {
        text: "See asub Päikesele kõige lähemal. ☀️",
        correct: false
      },
      {
        text: "See on Päikesest neljas planeet. 🔭",
        correct: true
      },
      {
        text: "See on Päikesesüsteemi kõige kuumem planeet. 🔥",
        correct: false
      },
      {
        text: "Sellel planeedil on kaks kuud. 🌙",
        correct: true
      },
      {
        text: "Sellel planeedil on vedela veega ookeanid. 🌊",
        correct: false
      }
    ],

    jupiter: [
      {
        text: "See on Päikesesüsteemi kõige suurem planeet. 🌍",
        correct: true
      },
      {
        text: "Sellel planeedil ei ole kuusid. 🌙",
        correct: false
      },
      {
        text: "See on gaasihiid. ☁️",
        correct: true
      },
      {
        text: "See asub Päikesele kõige lähemal. ☀️",
        correct: false
      },
      {
        text: "Selle atmosfääris asub Suur Punane Laik. 🌪️",
        correct: true
      },
      {
        text: "Sellel planeedil on tahke kivine pind. 🪨",
        correct: false
      }
    ],

    saturn: [
      {
        text: "See on tuntud oma suurte rõngaste poolest. 🪐",
        correct: true
      },
      {
        text: "See on Päikesest kolmas planeet. ☀️",
        correct: false
      },
      {
        text: "See on gaasihiid. ☁️",
        correct: true
      },
      {
        text: "Sellel planeedil ei ole kuusid. 🌙",
        correct: false
      },
      {
        text: "See on Päikesest kuues planeet. 🔭",
        correct: true
      },
      {
        text: "See on Päikesesüsteemi kõige väiksem planeet. 🪨",
        correct: false
      }
    ],

    uraan: [
      {
        text: "See on Päikesest seitsmes planeet. ☀️",
        correct: true
      },
      {
        text: "See on Päikesesüsteemi kõige kuumem planeet. 🔥",
        correct: false
      },
      {
        text: "See pöörleb peaaegu külili. 🔄",
        correct: true
      },
      {
        text: "See asub Päikesele kõige lähemal. 🔭",
        correct: false
      },
      {
        text: "See on jäähiid. ❄️",
        correct: true
      },
      {
        text: "Sellel planeedil ei ole kuusid. 🌙",
        correct: false
      }
    ],

    neptuun: [
      {
        text: "See on Päikesest kaheksas planeet. ☀️",
        correct: true
      },
      {
        text: "See asub Päikesele kõige lähemal. 🔭",
        correct: false
      },
      {
        text: "See on jäähiid. ❄️",
        correct: true
      },
      {
        text: "See on Päikesesüsteemi kõige väiksem planeet. 🪨",
        correct: false
      },
      {
        text: "See asub Päikesest kõige kaugemal. 🌌",
        correct: true
      },
      {
        text: "Sellel planeedil ei ole kuusid. 🌙",
        correct: false
      }
    ]
  };

  // Progress storage
  const storageKey =
    window.lessonConfig?.storageKey || "digiope-paikesesusteem";

  let savedPoster = null;

  try {
    const progress = JSON.parse(
      localStorage.getItem(storageKey) || "{}"
    );

    savedPoster = progress.responses?.poster || null;
  } catch {
    savedPoster = null;
  }

  function validNumber(value, min, max, fallback) {
    const number = Number(
      String(value ?? "").replace(/\D/g, "")
    );

    return Number.isInteger(number) &&
      number >= min && number <= max
      ? number
      : fallback;
  }

  // Support old saved posters
  let savedDecorations = [];

  if (Array.isArray(savedPoster?.decorations)) {
    savedDecorations = savedPoster.decorations;
  } else if (savedPoster?.decoration) {
    savedDecorations = [savedPoster.decoration];
  }

  savedDecorations = [
    ...new Set(
      savedDecorations
        .map(value => validNumber(value, 1, 8, 0))
        .filter(Boolean)
    )
  ].slice(0, 3);

  const state = {
    planet: savedPoster?.planet || "merkuur",

    subtitle: subtitles.includes(savedPoster?.subtitle)
      ? savedPoster.subtitle
      : subtitles[0],

    facts: Array.isArray(savedPoster?.facts)
      ? [...new Set(
          savedPoster.facts.map(Number).filter(
            n => Number.isInteger(n) && n >= 0 && n < 6
          )
        )].slice(0, 3)
      : [],

    background: validNumber(
      savedPoster?.background, 1, 7, 6
    ),

    decorations: savedDecorations,

    authors: savedPoster?.authors || ""
  };

  if (!planets.some(p => p.id === state.planet)) {
    state.planet = "merkuur";
    state.facts = [];
  }

  // Existing HTML elements
  const elements = {
    planets: root.querySelector("#poster-planets"),
    subtitles: root.querySelector("#poster-subtitles"),
    facts: root.querySelector("#poster-fact-options"),
    backgrounds: root.querySelector("#poster-backgrounds"),
    decorations: root.querySelector("#poster-decorations"),
    authors: root.querySelector("#poster-authors"),
    count: root.querySelector("#poster-fact-count"),
    title: root.querySelector("#poster-title"),
    subtitle: root.querySelector("#poster-subtitle"),
    list: root.querySelector("#poster-facts"),
    team: root.querySelector("#poster-team"),
    bg: root.querySelector("#poster-bg"),
    planetImage: root.querySelector("#poster-planet"),
    oldDecor: root.querySelector("#poster-decor"),
    preview: root.querySelector("#poster-preview"),
    save: root.querySelector("#poster-save"),
    message: root.querySelector("#poster-message")
  };

  // Make existing HTML compatible with the CSS classes
  root.querySelectorAll(".poster-control-group").forEach(group => {
    group.classList.add("poster-section");
  });

  root.querySelector(".poster-preview-area")
    ?.classList.add("poster-preview-panel");

  elements.planets.classList.remove("poster-option-grid");
  elements.subtitles.classList.remove("poster-option-list");

  elements.facts.classList.add("poster-fact-options");

  elements.backgrounds.classList.remove("poster-option-grid");
  elements.backgrounds.classList.add("poster-options-grid");

  elements.decorations.classList.remove("poster-option-grid");
  elements.decorations.classList.add("poster-options-grid");

  elements.count.classList.add("poster-fact-counter");
  elements.authors.classList.add("poster-text-input");

  elements.title.classList.add("poster-title");
  elements.subtitle.classList.add("poster-subtitle");
  elements.team.classList.add("poster-authors");

  elements.list.style.listStyle = "none";
  elements.list.style.margin = "0";
  elements.list.style.padding = "0";

  // Hide the old single-decoration image
  elements.oldDecor.hidden = true;
  elements.oldDecor.removeAttribute("src");

  // Counter for decorations
  const decorationCounter = document.createElement("p");
  decorationCounter.className = "poster-fact-counter";
  elements.decorations.after(decorationCounter);

  // Message area
  function showMessage(message, success) {
    elements.message.textContent = message;
    elements.message.className = success
      ? "learning-box"
      : "answer-feedback is-wrong";

    elements.message.hidden = false;
  }

  function markChanged() {
    elements.message.hidden = true;
    renderPoster();
  }

  // Create select menus
  function createSelect(target, options, selected, onChange, label) {
    const select = document.createElement("select");
    select.className = "poster-select";
    select.setAttribute("aria-label", label);

    options.forEach(item => {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      select.append(option);
    });

    select.value = selected;

    select.addEventListener("change", () => {
      onChange(select.value);
      markChanged();
    });

    target.replaceChildren(select);
  }

  // 1. Planet selection
  createSelect(
    elements.planets,
    planets.map(p => ({
      value: p.id,
      label: p.name
    })),
    state.planet,
    value => {
      if (state.planet !== value) {
        state.planet = value;
        state.facts = [];
        renderFacts();
      }
    },
    "Valige planeet"
  );

  // 2. Introduction selection
  createSelect(
    elements.subtitles,
    subtitles.map(text => ({
      value: text,
      label: text
    })),
    state.subtitle,
    value => {
      state.subtitle = value;
    },
    "Valige lühike tutvustus"
  );

  // 3. Fact selection
  function renderFacts() {
    elements.facts.replaceChildren();

    factBank[state.planet].forEach((fact, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "poster-option facts-option";

      const selected = state.facts.includes(index);

      button.classList.toggle("fact-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
      button.textContent = fact.text;

      button.addEventListener("click", () => {
        if (state.facts.includes(index)) {
          state.facts = state.facts.filter(i => i !== index);
        } else {
          if (state.facts.length >= 3) {
            showMessage(
              "Saate valida ainult kolm fakti.",
              false
            );
            return;
          }

          state.facts.push(index);
        }

        renderFacts();
        markChanged();
      });

      elements.facts.append(button);
    });

    elements.count.textContent =
      `Valitud: ${state.facts.length} / 3`;
  }

  // 4. Background selection
  function renderBackgrounds() {
    elements.backgrounds.replaceChildren();

    backgrounds.forEach(bg => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "poster-option small-label";

      const selected = state.background === bg.number;

      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));

      button.textContent = bg.name;
      button.style.color = bg.color;

      button.addEventListener("click", () => {
        state.background = bg.number;
        renderBackgrounds();
        markChanged();
      });

      elements.backgrounds.append(button);
    });
  }

  // 5. Decoration selection — maximum 3
  function renderDecorations() {
    elements.decorations.replaceChildren();

    const noneButton = document.createElement("button");
    noneButton.type = "button";
    noneButton.className = "poster-option small-label";
    noneButton.textContent = "Ilma kaunistuseta";

    const noDecorations = state.decorations.length === 0;

    noneButton.classList.toggle("selected", noDecorations);
    noneButton.setAttribute(
      "aria-pressed",
      String(noDecorations)
    );

    noneButton.addEventListener("click", () => {
      state.decorations = [];
      renderDecorations();
      markChanged();
    });

    elements.decorations.append(noneButton);

    for (let number = 1; number <= 8; number++) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "poster-option small-label";
      button.textContent = `Kaunistus ${number}`;

      const selected = state.decorations.includes(number);

      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));

      button.addEventListener("click", () => {
        if (state.decorations.includes(number)) {
          state.decorations = state.decorations.filter(
            item => item !== number
          );
        } else {
          if (state.decorations.length >= 3) {
            showMessage(
              "Saate valida kuni kolm kaunistust.",
              false
            );
            return;
          }

          state.decorations.push(number);
        }

        renderDecorations();
        markChanged();
      });

      elements.decorations.append(button);
    }

    decorationCounter.textContent =
      `Valitud: ${state.decorations.length} / 3`;
  }

  // 6. Authors
  elements.authors.value = state.authors;

  elements.authors.addEventListener("input", () => {
    state.authors = elements.authors.value;
    markChanged();
  });

  // Update images only when their paths change
  function setImage(img, url) {
    if (img.getAttribute("src") !== url) {
      img.src = url;
    }
  }

  // Render overlapping decorations
  let lastDecorationSignature = null;

  function renderDecorationLayers() {
    const signature = state.decorations.join(",");

    if (signature === lastDecorationSignature) return;

    lastDecorationSignature = signature;

    elements.preview
      .querySelectorAll("[data-poster-decoration]")
      .forEach(img => img.remove());

    const heading = elements.preview.querySelector(".poster-head");

    state.decorations.forEach(number => {
      const image = document.createElement("img");
      image.className = "poster-layer poster-decor";
      image.dataset.posterDecoration = String(number);
      image.src = imageUrl("kaunistus", number);
      image.alt = "";
      image.decoding = "async";

      elements.preview.insertBefore(image, heading);
    });
  }

  // Live poster preview
  function renderPoster() {
    const planet = planets.find(p => p.id === state.planet);

    elements.title.textContent = planet.name;
    elements.subtitle.textContent = state.subtitle;

    setImage(
      elements.bg,
      imageUrl("taust", state.background)
    );

    setImage(
      elements.planetImage,
      imageUrl("planeet", planet.image)
    );

    renderDecorationLayers();

    elements.list.replaceChildren();

    if (state.facts.length === 0) {
      const placeholder = document.createElement("li");
      placeholder.className = "poster-fact";
      placeholder.textContent = "Valige kolm huvitavat fakti.";
      elements.list.append(placeholder);
    } else {
      state.facts.forEach(index => {
        const fact = factBank[state.planet][index];
        if (!fact) return;

        const item = document.createElement("li");
        item.className = "poster-fact";
        item.textContent = fact.text;

        elements.list.append(item);
      });
    }

    elements.team.textContent = state.authors.trim()
      ? `Autorid: ${state.authors.trim()}`
      : "Autorid: ...";
  }

  // Check and save
  elements.save.addEventListener("click", () => {
    if (state.facts.length !== 3) {
      showMessage(
        "Valige täpselt kolm fakti.",
        false
      );
      return;
    }

    const allCorrect = state.facts.every(
      index => factBank[state.planet][index]?.correct === true
    );

    if (!allCorrect) {
      showMessage(
        "Mõni valitud fakt ei sobi selle planeedi kohta. " +
        "Uurige veel ja proovige uuesti.",
        false
      );
      return;
    }

    if (!state.authors.trim()) {
      showMessage(
        "Kirjutage plakati autorite eesnimed.",
        false
      );
      elements.authors.focus();
      return;
    }

    // Saved structure for stage 6
    const posterData = {
      planet: state.planet,
      subtitle: state.subtitle,
      facts: [...state.facts],
      factTexts: state.facts.map(
        index => factBank[state.planet][index].text
      ),
      background: state.background,
      decorations: [...state.decorations],
      authors: state.authors.trim()
    };

    // Existing lesson.js saves the poster and completes stage 5
    document.dispatchEvent(
      new CustomEvent("lesson:save-response", {
        detail: {
          id: "poster",
          step: 5,
          value: posterData
        }
      })
    );

    showMessage(
      "Plakat on salvestatud! Etapp läbitud!",
      true
    );
  });

  // Initialize
  renderFacts();
  renderBackgrounds();
  renderDecorations();
  renderPoster();

  if (savedPoster) {
    showMessage(
      "Salvestatud plakat on avatud.",
      true
    );
  }
})();
