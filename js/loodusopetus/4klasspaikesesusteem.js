// Questions and assessment rules for this topic
window.lessonConfig = {
  storageKey: "digiope-paikesesusteem",

  legacyResponses: {
    diagnostic: "answers",
    stage3: "stage3Answers"
  },

  // Knowledge checks
  quizzes: {
    // 2. ETAPP
    diagnostic: {
      step: 2,
      minCorrect: 0,
      successText: "Eelteadmiste kontroll on tehtud! Nüüd saad edasi õppida!",

      questions: [
        {
          id: "q1",
          text: "Mis on Päike?",
          options: {
            planeet: "Planeet",
            kaaslane: "Kaaslane",
            taht: "Täht"
          },
          correct: "taht",
          explanation: "Päike on täht ja annab ise valgust."
        },
        {
          id: "q2",
          text: "Mitu planeeti on Päikesesüsteemis?",
          options: {
            kaheksa: "8",
            seitse: "7",
            uheksa: "9"
          },
          correct: "kaheksa",
          explanation: "Päikesesüsteemis on kaheksa planeeti."
        },
        {
          id: "q3",
          text: "Milline planeet on Päikesele kõige lähemal?",
          options: {
            maa: "Maa",
            merkuur: "Merkuur",
            marss: "Marss"
          },
          correct: "merkuur",
          explanation: "Merkuur on Päikesele kõige lähemal."
        },
        {
          id: "q4",
          text: "Mis tiirleb ümber Maa?",
          options: {
            kuu: "Kuu",
            paike: "Päike",
            jupiter: "Jupiter"
          },
          correct: "kuu",
          explanation: "Kuu on Maa looduslik kaaslane."
        }
      ]
    },

    // 3. ETAPP
    stage3: {
      step: 3,
      minCorrect: 2,
      successText: "Väga tubli! Etapp läbitud!",
      retryText: "Korda õpitut ja proovi uuesti!",

      questions: [
        {
          id: "s3q1",
          text: "Mille ümber tiirlevad Päikesesüsteemi planeedid?",
          options: {
            maa: "Maa ümber",
            kuu: "Kuu ümber",
            paike: "Päikese ümber"
          },
          correct: "paike",
          explanation: "Kõik kaheksa planeeti tiirlevad ümber Päikese."
        },
        {
          id: "s3q2",
          text: "Mitmes planeet Päikesest on Maa?",
          options: {
            kolmas: "Kolmas",
            esimene: "Esimene",
            viies: "Viies"
          },
          correct: "kolmas",
          explanation: "Maa on Päikesest kolmas planeet."
        },
        {
          id: "s3q3",
          text: "Milline on Päikesesüsteemi kõige suurem planeet?",
          options: {
            saturn: "Saturn",
            jupiter: "Jupiter",
            neptuun: "Neptuun"
          },
          correct: "jupiter",
          explanation: "Jupiter on Päikesesüsteemi kõige suurem planeet."
        }
      ]
    }
  },

  // Research activities
  researchActivities: {
    // 4. ETAPP
    planetPassport: {
      step: 4,
      choiceLabel: "Millist planeeti soovid uurida?",
      checkField: "order",
      successText: "Planeedi pass on salvestatud! Etapp läbitud!",

      choices: [
        { value: "merkuur", label: "Merkuur", correct: "1" },
        { value: "veenus", label: "Veenus", correct: "2" },
        { value: "maa", label: "Maa", correct: "3" },
        { value: "marss", label: "Marss", correct: "4" },
        { value: "jupiter", label: "Jupiter", correct: "5" },
        { value: "saturn", label: "Saturn", correct: "6" },
        { value: "uraan", label: "Uraan", correct: "7" },
        { value: "neptuun", label: "Neptuun", correct: "8" }
      ],

      fields: [
        {
          name: "order",
          type: "select",
          label: "Mitmes planeet Päikesest see on?",
          options: ["1", "2", "3", "4", "5", "6", "7", "8"]
        },
        {
          name: "feature",
          type: "textarea",
          label: "Mille poolest on sinu planeet eriline?",
          placeholder: "Kirjelda planeeti oma sõnadega...",
          minLength: 10
        },
        {
          name: "fact",
          type: "textarea",
          label: "Kirjuta üks huvitav fakt oma planeedi kohta.",
          placeholder: "Sain teada, et...",
          minLength: 10
        }
      ]
    }
  }
};
