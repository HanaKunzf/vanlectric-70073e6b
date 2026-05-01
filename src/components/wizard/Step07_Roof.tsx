import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { WarningBanner } from "@/components/ui/WarningBanner";
import { RoofIllustration } from "@/components/illustrations/Illustrations";
import type { RoofObstacle, RoofStep, RoofType } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  value: RoofStep;
  onChange: (next: RoofStep) => void;
}

export const Step07_Roof = ({ value, onChange }: Props) => {
  const t = en.steps.s7;
  const obstacleKeys = Object.keys(t.obstacles) as RoofObstacle[];
  const roofKeys = Object.keys(t.roofTypeOptions) as RoofType[];

  const toggleObstacle = (k: RoofObstacle) => {
    if (k === "none") {
      onChange({ ...value, obstacles: ["none"] });
      return;
    }
    const without = value.obstacles.filter((o) => o !== "none");
    const next = without.includes(k) ? without.filter((o) => o !== k) : [...without, k];
    onChange({ ...value, obstacles: next });
  };

  return (
    <StepCard title={t.title} illustration={<RoofIllustration className="w-full h-full" />}>
      <h3 className="font-sans text-sm font-semibold tracking-wide text-muted-foreground mb-3">
        {t.obstaclesTitle}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
        {obstacleKeys.map((k) => {
          const selected = value.obstacles.includes(k);
          return (
            <button
              key={k}
              type="button"
              onClick={() => toggleObstacle(k)}
              aria-pressed={selected}
              className={cn(
                "rounded-lg border-2 p-3 text-center transition-colors min-h-[80px] flex flex-col items-center justify-center gap-1",
                selected
                  ? "border-primary bg-[hsl(var(--selected-bg))]"
                  : "border-border bg-card hover:border-primary/50",
              )}
            >
              <span className="text-xl" aria-hidden>{t.obstacles[k].icon}</span>
              <span className="text-xs font-sans font-medium">{t.obstacles[k].label}</span>
            </button>
          );
        })}
      </div>

      <h3 className="font-sans text-sm font-semibold tracking-wide text-muted-foreground mb-3">
        {t.roofTypeTitle}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {roofKeys.map((k) => (
          <SelectButton
            key={k}
            selected={value.roofType === k}
            onClick={() => onChange({ ...value, roofType: k })}
            size="sm"
          >
            <span className="text-sm">{t.roofTypeOptions[k]}</span>
          </SelectButton>
        ))}
      </div>

      {value.roofType === "pop-top" && (
        <div className="mt-6 animate-fade-in space-y-3">
          <WarningBanner>{t.warning}</WarningBanner>
          <div>
            <label className="block font-sans text-sm font-semibold mb-1">{t.popTopTitle}</label>
            <p className="text-xs text-muted-foreground mb-2">{t.popTopHelper}</p>
            <input
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={value.popTopHoursPerDay ?? 4}
              onChange={(e) => onChange({ ...value, popTopHoursPerDay: Number(e.target.value) })}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      )}
    </StepCard>
  );
};

export const isStep7Valid = (v: RoofStep) => Boolean(v.roofType);
