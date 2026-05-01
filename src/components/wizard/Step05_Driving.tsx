import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { HelperText } from "@/components/ui/WarningBanner";
import { DrivingIllustration } from "@/components/illustrations/Illustrations";
import type { DrivingDuration, DrivingFrequency, DrivingStep } from "@/types";

interface Props {
  value: DrivingStep;
  onChange: (next: DrivingStep) => void;
}

export const Step05_Driving = ({ value, onChange }: Props) => {
  const t = en.steps.s5;
  const showDuration = value.frequency === "occasional" || value.frequency === "daily";
  const freqs = Object.keys(t.frequencyOptions) as DrivingFrequency[];
  const durations = Object.keys(t.durationOptions) as DrivingDuration[];

  return (
    <StepCard title={t.title} illustration={<DrivingIllustration className="w-full h-full" />}>
      <HelperText>{t.helper}</HelperText>
      <div className="grid grid-cols-1 gap-3">
        {freqs.map((f) => (
          <SelectButton
            key={f}
            selected={value.frequency === f}
            onClick={() => onChange({ ...value, frequency: f })}
            size="md"
          >
            <div>
              <div className="font-display text-lg font-semibold">{t.frequencyOptions[f].label}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{t.frequencyOptions[f].desc}</div>
            </div>
          </SelectButton>
        ))}
      </div>

      {showDuration && (
        <div className="mt-8 pt-6 border-t border-border animate-fade-in">
          <h3 className="font-display text-xl sm:text-2xl font-semibold mb-2 tracking-tight">
            {t.durationTitle}
          </h3>
          <HelperText>{t.durationHelper}</HelperText>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {durations.map((d) => (
              <SelectButton
                key={d}
                selected={value.duration === d}
                onClick={() => onChange({ ...value, duration: d })}
                size="sm"
              >
                <span className="text-sm">{t.durationOptions[d]}</span>
              </SelectButton>
            ))}
          </div>
        </div>
      )}
    </StepCard>
  );
};

export const isStep5Valid = (v: DrivingStep) => {
  if (!v.frequency) return false;
  if (v.frequency === "occasional" || v.frequency === "daily") return Boolean(v.duration);
  return true;
};
