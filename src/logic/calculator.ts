// Vanlife Electrical Calculator — calculation engine.
import {
  APPLIANCE_CATALOG,
  type ApplianceDef,
  type WizardState,
  type ClimateZone,
  type Insulation,
  type Season,
  type VehicleSize,
  type RoofType,
  type RoofObstacleId,
  type DrivingFrequency,
  type JourneyDuration,
  type UsageProfile,
  type ShorePowerAccess,
  type People,
  type RemoteWork,
  type Budget,
} from "@/types";

// ---------- helpers ----------
const FRIDGE_IDS = new Set(["fridge-small", "fridge-medium", "fridge-large", "fridge-freezer", "fridge-absorption", "freezer"]);

const fridgeDuty: Record<ClimateZone, Record<Insulation, number>> = {
  cold:      { full: 0.15, basic: 0.20, none: 0.25 },
  temperate: { full: 0.28, basic: 0.35, none: 0.44 },
  warm:      { full: 0.50, basic: 0.63, none: 0.78 },
  mixed:     { full: 0.50, basic: 0.63, none: 0.78 },
};

const heatingHoursMap: Record<ClimateZone, Record<Season, number>> = {
  cold:      { summer: 2, "three-seasons": 6, "year-round": 10, winter: 14 },
  temperate: { summer: 0, "three-seasons": 3, "year-round": 7,  winter: 10 },
  warm:      { summer: 0, "three-seasons": 0, "year-round": 2,  winter: 4 },
  mixed:     { summer: 2, "three-seasons": 5, "year-round": 9,  winter: 12 },
};

const remoteWorkWh: Record<RemoteWork, number> = {
  no: 0, occasionally: 50, partTime: 200, fullTime: 450,
};

const daysAutonomyMap: Record<UsageProfile, number> = {
  weekendWarrior: 2, traveller: 3, fulltimer: 4,
};

const journeyHoursMap: Record<JourneyDuration, number> = {
  "1h": 1, "1-2h": 1.5, "2-4h": 3, "4h+": 5,
};

const solarHoursMatrix: Record<ClimateZone, Record<Season, number>> = {
  cold:      { summer: 3.5, "three-seasons": 2.5, "year-round": 2.0, winter: 1.5 },
  temperate: { summer: 5.0, "three-seasons": 3.5, "year-round": 2.5, winter: 2.0 },
  warm:      { summer: 7.0, "three-seasons": 5.5, "year-round": 4.5, winter: 3.5 },
  mixed:     { summer: 2.5, "three-seasons": 2.5, "year-round": 2.0, winter: 1.5 },
};

const roofAreaMap: Record<VehicleSize, number> = { L1: 2.0, L2: 2.8, L3: 3.4, L4: 4.0 };

// Default footprints in m² per single unit (length × width converted from cm).
const obstacleDefaults: Record<RoofObstacleId, { l: number; w: number }> = {
  "small-window": { l: 50, w: 50 },
  "large-window": { l: 90, w: 50 },
  "fan": { l: 40, w: 40 },
  "gps-antenna": { l: 0, w: 0 },
  "satellite": { l: 60, w: 60 },
  "solar-shower": { l: 60, w: 30 },
  "rack": { l: 140, w: 100 },
  "ac": { l: 70, w: 40 },
  "tent": { l: 240, w: 120 },
  "other": { l: 0, w: 0 },
};

// ---------- result types ----------
export interface ApplianceLine {
  id: string;
  label: string;
  powerSource: ApplianceDef["powerSource"];
  watts: number;
  hours: number;
  wh: number;
  shoreOnly: boolean;
  informational: boolean;
  isDutyCycle?: boolean;
}

export interface RecommendedComponent {
  key: string;
  category: string;
  name: string;
  why: string;
  detail: string;
  price: number;
  note?: string;
}

export interface MaterialItem { item: string; price: number; qty?: number }

