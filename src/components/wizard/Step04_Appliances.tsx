import { useRef, useState } from "react";
import { ChevronDown, ChevronRight, Settings2 } from "lucide-react";
import { en } from "@/i18n/en";
import { StepCard } from "@/components/ui/StepCard";
import { HelperText } from "@/components/ui/WarningBanner";
import { AppliancesIllustration } from "@/components/illustrations/Illustrations";
import { BrandIcon, type IconKey } from "@/components/ui/BrandIcon";
import { NumberField } from "@/components/ui/NumberField";
import { ErrorSummary } from "@/components/ui/ErrorSummary";
import {
  APPLIANCE_CATALOG,
  type AppliancesStep,
  type ApplianceEntry,
  type PowerSource,
} from "@/types";
import {
  categoryForApplianceId,
  validateHoursPerDay,
  validateWatts,
  WATT_CAPS,
  type ValidationIssue,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

interface Props {
  value: AppliancesStep;
  onChange: (next: AppliancesStep) => void;
  /** Vehicle engine type from Step 1 — used for cross-step contextual warnings (e.g. petrol + diesel heater). */
  vehicleEngine?: "petrol" | "diesel-old" | "diesel-euro6" | "unknown";
}

const PowerSourceBadge = ({ source, gas }: { source: PowerSource; gas?: boolean }) => {
  if (gas) {
    return (
      <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
        Gas
      </span>
    );
  }
  const map: Record<PowerSource, { label: string; cls: string }> = {
    "12v": {
      label: "12V",
      cls: "bg-[hsl(var(--primary)/0.12)] text-primary border-[hsl(var(--primary)/0.3)]",
    },
    "230v-inverter": {
      label: "230V inverter",
      cls: "bg-[#FEF3C7] text-[#92400E] border-[#8B6914]/40",
    },
    "230v-shore": {
      label: "Shore only",
      cls: "bg-[#FEE2E2] text-[#991B1B] border-[#991B1B]/30",
    },
  };
  const { label, cls } = map[source];
  return (
    <span className={cn("text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap", cls)}>
      {label}
    </span>
  );
};

export const Step04_Appliances = ({ value, onChange, vehicleEngine }: Props) => {
  const t = en.steps.s4;
  const [openCat, setOpenCat] = useState<string>(APPLIANCE_CATALOG[0].id);
  const [overrideOpen, setOverrideOpen] = useState<Record<string, boolean>>({});
  const headerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const toggleCat = (catId: string) => {
    const willOpen = openCat !== catId;
    setOpenCat(willOpen ? catId : "");
    if (willOpen) {
      requestAnimationFrame(() => {
        const el = headerRefs.current[catId];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const target = window.scrollY + rect.top - 80;
        window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
      });
    }
  };

  const updateEntry = (id: string, patch: Partial<ApplianceEntry>, shorePowerOnly?: boolean) => {
    const current = value.appliances[id] ?? { enabled: false };
    const next: ApplianceEntry = { ...current, ...patch };
    if (shorePowerOnly) next.shorePowerOnly = true;
    onChange({
      ...value,
      appliances: { ...value.appliances, [id]: next },
    });
  };

  const issues = validateStep4(value);

  return (
    <StepCard title={t.title} illustration={<AppliancesIllustration className="w-full h-full" />}>
      <HelperText>{t.helper}</HelperText>

      <div className="space-y-3">
        {APPLIANCE_CATALOG.map((cat) => {
          const isOpen = openCat === cat.id;
          const enabledCount = cat.items.filter((i) => value.appliances[i.id]?.enabled).length;
          return (
            <div key={cat.id} className="rounded-lg border border-border bg-background/40 overflow-hidden scroll-mt-24">
              <button
                ref={(el) => { headerRefs.current[cat.id] = el; }}
                type="button"
                onClick={() => toggleCat(cat.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors min-h-[44px]"
              >
                <BrandIcon name={cat.icon as IconKey} size="md" tone="primary" />
                <span className="flex-1 font-display text-lg font-semibold">{cat.label}</span>
                {enabledCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-sans font-semibold">
                    {enabledCount}
                  </span>
                )}
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 grid grid-cols-1 lg:grid-cols-2 gap-2 animate-fade-in">
                  {cat.items.map((item) => {
                    const entry = value.appliances[item.id];
                    const enabled = entry?.enabled ?? false;
                    const hours = entry?.hours ?? item.defaultHours;
                    const watts = entry?.watts ?? item.watts;
                    const isOverride = overrideOpen[item.id] ?? false;
                    const cat = categoryForApplianceId(item.id);
                    const hoursError = enabled && !item.informational ? validateHoursPerDay(hours) : null;
                    const wattsError = enabled && !item.informational && isOverride ? validateWatts(watts, cat) : null;
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "rounded-lg border p-3 transition-colors",
                          enabled ? "border-primary bg-[hsl(var(--selected-bg))]" : "border-border bg-card",
                        )}
                      >
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => updateEntry(item.id, { enabled: e.target.checked }, item.shorePowerOnly)}
                            className="mt-1 w-4 h-4 accent-primary"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-sans font-medium">{item.label}</span>
                              <PowerSourceBadge source={item.powerSource} gas={item.id === "gas-stove"} />
                            </div>
                            {item.hint && (
                              <div className="text-xs text-muted-foreground mt-0.5">{item.hint}</div>
                            )}
                          </div>
                        </label>

                        {enabled && !item.informational && (
                          <div className="mt-3 ml-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <NumberField
                              id={`appl-hours-${item.id}`}
                              label={t.hoursLabel}
                              value={hours}
                              min={0}
                              max={24}
                              step={0.1}
                              suffix={t.hoursLabel}
                              error={hoursError}
                              onChange={(v) => updateEntry(item.id, { hours: v ?? 0 })}
                            />
                            <div>
                              <button
                                type="button"
                                onClick={() =>
                                  setOverrideOpen((o) => ({ ...o, [item.id]: !isOverride }))
                                }
                                className="flex items-center gap-1.5 text-xs font-sans font-semibold text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Settings2 className="w-3 h-3" />
                                {t.overrideLabel}
                              </button>
                              {isOverride ? (
                                <NumberField
                                  id={`appl-watts-${item.id}`}
                                  label={`Custom wattage (max ${WATT_CAPS[cat]} W)`}
                                  hideLabel
                                  value={watts}
                                  min={0}
                                  max={WATT_CAPS[cat]}
                                  step={1}
                                  suffix="W"
                                  error={wattsError}
                                  onChange={(v) =>
                                    updateEntry(item.id, {
                                      watts: v ?? 0,
                                      wattsOverride: true,
                                    })
                                  }
                                  className="mt-1"
                                />
                              ) : (
                                <div className="mt-1 text-sm text-muted-foreground font-sans">
                                  {watts} {t.wattsLabel} (default)
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {enabled && item.powerSource === "230v-shore" && (
                          <div className="mt-3 ml-7 warning-banner flex items-start gap-2 text-sm">
                            <BrandIcon name="warning" size="xs" />
                            <span>
                              Shore power only. Excluded from off-grid battery sizing.
                            </span>
                          </div>
                        )}

                        {enabled && item.powerSource === "230v-inverter" && (
                          <div className="mt-3 ml-7 space-y-2">
                            {!entry?.shoreOnly && (
                              <div className="text-xs text-muted-foreground italic">
                                Via inverter — ~90% efficiency, losses applied to battery draw
                              </div>
                            )}
                            <label className="flex items-start gap-2 cursor-pointer text-sm">
                              <input
                                type="checkbox"
                                checked={entry?.shoreOnly ?? false}
                                onChange={(e) =>
                                  updateEntry(item.id, { shoreOnly: e.target.checked })
                                }
                                className="mt-0.5 w-4 h-4 accent-primary"
                              />
                              <span className="text-muted-foreground">
                                Shore power only — exclude from battery & inverter sizing
                              </span>
                            </label>
                            {entry?.shoreOnly && (
                              <div className="warning-banner flex items-start gap-2 text-sm">
                                <BrandIcon name="warning" size="xs" />
                                <span>Excluded from off-grid battery sizing.</span>
                              </div>
                            )}
                          </div>
                        )}

                        {enabled && item.id === "diesel-heater" && vehicleEngine === "petrol" && (
                          <div className="mt-3 ml-7 warning-banner flex items-start gap-2 text-sm">
                            <BrandIcon name="warning" size="xs" />
                            <span>
                              Your van appears to have a petrol engine. A diesel heater normally
                              cannot draw fuel from the vehicle tank. You will likely need a
                              separate diesel tank for the heater.
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ErrorSummary issues={issues} />
    </StepCard>
  );
};

export const validateStep4 = (v: AppliancesStep): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  let anyEnabled = false;
  for (const cat of APPLIANCE_CATALOG) {
    for (const item of cat.items) {
      const entry = v.appliances[item.id];
      if (!entry?.enabled) continue;
      anyEnabled = true;
      if (item.informational) continue;
      const cat = categoryForApplianceId(item.id);
      const hours = entry.hours ?? item.defaultHours;
      const hErr = validateHoursPerDay(hours);
      if (hErr) {
        issues.push({
          fieldId: `appl-hours-${item.id}`,
          label: `${item.label} — hours/day`,
          message: hErr,
        });
      }
      if (entry.wattsOverride) {
        const wErr = validateWatts(entry.watts, cat);
        if (wErr) {
          issues.push({
            fieldId: `appl-watts-${item.id}`,
            label: `${item.label} — wattage`,
            message: wErr,
          });
        }
      }
    }
  }
  if (!anyEnabled) {
    issues.push({
      fieldId: "appl-none",
      label: "Appliances",
      message: "Select at least one appliance.",
    });
  }
  return issues;
};

export const isStep4Valid = (v: AppliancesStep) => validateStep4(v).length === 0;
