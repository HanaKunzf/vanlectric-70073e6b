// All user-facing strings. No hardcoded text in components.
export const en = {
  app: {
    name: "Vanlectric",
    fullName: "Vanlectric — Vanlife Electrical Calculator",
    tagline: "Size your van's electrical system in 10 minutes. No electrician needed.",
  },
  landing: {
    bullets: [
      { icon: "zap", text: "Based on your actual appliances" },
      { icon: "sun", text: "Solar, alternator & shore power" },
      { icon: "report", text: "Full report & shopping list" },
    ],
    cta: "Start Calculator",
    note: "Free to use • No account required",
  },
  nav: {
    next: "Next",
    back: "Back",
    finish: "See my results",
    stepOf: (current: number, total: number) => `Step ${current} of ${total}`,
  },
  steps: {
    s1: {
      title: "🚐 What van are you converting?",
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
      title: "🏕️ How will you use your van?",
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
    s3: {
      title: "🌤️ What's your typical climate?",
      helper:
        "Cold weather reduces battery capacity by up to 30% and increases heater use. Hot climates push fridge and ventilation.",
      options: {
        cold: {
          label: "Cold climate",
          desc: "Below 5°C often — Scandinavia, Alps, winter trips",
        },
        temperate: {
          label: "Temperate",
          desc: "5–25°C — most of Europe in spring/autumn",
        },
        warm: {
          label: "Warm / hot",
          desc: "Above 25°C often — Mediterranean summer, Spain, Portugal",
        },
        mixed: {
          label: "Mixed / all of the above",
          desc: "I travel year-round across regions",
        },
      },
    },
    s4: {
      title: "🔌 Which appliances will you use?",
      helper:
        "Pick everything you'll use regularly. Adjust hours per day if your usage differs from the default.",
      hoursLabel: "h/day",
      wattsLabel: "W",
      overrideLabel: "Custom wattage",
    },
    s5: {
      title: "🛣️ How often will you drive?",
      helper:
        "Driving recharges your batteries via the alternator. The more you drive, the smaller your solar/battery setup needs to be.",
      frequencyOptions: {
        "shore-power": {
          label: "Mostly plugged in",
          desc: "I'll be on shore power most of the time",
        },
        "off-grid": {
          label: "Parked off-grid for days",
          desc: "I stay in one spot for several days at a time",
        },
        occasional: {
          label: "Occasional moves",
          desc: "I drive every 2–3 days",
        },
        daily: {
          label: "Drive almost every day",
          desc: "I'm on the road most days",
        },
      },
      durationTitle: "How long is a typical drive?",
      durationHelper:
        "Used to estimate alternator charging time per move.",
      durationOptions: {
        "1h": "Up to 1 hour",
        "1-2h": "1–2 hours",
        "2-4h": "2–4 hours",
        "4h+": "4+ hours",
      },
    },
    s6: {
      title: "⚡ After how many days do you usually connect to shore power?",
      helper:
        "Shore power means a 230V hookup at home, campsite, workshop, family house or another reliable plug.",
      options: {
        never: {
          label: "Never / almost never",
          desc: "I want the system to work off-grid without relying on a plug.",
        },
        frequent: {
          label: "Every 1–2 days",
          desc: "I usually reach a plug very often.",
        },
        occasional: {
          label: "Every 3–5 days",
          desc: "I can usually recharge during longer trips.",
        },
        rare: {
          label: "Once per week or less",
          desc: "I may connect sometimes, but I do not want to depend on it.",
        },
        "home-between-trips": {
          label: "At home between trips",
          desc: "I mainly use the van for weekends and recharge at home afterwards.",
        },
      },
      chargingTitle: "Do you want shore power to charge your leisure battery?",
      chargingHelper:
        "A 230V shore circuit gives you wall sockets in the van. A shore battery charger is a separate device that recharges your leisure battery from that 230V supply.",
      chargingOptions: {
        "charge-battery": {
          label: "Yes — charge my battery from shore power",
          desc: "Recommended if you regularly connect to a plug.",
        },
        "ac-only": {
          label: "No — I only want 230V sockets for shore appliances",
          desc: "Creates a separate 230V circuit, but does not recharge the leisure battery.",
        },
        "not-sure": {
          label: "Not sure — show both options",
          desc: "We'll include the charger as recommended, but explain that it is optional.",
        },
      },
    },
    s7: {
      title: "🏠 Tell us about your roof",
      obstaclesTitle: "What's already on your roof?",
      obstaclesHelper: "Set how many of each. We'll subtract their footprint from your usable solar area.",
      measurementInfo:
        "💡 These calculations use typical dimensions. Always measure your actual roof and mark out obstacle positions before ordering panels. Component placement matters — a window near the centre may block more usable area than one at the edge.",
      emptyButton: "✨ Nothing — it's empty",
      countLabel: "Count",
      countOptions: { 0: "0", 1: "1", 2: "2", 3: "3" },
      tentCoversFanWarning:
        "⚠️ A roof tent typically covers the full roof including fan openings. Verify compatibility with your specific tent and van.",
      acFanInfo:
        "💡 Some roof AC units include ventilation — check if a separate fan is still needed.",
      knowDimensions: "I know the dimensions",
      lengthLabel: "Length (along van), cm",
      widthLabel: "Width (across van), cm",
      otherNameLabel: "Name",
      otherNamePlaceholder: "e.g. cargo box",
      obstacles: {
        "small-window": { icon: "🪟", label: "Small roof window", defaultText: "up to 50×50 cm", defaultL: 50, defaultW: 50 },
        "large-window": { icon: "🪟", label: "Large roof window", defaultText: "50×90 cm+", defaultL: 90, defaultW: 50 },
        "fan": { icon: "💨", label: "Roof fan", defaultText: "Maxxair, Fan-tastic… ~40×40 cm", defaultL: 40, defaultW: 40 },
        "gps-antenna": { icon: "📡", label: "GPS / mobile antenna", defaultText: "negligible — no area deducted", defaultL: 0, defaultW: 0 },
        "satellite": { icon: "📡", label: "Satellite dish", defaultText: "~60×60 cm", defaultL: 60, defaultW: 60 },
        "solar-shower": { icon: "🚿", label: "Solar shower bag", defaultText: "~30×60 cm", defaultL: 60, defaultW: 30 },
        "rack": { icon: "🔧", label: "Roof rack / carrier", defaultText: "~100×140 cm", defaultL: 140, defaultW: 100 },
        "ac": { icon: "❄️", label: "Roof AC unit", defaultText: "~70×40 cm", defaultL: 70, defaultW: 40 },
        "tent": { icon: "🏕️", label: "Roof tent", defaultText: "~120×240 cm", defaultL: 240, defaultW: 120 },
        "other": { icon: "⬜", label: "Other obstacle", defaultText: "enter dimensions", defaultL: 0, defaultW: 0 },
      },
      rackPanelsLabel: "Panels can be mounted on/inside the rack",
      rackPanelsHint: "If checked, the rack becomes a mounting platform — its area is not deducted.",
      rackHeightWarning: "⚠️ Check total vehicle height with panels — may restrict access to car parks and low bridges.",
      tentSolarTitle: "Can you mount solar panels alongside the tent?",
      tentSolarYes: "Yes — with quick-disconnect (MC4)",
      tentSolarNo: "No — tent takes the full roof",
      roofTypeTitle: "What kind of roof do you have?",
      roofTypeOptions: {
        flat: "Flat / standard high-roof",
        "pop-top": "Pop-top / elevating roof",
        "high-top": "Factory high-top",
        unsure: "Not sure",
      },
      popTopTitle: "On average, how many hours per day will the pop-top be UP while parked?",
      popTopHelper:
        "When the pop-top is up, no solar can be installed there — we'll account for limited usable roof area.",
      warning:
        "A pop-top roof significantly reduces the surface available for solar panels.",
    },
    s8: {
      title: "👥 How many people will live in the van?",
      helper:
        "More people = more phones, more lights, more water pumping, more cooking. We'll scale loads accordingly.",
      options: {
        1: { icon: "👤", label: "Just me", desc: "Solo build" },
        2: { icon: "👥", label: "2 people", desc: "Couple — most common" },
        3: { icon: "👨‍👩‍👧", label: "3 people", desc: "Small family" },
        4: { icon: "👨‍👩‍👧‍👦", label: "4 or more", desc: "Family build" },
      },
    },
    s9: {
      title: "💻 Will you work remotely from the van?",
      helper:
        "Remote work means laptops, screens, routers and Starlink — significant continuous loads during the day.",
      options: {
        no: { label: "No", desc: "Just leisure use" },
        occasionally: {
          label: "Occasionally",
          desc: "A few hours a week",
        },
        partTime: {
          label: "Part-time",
          desc: "Several days per week, full days",
        },
        fullTime: {
          label: "Full-time",
          desc: "8h/day, every weekday — this is my office",
        },
      },
    },
    s10: {
      title: "🍂 What seasons will you use the van?",
      helper:
        "Solar production drops to ~20% in winter at northern latitudes. Year-round users need significantly more battery.",
      options: {
        summer: {
          label: "Summer only",
          desc: "Roughly May–September",
        },
        "three-seasons": {
          label: "Three seasons",
          desc: "Spring, summer, autumn — no deep winter",
        },
        "year-round": {
          label: "Year-round",
          desc: "I want to use the van all 12 months",
        },
        winter: {
          label: "Mostly winter",
          desc: "Ski trips, cold weather expeditions",
        },
      },
    },
    s11: {
      title: "🧱 How well insulated is your van?",
      helper:
        "Better insulation drastically reduces heating and cooling loads — and therefore battery needs.",
      options: {
        full: {
          label: "Fully insulated",
          desc: "Walls, ceiling, floor and windows — done properly",
        },
        basic: {
          label: "Basic insulation",
          desc: "Some walls and ceiling, gaps remain",
        },
        none: {
          label: "Little or none",
          desc: "Empty van or just panels — heat escapes fast",
        },
      },
      warning:
        "Poor insulation can double your heating energy needs in winter.",
    },
    s12: {
      title: "💰 What's your budget for the electrical system?",
      helper:
        "This is just the electrical setup (batteries, solar, inverter, charger, cables). Not the full van conversion.",
      options: {
        "<500": { label: "Under €500", desc: "Bare minimum — small system" },
        "500-1000": { label: "€500 – €1,000", desc: "Weekend setup" },
        "1000-2000": { label: "€1,000 – €2,000", desc: "Solid all-rounder" },
        "2000-3000": { label: "€2,000 – €3,000", desc: "Comfortable full-timer" },
        "3000+": { label: "€3,000+", desc: "No compromises" },
        "show-me": {
          label: "Show me what I need",
          desc: "I'll decide once I see the recommendation",
        },
      },
    },
  },
  pro: {
    badge: "PRO",
    locked: "Coming soon in PRO version",
  },
} as const;
