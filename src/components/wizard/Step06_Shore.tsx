import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { HelperText } from "@/components/ui/WarningBanner";
import { ShoreIllustration } from "@/components/illustrations/Illustrations";
import type { ShoreChargingPreference, ShorePowerAccess, ShoreStep } from "@/types";

interface Props {
  value: ShoreStep;
  onChange: (next: ShoreStep) => void;
}

export const Step06_Shore = ({ value, onChange }: Props) => {
  const t = en.steps.s6;
  const keys = Object.keys(t.options) as ShorePowerAccess[];
  const chargingKeys = Object.keys(t.chargingOptions) as Exclude<ShoreChargingPreference, "none">[];
  const showCharging = value.shorePower && value.shorePower !== "never";

  const setShore = (k: ShorePowerAccess) => {
    if (k === "never") {
      onChange({ shorePower: k, shoreCharging: "none" });
    } else {
      onChange({
        shorePower: k,
        // Preserve previous selection, otherwise leave undefined to force a choice.
        shoreCharging:
          value.shoreCharging && value.shoreCharging !== "none" ? value.shoreCharging : undefined,
      });
    }
  };

  return (
    <StepCard title={t.title} illustration={<ShoreIllustration className="w-full h-full" />}>
      <HelperText>{t.helper}</HelperText>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {keys.map((k) => (
          <SelectButton key={k} selected={value.shorePower === k} onClick={() => setShore(k)} size="md">
            <div>
              <div className="font-display text-lg font-semibold">{t.options[k].label}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{t.options[k].desc}</div>
            </div>
          </SelectButton>
        ))}
      </div>

      {showCharging && (
        <div className="mt-8 pt-6 border-t border-border animate-fade-in">
          <h3 className="font-display text-xl font-semibold mb-1">{t.chargingTitle}</h3>
          <HelperText>{t.chargingHelper}</HelperText>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {chargingKeys.map((k) => (
              <SelectButton
                key={k}
                selected={value.shoreCharging === k}
                onClick={() => onChange({ ...value, shoreCharging: k })}
                size="md"
              >
                <div>
                  <div className="font-display text-base font-semibold">{t.chargingOptions[k].label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{t.chargingOptions[k].desc}</div>
                </div>
              </SelectButton>
            ))}
          </div>
        </div>
      )}
    </StepCard>
  );
};

export const isStep6Valid = (v: ShoreStep) => {
  if (!v.shorePower) return false;
  if (v.shorePower === "never") return true;
  return !!v.shoreCharging && v.shoreCharging !== "none";
};
