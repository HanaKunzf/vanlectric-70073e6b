import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { StepCard } from "@/components/ui/StepCard";
import { WarningBanner } from "@/components/ui/WarningBanner";
import { RoofIllustration } from "@/components/illustrations/Illustrations";
import type { RoofObstacleEntry, RoofObstacleId, RoofStep, RoofType, ObstacleCount } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  value: RoofStep;
  onChange: (next: RoofStep) => void;
}

const OBSTACLE_MAX: Record<RoofObstacleId, 1 | 2 | 3> = {
  "small-window": 3,
  "large-window": 2,
  "fan": 2,
  "gps-antenna": 2,
  "satellite": 1,
  "solar-shower": 1,
  "rack": 1,
  "ac": 1,
  "tent": 1,
  "other": 3,
};

export const Step07_Roof = ({ value, onChange }: Props) => {
  const t = en.steps.s7;
  const obstacleKeys = Object.keys(t.obstacles) as RoofObstacleId[];
  const roofKeys = Object.keys(t.roofTypeOptions) as RoofType[];

  const getEntry = (id: RoofObstacleId): RoofObstacleEntry =>
    value.obstacles[id] ?? { count: 0 };

  const updateEntry = (id: RoofObstacleId, patch: Partial<RoofObstacleEntry>) => {
    const current = getEntry(id);
    const next = { ...current, ...patch };
    onChange({
      ...value,
      obstacles: { ...value.obstacles, [id]: next },
    });
  };

  const setAllEmpty = () => {
    onChange({ ...value, obstacles: {} });
  };

  const allZero = obstacleKeys.every((k) => (value.obstacles[k]?.count ?? 0) === 0);

  return (
    <StepCard title={t.title} illustration={<RoofIllustration className="w-full h-full" />}>
      <h3 className="font-sans text-sm font-semibold tracking-wide text-muted-foreground mb-2">
        {t.obstaclesTitle}
      </h3>
      <p className="text-xs text-muted-foreground mb-4">{t.obstaclesHelper}</p>

      <button
        type="button"
        onClick={setAllEmpty}
        aria-pressed={allZero}
        className={cn(
          "w-full mb-5 rounded-lg border-2 px-4 py-3 text-sm font-sans font-medium transition-colors",
          allZero
            ? "border-primary bg-[hsl(var(--selected-bg))]"
            : "border-border bg-card hover:border-primary/50",
        )}
      >
        {t.emptyButton}
      </button>

      <div className="space-y-3 mb-8">
        {obstacleKeys.map((id) => {
          const meta = t.obstacles[id];
          const entry = getEntry(id);
          const expanded = entry.count > 0;
          return (
            <div key={id} className="rounded-lg border border-border bg-card">
              <div className="flex items-center gap-3 p-3">
                <span className="text-xl" aria-hidden>{meta.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-sans font-semibold">{meta.label}</div>
                  <div className="text-xs text-muted-foreground">{meta.defaultText}</div>
                </div>
                <div className="flex gap-1" role="group" aria-label={t.countLabel}>
                  {Array.from({ length: OBSTACLE_MAX[id] + 1 }, (_, c) => c as ObstacleCount).map((c) => {
                    const selected = entry.count === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateEntry(id, { count: c })}
                        aria-pressed={selected}
                        className={cn(
                          "min-w-[36px] h-9 px-2 rounded-md border-2 text-xs font-sans font-semibold transition-colors",
                          selected
                            ? "border-primary bg-[hsl(var(--selected-bg))] text-primary"
                            : "border-border bg-background hover:border-primary/50",
                        )}
                      >
                        {t.countOptions[c]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {expanded && (
                <div className="border-t border-border px-3 py-3 space-y-3 animate-fade-in">
                  {id === "other" && (
                    <div>
                      <label className="block text-xs font-sans font-medium mb-1">{t.otherNameLabel}</label>
                      <input
                        type="text"
                        value={entry.name ?? ""}
                        onChange={(e) => updateEntry(id, { name: e.target.value })}
                        placeholder={t.otherNamePlaceholder}
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  )}

                  {id !== "gps-antenna" && id !== "other" && (
                    <label className="flex items-center gap-2 text-xs font-sans cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!entry.customSize}
                        onChange={(e) => updateEntry(id, { customSize: e.target.checked })}
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                      <span>{t.knowDimensions}</span>
                    </label>
                  )}

                  {(entry.customSize || id === "other") && id !== "gps-antenna" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-sans text-muted-foreground mb-1">{t.lengthLabel}</label>
                        <input
                          type="number"
                          min={0}
                          value={entry.lengthCm ?? ""}
                          onChange={(e) => updateEntry(id, { lengthCm: e.target.value === "" ? undefined : Number(e.target.value) })}
                          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-muted-foreground mb-1">{t.widthLabel}</label>
                        <input
                          type="number"
                          min={0}
                          value={entry.widthCm ?? ""}
                          onChange={(e) => updateEntry(id, { widthCm: e.target.value === "" ? undefined : Number(e.target.value) })}
                          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  )}

                  {id === "rack" && (
                    <>
                      <label className="flex items-start gap-2 text-xs font-sans cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!entry.panelsOnRack}
                          onChange={(e) => updateEntry(id, { panelsOnRack: e.target.checked })}
                          className="h-4 w-4 mt-0.5 rounded border-border accent-primary"
                        />
                        <span>
                          <span className="font-medium">{t.rackPanelsLabel}</span>
                          <span className="block text-muted-foreground">{t.rackPanelsHint}</span>
                        </span>
                      </label>
                      {entry.panelsOnRack && (
                        <WarningBanner>{t.rackHeightWarning}</WarningBanner>
                      )}
                    </>
                  )}

                  {id === "tent" && (
                    <div>
                      <div className="text-xs font-sans font-medium mb-2">{t.tentSolarTitle}</div>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-sans cursor-pointer">
                          <input
                            type="radio"
                            name="tent-solar"
                            checked={entry.solarAlongside === "yes-mc4"}
                            onChange={() => updateEntry(id, { solarAlongside: "yes-mc4" })}
                            className="accent-primary"
                          />
                          <span>{t.tentSolarYes}</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-sans cursor-pointer">
                          <input
                            type="radio"
                            name="tent-solar"
                            checked={entry.solarAlongside === "no"}
                            onChange={() => updateEntry(id, { solarAlongside: "no" })}
                            className="accent-primary"
                          />
                          <span>{t.tentSolarNo}</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(value.obstacles.tent?.count ?? 0) > 0 && (value.obstacles.fan?.count ?? 0) > 0 && (
        <div className="mb-3 rounded-lg border-l-4 border-accent bg-accent/10 p-3 text-xs font-sans leading-relaxed">
          {t.tentCoversFanWarning}
        </div>
      )}

      {(value.obstacles.ac?.count ?? 0) > 0 && (value.obstacles.fan?.count ?? 0) > 0 && (
        <div className="mb-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs font-sans leading-relaxed">
          {t.acFanInfo}
        </div>
      )}

      <div className="mb-8 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs font-sans text-foreground/90 leading-relaxed">
        {t.measurementInfo}
      </div>

      <h3 className="font-sans text-sm font-semibold tracking-wide text-muted-foreground mb-3">
        {t.roofTypeTitle}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
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

export const isStep7Valid = (v: RoofStep) => {
  if (!v.roofType) return false;
  // If "other" obstacle has count > 0, require dimensions
  const other = v.obstacles.other;
  if (other && other.count > 0) {
    if (!other.lengthCm || !other.widthCm) return false;
  }
  // Tent must have solarAlongside choice if used
  const tent = v.obstacles.tent;
  if (tent && tent.count > 0 && !tent.solarAlongside) return false;
  return true;
};
