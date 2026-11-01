(() => {
  const root = document.querySelector("#poster-builder");
  const data = window.paikesesusteemData;
  if (!root || !data) return;

  const storageKey = window.lessonConfig.storageKey;

  function getProgress() {
    try {
      return JSON.parse(
        localStorage.getItem(storageKey) || "{}"
      );
    } catch {
      return {};
    }
  }

  const savedPoster = getProgress().responses?.poster || null;

  function validNumber(value, max, fallback = null) {
    const number = Number(value);

    return Number.isInteger(number) &&
      number >= 1 &&
      number <= max
      ? number
      : fallback;
  }

  const previousDecorations = Array.isArray(savedPoster?.decorations)
    ? savedPoster.decorations
    : savedPoster?.decoration
      ? [savedPoster.decoration]
      : [];

  const state = {
    planet: data.planets.some(
      planet => planet.id === savedPoster?.planet
    ) ? savedPoster.planet : "merkuur",

    planetImage: validNumber(savedPoster?.planetImage, 8),

    subtitle: data.subtitles.includes(savedPoster?.subtitle)
      ? savedPoster.subtitle
      : data.subtitles[0],

    facts: Array.isArray(savedPoster?.facts)
      ? [...new Set(
          savedPoster.facts.map(Number).filter(
            index =>
              Number.isInteger(index) &&
              index >= 0 &&
              index < 6
          )
        )].slice(0, 3)
      : [],

    background: validNumber(savedPoster?.background, 7, 6),

    decorations: [...new Set(
      previousDecorations
        .map(value => validNumber(value, 8))
        .filter(Boolean)
    )].slice(0, 3),

    authors: typeof savedPoster?.authors === "string"
      ? savedPoster.authors
      : ""
  };

  let imageCursor = state.planetImage || 5;
  let renderedDecorations = null;

  const el = id => root.querySelector(`#${id}`);

  const elements = {
    planets: el("poster-planets"),
    imageChoice: el("poster-image-choice"),
    imagePrev: el("poster-image-prev"),
    imageNext: el("poster-image-next"),
    imageSelect: el("poster-image-select"),
    imageStatus: el("poster-image-status"),
    subtitles: el("poster-subtitles"),
    facts: el("poster-fact-options"),
    count: el("poster-fact-count"),
    backgrounds: el("poster-backgrounds"),
    decorations: el("poster-decorations"),
    authors: el("poster-authors"),
    bg: el("poster-bg"),
    planetImage: el("poster-planet"),
    oldDecor: el("poster-decor"),
    preview: el("poster-preview"),
    title: el("poster-title"),
    subtitle: el("poster-subtitle"),
    list: el("poster-facts"),
    team: el("poster-team"),
    save: el("poster-save"),
    message: el("poster-message"),
    next: el("poster-next")
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

  let savedSignature = state.planetImage && savedPoster
    ? signature()
    : null;

  function showMessage(message, success = false) {
    elements.message.textContent = message;
    elements.message.className = success
      ? "learning-box"
      : "answer-feedback is-wrong";
    elements.message.hidden = false;
  }

  function markChanged() {
    const unchanged =
      savedSignature !== null &&
      signature() === savedSignature;

    elements.next.hidden = !unchanged;

    if (unchanged) {
      showMessage("Salvestatud plakat on avatud.", true);
    } else if (savedSignature !== null) {
      showMessage(
        "Plakatil on salvestamata muudatusi. Salvesta uuesti."
      );
    } else {
      elements.message.hidden = true;
    }

    renderPoster();
  }

  function createSelect(target, items, selected, onChange) {
    const select = document.createElement("select");
    select.className = "poster-select";

    items.forEach(item => {
      const option = document.createElement("option");
      option.value = String(item.value);
      option.textContent = item.label;
      select.append(option);
    });

    select.value = String(selected);
    select.addEventListener("change", () => {
      onChange(select.value);
    });

    target.replaceChildren(select);
    return select;
  }

  function createDropdown(target, title) {
    const details = document.createElement("details");
    details.className = "poster-dropdown";

    const summary = document.createElement("summary");
    summary.textContent = title;

    const list = document.createElement("div");
    list.className = "poster-dropdown-list";

    details.append(summary, list);
    target.replaceChildren(details);

    return { summary, list };
  }

  createSelect(
    elements.planets,
    data.planets.map(planet => ({
      value: planet.id,
      label: planet.name
    })),
    state.planet,
    value => {
      if (value === state.planet) return;

      state.planet = value;
      state.facts = [];
      renderFacts();
      markChanged();
    }
  );

  function renderImageChoice() {
    elements.imageChoice.src =
      data.imageUrl("planeet", imageCursor);

    elements.imageChoice.alt = "Planeedi pildi eelvaade";

    elements.imageStatus.textContent = state.planetImage
      ? "Planeedi pilt on valitud."
      : "Vali sobiv planeedi pilt.";
  }

  function chooseImage(number) {
    imageCursor = number;
    state.planetImage = number;

    renderImageChoice();
    markChanged();
  }
  function renderImageChoice() {
    elements.imageChoice.src =
      data.imageUrl("planeet", imageCursor);
  
    elements.imageChoice.alt = "Planeedi pildi eelvaade";
  
    const isSelected = state.planetImage === imageCursor;
  
    elements.imageStatus.textContent = isSelected
      ? "See planeedi pilt on valitud."
      : "Pildi valimiseks vajuta nuppu „Vali see pilt“.";
  
    elements.imageSelect.disabled = isSelected;
  }
  
  function browseImage(number) {
    imageCursor = number;
    renderImageChoice();
  }
  
  elements.imagePrev.addEventListener("click", () => {
    browseImage(imageCursor === 1 ? 8 : imageCursor - 1);
  });
  
  elements.imageNext.addEventListener("click", () => {
    browseImage(imageCursor === 8 ? 1 : imageCursor + 1);
  });
  
  elements.imageSelect.addEventListener("click", () => {
    state.planetImage = imageCursor;
    renderImageChoice();
    markChanged();
});
  elements.imageSelect.addEventListener("click", () => {
    chooseImage(imageCursor);
  });

  createSelect(
    elements.subtitles,
    data.subtitles.map(text => ({
      value: text,
      label: text
    })),
    state.subtitle,
    value => {
      state.subtitle = value;
      markChanged();
    }
  );

  function renderFacts() {
    const dropdown = createDropdown(
      elements.facts,
      `Valitud fakte: ${state.facts.length} / 3`
    );

    data.facts[state.planet].forEach((fact, index) => {
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
          showMessage("Valida saab kuni kolm fakti.");
          return;
        }

        if (checkbox.checked) {
          state.facts.push(index);
        } else {
          state.facts = state.facts.filter(
            value => value !== index
          );
        }

        label.classList.toggle("is-selected", checkbox.checked);

        dropdown.summary.textContent =
          `Valitud fakte: ${state.facts.length} / 3`;

        markChanged();
      });

      label.append(checkbox, text);
      dropdown.list.append(label);
    });

    elements.count.textContent =
      `Valitud: ${state.facts.length} / 3`;
  }

  const backgroundSelect = createSelect(
    elements.backgrounds,
    data.backgrounds.map(background => ({
      value: background.number,
      label: background.name
    })),
    state.background,
    value => {
      state.background = Number(value);
      updateBackgroundColor();
      markChanged();
    }
  );

  function updateBackgroundColor() {
    const background = data.backgrounds.find(
      item => item.number === state.background
    );

    if (!background) return;

    backgroundSelect.style.color = background.color;
    backgroundSelect.style.fontWeight = "700";
  }

  function decorationHeading() {
    return state.decorations.length
      ? `Valitud kaunistusi: ${state.decorations.length} / 3`
      : "Ilma kaunistusteta";
  }

  function renderDecorations() {
    const dropdown = createDropdown(
      elements.decorations,
      decorationHeading()
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
          showMessage("Valida saab kuni kolm kaunistust.");
          return;
        }

        if (checkbox.checked) {
          state.decorations.push(number);
        } else {
          state.decorations = state.decorations.filter(
            value => value !== number
          );
        }

        label.classList.toggle("is-selected", checkbox.checked);
        dropdown.summary.textContent = decorationHeading();

        markChanged();
      });

      label.append(checkbox, text);
      dropdown.list.append(label);
    }
  }

  document.addEventListener("click", event => {
    root.querySelectorAll(".poster-dropdown[open]")
      .forEach(dropdown => {
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

  function renderDecorationLayers() {
    const current = state.decorations.join(",");

    if (current === renderedDecorations) return;
    renderedDecorations = current;

    elements.preview
      .querySelectorAll("[data-poster-decoration]")
      .forEach(image => image.remove());

    const heading = elements.preview.querySelector(".poster-head");

    state.decorations.forEach(number => {
      const image = document.createElement("img");

      image.className = "poster-layer poster-decor";
      image.dataset.posterDecoration = String(number);
      image.src = data.imageUrl("kaunistus", number);
      image.alt = "";

      elements.preview.insertBefore(image, heading);
    });
  }

  function renderPoster() {
    const planet = data.planets.find(
      item => item.id === state.planet
    );

    elements.title.textContent = planet.name;
    elements.subtitle.textContent = state.subtitle;

    setImage(
      elements.bg,
      data.imageUrl("taust", state.background)
    );

    if (state.planetImage) {
      setImage(
        elements.planetImage,
        data.imageUrl("planeet", state.planetImage)
      );

      elements.planetImage.hidden = false;
    } else {
      elements.planetImage.hidden = true;
      elements.planetImage.removeAttribute("src");
    }

    renderDecorationLayers();
    elements.list.replaceChildren();

    if (state.facts.length === 0) {
      const item = document.createElement("li");
      item.className = "poster-fact";
      item.textContent = "Valige kolm fakti.";
      elements.list.append(item);
    } else {
      state.facts.forEach(index => {
        const fact = data.facts[state.planet]?.[index];
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
      showMessage("Vali plakatile planeedi pilt.");
      return;
    }

    if (state.facts.length !== 3) {
      showMessage("Vali täpselt kolm fakti.");
      return;
    }

    if (!state.authors.trim()) {
      showMessage("Kirjutage plakati autorite eesnimed.");
      elements.authors.focus();
      return;
    }

    const poster = {
      planet: state.planet,
      planetImage: state.planetImage,
      subtitle: state.subtitle,
      facts: [...state.facts],
      factTexts: state.facts.map(
        index => data.facts[state.planet][index][0]
      ),
      background: state.background,
      decorations: [...state.decorations],
      authors: state.authors.trim()
    };

    document.dispatchEvent(
      new CustomEvent("lesson:save-response", {
        detail: {
          id: "poster",
          step: 5,
          value: poster
        }
      })
    );

    savedSignature = signature();

    showMessage("Plakat on salvestatud! Etapp läbitud!", true);
    elements.next.hidden = false;
  });

  updateBackgroundColor();
  renderImageChoice();
  renderFacts();
  renderDecorations();
  renderPoster();

  if (savedSignature !== null) {
    showMessage("Salvestatud plakat on avatud.", true);
    elements.next.hidden = false;
  }
})();
