(() => {
  const config = window.lessonConfig;
  if (!config) return;

  const steps = [...document.querySelectorAll(".journey-step")];

  const progress = {
    done: Array(steps.length).fill(false),
    responses: {}
  };

  try {
    const saved = JSON.parse(
      localStorage.getItem(config.storageKey) || "{}"
    );

    if (Array.isArray(saved.done)) {
      progress.done = progress.done.map(
        (_, index) => saved.done[index] === true
      );
    }

    if (saved.responses && typeof saved.responses === "object") {
      progress.responses = saved.responses;
    }

    Object.entries(config.legacyResponses || {}).forEach(
      ([id, oldKey]) => {
        if (!progress.responses[id] && saved[oldKey]) {
          progress.responses[id] = saved[oldKey];
        }
      }
    );
  } catch {
    progress.responses = {};
  }

  function saveProgress() {
    try {
      localStorage.setItem(
        config.storageKey,
        JSON.stringify(progress)
      );
    } catch {
      return;
    }
  }

  function updateProgress() {
    const completed = progress.done.filter(Boolean).length;
    const total = steps.length;

    const count = document.querySelector("#journey-count");
    const fill = document.querySelector("#journey-fill");
    const bar = document.querySelector(".journey-progress");

    if (count) {
      count.textContent = `${completed} / ${total} läbitud`;
    }

    if (fill) {
      fill.style.width = `${completed / total * 100}%`;
    }

    if (bar) {
      bar.setAttribute("aria-valuenow", String(completed));
      bar.setAttribute("aria-valuemax", String(total));
    }

    steps.forEach(step => {
      const number = Number(step.dataset.step);
      const done = progress.done[number - 1];

      step.classList.toggle("is-done", done);

      step.querySelector(".step-number").textContent =
        done ? "✓" : String(number);

      step.querySelector(".step-status").textContent =
        done ? "Läbitud" : step.open ? "Pooleli" : "Alustamata";
    });
  }

  function openStep(number) {
    const target = steps.find(
      step => Number(step.dataset.step) === number
    );

    if (!target) return;

    steps.forEach(step => {
      step.open = step === target;
    });

    updateProgress();

    window.setTimeout(() => {
      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });
    }, 320);
  }

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

  document.addEventListener("lesson:save-response", event => {
    const { id, step, value } = event.detail || {};
    const number = Number(step);

    if (
      typeof id !== "string" ||
      !id ||
      !Number.isInteger(number) ||
      number < 1 ||
      number > steps.length ||
      value == null
    ) return;

    if (id === "poster") {
      const previous = progress.responses.poster;

      if (
        previous &&
        JSON.stringify(previous) !== JSON.stringify(value)
      ) {
        delete progress.responses.posterReview;
        progress.done[5] = false;
      }
    }

    progress.responses[id] = value;
    progress.done[number - 1] = true;

    saveProgress();
    updateProgress();
  });

  document.querySelectorAll("[data-complete-step]").forEach(button => {
    button.addEventListener("click", () => {
      const number = Number(button.dataset.completeStep);

      if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > steps.length
      ) return;

      if (
        number === 6 &&
        !progress.responses.posterReview
      ) return;

      progress.done[number - 1] = true;
      saveProgress();
      updateProgress();

      if (button.dataset.nextStep) {
        openStep(Number(button.dataset.nextStep));
      }
    });
  });

  function buildQuiz(container) {
    const id = container.dataset.quiz;
    const quiz = config.quizzes?.[id];
    if (!quiz) return;

    const form = document.createElement("form");
    form.className = "learning-quiz";

    const feedbackNodes = new Map();

    quiz.questions.forEach((question, index) => {
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");

      legend.textContent = `${index + 1}. ${question.text}`;
      fieldset.append(legend);

      Object.entries(question.options).forEach(
        ([value, text], optionIndex) => {
          const label = document.createElement("label");
          const input = document.createElement("input");

          input.type = "radio";
          input.name = question.id;
          input.value = value;

          if (optionIndex === 0) {
            input.required = true;
          }

          label.append(input, document.createTextNode(` ${text}`));
          fieldset.append(label);
        }
      );

      const feedback = document.createElement("p");
      feedback.className = "answer-feedback";
      feedback.hidden = true;

      feedbackNodes.set(question.id, feedback);
      fieldset.append(feedback);
      form.append(fieldset);
    });

    const actions = document.createElement("div");
    actions.className = "quiz-actions";

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "action-button check-button";
    submit.textContent = "Kontrolli vastuseid";

    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "secondary-button retry-button";
    retry.textContent = "Proovi uuesti";
    retry.hidden = true;

    actions.append(submit, retry);
    form.append(actions);

    const result = document.createElement("div");
    result.className = "learning-box";
    result.setAttribute("role", "status");
    result.setAttribute("aria-live", "polite");
    result.hidden = true;
    form.append(result);

    const next = document.createElement("button");
    next.type = "button";
    next.className = "action-button";
    next.textContent = `Edasi ${quiz.step + 1}. etapiga`;
    next.hidden = true;

    if (quiz.step < steps.length) {
      form.append(next);
    }

    next.addEventListener("click", () => {
      openStep(quiz.step + 1);
    });

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
        (passed ? quiz.successText : quiz.retryText || "");

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

    form.addEventListener("submit", event => {
      event.preventDefault();

      const answers = Object.fromEntries(
        new FormData(form).entries()
      );

      showResults(answers, true);
    });

    retry.addEventListener("click", () => {
      form.reset();

      feedbackNodes.forEach(feedback => {
        feedback.hidden = true;
      });

      result.hidden = true;
      retry.hidden = true;
      next.hidden = true;

      delete progress.responses[id];
      progress.done[quiz.step - 1] = false;

      saveProgress();
      updateProgress();
    });

    container.append(form);

    const savedAnswers = progress.responses[id];

    if (savedAnswers) {
      form.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked =
          savedAnswers[input.name] === input.value;
      });

      showResults(savedAnswers, false);
    }
  }

  function buildResearch(container) {
    const id = container.dataset.research;
    const activity = config.researchActivities?.[id];
    if (!activity) return;

    const form = document.createElement("form");
    form.className = "learning-research";

    const group = document.createElement("fieldset");
    const legend = document.createElement("legend");

    legend.textContent = activity.choiceLabel;
    group.append(legend);

    const choices = document.createElement("div");
    choices.className = "research-choices";

    activity.choices.forEach((choice, index) => {
      const label = document.createElement("label");
      label.className = "research-choice";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "choice";
      input.value = choice.value;

      if (index === 0) input.required = true;

      const text = document.createElement("span");
      text.textContent = choice.label;

      label.append(input, text);
      choices.append(label);
    });

    group.append(choices);
    form.append(group);

    activity.fields.forEach(field => {
      const label = document.createElement("label");
      label.className = "research-field";

      const heading = document.createElement("strong");
      heading.textContent = field.label;

      const control = document.createElement(
        field.type === "select" ? "select" : "textarea"
      );

      control.name = field.name;
      control.required = true;

      if (field.type === "select") {
        const blank = document.createElement("option");
        blank.value = "";
        blank.textContent = "Vali vastus";
        control.append(blank);

        field.options.forEach(value => {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = value;
          control.append(option);
        });
      } else {
        control.rows = 3;
        control.placeholder = field.placeholder || "";
        control.minLength = field.minLength || 1;
      }

      label.append(heading, control);
      form.append(label);
    });

    const actions = document.createElement("div");
    actions.className = "quiz-actions";

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "action-button check-button";
    submit.textContent = "Kontrolli ja salvesta";

    actions.append(submit);
    form.append(actions);

    const feedback = document.createElement("div");
    feedback.className = "learning-box";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    feedback.hidden = true;
    form.append(feedback);

    const next = document.createElement("button");
    next.type = "button";
    next.className = "action-button";
    next.textContent = `Edasi ${activity.step + 1}. etapiga`;
    next.hidden = true;

    if (activity.step < steps.length) {
      form.append(next);
    }

    container.append(form);

    function showFeedback(text, success) {
      feedback.textContent = text;
      feedback.className = success
        ? "learning-box"
        : "answer-feedback is-wrong";
      feedback.hidden = false;
    }

    form.addEventListener("submit", event => {
      event.preventDefault();

      const answers = Object.fromEntries(new FormData(form));
      const choice = activity.choices.find(
        item => item.value === answers.choice
      );

      if (!choice || answers[activity.checkField] !== choice.correct) {
        showFeedback(
          `Õige vastus: ${choice?.correct || "–"}. Paranda ja proovi uuesti.`,
          false
        );
        return;
      }

      progress.responses[id] = answers;
      progress.done[activity.step - 1] = true;

      saveProgress();
      updateProgress();

      showFeedback(activity.successText, true);
      next.hidden = false;
    });

    form.addEventListener("input", () => {
      if (progress.done[activity.step - 1]) {
        progress.done[activity.step - 1] = false;
        delete progress.responses[id];
        saveProgress();
        updateProgress();
      }

      feedback.hidden = true;
      next.hidden = true;
    });

    next.addEventListener("click", () => {
      openStep(activity.step + 1);
    });

    const savedAnswers = progress.responses[id];

    if (savedAnswers) {
      form.querySelectorAll("[name]").forEach(input => {
        if (input.type === "radio") {
          input.checked =
            input.value === savedAnswers[input.name];
        } else {
          input.value = savedAnswers[input.name] || "";
        }
      });

      if (progress.done[activity.step - 1]) {
        showFeedback(activity.successText, true);
        next.hidden = false;
      }
    }
  }

  document.querySelectorAll("[data-quiz]").forEach(buildQuiz);

  document.querySelectorAll("[data-research]").forEach(
    buildResearch
  );

  document.querySelectorAll(".embed-shell iframe").forEach(frame => {
    frame.addEventListener("load", () => {
      const shell = frame.closest(".embed-shell");

      if (shell) {
        shell.classList.remove("is-loading");
        shell.classList.add("is-loaded");
      }
    });
  });

  const firstUnfinished =
    progress.done.findIndex(done => !done);

  steps.forEach(step => {
    step.open = Number(step.dataset.step) === (
      firstUnfinished === -1 ? 1 : firstUnfinished + 1
    );
  });

  updateProgress();

  if (sessionStorage.getItem("digiope-reset-scroll") === "1") {
    sessionStorage.removeItem("digiope-reset-scroll");

    history.scrollRestoration = "manual";

    window.addEventListener("load", () => {
      requestAnimationFrame(() => {
        steps[0]?.scrollIntoView({
          behavior: "instant",
          block: "start"
        });
      });
    });
  }

  document.querySelector("#reset-journey")
    ?.addEventListener("click", () => {
      const confirmed = confirm(
        "Kas soovid kõik oma vastused ja edusammud kustutada ning õpiteekonda uuesti alustada?"
      );

      if (!confirmed) return;

      localStorage.removeItem(config.storageKey);
      sessionStorage.setItem("digiope-reset-scroll", "1");
      history.scrollRestoration = "manual";

      window.location.reload();
    });
})();
