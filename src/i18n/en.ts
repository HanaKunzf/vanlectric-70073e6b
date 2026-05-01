// All user-facing strings. No hardcoded text in components.
export const en = {
  app: {
    name: "Vanlife Electrical Calculator",
    tagline: "Size your van's electrical system in 10 minutes. No electrician needed.",
  },
  landing: {
    bullets: [
      { icon: "⚡", text: "Based on your actual appliances" },
      { icon: "☀️", text: "Solar, alternator & shore power" },
      { icon: "📄", text: "Full report & shopping list" },
    ],
    cta: "Start Calculator",
    note: "Free to use • No account required",
  },
  nav: {
    next: "Next",
    back: "Back",
    stepOf: (current: number, total: number) => `Step ${current} of ${total}`,
  },
  steps: {
    s1: {
      title: "What van are you converting?",
      brand: "Brand",
      size: "Size",
      year: "Year",
      engine: "Engine",
      brandOptions: {
        ducato: "Fiat Ducato / Peugeot Boxer / Citroën Jumper",
        sprinter: "Mercedes Sprinter / VW Crafter",
        transit: "Ford Transit",
        master: "Renault Master / Opel Movano",
        transporter: "Volkswagen Transporter",
        proace: "Toyota Proace / Peugeot Expert",
        other: "Other",
      },
      brandOtherPlaceholder: "Which van?",
      sizeOptions: {
        L1: "L1 — Short",
        L2: "L2 — Medium",
        L3: "L3 — Long",
        L4: "L4 — Extra Long",
      },
      yearOptions: {
        "pre-2010": "Before 2010",
        "2010-2014": "2010–2014",
        "2015-2019": "2015–2019",
        "2020+": "2020 or newer",
      },
      engineOptions: {
        petrol: "Petrol",
        "diesel-old": "Diesel — older (Euro 4/5, before 2017)",
        "diesel-euro6": "Diesel — modern (Euro 6, 2017+)",
        unknown: "I don't know",
      },
    },
    s2: {
      title: "How will you use your van?",
      profileOptions: {
        weekendWarrior: {
          icon: "🏕️",
          label: "Weekend Warrior",
          desc: "Mostly weekends + occasional 1–2 week trips",
        },
        traveller: {
          icon: "🗺️",
          label: "Traveller",
          desc: "Regular expeditions of 1–4 weeks, then back home",
        },
        fulltimer: {
          icon: "🏠",
          label: "Full-timer",
          desc: "The van is my home, living in it long-term",
        },
      },
      journeyTitle: "How long is a typical one-way drive to your destination?",
      journeyHelper:
        "This affects battery sizing for the drive home — especially if you don't have a DC-DC charger.",
      journeyOptions: {
        "1h": { icon: "🕐", label: "Up to 1 hour" },
        "1-2h": { icon: "🕑", label: "1–2 hours" },
        "2-4h": { icon: "🕓", label: "2–4 hours" },
        "4h+": { icon: "🕔", label: "4+ hours" },
      },
    },
  },
  pro: {
    badge: "PRO",
    locked: "Coming soon in PRO version",
  },
} as const;
