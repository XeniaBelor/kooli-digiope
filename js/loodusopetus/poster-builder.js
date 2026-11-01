// Poster builder for the learning journey

(() => {
  const root = document.querySelector("#poster-builder");
  if (!root) return;

  const imagePath = "../../../images/loodusopetus/poster/";

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
    "Kolm huvitavat fakti meie planeedist.",
    "Meie avastusretk Päikesesüsteemis.",
    "Mis teeb selle planeedi eriliseks?"
  ];

  // Each planet has 3 correct and 3 incorrect statements.
  // Planet names are intentionally omitted from the statements.
  const factBank = {
    merkuur: [
      { text: "See on Päikesesüsteemi kõige väiksem planeet.", correct: true },
      { text: "Sellel planeedil on suured rõngad.", correct: false },
      { text: "See asub Päikesele kõige lähemal.", correct: true },
      { text: "Sellel planeedil on kaks kuud.", correct: false },
      { text: "Sellel planeedil ei ole kuusid.", correct: true },
      { text: "See on Päikesesüsteemi kõige suurem planeet.", correct: false }
    ],

    veenus: [
      { text: "See on Päikesest teine planeet.", correct: true },
      { text: "See on Päikesesüsteemi kõige väiksem planeet.", correct: false },
      { text: "See on Päikesesüsteemi kõige kuumem planeet.", correct: true },
      { text: "Sellel planeedil elavad inimesed.", correct: false },
      { text: "Sellel planeedil ei ole kuusid.", correct: true },
      { text: "See asub Päikesest kõige kaugemal.", correct: false }
    ],

    maa: [
      { text: "See on Päikesest kolmas planeet.", correct: true },
      { text: "See on Päikesesüsteemi kõige suurem planeet.", correct: false },
      { text: "Sellel planeedil on üks looduslik kaaslane.", correct: true },
      { text: "See on Päikesest teine planeet.", correct: false },
      { text: "See on ainus teadaolev planeet, kus leidub elu.", correct: true },
      { text: "See on tuntud suurte rõngaste poolest.", correct: false }
    ],

    marss: [
      { text: "Seda tuntakse punase planeedina.", correct: true },
      { text: "See on Päikesele kõige lähemal.", correct: false },
      { text: "See on Päikesest neljas planeet.", correct: true },
      { text: "See on Päikesesüsteemi kõige kuumem planeet.", correct: false },
      { text: "Sellel planeedil on kaks kuud.", correct: true },
      { text: "Sellel planeedil on vedela veega ookeanid.", correct: false }
    ],

    jupiter: [
      { text: "See on Päikesesüsteemi kõige suurem planeet.", correct: true },
      { text: "Sellel planeedil ei ole kuusid.", correct: false },
      { text: "See on gaasihiid.", correct: true },
      { text: "See on Päikesele kõige lähem planeet.", correct: false },
      { text: "Selle atmosfääris asub Suur Punane Laik.", correct: true },
      { text: "Sellel on tahke kivine pind.", correct: false }
    ],

    saturn: [
      { text: "See on tuntud oma suurte rõngaste poolest.", correct: true },
      { text: "See on Päikesest kolmas planeet.", correct: false },
      { text: "See on gaasihiid.", correct: true },
      { text: "Sellel planeedil ei ole kuusid.", correct: false },
      { text: "See on Päikesest kuues planeet.", correct: true },
      { text: "See on Päikesesüsteemi kõige väiksem planeet.", correct: false }
    ],

    uraan: [
      { text: "See on Päikesest seitsmes planeet.", correct: true },
      { text: "See on Päikesesüsteemi kõige kuumem planeet.", correct: false },
      { text: "See pöörleb peaaegu külili.", correct: true },
      { text: "See on Päikesele kõige lähem planeet.", correct: false },
      { text: "See on jäähiid.", correct: true },
      { text: "Sellel planeedil ei ole kuusid.", correct: false }
    ],

    neptuun: [
      { text: "See on Päikesest kaheksas planeet.", correct: true },
      { text: "See on Päikesele kõige lähem planeet.", correct: false },
      { text: "See on jäähiid.", correct: true },
      { text: "See on Päikesesüsteemi kõige väiksem planeet.", correct: false },
      { text: "See asub Päikesest kõige kaugemal.", correct: true },
      { text: "Sellel planeedil ei ole kuusid.", correct: false }
    ]
  };

  const storageKey =
    window.lessonConfig?.storageKey || "digiope-paikesesusteem";

  let savedPoster = null;

  try {
    const savedProgress = JSON.parse(localStorage.getItem(storageKey));
    savedPoster = savedProgress?.responses?.poster || null;
  } catch {
    savedPoster = null;
  }

  const state = {
    planet: savedPoster?.planet || "merkuur",
    subtitle: savedPoster?.subtitle || subtitles[0],
    facts: Array.isArray(savedPoster?.facts)
      ? [...savedPoster.facts]
      : [],
    background: savedPoster?.background || 1,
    decoration: savedPoster?.decoration ?? 1,
    authors: savedPoster?.authors || ""
  };

  if (!planets.some(p => p.id === state.planet)) {
    state.planet = "merkuur";
    state.facts = [];
  }

  const elements = {
    planets: document.querySelector("#poster-planets"),
    subtitles: document.querySelector("#poster-subtitles"),
    facts: document.querySelector("#poster-fact-options"),
    backgrounds: document.querySelector("#poster-backgrounds"),
    decorations: document.querySelector("#poster-decorations"),
    authors: document.querySelector("#poster-authors"),
    count: document.querySelector("#poster-fact-count"),
    title: document.querySelector("#poster-title"),
    subtitle: document.querySelector("#poster-subtitle"),
    list: document.querySelector("#poster-facts"),
    team: document.querySelector("#poster-team"),
    bg: document.querySelector("#poster-bg"),
    planetImage: document.querySelector("#poster-planet"),
    decor: document.querySelector("#poster-decor"),
    save: document.querySelector("#poster-save"),
    message: document.querySelector("#poster-message")
  };

  function imageUrl(type, number) {
    return `${imagePath}4-klass_poster-${type}${number}.webp`;
  }

  function showMessage(text, success) {
    elements.message.textContent = text;
    elements.message.className = success
      ? "learning-box"
      : "answer-feedback is-wrong";
    elements.message.hidden = false;
  }

  function changed() {
    elements.message.hidden = true;
    renderPoster();
  }

  // Generate selection buttons
  function createButtons(target, options, currentValue, onSelect) {
    target.replaceChildren();

    options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "poster-option";

      const active = option.value === currentValue;

      button.classList.toggle("is-selected", active);
      button.setAttribute("aria-pressed", String(active));

      if (option.image) {
        const img = document.createElement("img");
        img.src = option.image;
        img.alt = "";
        img.loading = "lazy";
        button.append(img);
      }

      const text = document.createElement("span");
      text.textContent = option.label;
      button.append(text);

      button.addEventListener("click", () => {
        onSelect(option.value);
        renderControls();
        changed();
      });

      target.append(button);
    });
  }

  function renderControls() {
    createButtons(
      elements.planets,
      planets.map(p => ({ value: p.id, label: p.name })),
      state.planet,
      value => {
        if (state.planet !== value) {
          state.planet = value;
          state.facts = [];
        }
      }
    );

    createButtons(
      elements.subtitles,
      subtitles.map(text => ({ value: text, label: text })),
      state.subtitle,
      value => { state.subtitle = value; }
    );

    createButtons(
      elements.backgrounds,
      Array.from({ length: 7 }, (_, i) => ({
        value: i + 1,
        label: `Taust ${i + 1}`,
        image: imageUrl("taust", i + 1)
      })),
      state.background,
      value => { state.background = value; }
    );

    createButtons(
      elements.decorations,
      [
        { value: 0, label: "Ilma kaunistuseta" },
        ...Array.from({ length: 8 }, (_, i) => ({
          value: i + 1,
          label: `Kaunistus ${i + 1}`
        }))
      ],
      state.decoration,
      value => { state.decoration = value; }
    );

    renderFactChoices();
  }

  // Display 6 choices for the selected planet
  function renderFactChoices() {
    elements.facts.replaceChildren();

    const choices = factBank[state.planet];

    choices.forEach((fact, index) => {
      const label = document.createElement("label");
      label.className = "poster-fact-option";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = String(index);
      checkbox.checked = state.facts.includes(index);

      label.classList.toggle("is-selected", checkbox.checked);

      const text = document.createElement("span");
      text.textContent = fact.text;

      checkbox.addEventListener("change", () => {
        if (checkbox.checked && state.facts.length >= 3) {
          checkbox.checked = false;
          showMessage("Saad valida ainult kolm fakti.", false);
          return;
        }

        if (checkbox.checked) {
          state.facts.push(index);
        } else {
          state.facts = state.facts.filter(i => i !== index);
        }

        renderFactChoices();
        changed();
      });

      label.append(checkbox, text);
      elements.facts.append(label);
    });

    elements.count.textContent = `Valitud: ${state.facts.length} / 3`;
  }

  // Update the poster immediately after every change
  function renderPoster() {
    const planet = planets.find(p => p.id === state.planet);

    elements.title.textContent = planet.name;
    elements.subtitle.textContent = state.subtitle;

    elements.bg.src = imageUrl("taust", state.background);
    elements.planetImage.src = imageUrl("planeet", planet.image);

    if (state.decoration === 0) {
      elements.decor.hidden = true;
      elements.decor.removeAttribute("src");
    } else {
      elements.decor.hidden = false;
      elements.decor.src = imageUrl("kaunistus", state.decoration);
    }

    elements.list.replaceChildren();

    if (state.facts.length === 0) {
      const placeholder = document.createElement("li");
      placeholder.textContent = "Valige kolm huvitavat fakti.";
      elements.list.append(placeholder);
    } else {
      state.facts.forEach(index => {
        const fact = factBank[state.planet][index];
        if (!fact) return;

        const item = document.createElement("li");
        item.textContent = fact.text;
        elements.list.append(item);
      });
    }

    elements.team.textContent = state.authors.trim()
      ? `Autorid: ${state.authors.trim()}`
      : "Autorid: ...";
  }

  // Save only when all three facts are correct
  elements.save.addEventListener("click", () => {
    if (state.facts.length !== 3) {
      showMessage("Valige täpselt kolm fakti.", false);
      return;
    }

    const allCorrect = state.facts.every(
      index => factBank[state.planet][index]?.correct === true
    );

    if (!allCorrect) {
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
      decoration: state.decoration,
      authors: state.authors.trim()
    };

    // Save through the existing learning journey
    document.dispatchEvent(new CustomEvent("lesson:save-response", {
      detail: {
        id: "poster",
        step: 5,
        value: posterData
      }
    }));

    showMessage(
      "Plakat on salvestatud! Etapp läbitud!",
      true
    );
  });

  elements.authors.value = state.authors;

  elements.authors.addEventListener("input", () => {
    state.authors = elements.authors.value;
    changed();
  });

  renderControls();
  renderPoster();

  if (savedPoster) {
    showMessage("Salvestatud plakat on avatud.", true);
  }
})();