export interface CalculationResult {
  lines: ApplianceLine[];
  shoreLines: ApplianceLine[];
  applianceSubtotalWh: number;
  inverterLossWh: number;
  remoteWorkWh: number;
  reserveWh: number;
  totalDailyWh: number;
  hasInverterLoad: boolean;

  // Battery
  daysAutonomy: number;
  journeyWh: number;
  requiredWh: number;
  requiredAh: number;

  // Solar
  roofArea: number;
  obstacleArea: number;
  maxSolarW: number;
  solarHours: number;
  requiredSolarW: number;
  recommendedSolarW: number;
  panelType: string;
  solarDailyWh: number;

  // Alternator
  alternatorDailyWh: number;
  hasDCDC: boolean;

  components: RecommendedComponent[];
  materials: MaterialItem[];
  materialsTotal: number;
  componentsTotal: number;
  subtotal: number;
  contingency: number;
  totalBudget: number;

  warnings: string[];
}

// ---------- main ----------
export function calculate(state: WizardState): CalculationResult {
  const { step1, step2, step3, step4, step5, step6, step7, step8, step9, step10, step11, step12 } = state;

  const climate: ClimateZone = step3.climate ?? "temperate";
  const insulation: Insulation = step11.insulation ?? "basic";
  const season: Season = step10.season ?? "three-seasons";
  const people: People = step8.people ?? 2;

  const allAppliances: ApplianceDef[] = APPLIANCE_CATALOG.flatMap((c) => c.items);
  const byId = new Map(allAppliances.map((a) => [a.id, a]));

  const lines: ApplianceLine[] = [];
  const shoreLines: ApplianceLine[] = [];
  let applianceSubtotalWh = 0;
  let inverterLossWh = 0;
  let hasInverterLoad = false;

  for (const [id, entry] of Object.entries(step4.appliances)) {
    if (!entry.enabled) continue;
    const def = byId.get(id);
    if (!def) continue;

    const watts = entry.watts ?? def.watts;
    const hours = entry.hours ?? def.defaultHours;

    if (def.powerSource === "230v-shore" || entry.shoreOnly) {
      shoreLines.push({
        id, label: def.label, powerSource: def.powerSource,
        watts, hours, wh: 0, shoreOnly: true, informational: !!def.informational,
      });
      continue;
    }

    if (def.informational) {
      lines.push({
        id, label: def.label, powerSource: def.powerSource,
        watts: 0, hours: 0, wh: 0, shoreOnly: false, informational: true,
      });
      continue;
    }

    let baseWh = watts * hours;
    let displayHours = hours;

    // Fridge duty cycle
    if (FRIDGE_IDS.has(id)) {
      const duty = fridgeDuty[climate][insulation];
      baseWh = watts * 24 * duty;
      displayHours = 24 * duty;
    }

    // Diesel heater
    if (id === "diesel-heater") {
      const h = heatingHoursMap[climate][season];
      baseWh = 15 * h + 120 * 0.033;
    }

    // People corrections
    if (id === "phones") baseWh += (people - 1) * 10 * 3;
    if (id === "lights-led") baseWh *= 1 + (people - 1) * 0.1;
    if (id === "water-pump") baseWh *= 1 + (people - 1) * 0.2;

    // Inverter losses
    if (def.powerSource === "230v-inverter") {
      hasInverterLoad = true;
      const before = baseWh;
      baseWh = baseWh * 1.12;
      inverterLossWh += baseWh - before;
    }

    lines.push({
      id, label: def.label, powerSource: def.powerSource,
      watts, hours: displayHours, wh: baseWh, shoreOnly: false, informational: false,
      isDutyCycle: FRIDGE_IDS.has(id),
    });
    applianceSubtotalWh += baseWh;
  }

  const rwWh = remoteWorkWh[step9.remoteWork ?? "no"];
  const beforeReserve = applianceSubtotalWh + rwWh;
  const totalDailyWh = beforeReserve * 1.25;
  const reserveWh = totalDailyWh - beforeReserve;

  // ----- Battery -----
  const profile = step2.profile ?? "traveller";
  const daysAutonomy = daysAutonomyMap[profile];
  const frequency: DrivingFrequency = step5.frequency ?? "off-grid";
  const hasDCDC = frequency === "occasional" || frequency === "daily";
  const journey = step2.journey;
  let journeyWh = 0;
  if (profile !== "fulltimer" && !hasDCDC && journey) {
    const jh = journeyHoursMap[journey];
    journeyWh = totalDailyWh * (jh / 24);
  }
  const requiredWh = totalDailyWh * daysAutonomy + journeyWh;
  const requiredAh = requiredWh / 12 / 0.9;

  // ----- Solar -----
  const size = step1.size ?? "L2";
  const roofArea = roofAreaMap[size];
  const obstacleEntries = Object.entries(step7.obstacles ?? {}) as Array<[RoofObstacleId, import("@/types").RoofObstacleEntry]>;
  let obstacleArea = 0;
  let rackMountingArea = 0; // added back when rack used as platform
  for (const [id, entry] of obstacleEntries) {
    if (!entry || !entry.count) continue;
    const def = obstacleDefaults[id];
    const lCm = entry.customSize && entry.lengthCm != null ? entry.lengthCm : def.l;
    const wCm = entry.customSize && entry.widthCm != null ? entry.widthCm : def.w;
    const m2 = (lCm * wCm) / 10000;
    const total = m2 * entry.count;
    if (id === "rack" && entry.panelsOnRack) {
      // rack is a mounting platform, not an obstacle
      rackMountingArea += total;
      continue;
    }
    if (id === "tent" && entry.solarAlongside === "yes-mc4") {
      // tent leaves space alongside — deduct only half its footprint
      obstacleArea += total * 0.5;
      continue;
    }
    obstacleArea += total;
  }
  const availableArea = Math.max(0, roofArea - obstacleArea - 0.4);
  const maxSolarW = (availableArea + rackMountingArea) * 200;
  const solarHours = solarHoursMatrix[climate][season];
  const requiredSolarW = totalDailyWh / Math.max(0.5, solarHours);
  const recommendedSolarW = Math.max(50, Math.min(requiredSolarW, maxSolarW));
  const panelType = step7.roofType === "pop-top" ? "flexible monocrystalline" : "rigid monocrystalline";
  const solarDailyWh = recommendedSolarW * solarHours;

  // ----- Alternator -----
  let alternatorDailyWh = 0;
  if (frequency === "occasional" || frequency === "daily") {
    const dh = step5.duration ? journeyHoursMap[step5.duration] : 1;
    alternatorDailyWh = dh * 360 * 0.85;
    if (frequency === "occasional") alternatorDailyWh /= 2.5;
  }

  // ----- Components -----
  const components: RecommendedComponent[] = [];

  // Battery
  let battery: RecommendedComponent;
  if (requiredAh < 100) battery = { key: "battery", category: "Battery", name: "1× 100Ah LiFePO4", why: "Sized for ~2 days off-grid autonomy.", detail: `Required ~${Math.round(requiredAh)}Ah — fits one 100Ah battery.`, price: 120 };
  else if (requiredAh < 200) battery = { key: "battery", category: "Battery", name: "1× 200Ah LiFePO4", why: "Single battery covers your daily needs with reserve.", detail: `Required ~${Math.round(requiredAh)}Ah usable.`, price: 220 };
  else if (requiredAh < 300) battery = { key: "battery", category: "Battery", name: "2× 150Ah LiFePO4", why: "Two batteries in parallel for higher capacity.", detail: `Required ~${Math.round(requiredAh)}Ah usable.`, price: 320 };
  else if (requiredAh < 400) battery = { key: "battery", category: "Battery", name: "2× 200Ah LiFePO4", why: "Large bank for full-time / heavy daily loads.", detail: `Required ~${Math.round(requiredAh)}Ah usable.`, price: 440 };
  else battery = { key: "battery", category: "Battery", name: "3× 200Ah LiFePO4", why: "Maximum bank for extended off-grid use.", detail: `Required ~${Math.round(requiredAh)}Ah usable.`, price: 660 };

  if (profile === "weekendWarrior" && requiredAh > 300) {
    battery.note = "💡 As a weekend warrior, you recharge at home between trips. If your system seems oversized, consider whether you really need worst-case winter sizing — or adjust your climate/season settings to match your typical travel conditions.";
  }
  components.push(battery);

  // Solar panel — €0.50 per watt
  components.push({
    key: "solar",
    category: "Solar panels",
    name: `${Math.round(recommendedSolarW)}W ${panelType}`,
    why: `Replaces your daily consumption with ~${solarHours}h of effective sun.`,
    detail: `Roof area available: ${roofArea.toFixed(1)}m². After obstacles & margin: ~${maxSolarW.toFixed(0)}W max. Required: ${Math.round(requiredSolarW)}W.`,
    price: Math.round(recommendedSolarW * 0.5),
  });

  // MPPT
  let mppt: RecommendedComponent;
  if (recommendedSolarW < 150) mppt = { key: "mppt", category: "Solar charger", name: "Victron MPPT 75/15", why: "Matches small solar arrays up to ~150W.", detail: "12V system, up to 15A solar input.", price: 65 };
  else if (recommendedSolarW < 250) mppt = { key: "mppt", category: "Solar charger", name: "Victron MPPT 100/20", why: "Right size for 150–250W panels.", detail: "Bluetooth, 20A output.", price: 95 };
  else if (recommendedSolarW < 500) mppt = { key: "mppt", category: "Solar charger", name: "Victron MPPT 100/30", why: "Handles 250–500W of solar comfortably.", detail: "30A output, smart networking.", price: 145 };
  else mppt = { key: "mppt", category: "Solar charger", name: "Victron MPPT 100/50", why: "For 500W+ arrays — maximum harvest.", detail: "50A output, smart networking.", price: 195 };
  components.push(mppt);

  // DC-DC charger
  if (frequency !== "shore-power" && frequency !== "off-grid") {
    components.push({
      key: "dcdc", category: "DC-DC charger",
      name: "Victron Orion-Tr Smart 12/12-30A Isolated",
      why: "Recharges your house battery from the alternator while driving.",
      detail: `Estimated ~${Math.round(alternatorDailyWh)}Wh/day from driving.`,
      price: 190,
    });
  }

  // Shore power charger
  const shore: ShorePowerAccess = step6.shorePower ?? "never";
  if (shore === "occasionally") {
    components.push({ key: "shore", category: "Shore charger", name: "Victron Blue Smart IP67 12/17A", why: "Tops up your bank when at a campsite.", detail: "Waterproof, compact.", price: 90 });
  } else if (shore === "regularly" || shore === "home") {
    components.push({ key: "shore", category: "Shore charger", name: "Victron Blue Smart IP67 12/25A", why: "Faster recharge for frequent shore-power use.", detail: "Waterproof, 25A.", price: 110 });
  }

  // Inverter
  const max230VInverter = lines
    .filter((l) => l.powerSource === "230v-inverter")
    .reduce((m, l) => Math.max(m, l.watts), 0);
  if (max230VInverter > 0) {
    if (max230VInverter < 1000) components.push({ key: "inverter", category: "Inverter", name: "1000W pure sine inverter", why: "Minimum recommended size — covers laptops, kettles, small appliances cleanly.", detail: `Largest 230V load: ${max230VInverter}W.`, price: 80 });
    else if (max230VInverter < 2500) components.push({ key: "inverter", category: "Inverter", name: "2000W pure sine inverter", why: "Handles high-draw 230V appliances.", detail: `Largest 230V load: ${max230VInverter}W.`, price: 150 });
    else components.push({ key: "inverter", category: "Inverter", name: "3000W pure sine inverter", why: "Very high 230V draw — heavy loads.", detail: `Largest 230V load: ${max230VInverter}W. Cable sizing critical.`, price: 250 });
  }

  // Materials
  const materials: MaterialItem[] = [
    { item: "Main fuse ANL/MIDI", price: 15 },
    { item: "Fuse box", price: 20 },
    { item: "Circuit fuses", price: 10 },
    { item: "SmartShunt 500A", price: 60 },
    { item: "Temperature sensor", price: 20 },
    { item: "Battery disconnect switch", price: 15 },
    { item: "Switch panel", price: 50 },
    { item: "12V sockets (×2)", price: 20 },
    { item: "USB sockets A+C (×2)", price: 25 },
    { item: "230V sockets (×3)", price: 30 },
    { item: "MC4 connectors", price: 10 },
    { item: "Anderson connectors", price: 15 },
    { item: "WAGO connectors", price: 10 },
    { item: "Main cable 35–70mm²", price: 40 },
    { item: "Solar cable 6mm²", price: 20 },
    { item: "Other wiring", price: 50 },
    { item: "Cable management", price: 15 },
    { item: "Mounting hardware", price: 20 },
  ];
  const materialsTotal = materials.reduce((s, m) => s + m.price, 0);
  const componentsTotal = components.reduce((s, c) => s + c.price, 0);
  const subtotal = componentsTotal + materialsTotal;
  const contingency = subtotal * 0.15;
  const totalBudget = subtotal + contingency;

  // ----- Warnings -----
  const warnings: string[] = [];
  if (step1.year === "2015-2019" || step1.year === "2020+") {
    if (frequency === "occasional" || frequency === "daily") {
      warnings.push("Modern Euro 6 vans typically have a smart alternator. A DC-DC charger with engine-running detection is essential — verify your model before buying.");
    }
  }
  if ((season === "winter" || season === "year-round") && climate === "cold") {
    warnings.push("LiFePO4 batteries cannot be charged below 0°C without a built-in heater. Choose a battery with low-temp protection or low-temp heating.");
  }
  if (recommendedSolarW < requiredSolarW * 0.9) {
    warnings.push(
      `Your climate and season combination (${climate} / ${season}) uses a conservative worst-case of ${solarHours} solar hours/day. Your solar panels (~${maxSolarW.toFixed(0)}W) will cover your needs on sunny days. For cloudy periods, plan for alternator top-ups or shore power. If you travel mainly in summer, reconsider your season selection for a more realistic estimate.`
    );
  }
  if (shoreLines.length > 0 && shore === "never") {
    warnings.push("You have shore-power-only appliances but no shore-power access. Consider removing them or planning campsite stops.");
  }
  if (max230VInverter > 2500) {
    warnings.push("Inverter loads above 2500W draw >200A from the battery. Use 70mm² cables and a Class T fuse.");
  }
  const budget: Budget = step12.budget ?? "show-me";
  const budgetMaxMap: Record<Budget, number> = {
    "<500": 500, "500-1000": 1000, "1000-2000": 2000, "2000-3000": 3000, "3000+": Infinity, "show-me": Infinity,
  };
  if (budget !== "show-me" && totalBudget > budgetMaxMap[budget]) {
    warnings.push(`Recommended system (~€${Math.round(totalBudget)}) exceeds your stated budget. Consider a smaller battery bank or reducing 230V appliances.`);
  }

  return {
    lines, shoreLines,
    applianceSubtotalWh, inverterLossWh, remoteWorkWh: rwWh, reserveWh, totalDailyWh, hasInverterLoad,
    daysAutonomy, journeyWh, requiredWh, requiredAh,
    roofArea, obstacleArea, maxSolarW, solarHours, requiredSolarW, recommendedSolarW, panelType, solarDailyWh,
    alternatorDailyWh, hasDCDC,
    components, materials, materialsTotal, componentsTotal, subtotal, contingency, totalBudget,
    warnings,
  };
}
