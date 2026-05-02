import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { HelperText } from "@/components/ui/WarningBanner";
import { RemoteWorkIllustration } from "@/components/illustrations/Illustrations";
import type { RemoteWork, RemoteWorkStep } from "@/types";

interface Props {
  value: RemoteWorkStep;
  onChange: (next: RemoteWorkStep) => void;
}

export const Step09_RemoteWork = ({ value, onChange }: Props) => {
  const t = en.steps.s9;
  const keys = Object.keys(t.options) as RemoteWork[];
  return (
    <StepCard title={t.title} illustration={<RemoteWorkIllustration className="w-full h-full" />}>
      <HelperText>{t.helper}</HelperText>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {keys.map((k) => (
          <SelectButton key={k} selected={value.remoteWork === k} onClick={() => onChange({ remoteWork: k })} size="md">
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

export const isStep9Valid = (v: RemoteWorkStep) => Boolean(v.remoteWork);
