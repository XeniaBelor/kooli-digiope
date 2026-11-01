(() => {
  const root = document.querySelector("#poster-builder");
  if (!root) return;

  const imagePath = new URL(
    "../../images/loodusopetus/poster/",
    document.currentScript.src
  ).href;

  const imageUrl = (type, number) =>
    `${imagePath}4-klass_poster-${type}${number}.webp`;

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

  const subtitles = [
    "Avastame ühe põneva planeedi!",
    "Kolm huvitavat fakti planeedist.",
    "Meie avastusretk Päikesesüsteemis.",
    "Mis teeb selle planeedi eriliseks?",
    "Avastame kosmose saladusi!",
    "Üks planeet, palju põnevaid avastusi!",
    "Lähme koos planeeti avastama!"
  ];

  const backgrounds = [
    { number: 1, name: "Punane", color: "#c54a50" },
    { number: 2, name: "Oranž", color: "#d77a24" },
    { number: 3, name: "Kollane", color: "#a88100" },
    { number: 4, name: "Roheline", color: "#26834e" },
    { number: 5, name: "Helesinine", color: "#197eac" },
    { number: 6, name: "Sinine", color: "#2764c1" },
    { number: 7, name: "Violetne", color: "#7851b6" }
  ];

  const factBank = {
    merkuur: [
      ["See on Päikesesüsteemi kõige väiksem planeet. 🪨", true],
      ["Sellel planeedil on suured rõngad. 🪐", false],
      ["See asub Päikesele kõige lähemal. ☀️", true],
      ["Sellel planeedil on kaks kuud. 🌙", false],
      ["Sellel planeedil ei ole kuusid. 🔭", true],
      ["See on Päikesesüsteemi kõige suurem planeet. 🌍", false]
    ],
    veenus: [
      ["See on Päikesest teine planeet. ☀️", true],
      ["See on Päikesesüsteemi kõige väiksem planeet. 🪨", false],
      ["See on Päikesesüsteemi kõige kuumem planeet. 🔥", true],
      ["Sellel planeedil elavad inimesed. 🏠", false],
      ["Sellel planeedil ei ole kuusid. 🔭", true],
      ["See asub Päikesest kõige kaugemal. 🌌", false]
    ],
    maa: [
      ["See on Päikesest kolmas planeet. ☀️", true],
      ["See on Päikesesüsteemi kõige suurem planeet. 🌍", false],
      ["Sellel planeedil on üks looduslik kaaslane. 🌙", true],
      ["See on Päikesest teine planeet. 🔭", false],
      ["See on ainus teadaolev planeet, kus leidub elu. 🌱", true],
      ["See on tuntud suurte rõngaste poolest. 🪐", false]
    ],
    marss: [
      ["Seda tuntakse punase planeedina. 🔴", true],
      ["See asub Päikesele kõige lähemal. ☀️", false],
      ["See on Päikesest neljas planeet. 🔭", true],
      ["See on Päikesesüsteemi kõige kuumem planeet. 🔥", false],
      ["Sellel planeedil on kaks kuud. 🌙", true],
      ["Sellel planeedil on vedela veega ookeanid. 🌊", false]
    ],
    jupiter: [
      ["See on Päikesesüsteemi kõige suurem planeet. 🌍", true],
      ["Sellel planeedil ei ole kuusid. 🌙", false],
      ["See on gaasihiid. ☁️", true],
      ["See asub Päikesele kõige lähemal. ☀️", false],
      ["Selle atmosfääris asub Suur Punane Laik. 🌪️", true],
      ["Sellel planeedil on tahke kivine pind. 🪨", false]
    ],
    saturn: [
      ["See on tuntud oma suurte rõngaste poolest. 🪐", true],
      ["See on Päikesest kolmas planeet. ☀️", false],
      ["See on gaasihiid. ☁️", true],
      ["Sellel planeedil ei ole kuusid. 🌙", false],
      ["See on Päikesest kuues planeet. 🔭", true],
      ["See on Päikesesüsteemi kõige väiksem planeet. 🪨", false]
    ],
    uraan: [
      ["See on Päikesest seitsmes planeet. ☀️", true],
      ["See on Päikesesüsteemi kõige kuumem planeet. 🔥", false],
      ["See pöörleb peaaegu külili. 🔄", true],
      ["See asub Päikesele kõige lähemal. 🔭", false],
      ["See on jäähiid. ❄️", true],
      ["Sellel planeedil ei ole kuusid. 🌙", false]
    ],
    neptuun: [
      ["See on Päikesest kaheksas planeet. ☀️", true],
      ["See asub Päikesele kõige lähemal. 🔭", false],
      ["See on jäähiid. ❄️", true],
      ["See on Päikesesüsteemi kõige väiksem planeet. 🪨", false],
      ["See asub Päikesest kõige kaugemal. 🌌", true],
      ["Sellel planeedil ei ole kuusid. 🌙", false]
    ]
  };

  const storageKey =
    window.lessonConfig?.storageKey || "digiope-paikesesusteem";

  let savedPoster = null;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    savedPoster = saved.responses?.poster || null;
  } catch {
    savedPoster = null;
  }

  function validNumber(value, min, max, fallback) {
    const number = Number(value);
    return Number.isInteger(number) && number >= min && number <= max
      ? number
      : fallback;
  }

  const oldDecorations = Array.isArray(savedPoster?.decorations)
    ? savedPoster.decorations
    : savedPoster?.decoration
      ? [savedPoster.decoration]
      : [];

  const state = {
    planet: planets.some(p => p.id === savedPoster?.planet)
      ? savedPoster.planet
      : "merkuur",

    planetImage: validNumber(savedPoster?.planetImage, 1, 8, null),

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

    background: validNumber(savedPoster?.background, 1, 7, 6),

    decorations: [...new Set(
      oldDecorations
        .map(n => validNumber(n, 1, 8, null))
        .filter(Boolean)
    )].slice(0, 3),

    authors: typeof savedPoster?.authors === "string"
      ? savedPoster.authors
      : ""
  };

  let imageCursor = state.planetImage || 5;

  const elements = {
    planets: root.querySelector("#poster-planets"),
    imageChoice: root.querySelector("#poster-image-choice"),
    imagePrev: root.querySelector("#poster-image-prev"),
    imageNext: root.querySelector("#poster-image-next"),
    imageSelect: root.querySelector("#poster-image-select"),
    imageStatus: root.querySelector("#poster-image-status"),
    subtitles: root.querySelector("#poster-subtitles"),
    facts: root.querySelector("#poster-fact-options"),
    count: root.querySelector("#poster-fact-count"),
    backgrounds: root.querySelector("#poster-backgrounds"),
    decorations: root.querySelector("#poster-decorations"),
    authors: root.querySelector("#poster-authors"),
    bg: root.querySelector("#poster-bg"),
    planetImage: root.querySelector("#poster-planet"),
    oldDecor: root.querySelector("#poster-decor"),
    preview: root.querySelector("#poster-preview"),
    title: root.querySelector("#poster-title"),
    subtitle: root.querySelector("#poster-subtitle"),
    list: root.querySelector("#poster-facts"),
    team: root.querySelector("#poster-team"),
    save: root.querySelector("#poster-save"),
    message: root.querySelector("#poster-message"),
    next: root.querySelector("#poster-next")
  };

  if (Object.values(elements).some(element => !element)) return;

  elements.oldDecor.hidden = true;
  elements.oldDecor.removeAttribute("src");
  elements.count.hidden = true;

  function signature() {
    return JSON.stringify({
      planet: state.planet,
      planetImage: state.planetImage,
      subtitle: state.subtitle,
      facts: [...state.facts],
      background: state.background,
      decorations: [...state.decorations],
      authors: state.authors.trim()
    });
  }

  let savedSignature = savedPoster?.planetImage
    ? signature()
    : null;

  function showMessage(message, success) {
    elements.message.textContent = message;
    elements.message.className = success
      ? "learning-box"
      : "answer-feedback is-wrong";
    elements.message.hidden = false;
  }

  function markChanged() {
    if (savedSignature && signature() === savedSignature) {
      showMessage("Salvestatud plakat on avatud.", true);
      elements.next.hidden = false;
    } else {
      elements.next.hidden = true;

      if (savedSignature) {
        showMessage(
          "Plakatil on salvestamata muudatusi. Salvestage plakat uuesti.",
          false
        );
      } else {
        elements.message.hidden = true;
      }
    }

    renderPoster();
  }

  function createSelect(target, options, selected, label, onChange) {
    const select = document.createElement("select");
    select.className = "poster-select";
    select.setAttribute("aria-label", label);

    options.forEach(item => {
      const option = document.createElement("option");
      option.value = String(item.value);
      option.textContent = item.label;
      select.append(option);
    });

    select.value = String(selected);
    select.addEventListener("change", () => onChange(select.value));

    target.replaceChildren(select);
    return select;
  }

  createSelect(
    elements.planets,
    planets.map(p => ({ value: p.id, label: p.name })),
    state.planet,
    "Valige planeet",
    value => {
      if (value === state.planet) return;

      state.planet = value;
      state.facts = [];
      renderFacts();
      markChanged();
    }
  );

  function renderImageChoice() {
    elements.imageChoice.src = imageUrl("planeet", imageCursor);
    elements.imageChoice.alt = "Valitava planeedi pilt";

    elements.imageStatus.textContent = state.planetImage
      ? "Planeedi pilt on valitud."
      : "Valige sobiv planeedi pilt.";
  }

  function chooseImage(number) {
    state.planetImage = number;
    renderImageChoice();
    markChanged();
  }

  elements.imagePrev.addEventListener("click", () => {
    imageCursor = imageCursor === 1 ? 8 : imageCursor - 1;
    chooseImage(imageCursor);
  });

  elements.imageNext.addEventListener("click", () => {
    imageCursor = imageCursor === 8 ? 1 : imageCursor + 1;
    chooseImage(imageCursor);
  });

  elements.imageSelect.addEventListener("click", () => {
    chooseImage(imageCursor);
  });

  createSelect(
    elements.subtitles,
    subtitles.map(text => ({ value: text, label: text })),
    state.subtitle,
    "Valige lühike tutvustus",
    value => {
      state.subtitle = value;
      markChanged();
    }
  );

  function createDropdown(target, label) {
    const details = document.createElement("details");
    details.className = "poster-dropdown";

    const summary = document.createElement("summary");
    summary.textContent = label;

    const list = document.createElement("div");
    list.className = "poster-dropdown-list";

    details.append(summary, list);
    target.replaceChildren(details);

    return { summary, list };
  }

  function renderFacts() {
    const dropdown = createDropdown(
      elements.facts,
      `Valige faktid (${state.facts.length} / 3)`
    );

    factBank[state.planet].forEach((fact, index) => {
      const label = document.createElement("label");
      label.className = "poster-dropdown-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = state.facts.includes(index);

      const text = document.createElement("span");
      text.textContent = fact[0];

      label.classList.toggle("is-selected", checkbox.checked);

      checkbox.addEventListener("change", () => {
        if (checkbox.checked && state.facts.length >= 3) {
          checkbox.checked = false;
          showMessage("Saate valida kuni kolm fakti.", false);
          return;
        }

        if (checkbox.checked) {
          state.facts.push(index);
        } else {
          state.facts = state.facts.filter(n => n !== index);
        }

        label.classList.toggle("is-selected", checkbox.checked);

        dropdown.summary.textContent =
          `Valige faktid (${state.facts.length} / 3)`;

        markChanged();
      });

      label.append(checkbox, text);
      dropdown.list.append(label);
    });

    elements.count.textContent = `Valitud: ${state.facts.length} / 3`;
  }

  const backgroundSelect = createSelect(
    elements.backgrounds,
    backgrounds.map(bg => ({
      value: bg.number,
      label: bg.name
    })),
    state.background,
    "Valige taust",
    value => {
      state.background = Number(value);
      updateBackgroundColor();
      markChanged();
    }
  );

  function updateBackgroundColor() {
    const background = backgrounds.find(
      bg => bg.number === state.background
    );

    backgroundSelect.style.color = background.color;
    backgroundSelect.style.fontWeight = "700";
  }

  function decorationSummary() {
    return state.decorations.length
      ? `Valitud kaunistusi: ${state.decorations.length} / 3`
      : "Ilma kaunistuseta";
  }

  function renderDecorations() {
    const dropdown = createDropdown(
      elements.decorations,
      decorationSummary()
    );

    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "poster-dropdown-clear";
    clear.textContent = "Eemalda kõik kaunistused";

    clear.addEventListener("click", () => {
      state.decorations = [];
      renderDecorations();
      markChanged();
    });

    dropdown.list.append(clear);

    for (let number = 1; number <= 8; number++) {
      const label = document.createElement("label");
      label.className = "poster-dropdown-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = state.decorations.includes(number);

      const text = document.createElement("span");
      text.textContent = `Kaunistus ${number}`;

      label.classList.toggle("is-selected", checkbox.checked);

      checkbox.addEventListener("change", () => {
        if (checkbox.checked && state.decorations.length >= 3) {
          checkbox.checked = false;
          showMessage("Saate valida kuni kolm kaunistust.", false);
          return;
        }

        if (checkbox.checked) {
          state.decorations.push(number);
        } else {
          state.decorations = state.decorations.filter(
            n => n !== number
          );
        }

        label.classList.toggle("is-selected", checkbox.checked);
        dropdown.summary.textContent = decorationSummary();
        markChanged();
      });

      label.append(checkbox, text);
      dropdown.list.append(label);
    }
  }

  document.addEventListener("click", event => {
    root.querySelectorAll(".poster-dropdown[open]").forEach(dropdown => {
      if (!dropdown.contains(event.target)) {
        dropdown.open = false;
      }
    });
  });

  elements.authors.value = state.authors;

  elements.authors.addEventListener("input", () => {
    state.authors = elements.authors.value;
    markChanged();
  });

  function setImage(element, url) {
    if (element.getAttribute("src") !== url) {
      element.src = url;
    }
  }

  let previousDecorations = null;

  function renderDecorationLayers() {
    const current = state.decorations.join(",");

    if (current === previousDecorations) return;
    previousDecorations = current;

    elements.preview
      .querySelectorAll("[data-poster-decoration]")
      .forEach(image => image.remove());

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

  function renderPoster() {
    const planet = planets.find(p => p.id === state.planet);

    elements.title.textContent = planet.name;
    elements.subtitle.textContent = state.subtitle;

    setImage(elements.bg, imageUrl("taust", state.background));

    if (state.planetImage) {
      setImage(
        elements.planetImage,
        imageUrl("planeet", state.planetImage)
      );
      elements.planetImage.hidden = false;
    } else {
      elements.planetImage.hidden = true;
      elements.planetImage.removeAttribute("src");
    }

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
        item.textContent = fact[0];

        elements.list.append(item);
      });
    }

    elements.team.textContent = state.authors.trim()
      ? `Autorid: ${state.authors.trim()}`
      : "Autorid: ...";
  }

  elements.save.addEventListener("click", () => {
    if (!state.planetImage) {
      showMessage("Valige plakatile planeedi pilt.", false);
      return;
    }

    if (state.facts.length !== 3) {
      showMessage("Valige täpselt kolm fakti.", false);
      return;
    }

    if (!state.authors.trim()) {
      showMessage("Kirjutage plakati autorite eesnimed.", false);
      elements.authors.focus();
      return;
    }

    const posterData = {
      planet: state.planet,
      planetImage: state.planetImage,
      subtitle: state.subtitle,
      facts: [...state.facts],
      factTexts: state.facts.map(
        index => factBank[state.planet][index][0]
      ),
      background: state.background,
      decorations: [...state.decorations],
      authors: state.authors.trim()
    };

    document.dispatchEvent(new CustomEvent("lesson:save-response", {
      detail: {
        id: "poster",
        step: 5,
        value: posterData
      }
    }));

    savedSignature = signature();

    showMessage("Plakat on salvestatud! Etapp läbitud!", true);
    elements.next.hidden = false;
  });

  updateBackgroundColor();
  renderImageChoice();
  renderFacts();
  renderDecorations();
  renderPoster();

  if (savedSignature) {
    showMessage("Salvestatud plakat on avatud.", true);
    elements.next.hidden = false;
  }
})();
