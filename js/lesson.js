const STORAGE_KEY = "digiope-paikesesusteem";

let progress = {
  done: Array(8).fill(false),
  answers: null
};

// Restore progress
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (saved && Array.isArray(saved.done) && saved.done.length === 8) {
    progress.done = saved.done.map(value => value === true);
    progress.answers = saved.answers || null;
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
