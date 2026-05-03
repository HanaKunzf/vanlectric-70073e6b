// Cross-step consistency checks. Soft warnings only — never block Next.
import type { ClimateZone, Season, WizardState } from "@/types";

export interface ConsistencyWarning {
  id: string;
  message: string;
}

export function climateSeasonWarning(
  climate: ClimateZone | undefined,
  season: Season | undefined,
): ConsistencyWarning | null {
  if (!climate || !season) return null;
  if (climate === "warm" && (season === "winter" || season === "year-round")) {
    return {
      id: "warm-winter",
      message:
        "You picked a warm climate with a winter / year-round season. Double-check — most warm regions stay above 5°C even in winter, and this combination raises heating estimates.",
    };
  }
  if (climate === "cold" && season === "summer") {
    return {
      id: "cold-summer",
      message:
        "Cold climate + summer-only is unusual. If you mostly travel in warmer months, consider 'temperate' climate for a more realistic solar estimate.",
    };
  }
  return null;
}

export function sanityWarnings(state: WizardState, totals: {
  totalDailyWh: number;
  usableBatteryWh: number;
  solarDailyWh: number;
  recommendedSolarW: number;
  requiredSolarW: number;
  totalBudget: number;
}): ConsistencyWarning[] {
  const out: ConsistencyWarning[] = [];
  const cs = climateSeasonWarning(state.step3.climate, state.step10.season);
  if (cs) out.push(cs);

  const profile = state.step2.profile;
  const shore = state.step6.shorePower;
  const season = state.step10.season;
  const insulation = state.step11.insulation;
  const frequency = state.step5.frequency;

  const autonomyDays =
    totals.totalDailyWh > 0 ? totals.usableBatteryWh / totals.totalDailyWh : Infinity;

  if (
    (profile === "fulltimer" || frequency === "off-grid") &&
    Number.isFinite(autonomyDays) &&
    autonomyDays < 2
  ) {
    out.push({
      id: "low-autonomy",
      message: `Less than 2 days of off-grid autonomy (~${autonomyDays.toFixed(
        1,
      )} days). For unplugged trips you usually want 2–3 days of buffer.`,
    });
  }
  if (
    (shore === "never" || shore === "rare") &&
    totals.solarDailyWh < totals.totalDailyWh * 0.6
  ) {
    out.push({
      id: "shore-low-solar",
      message:
        "You rarely use shore power, but your estimated solar harvest is well below your daily consumption. Plan for alternator charging or expect a deficit.",
    });
  }
  if (
    (season === "winter" || season === "year-round") &&
    insulation === "none" &&
    (frequency === "off-grid" || shore === "never")
  ) {
    out.push({
      id: "winter-no-insulation",
      message:
        "Winter / year-round use off-grid with little or no insulation will dramatically increase heating loads. Insulating first is the cheapest energy upgrade.",
    });
  }
  if (
    totals.recommendedSolarW < totals.requiredSolarW * 0.7 &&
    (season === "winter" || season === "year-round")
  ) {
    out.push({
      id: "winter-solar-undersized",
      message:
        "Your roof cannot fit the solar capacity needed for winter conditions. Plan for alternator or shore-power top-ups.",
    });
  }

  // Short drives + rarely shore + heavy AC loads → no realistic recharge path.
  const journey = state.step2.journey;
  const shortDrives = journey === "1h" || journey === "1-2h";
  const heavyAc = totals.totalDailyWh > 3000;
  if (
    shortDrives &&
    (shore === "never" || shore === "rare") &&
    heavyAc
  ) {
    out.push({
      id: "short-drives-heavy-loads",
      message:
        "You drive only short distances, rarely use shore power, but have high daily consumption. There is no realistic way to recharge the battery — plan for longer drives, more solar, or reduce loads.",
    });
  }

  // Weekend warriors with long off-grid frequency are a likely mismatch.
  if (
    profile === "weekendWarrior" &&
    frequency === "off-grid"
  ) {
    out.push({
      id: "weekend-long-offgrid",
      message:
        "You picked weekend trips but also \"off-grid only\" driving. Most weekenders drive to/from a spot, which gives some alternator charging — double-check this matches how you actually travel.",
    });
  }

  return out;
}
