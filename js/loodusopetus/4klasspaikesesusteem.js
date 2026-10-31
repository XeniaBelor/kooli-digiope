// Questions and assessment rules for this topic
window.lessonConfig = {
  storageKey: "digiope-paikesesusteem",

  // Preserve results saved by the previous version
  legacyResponses: {
    diagnostic: "answers",
    stage3: "stage3Answers"
  },

  quizzes: {
    // 2. ETAPP — Initial knowledge check
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
            taht: "Täht",
            kaaslane: "Kaaslane"
          },
          correct: "taht",
          explanation: "Päike on täht ja annab ise valgust."
        },
        {
          id: "q2",
          text: "Mitu planeeti on Päikesesüsteemis?",
          options: {
            "7": "7",
            "8": "8",
            "9": "9"
          },
          correct: "8",
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

    // 3. ETAPP — Knowledge check after studying
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
            paike: "Päikese ümber",
            kuu: "Kuu ümber"
          },
          correct: "paike",
          explanation: "Kõik kaheksa planeeti tiirlevad ümber Päikese."
        },
        {
          id: "s3q2",
          text: "Mitmes planeet Päikesest on Maa?",
          options: {
            esimene: "Esimene",
            kolmas: "Kolmas",
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
  }
};
