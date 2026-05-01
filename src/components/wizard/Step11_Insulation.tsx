import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { HelperText, WarningBanner } from "@/components/ui/WarningBanner";
import { InsulationIllustration } from "@/components/illustrations/Illustrations";
import type { Insulation, InsulationStep } from "@/types";

interface Props {
  value: InsulationStep;
  onChange: (next: InsulationStep) => void;
}

export const Step11_Insulation = ({ value, onChange }: Props) => {
  const t = en.steps.s11;
  const keys = Object.keys(t.options) as Insulation[];
  return (
    <StepCard title={t.title} illustration={<InsulationIllustration className="w-full h-full" />}>
      <HelperText>{t.helper}</HelperText>
      <div className="grid grid-cols-1 gap-3">
        {keys.map((k) => (
          <SelectButton key={k} selected={value.insulation === k} onClick={() => onChange({ insulation: k })} size="md">
            <div>
              <div className="font-display text-lg font-semibold">{t.options[k].label}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{t.options[k].desc}</div>
            </div>
          </SelectButton>
        ))}
      </div>
      {value.insulation === "none" && (
        <div className="mt-5 animate-fade-in">
          <WarningBanner>{t.warning}</WarningBanner>
        </div>
      )}
    </StepCard>
  );
};

export const isStep11Valid = (v: InsulationStep) => Boolean(v.insulation);
