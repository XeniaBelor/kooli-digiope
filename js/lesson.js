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
  function openStep(stepNumber) {
    const step = steps[stepNumber - 1];
    if (!step) return;
  
    step.open = true;
  
    const summary = step.querySelector("summary");
    const top = summary.getBoundingClientRect().top + window.scrollY - 90;
  
    window.scrollTo({
      top,
      behavior: "smooth"
    });
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

    // Build research activities from the topic configuration
    function buildResearch(container) {
      const id = container.dataset.research;
      const activity = config.researchActivities?.[id];
      if (!activity) return;
    
      const form = document.createElement("form");
      form.className = "learning-research";
    
      // Choice cards
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
    
      // Research fields
      activity.fields.forEach(field => {
        const label = document.createElement("label");
        label.className = "research-field";
    
        const title = document.createElement("strong");
        title.textContent = field.label;
    
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
    
        label.append(title, control);
        form.append(label);
      });
    
      // Feedback and buttons
      const feedback = document.createElement("p");
      feedback.className = "answer-feedback";
      feedback.setAttribute("role", "status");
      feedback.setAttribute("aria-live", "polite");
      feedback.hidden = true;
    
      const actions = document.createElement("div");
      actions.className = "quiz-actions";
    
      const submit = document.createElement("button");
      submit.type = "submit";
      submit.className = "action-button";
      submit.textContent = "Kontrolli ja salvesta";
    
      const next = document.createElement("button");
      next.type = "button";
      next.className = "secondary-button";
      next.textContent = `Edasi ${activity.step + 1}. etapiga`;
      next.hidden = true;
    
      actions.append(submit);
      if (activity.step < steps.length) actions.append(next);
    
      form.append(actions, feedback);
      container.append(form);
    
      function showFeedback(message, correct) {
        feedback.textContent = message;
        feedback.className =
          `answer-feedback ${correct ? "is-correct" : "is-wrong"}`;
        feedback.hidden = false;
      }
    
      // Check the research form
      form.addEventListener("submit", event => {
        event.preventDefault();
    
        const answers = Object.fromEntries(new FormData(form));
        const choice = activity.choices.find(
          item => item.value === answers.choice
        );
    
        if (!choice || answers[activity.checkField] !== choice.correct) {
          showFeedback(
            `Õige vastus: ${choice?.correct || "–"}. ` +
            "Paranda vastus ja proovi uuesti.",
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
    
      // Editing a completed form removes its completion mark
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
    
      next.addEventListener("click", () => openStep(activity.step + 1));
    
      // Restore saved research
      const saved = progress.responses[id];
    
      if (saved) {
        form.querySelectorAll("[name]").forEach(input => {
          if (input.type === "radio") {
            input.checked = input.value === saved[input.name];
          } else {
            input.value = saved[input.name] || "";
          }
        });
    
        if (progress.done[activity.step - 1]) {
          showFeedback(activity.successText, true);
          next.hidden = false;
        }
      }
    }

  // Initialize quizzes
  document.querySelectorAll("[data-quiz]").forEach(buildQuiz);

  document.querySelectorAll("[data-research]").forEach(buildResearch);

  // Loading for h5p
  document.querySelectorAll(".js-embed-frame").forEach(frame => {
  frame.addEventListener("load", () => {
    const shell = frame.closest(".embed-shell");
    if (shell) {
      shell.classList.remove("is-loading");
      shell.classList.add("is-loaded");
      }
    });
  });

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
