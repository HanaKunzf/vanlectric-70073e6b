import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { HelperText } from "@/components/ui/WarningBanner";
import { PeopleIllustration } from "@/components/illustrations/Illustrations";
import type { People, PeopleStep } from "@/types";

interface Props {
  value: PeopleStep;
  onChange: (next: PeopleStep) => void;
}

export const Step08_People = ({ value, onChange }: Props) => {
  const t = en.steps.s8;
  const counts: People[] = [1, 2, 3, 4];
  return (
    <StepCard title={t.title} illustration={<PeopleIllustration className="w-full h-full" />}>
      <HelperText>{t.helper}</HelperText>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {counts.map((c) => (
          <SelectButton key={c} selected={value.people === c} onClick={() => onChange({ people: c })} size="md">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none">{t.options[c].icon}</span>
              <div>
                <div className="font-display text-lg font-semibold">{t.options[c].label}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{t.options[c].desc}</div>
              </div>
            </div>
          </SelectButton>
        ))}
      </div>
    </StepCard>
  );
};

export const isStep8Valid = (v: PeopleStep) => Boolean(v.people);
