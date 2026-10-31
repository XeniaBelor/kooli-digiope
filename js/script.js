const subjectsBox = document.querySelector("#subjects");
const gradesBox = document.querySelector("#grades");
const gradeSection = document.querySelector("#grade-section");
const resultsSection = document.querySelector("#results");
const cardsBox = document.querySelector("#cards");

let selectedSubject = null;
let selectedGrade = null;

function makeButtons(items, container, selected, onClick, label) {
  container.replaceChildren();

  items.forEach(item => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = item === selected ? "chip selected" : "chip";
    button.textContent = label(item);
    button.setAttribute("aria-pressed", item === selected);

    button.addEventListener("click", () => onClick(item));
    container.append(button);
  });
}

function showSubjects() {
  makeButtons(subjects, subjectsBox, selectedSubject, subject => {
    selectedSubject = subject;
    selectedGrade = null;

    gradeSection.hidden = false;
    resultsSection.hidden = true;

    showSubjects();
    showGrades();
  }, subject => subject);
}

function showGrades() {
  const grades = Array.from({ length: 9 }, (_, i) => i + 1);

  makeButtons(grades, gradesBox, selectedGrade, grade => {
    selectedGrade = grade;
    resultsSection.hidden = false;

    showGrades();
    showMaterials();
  }, grade => `${grade}. klass`);
}

function showMaterials() {
  cardsBox.replaceChildren();

  const found = materials.filter(material =>
    material.subject === selectedSubject &&
    material.grade === selectedGrade
  );

  if (!found.length) {
    const message = document.createElement("p");
    message.className = "empty";
    message.textContent = "Selle klassi jaoks pole veel materjale lisatud.";
    cardsBox.append(message);
    return;
  }

  found.forEach(material => {
    const card = document.createElement("a");
    card.className = "material-card";
    card.href = material.url;

    const image = document.createElement("img");
    image.src = material.image;
    image.alt = material.title;
    image.loading = "lazy";

    const body = document.createElement("div");
    body.className = "card-body";

    const type = document.createElement("small");
    type.textContent = material.type;

    const title = document.createElement("h4");
    title.textContent = material.title;

    const details = document.createElement("p");
    details.textContent = `${material.subject} · ${material.grade}. klass`;

    body.append(type, title, details);
    card.append(image, body);
    cardsBox.append(card);
  });
}

showSubjects();
