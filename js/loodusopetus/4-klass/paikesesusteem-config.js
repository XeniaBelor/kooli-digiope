(() => {
  const imageBase = new URL(
    "../../../images/loodusopetus/4-klass/paikesesusteem/",
    document.currentScript.src
  ).href;

  const planets = [
    { id: "merkuur", name: "Merkuur", image: 1 },
    { id: "veenus", name: "Veenus", image: 2 },
    { id: "maa", name: "Maa", image: 3 },
    { id: "marss", name: "Marss", image: 4 },
    { id: "jupiter", name: "Jupiter", image: 5 },
    { id: "saturn", name: "Saturn", image: 6 },
    { id: "uraan", name: "Uraan", image: 7 },
    { id: "neptuun", name: "Neptuun", image: 8 }
  ];

  window.paikesesusteemData = {
    planets,

    imageUrl(type, number) {
      return `${imageBase}4-klass_poster-${type}${number}.webp`;
    },

    subtitles: [
      "Avastame ühe põneva planeedi!",
      "Kolm huvitavat fakti planeedist.",
      "Meie avastusretk Päikesesüsteemis.",
      "Mis teeb selle planeedi eriliseks?",
      "Avastame kosmose saladusi!",
      "Üks planeet, palju põnevaid avastusi!",
      "Lähme koos planeeti avastama!"
    ],

    backgrounds: [
      { number: 1, name: "Punane", color: "#c54a50" },
      { number: 2, name: "Oranž", color: "#d77a24" },
      { number: 3, name: "Kollane", color: "#a88100" },
      { number: 4, name: "Roheline", color: "#26834e" },
      { number: 5, name: "Helesinine", color: "#197eac" },
      { number: 6, name: "Sinine", color: "#2764c1" },
      { number: 7, name: "Violetne", color: "#7851b6" }
    ],

    facts: {
      merkuur: [
        ["See on Päikesesüsteemi kõige väiksem planeet. 🪨", true],
        ["Sellel planeedil on suured rõngad. 🪐", false],
        ["See asub Päikesele kõige lähemal. ☀️", true],
        ["Sellel planeedil on kaks kuud. 🌙", false],
        ["Sellel planeedil ei ole kuusid. 🔭", true],
        ["See on Päikesesüsteemi kõige suurem planeet. 🌍", false]
      ],

      veenus: [
        ["See on Päikesest teine planeet. ☀️", true],
        ["See on Päikesesüsteemi kõige väiksem planeet. 🪨", false],
        ["See on Päikesesüsteemi kõige kuumem planeet. 🔥", true],
        ["Sellel planeedil elavad inimesed. 🏠", false],
        ["Sellel planeedil ei ole kuusid. 🔭", true],
        ["See asub Päikesest kõige kaugemal. 🌌", false]
      ],

      maa: [
        ["See on Päikesest kolmas planeet. ☀️", true],
        ["See on Päikesesüsteemi kõige suurem planeet. 🌍", false],
        ["Sellel planeedil on üks looduslik kaaslane. 🌙", true],
        ["See on Päikesest teine planeet. 🔭", false],
        ["See on ainus teadaolev planeet, kus leidub elu. 🌱", true],
        ["See on tuntud suurte rõngaste poolest. 🪐", false]
      ],

      marss: [
        ["Seda tuntakse punase planeedina. 🔴", true],
        ["See asub Päikesele kõige lähemal. ☀️", false],
        ["See on Päikesest neljas planeet. 🔭", true],
        ["See on Päikesesüsteemi kõige kuumem planeet. 🔥", false],
        ["Sellel planeedil on kaks kuud. 🌙", true],
        ["Sellel planeedil on vedela veega ookeanid. 🌊", false]
      ],

      jupiter: [
        ["See on Päikesesüsteemi kõige suurem planeet. 🌍", true],
        ["Sellel planeedil ei ole kuusid. 🌙", false],
        ["See on gaasihiid. ☁️", true],
        ["See asub Päikesele kõige lähemal. ☀️", false],
        ["Selle atmosfääris asub Suur Punane Laik. 🌪️", true],
        ["Sellel planeedil on tahke kivine pind. 🪨", false]
      ],

      saturn: [
        ["See on tuntud oma suurte rõngaste poolest. 🪐", true],
        ["See on Päikesest kolmas planeet. ☀️", false],
        ["See on gaasihiid. ☁️", true],
        ["Sellel planeedil ei ole kuusid. 🌙", false],
        ["See on Päikesest kuues planeet. 🔭", true],
        ["See on Päikesesüsteemi kõige väiksem planeet. 🪨", false]
      ],

      uraan: [
        ["See on Päikesest seitsmes planeet. ☀️", true],
        ["See on Päikesesüsteemi kõige kuumem planeet. 🔥", false],
        ["See pöörleb peaaegu külili. 🔄", true],
        ["See asub Päikesele kõige lähemal. 🔭", false],
        ["See on jäähiid. ❄️", true],
        ["Sellel planeedil ei ole kuusid. 🌙", false]
      ],

      neptuun: [
        ["See on Päikesest kaheksas planeet. ☀️", true],
        ["See asub Päikesele kõige lähemal. 🔭", false],
        ["See on jäähiid. ❄️", true],
        ["See on Päikesesüsteemi kõige väiksem planeet. 🪨", false],
        ["See asub Päikesest kõige kaugemal. 🌌", true],
        ["Sellel planeedil ei ole kuusid. 🌙", false]
      ]
    }
  };

  window.lessonConfig = {
    storageKey: "digiope-paikesesusteem",

    legacyResponses: {
      diagnostic: "answers",
      stage3: "stage3Answers"
    },

    quizzes: {
      diagnostic: {
        step: 2,
        minCorrect: 0,
        successText:
          "Eelteadmised on kontrollitud! Jätka kosmosereisi.",
        questions: [
          {
            id: "q1",
            text: "Mis on Päike? ☀️",
            options: {
              planeet: "Planeet",
              kaaslane: "Kuu",
              taht: "Täht"
            },
            correct: "taht",
            explanation:
              "Päike on täht. See annab valgust ja soojust."
          },
          {
            id: "q2",
            text: "Mitu planeeti on Päikesesüsteemis? 🪐",
            options: {
              kaheksa: "8",
              seitse: "7",
              uheksa: "9"
            },
            correct: "kaheksa",
            explanation:
              "Päikesesüsteemis on kaheksa planeeti."
          },
          {
            id: "q3",
            text: "Milline planeet on Päikesele kõige lähemal? 🔍",
            options: {
              maa: "Maa",
              merkuur: "Merkuur",
              marss: "Marss"
            },
            correct: "merkuur",
            explanation:
              "Merkuur asub Päikesele kõige lähemal."
          },
          {
            id: "q4",
            text: "Mis tiirleb ümber Maa? 🌕",
            options: {
              kuu: "Kuu",
              paike: "Päike",
              jupiter: "Jupiter"
            },
            correct: "kuu",
            explanation:
              "Kuu on Maa looduslik kaaslane."
          }
        ]
      },

      stage3: {
        step: 3,
        minCorrect: 2,
        successText:
          "Tubli! Võid jätkata planeetide uurimist.",
        retryText:
          "Uuri Päikesesüsteemi veel ja proovi uuesti.",
        questions: [
          {
            id: "s3q1",
            text: "Mille ümber tiirlevad Päikesesüsteemi planeedid? 🪐",
            options: {
              maa: "Maa ümber",
              kuu: "Kuu ümber",
              paike: "Päikese ümber"
            },
            correct: "paike",
            explanation:
              "Kõik kaheksa planeeti tiirlevad ümber Päikese."
          },
          {
            id: "s3q2",
            text: "Mis on asteroid? ☄️",
            options: {
              kivine: "Väike kivine taevakeha",
              taht: "Suur helendav täht",
              laev: "Kosmoselaev"
            },
            correct: "kivine",
            explanation:
              "Asteroid on väike taevakeha, mis koosneb peamiselt kivimist või metallist."
          },
          {
            id: "s3q3",
            text: "Milline neist ei ole planeet? 🌑",
            options: {
              saturn: "Saturn",
              kuu: "Kuu",
              neptuun: "Neptuun"
            },
            correct: "kuu",
            explanation:
              "Kuu on Maa looduslik kaaslane, mitte planeet."
          }
        ]
      }
    },

    researchActivities: {
      planetPassport: {
        step: 4,
        choiceLabel: "Millist planeeti soovid uurida? 🚀",
        checkField: "order",
        successText:
          "Planeedi pass on salvestatud! Etapp läbitud!",
        choices: planets.map((planet, index) => ({
          value: planet.id,
          label: planet.name,
          correct: String(index + 1)
        })),
        fields: [
          {
            name: "order",
            type: "select",
            label: "Mitmes planeet Päikesest see on? 📍",
            options: ["1", "2", "3", "4", "5", "6", "7", "8"]
          },
          {
            name: "feature",
            type: "textarea",
            label: "Kirjuta üks huvitav asi oma planeedi kohta. ✍️",
            placeholder: "Sain teada, et ...",
            minLength: 8
          }
        ]
      }
    }
  };
})();
