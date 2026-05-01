import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { HelperText } from "@/components/ui/WarningBanner";
import { BudgetIllustration } from "@/components/illustrations/Illustrations";
import type { Budget, BudgetStep } from "@/types";

interface Props {
  value: BudgetStep;
  onChange: (next: BudgetStep) => void;
}

export const Step12_Budget = ({ value, onChange }: Props) => {
  const t = en.steps.s12;
  const keys = Object.keys(t.options) as Budget[];
  return (
    <StepCard title={t.title} illustration={<BudgetIllustration className="w-full h-full" />}>
      <HelperText>{t.helper}</HelperText>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {keys.map((k) => (
          <SelectButton key={k} selected={value.budget === k} onClick={() => onChange({ budget: k })} size="md">
            <div>
              <div className="font-display text-lg font-semibold">{t.options[k].label}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{t.options[k].desc}</div>
            </div>
          </SelectButton>
        ))}
      </div>
    </StepCard>
  );
};

export const isStep12Valid = (v: BudgetStep) => Boolean(v.budget);
