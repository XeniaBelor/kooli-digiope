(() => {
  const form = document.querySelector("#final-mission");
  const storageKey = window.lessonConfig?.storageKey;

  if (!form || !storageKey) return;

  const checkButton = document.querySelector("#final-check");
  const finishButton = document.querySelector("#final-finish");
  const success = document.querySelector("#final-success");
  const total = document.querySelector("#final-total");

  if (
    !checkButton ||
    !finishButton ||
    !success ||
    !total
  ) return;

  const tasks = [
    {
      name: "bag",
      correct: 1,
      explanation:
        "7 + 4 + 5 + 3 = 19 kg. " +
        "20 − 19 = 1 kg."
    },
    {
      name: "oxygen",
      correct: 3,
      explanation:
        "Kaks astronauti vajavad minutis kokku " +
        "4 liitrit hapnikku. " +
        "30 minutiga kulub 120 liitrit. " +
        "Kahes balloonis on 100 liitrit, " +
        "seega on vaja 3 ballooni."
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

  function isCorrect(task, answers) {
    return answers[task.name] !== "" &&
      Number(answers[task.name]) === task.correct;
  }


function showResults(answers) {
  let correctCount = 0;

  tasks.forEach(task => {
    const result = document.querySelector(
      `#final-result-${task.name}`
    );

    if (!result) return;

    const correct = isCorrect(task, answers);

    if (correct) correctCount++;

    result.className = correct
      ? "final-feedback is-correct"
      : "final-feedback is-wrong";

    result.textContent = correct
      ? `Õige vastus! ${task.explanation}`
      : `Õige vastus on ${task.correct}. ${task.explanation}`;

    result.hidden = false;
  });

  const allCorrect = correctCount === tasks.length;

  total.textContent = allCorrect
    ? "Kõik 3 vastust on õiged! " +
      "Võid kosmosereisi lõpetada."
    : `Õigeid vastuseid: ${correctCount} / 3. ` +
      "Paranda valed vastused ja kontrolli uuesti.";

  total.hidden = false;
  finishButton.hidden = !allCorrect;

  return allCorrect;
}

  function resetResults() {
    finishButton.hidden = true;
    success.hidden = true;
    total.hidden = true;

    tasks.forEach(task => {
      const result = document.querySelector(
        `#final-result-${task.name}`
      );

      if (result) result.hidden = true;
    });
  }

  function completeMission() {
    if (!form.reportValidity()) return;

    const answers = collectAnswers();

    const allCorrect = tasks.every(task =>
      isCorrect(task, answers)
    );

    if (!allCorrect) {
      showResults(answers);
      return;
    }

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
    finishButton.hidden = true;

    success.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth",
      block: "nearest"
    });
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
  });

  checkButton.addEventListener("click", () => {
    if (!form.reportValidity()) return;

    success.hidden = true;
    showResults(collectAnswers());
  });

  form.addEventListener("input", resetResults);

  finishButton.addEventListener("click", completeMission);

  const saved = getSaved();

  if (saved) {
    tasks.forEach(task => {
      const input = form.elements.namedItem(task.name);

      if (input && saved[task.name] != null) {
        input.value = saved[task.name];
      }
    });

    const allCorrect = tasks.every(task =>
      isCorrect(task, saved)
    );

    if (allCorrect) {
      showResults(saved);
      finishButton.hidden = true;
      success.hidden = false;
    }
  }
})();
