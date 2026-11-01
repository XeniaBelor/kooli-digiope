
(() => {
  const root = document.querySelector("#poster-builder");
  if (!root) return;

  const scriptUrl = document.currentScript.src;
  const imagePath = new URL(
    "../../images/loodusopetus/poster/",
    scriptUrl
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
      { text: "See on Päikesesüsteemi kõige väiksem planeet. 🪨", correct: true },
      { text: "Sellel planeedil on suured rõngad. 🪐", correct: false },
      { text: "See asub Päikesele kõige lähemal. ☀️", correct: true },
      { text: "Sellel planeedil on kaks kuud. 🌙", correct: false },
      { text: "Sellel planeedil ei ole kuusid. 🔭", correct: true },
      { text: "See on Päikesesüsteemi kõige suurem planeet. 🌍", correct: false }
    ],
    veenus: [
      { text: "See on Päikesest teine planeet. ☀️", correct: true },
      { text: "See on Päikesesüsteemi kõige väiksem planeet. 🪨", correct: false },
      { text: "See on Päikesesüsteemi kõige kuumem planeet. 🔥", correct: true },
      { text: "Sellel planeedil elavad inimesed. 🏠", correct: false },
      { text: "Sellel planeedil ei ole kuusid. 🔭", correct: true },
      { text: "See asub Päikesest kõige kaugemal. 🌌", correct: false }
    ],
    maa: [
      { text: "See on Päikesest kolmas planeet. ☀️", correct: true },
      { text: "See on Päikesesüsteemi kõige suurem planeet. 🌍", correct: false },
      { text: "Sellel planeedil on üks looduslik kaaslane. 🌙", correct: true },
      { text: "See on Päikesest teine planeet. 🔭", correct: false },
      { text: "See on ainus teadaolev planeet, kus leidub elu. 🌱", correct: true },
      { text: "See on tuntud suurte rõngaste poolest. 🪐", correct: false }
    ],
    marss: [
      { text: "Seda tuntakse punase planeedina. 🔴", correct: true },
      { text: "See asub Päikesele kõige lähemal. ☀️", correct: false },
      { text: "See on Päikesest neljas planeet. 🔭", correct: true },
      { text: "See on Päikesesüsteemi kõige kuumem planeet. 🔥", correct: false },
      { text: "Sellel planeedil on kaks kuud. 🌙", correct: true },
      { text: "Sellel planeedil on vedela veega ookeanid. 🌊", correct: false }
    ],
    jupiter: [
      { text: "See on Päikesesüsteemi kõige suurem planeet. 🌍", correct: true },
      { text: "Sellel planeedil ei ole kuusid. 🌙", correct: false },
      { text: "See on gaasihiid. ☁️", correct: true },
      { text: "See asub Päikesele kõige lähemal. ☀️", correct: false },
      { text: "Selle atmosfääris asub Suur Punane Laik. 🌪️", correct: true },
      { text: "Sellel planeedil on tahke kivine pind. 🪨", correct: false }
    ],
    saturn: [
      { text: "See on tuntud oma suurte rõngaste poolest. 🪐", correct: true },
      { text: "See on Päikesest kolmas planeet. ☀️", correct: false },
      { text: "See on gaasihiid. ☁️", correct: true },
      { text: "Sellel planeedil ei ole kuusid. 🌙", correct: false },
      { text: "See on Päikesest kuues planeet. 🔭", correct: true },
      { text: "See on Päikesesüsteemi kõige väiksem planeet. 🪨", correct: false }
    ],
    uraan: [
      { text: "See on Päikesest seitsmes planeet. ☀️", correct: true },
      { text: "See on Päikesesüsteemi kõige kuumem planeet. 🔥", correct: false },
      { text: "See pöörleb peaaegu külili. 🔄", correct: true },
      { text: "See asub Päikesele kõige lähemal. 🔭", correct: false },
      { text: "See on jäähiid. ❄️", correct: true },
      { text: "Sellel planeedil ei ole kuusid. 🌙", correct: false }
    ],
    neptuun: [
      { text: "See on Päikesest kaheksas planeet. ☀️", correct: true },
      { text: "See asub Päikesele kõige lähemal. 🔭", correct: false },
      { text: "See on jäähiid. ❄️", correct: true },
      { text: "See on Päikesesüsteemi kõige väiksem planeet. 🪨", correct: false },
      { text: "See asub Päikesest kõige kaugemal. 🌌", correct: true },
      { text: "Sellel planeedil ei ole kuusid. 🌙", correct: false }
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
    const number = Number(String(value ?? "").replace(/\D/g, ""));
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
    planet: savedPoster?.planet || "merkuur",
    subtitle: subtitles.includes(savedPoster?.subtitle)
      ? savedPoster.subtitle
      : subtitles[0],
    facts: Array.isArray(savedPoster?.facts)
      ? [...new Set(
          savedPoster.facts
            .map(Number)
            .filter(number =>
              Number.isInteger(number) &&
              number >= 0 &&
              number < 6
            )
        )].slice(0, 3)
      : [],
    background: validNumber(savedPoster?.background, 1, 7, 6),
    decorations: [...new Set(
      oldDecorations
        .map(value => validNumber(value, 1, 8, 0))
        .filter(Boolean)
    )].slice(0, 3),
    authors: typeof savedPoster?.authors === "string"
      ? savedPoster.authors
      : ""
  };

  if (!planets.some(planet => planet.id === state.planet)) {
    state.planet = "merkuur";
    state.facts = [];
  }

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

  if (Object.values(elements).some(element => !element)) return;

  elements.oldDecor.hidden = true;
  elements.oldDecor.removeAttribute("src");

  elements.count.hidden = true;

  const decorationCounter = elements.decorations
    .parentElement.querySelector(".poster-fact-counter");

  if (decorationCounter) {
    decorationCounter.hidden = true;
  }

  let savedSignature = savedPoster
    ? JSON.stringify({
        planet: state.planet,
        subtitle: state.subtitle,
        facts: [...state.facts],
        background: state.background,
        decorations: [...state.decorations],
        authors: state.authors.trim()
      })
    : null;

  const signature = () => JSON.stringify({
    planet: state.planet,
    subtitle: state.subtitle,
    facts: [...state.facts],
    background: state.background,
    decorations: [...state.decorations],
    authors: state.authors.trim()
  });

  function showMessage(message, success) {
    elements.message.textContent = message;
    elements.message.className = success
      ? "learning-box"
      : "answer-feedback is-wrong";
    elements.message.hidden = false;
  }

  function markChanged() {
    if (signature() === savedSignature) {
      showMessage("Salvestatud plakat on avatud.", true);
    } else if (savedSignature) {
      showMessage(
        "Plakatil on salvestamata muudatusi. Kontrollige ja salvestage uuesti.",
        false
      );
    } else {
      elements.message.hidden = true;
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
    planets.map(planet => ({
      value: planet.id,
      label: planet.name
    })),
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

  createSelect(
    elements.subtitles,
    subtitles.map(text => ({
      value: text,
      label: text
    })),
    state.subtitle,
    "Valige lühike tutvustus",
    value => {
      state.subtitle = value;
      markChanged();
    }
  );

  function createDropdown(target, summaryText) {
    const details = document.createElement("details");
    details.className = "poster-dropdown";

    const summary = document.createElement("summary");
    summary.textContent = summaryText;

    const list = document.createElement("div");
    list.className = "poster-dropdown-list";

    details.append(summary, list);
    target.replaceChildren(details);

    return { details, summary, list };
  }

  function renderFacts() {
    const dropdown = createDropdown(
      elements.facts,
      `Valige faktid (${state.facts.length} / 3)`
    );

    elements.count.textContent =
      `Valitud: ${state.facts.length} / 3`;

    factBank[state.planet].forEach((fact, index) => {
      const label = document.createElement("label");
      label.className = "poster-dropdown-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = state.facts.includes(index);

      const text = document.createElement("span");
      text.textContent = fact.text;

      label.classList.toggle("is-selected", checkbox.checked);

      checkbox.addEventListener("change", () => {
        if (checkbox.checked && state.facts.length >= 3) {
          checkbox.checked = false;
          showMessage("Saate valida ainult kolm fakti.", false);
          return;
        }

        if (checkbox.checked) {
          state.facts.push(index);
        } else {
          state.facts = state.facts.filter(item => item !== index);
        }

        label.classList.toggle("is-selected", checkbox.checked);
        dropdown.summary.textContent =
          `Valige faktid (${state.facts.length} / 3)`;

        elements.count.textContent =
          `Valitud: ${state.facts.length} / 3`;

        markChanged();
      });

      label.append(checkbox, text);
      dropdown.list.append(label);
    });
  }

  function updateBackgroundColor() {
    const select = elements.backgrounds.querySelector("select");
    const background = backgrounds.find(
      item => item.number === state.background
    );

    if (select && background) {
      select.style.color = background.color;
      select.style.fontWeight = "700";
    }
  }

  createSelect(
    elements.backgrounds,
    backgrounds.map(background => ({
      value: background.number,
      label: background.name
    })),
    state.background,
    "Valige taust",
    value => {
      state.background = Number(value);
      updateBackgroundColor();
      markChanged();
    }
  );

  updateBackgroundColor();

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
            item => item !== number
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

  let decorationSignature = null;

  function renderDecorationLayers() {
    const current = state.decorations.join(",");

    if (current === decorationSignature) return;
    decorationSignature = current;

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
    const planet = planets.find(
      item => item.id === state.planet
    );

    elements.title.textContent = planet.name;
    elements.subtitle.textContent = state.subtitle;

    setImage(elements.bg, imageUrl("taust", state.background));
    setImage(elements.planetImage, imageUrl("planeet", planet.image));

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

  elements.save.addEventListener("click", () => {
    if (state.facts.length !== 3) {
      showMessage("Valige täpselt kolm fakti.", false);
      return;
    }

    const correct = state.facts.every(index =>
      factBank[state.planet][index]?.correct === true
    );

    if (!correct) {
      showMessage(
        "Mõni valitud fakt ei sobi selle planeedi kohta. Uurige veel ja proovige uuesti.",
        false
      );
      return;
    }

    if (!state.authors.trim()) {
      showMessage("Kirjutage plakati autorite eesnimed.", false);
      elements.authors.focus();
      return;
    }

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

    document.dispatchEvent(new CustomEvent("lesson:save-response", {
      detail: {
        id: "poster",
        step: 5,
        value: posterData
      }
    }));

    savedSignature = signature();
    showMessage("Plakat on salvestatud! Etapp läbitud!", true);
  });

  renderFacts();
  renderDecorations();
  renderPoster();

  if (savedPoster) {
    showMessage("Salvestatud plakat on avatud.", true);
  }
})();
