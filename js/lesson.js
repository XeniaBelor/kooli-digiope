const STORAGE_KEY = "digiope-paikesesusteem";

let progress = {
  done: Array(8).fill(false),
  answers: null,
  stage3Answers: null
};

// Restore progress
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (saved && Array.isArray(saved.done) && saved.done.length === 8) {
    progress.done = saved.done.map(value => value === true);
    progress.answers = saved.answers || null;
    progress.stage3Answers = saved.stage3Answers || null;
  }
} catch {
  // Continue without saved progress
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Progress still works until the page is closed
  }
}

// Tabs
document.querySelectorAll(".journey-tab").forEach(button => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;

    document.querySelectorAll(".journey-tab").forEach(tab => {
      const active = tab === button;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-pressed", String(active));
    });

    document.querySelector("#learner-view").hidden = view !== "learner";
    document.querySelector("#teacher-view").hidden = view !== "teacher";
  });
});

// Learning steps
const steps = [...document.querySelectorAll(".journey-step")];

function updateProgress() {
  const completed = progress.done.filter(Boolean).length;

  document.querySelector("#journey-count").textContent =
    `${completed} / 8 läbitud`;

  document.querySelector("#journey-fill").style.width =
    `${completed / 8 * 100}%`;

  document.querySelector(".journey-progress")
    .setAttribute("aria-valuenow", completed);

  steps.forEach(step => {
    const index = Number(step.dataset.step);
    const done = progress.done[index - 1];

    step.classList.toggle("is-done", done);

    step.querySelector(".step-number").textContent =
      done ? "✓" : index;

    step.querySelector(".step-status").textContent =
      done ? "Läbitud" : step.open ? "Pooleli" : "Alustamata";
  });
}

function completeStep(number) {
  progress.done[number - 1] = true;
  saveProgress();
  updateProgress();
}

function openStep(number) {
  steps.forEach(step => {
    step.open = Number(step.dataset.step) === number;
  });

  updateProgress();

  document.querySelector(`[data-step="${number}"]`)
    .scrollIntoView({ block: "start" });
}

// Keep only one step expanded
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

// First stage
document.querySelector("#start-journey").addEventListener("click", () => {
  completeStep(1);
  openStep(2);
});

// Diagnostic questions
const questions = {
  q1: {
    correct: "taht",
    label: "Täht",
    explanation: "Päike on täht ja annab ise valgust."
  },
  q2: {
    correct: "8",
    label: "8",
    explanation: "Päikesesüsteemis on kaheksa planeeti."
  },
  q3: {
    correct: "merkuur",
    label: "Merkuur",
    explanation: "Merkuur on Päikesele kõige lähemal."
  },
  q4: {
    correct: "kuu",
    label: "Kuu",
    explanation: "Kuu on Maa looduslik kaaslane."
  }
};

const quiz = document.querySelector("#diagnostic-form");
const result = document.querySelector("#diagnostic-result");
const retry = document.querySelector("#retry-diagnostic");
const next = document.querySelector("#next-after-diagnostic");

function showFeedback(answers) {
  let score = 0;

  Object.entries(questions).forEach(([key, question]) => {
    const correct = answers[key] === question.correct;
    if (correct) score++;

    const feedback = document.querySelector(`[data-feedback="${key}"]`);

    feedback.textContent = correct
      ? `Õige! ${question.explanation}`
      : `Õige vastus: ${question.label}. ${question.explanation}`;

    feedback.className =
      `answer-feedback ${correct ? "is-correct" : "is-wrong"}`;

    feedback.hidden = false;
  });

  result.textContent =
    `Said ${score} vastust neljast õigesti. ` +
    `Tubli, esimene teadmiste kontroll on tehtud! ` +
    `Järgmistes etappides õpid Päikesesüsteemi põhjalikumalt tundma.`;

  result.hidden = false;
  retry.hidden = false;
  next.hidden = false;
}

quiz.addEventListener("submit", event => {
  event.preventDefault();

  progress.answers = Object.fromEntries(new FormData(quiz).entries());

  completeStep(2);
  showFeedback(progress.answers);
});

retry.addEventListener("click", () => {
  quiz.reset();

  progress.done[1] = false;
  progress.answers = null;

  document.querySelectorAll(".answer-feedback").forEach(feedback => {
    feedback.hidden = true;
  });

  result.hidden = true;
  retry.hidden = true;
  next.hidden = true;

  saveProgress();
  updateProgress();
});

next.addEventListener("click", () => openStep(3));

// Restore diagnostic answers if completed previously
if (progress.answers) {
  quiz.querySelectorAll('input[type="radio"]').forEach(input => {
    input.checked = progress.answers[input.name] === input.value;
  });

  showFeedback(progress.answers);
}

// Open the first unfinished stage
const firstUnfinished = progress.done.findIndex(done => !done);

steps.forEach(step => {
  step.open = Number(step.dataset.step) ===
    (firstUnfinished === -1 ? 1 : firstUnfinished + 1);
});

updateProgress();


// Third stage: knowledge check

const stage3Quiz = document.querySelector("#stage3-quiz");
const stage3Result = document.querySelector("#stage3-result");
const stage3Retry = document.querySelector("#stage3-retry");
const stage3Next = document.querySelector("#stage3-next");

const stage3Questions = {
  s3q1: {
    correct: "paike",
    answer: "Päikese ümber",
    explanation: "Kõik kaheksa planeeti tiirlevad ümber Päikese."
  },
  s3q2: {
    correct: "kolmas",
    answer: "Kolmas",
    explanation: "Maa on Päikesest kolmas planeet."
  },
  s3q3: {
    correct: "jupiter",
    answer: "Jupiter",
    explanation: "Jupiter on Päikesesüsteemi kõige suurem planeet."
  }
};

function checkStage3(answers, save = true) {
  let score = 0;

  Object.entries(stage3Questions).forEach(([key, question]) => {
    const correct = answers[key] === question.correct;
    if (correct) score++;

    const feedback = stage3Quiz.querySelector(
      `[data-stage3-feedback="${key}"]`
    );

    feedback.textContent = correct
      ? `Õige! ${question.explanation}`
      : `Õige vastus: ${question.answer}. ${question.explanation}`;

    feedback.className =
      `answer-feedback ${correct ? "is-correct" : "is-wrong"}`;

    feedback.hidden = false;
  });

  if (score >= 2 && save) {
    progress.stage3Answers = answers;
    completeStep(3);
  }

  stage3Result.textContent = score >= 2
    ? `${score}/3 õiget vastust. Väga tubli! Etapp läbitud!`
    : `${score}/3 õiget vastust. Korda õpitut ja proovi uuesti!`;

  stage3Result.hidden = false;
  stage3Retry.hidden = score >= 2;
  stage3Next.hidden = !progress.done[2];
}

stage3Quiz.addEventListener("submit", event => {
  event.preventDefault();

  const answers = Object.fromEntries(
    new FormData(stage3Quiz).entries()
  );

  checkStage3(answers);
});

stage3Retry.addEventListener("click", () => {
  stage3Quiz.reset();

  stage3Quiz.querySelectorAll(".answer-feedback").forEach(feedback => {
    feedback.hidden = true;
  });

  stage3Result.hidden = true;
  stage3Retry.hidden = true;
  stage3Next.hidden = true;
});

stage3Next.addEventListener("click", () => openStep(4));

// Restore saved answers
if (progress.done[2] && progress.stage3Answers) {
  stage3Quiz.querySelectorAll('input[type="radio"]').forEach(input => {
    input.checked =
      progress.stage3Answers[input.name] === input.value;
  });

  checkStage3(progress.stage3Answers, false);
}

