import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { UsageIllustration } from "@/components/illustrations/Illustrations";
import type { JourneyDuration, UsageProfile, UsageStep } from "@/types";

interface Props {
  value: UsageStep;
  onChange: (next: UsageStep) => void;
}

export const Step02_UsageProfile = ({ value, onChange }: Props) => {
  const t = en.steps.s2;
  const profiles = Object.keys(t.profileOptions) as UsageProfile[];
  const showJourney = value.profile === "weekendWarrior" || value.profile === "traveller";

  return (
    <StepCard title={t.title} illustration={<UsageIllustration className="w-full h-full" />}>
      <div className="grid grid-cols-1 gap-3">
        {profiles.map((p) => {
          const opt = t.profileOptions[p];
          return (
            <SelectButton
              key={p}
              selected={value.profile === p}
              onClick={() => onChange({ ...value, profile: p })}
              size="lg"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">{opt.icon}</span>
                <div>
                  <div className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
                    {opt.label}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">{opt.desc}</div>
                </div>
              </div>
            </SelectButton>
          );
        })}
      </div>

      {showJourney && (
        <div className="mt-8 pt-6 border-t border-border animate-fade-in">
          <h3 className="font-display text-xl sm:text-2xl font-semibold mb-2 tracking-tight">
            {t.journeyTitle}
          </h3>
          <div className="warning-banner mb-4 flex items-start gap-2">
            <span aria-hidden>💡</span>
            <span>{t.journeyHelper}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Object.keys(t.journeyOptions) as JourneyDuration[]).map((j) => {
              const opt = t.journeyOptions[j];
              return (
                <SelectButton
                  key={j}
                  selected={value.journey === j}
                  onClick={() => onChange({ ...value, journey: j })}
                  size="sm"
                >
                  <span className="text-sm">
                    <span className="mr-2">{opt.icon}</span>
                    {opt.label}
                  </span>
                </SelectButton>
              );
            })}
          </div>
        </div>
      )}
    </StepCard>
  );
};

export const isStep2Valid = (v: UsageStep): boolean => {
  if (!v.profile) return false;
  if (v.profile === "fulltimer") return true;
  return Boolean(v.journey);
};
