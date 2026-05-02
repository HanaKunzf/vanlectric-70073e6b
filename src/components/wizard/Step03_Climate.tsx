import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { HelperText } from "@/components/ui/WarningBanner";
import { ClimateIllustration } from "@/components/illustrations/Illustrations";
import type { ClimateStep, ClimateZone } from "@/types";

interface Props {
  value: ClimateStep;
  onChange: (next: ClimateStep) => void;
}

export const Step03_Climate = ({ value, onChange }: Props) => {
  const t = en.steps.s3;
  const keys = Object.keys(t.options) as ClimateZone[];
  return (
    <StepCard title={t.title} illustration={<ClimateIllustration className="w-full h-full" />}>
      <HelperText>{t.helper}</HelperText>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {keys.map((k) => (
          <SelectButton key={k} selected={value.climate === k} onClick={() => onChange({ climate: k })} size="md">
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

export const isStep3Valid = (v: ClimateStep) => Boolean(v.climate);
