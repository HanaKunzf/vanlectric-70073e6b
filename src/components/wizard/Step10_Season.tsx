import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { HelperText } from "@/components/ui/WarningBanner";
import { SeasonIllustration } from "@/components/illustrations/Illustrations";
import { climateSeasonWarning } from "@/logic/consistency";
import type { ClimateZone, Season, SeasonStep } from "@/types";

interface Props {
  value: SeasonStep;
  onChange: (next: SeasonStep) => void;
  /** Climate from Step 3 — used for soft consistency warning. */
  climate?: ClimateZone;
}

export const Step10_Season = ({ value, onChange, climate }: Props) => {
  const t = en.steps.s10;
  const keys = Object.keys(t.options) as Season[];
  const warning = climateSeasonWarning(climate, value.season);
  return (
    <StepCard title={t.title} illustration={<SeasonIllustration className="w-full h-full" />}>
      <HelperText>{t.helper}</HelperText>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {keys.map((k) => (
          <SelectButton key={k} selected={value.season === k} onClick={() => onChange({ season: k })} size="md">
            <div>
              <div className="font-display text-lg font-semibold">{t.options[k].label}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{t.options[k].desc}</div>
            </div>
          </SelectButton>
        ))}
      </div>
      {warning && (
        <div
          role="status"
          className="mt-5 rounded-lg border-l-4 border-accent bg-accent/10 p-3 text-sm font-sans"
        >
          <span className="font-semibold">Heads up — </span>
          {warning.message}
        </div>
      )}
    </StepCard>
  );
};

export const isStep10Valid = (v: SeasonStep) => Boolean(v.season);
