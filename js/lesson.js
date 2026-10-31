// Shared learning journey: tabs, progress and quizzes
(() => {
  const config = window.lessonConfig;
  if (!config) return;

  const steps = [...document.querySelectorAll(".journey-step")];
  const progress = {
    done: Array(steps.length).fill(false),
    responses: {}
  };

  // Restore saved progress
  try {
    const saved = JSON.parse(localStorage.getItem(config.storageKey));

    if (saved && typeof saved === "object") {
      if (Array.isArray(saved.done)) {
        progress.done = progress.done.map((_, i) => saved.done[i] === true);
      }

      if (saved.responses && typeof saved.responses === "object") {
        progress.responses = saved.responses;
      }

      // Restore answers from the previous code
      Object.entries(config.legacyResponses || {}).forEach(([id, oldKey]) => {
        if (!progress.responses[id] && saved[oldKey]) {
          progress.responses[id] = saved[oldKey];
        }
      });
    }
  } catch {
    // Continue without saved progress
  }

  function saveProgress() {
    try {
      localStorage.setItem(config.storageKey, JSON.stringify(progress));
    } catch {
      // Continue without persistent storage
    }
  }

  // Progress indicator and stage statuses
  function updateProgress() {
    const completed = progress.done.filter(Boolean).length;

    document.querySelector("#journey-count").textContent =
      `${completed} / ${steps.length} läbitud`;

    document.querySelector("#journey-fill").style.width =
      `${completed / steps.length * 100}%`;

    const bar = document.querySelector(".journey-progress");
    bar.setAttribute("aria-valuenow", completed);
    bar.setAttribute("aria-valuemax", steps.length);

    steps.forEach(step => {
      const number = Number(step.dataset.step);
      const done = progress.done[number - 1];

      step.classList.toggle("is-done", done);

      step.querySelector(".step-number").textContent =
        done ? "✓" : number;

      step.querySelector(".step-status").textContent =
        done ? "Läbitud" : step.open ? "Pooleli" : "Alustamata";
    });
  }

  // Open a stage
  function openStep(number) {
    steps.forEach(step => {
      step.open = Number(step.dataset.step) === number;
    });

    updateProgress();

    document.querySelector(`.journey-step[data-step="${number}"]`)
      ?.scrollIntoView({ block: "start" });
  }

  // Learner / teacher tabs
  document.querySelectorAll(".journey-tab").forEach(button => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;

      document.querySelectorAll(".journey-tab").forEach(tab => {
        const active = tab === button;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-pressed", String(active));
      });

      document.querySelector("#learner-view").hidden =
        view !== "learner";

      document.querySelector("#teacher-view").hidden =
        view !== "teacher";
    });
  });

  // Keep only one stage expanded
  steps.forEach(step => {
    step.addEventListener("toggle", () => {
      if (step.open) {
        steps.forEach(other => {
          if (other !== step) other.open = false;
        });
      }

      updateProgress();
    });
  });

  // Simple completion buttons
  document.querySelectorAll("[data-complete-step]").forEach(button => {
    button.addEventListener("click", () => {
      progress.done[Number(button.dataset.completeStep) - 1] = true;
      saveProgress();
      updateProgress();

      if (button.dataset.nextStep) {
        openStep(Number(button.dataset.nextStep));
      }
    });
  });

  // Build any quiz from the topic configuration
  function buildQuiz(container) {
    const id = container.dataset.quiz;
    const quiz = config.quizzes[id];
    if (!quiz) return;

    const form = document.createElement("form");
    form.className = "learning-quiz";

    const feedbackNodes = new Map();

    // Questions and answer options
    quiz.questions.forEach((question, index) => {
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");

      legend.textContent = `${index + 1}. ${question.text}`;
      fieldset.append(legend);

      Object.entries(question.options).forEach(([value, labelText], i) => {
        const label = document.createElement("label");
        const input = document.createElement("input");

        input.type = "radio";
        input.name = question.id;
        input.value = value;

        if (i === 0) input.required = true;

        label.append(input, document.createTextNode(` ${labelText}`));
        fieldset.append(label);
      });

      const feedback = document.createElement("p");
      feedback.className = "answer-feedback";
      feedback.hidden = true;

      feedbackNodes.set(question.id, feedback);
      fieldset.append(feedback);

      form.append(fieldset);
    });

    // Action buttons
    const actions = document.createElement("div");
    actions.className = "quiz-actions";

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "action-button";
    submit.textContent = "Kontrolli vastuseid";

    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "secondary-button";
    retry.textContent = "Proovi uuesti";
    retry.hidden = true;

    actions.append(submit, retry);
    form.append(actions);

    // Result message
    const result = document.createElement("div");
    result.className = "learning-box";
    result.setAttribute("role", "status");
    result.setAttribute("aria-live", "polite");
    result.hidden = true;
    form.append(result);

    // Next stage
    const next = document.createElement("button");
    next.type = "button";
    next.className = "action-button";
    next.textContent = `Edasi ${quiz.step + 1}. etapiga`;
    next.hidden = true;

    if (quiz.step < steps.length) {
      form.append(next);
    }

    next.addEventListener("click", () => openStep(quiz.step + 1));

    // One checking function for every quiz
    function showResults(answers, persist) {
      let score = 0;

      quiz.questions.forEach(question => {
        const correct = answers[question.id] === question.correct;
        if (correct) score++;

        const feedback = feedbackNodes.get(question.id);

        feedback.textContent = correct
          ? `Õige! ${question.explanation}`
          : `Õige vastus: ${question.options[question.correct]}. ${question.explanation}`;

        feedback.className =
          `answer-feedback ${correct ? "is-correct" : "is-wrong"}`;

        feedback.hidden = false;
      });

      const passed = score >= quiz.minCorrect;

      result.textContent =
        `${score} / ${quiz.questions.length} õiget vastust. ` +
        (passed ? quiz.successText : quiz.retryText);

      result.hidden = false;
      retry.hidden = false;
      next.hidden = !passed;

      if (persist) {
        progress.responses[id] = answers;
        progress.done[quiz.step - 1] = passed;
        saveProgress();
        updateProgress();
      }
    }

    // Submit answers
    form.addEventListener("submit", event => {
      event.preventDefault();

      const answers = Object.fromEntries(
        new FormData(form).entries()
      );

      showResults(answers, true);
    });

    // Retry quiz
    retry.addEventListener("click", () => {
      form.reset();

      feedbackNodes.forEach(feedback => {
        feedback.hidden = true;
      });

      result.hidden = true;
      retry.hidden = true;
      next.hidden = true;

      progress.done[quiz.step - 1] = false;
      delete progress.responses[id];

      saveProgress();
      updateProgress();
    });

    container.append(form);

    // Restore previously submitted answers
    const savedAnswers = progress.responses[id];

    if (savedAnswers) {
      form.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked =
          savedAnswers[input.name] === input.value;
      });

      showResults(savedAnswers, false);
    }
  }

  // Initialize quizzes
  document.querySelectorAll("[data-quiz]").forEach(buildQuiz);

  // Open the first unfinished stage on page load
  const firstUnfinished = progress.done.findIndex(done => !done);

  steps.forEach(step => {
    step.open = Number(step.dataset.step) ===
      (firstUnfinished === -1 ? 1 : firstUnfinished + 1);
  });

  updateProgress();

  // Reset the entire learning journey
  document.querySelector("#reset-journey")?.addEventListener("click", () => {
    const confirmed = confirm(
      "Kas soovid kõik oma vastused ja edusammud kustutada ning õpiteekonda uuesti alustada?"
    );
  
    if (!confirmed) return;
  
    localStorage.removeItem(config.storageKey);
    window.location.reload();
  });
})();
