import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { HelperText } from "@/components/ui/WarningBanner";
import { PeopleIllustration } from "@/components/illustrations/Illustrations";
import { BrandIcon, type IconKey } from "@/components/ui/BrandIcon";
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {counts.map((c) => (
          <SelectButton key={c} selected={value.people === c} onClick={() => onChange({ people: c })} size="md">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:gap-3">
              <BrandIcon name={t.options[c].icon as IconKey} size="md" tone="primary" />
              <div className="min-w-0">
                <div className="font-display text-base sm:text-lg font-semibold leading-tight">{t.options[c].label}</div>
                <div className="text-sm text-muted-foreground mt-0.5 leading-snug">{t.options[c].desc}</div>
              </div>
            </div>
          </SelectButton>
        ))}
      </div>
    </StepCard>
  );
};

export const isStep8Valid = (v: PeopleStep) => Boolean(v.people);
