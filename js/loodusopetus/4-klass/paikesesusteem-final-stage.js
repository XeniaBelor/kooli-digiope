(() => {
  const form = document.querySelector("#final-mission");
  if (!form) return;

  const storageKey = window.lessonConfig.storageKey;

  const checkButton = document.querySelector("#final-check");
  const finishButton = document.querySelector("#final-finish");
  const success = document.querySelector("#final-success");
  const total = document.querySelector("#final-total");

  if (
    !checkButton || !finishButton ||
    !success || !total
  ) return;

  const tasks = [
    {
      name: "bag",
      correct: 1,
      explanation:
        "7 + 4 + 5 + 3 = 19 kg. 20 − 19 = 1 kg."
    },
    {
      name: "oxygen",
      correct: 3,
      explanation:
        "Kaks astronauti vajavad minutis kokku 4 liitrit. " +
        "30 minutiga kulub 120 liitrit. " +
        "Kahes balloonis on kokku 100 liitrit, " +
        "seega tuleb kaasa võtta 3 ballooni."
    },
    {
      name: "budget",
      correct: 20,
      explanation:
        "145 + 125 + 90 + 160 = 520 €. " +
        "520 − 500 = 20 €."
    }
  ];

  function getSaved() {
    try {
      const progress = JSON.parse(
        localStorage.getItem(storageKey) || "{}"
      );

      return progress.responses?.finalMission || null;
    } catch {
      return null;
    }
  }

  function collectAnswers() {
    const values = new FormData(form);

    return {
      bag: String(values.get("bag") || ""),
      oxygen: String(values.get("oxygen") || ""),
      budget: String(values.get("budget") || "")
    };
  }

  function showResults(answers) {
    let correctCount = 0;

    tasks.forEach(task => {
      const result = document.querySelector(
        `#final-result-${task.name}`
      );

      const correct =
        answers[task.name] !== "" &&
        Number(answers[task.name]) === task.correct;

      if (correct) correctCount++;

      result.className = correct
        ? "final-feedback is-correct"
        : "final-feedback is-wrong";

      result.textContent = correct
        ? `Õige vastus! ${task.explanation}`
        : `Õige vastus on ${task.correct}. ${task.explanation}`;

      result.hidden = false;
    });

    total.textContent =
      `Õigeid vastuseid: ${correctCount} / 3.`;

    total.hidden = false;
    finishButton.hidden = false;
  }

  checkButton.addEventListener("click", () => {
    if (!form.reportValidity()) return;

    showResults(collectAnswers());
    success.hidden = true;
  });

  form.addEventListener("input", () => {
    finishButton.hidden = true;
    total.hidden = true;
    success.hidden = true;

    tasks.forEach(task => {
      const result = document.querySelector(
        `#final-result-${task.name}`
      );

      if (result) result.hidden = true;
    });
  });

  finishButton.addEventListener("click", () => {
    if (!form.reportValidity()) return;

    const answers = collectAnswers();

    document.dispatchEvent(
      new CustomEvent("lesson:save-response", {
        detail: {
          id: "finalMission",
          step: 8,
          value: answers
        }
      })
    );

    success.hidden = false;

    success.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth",
      block: "nearest"
    });
  });

  const saved = getSaved();

  if (saved) {
    tasks.forEach(task => {
      const input = form.elements.namedItem(task.name);

      if (input && saved[task.name] != null) {
        input.value = saved[task.name];
      }
    });

    if (
      tasks.every(task =>
        saved[task.name] !== "" &&
        saved[task.name] != null
      )
    ) {
      showResults(saved);
      success.hidden = false;
    }
  }
})();
