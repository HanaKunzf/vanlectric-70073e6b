import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { HelperText } from "@/components/ui/WarningBanner";
import { ShoreIllustration } from "@/components/illustrations/Illustrations";
import type { ShorePowerAccess, ShoreStep } from "@/types";

interface Props {
  value: ShoreStep;
  onChange: (next: ShoreStep) => void;
}

export const Step06_Shore = ({ value, onChange }: Props) => {
  const t = en.steps.s6;
  const keys = Object.keys(t.options) as ShorePowerAccess[];
  return (
    <StepCard title={t.title} illustration={<ShoreIllustration className="w-full h-full" />}>
      <HelperText>{t.helper}</HelperText>
      <div className="grid grid-cols-1 gap-3">
        {keys.map((k) => (
          <SelectButton key={k} selected={value.shorePower === k} onClick={() => onChange({ shorePower: k })} size="md">
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

export const isStep6Valid = (v: ShoreStep) => Boolean(v.shorePower);
