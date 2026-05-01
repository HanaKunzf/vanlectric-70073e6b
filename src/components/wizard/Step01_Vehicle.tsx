import { en } from "@/i18n/en";
import { SelectButton } from "@/components/ui/SelectButton";
import { VanIllustration } from "@/components/illustrations/Illustrations";
import { StepCard } from "@/components/ui/StepCard";
import type {
  VehicleBrand,
  VehicleEngine,
  VehicleSize,
  VehicleStep,
  VehicleYear,
} from "@/types";

interface Props {
  value: VehicleStep;
  onChange: (next: VehicleStep) => void;
}

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-6 last:mb-0">
    <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase mb-3">
      {label}
    </h3>
    {children}
  </div>
);

export const Step01_Vehicle = ({ value, onChange }: Props) => {
  const t = en.steps.s1;
  const set = <K extends keyof VehicleStep>(key: K, v: VehicleStep[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <StepCard title={t.title} illustration={<VanIllustration className="w-full h-full" />}>
      <Section label={t.brand}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(Object.keys(t.brandOptions) as VehicleBrand[]).map((brand) => (
            <SelectButton
              key={brand}
              selected={value.brand === brand}
              onClick={() => set("brand", brand)}
              size="sm"
            >
              <span className="text-sm sm:text-base">🚐 {t.brandOptions[brand]}</span>
            </SelectButton>
          ))}
        </div>
        {value.brand === "other" && (
          <input
            type="text"
            placeholder={t.brandOtherPlaceholder}
            value={value.brandOther ?? ""}
            onChange={(e) => set("brandOther", e.target.value)}
            className="mt-3 w-full bg-muted border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        )}
      </Section>

      <Section label={t.size}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(Object.keys(t.sizeOptions) as VehicleSize[]).map((s) => (
            <SelectButton
              key={s}
              selected={value.size === s}
              onClick={() => set("size", s)}
              size="sm"
            >
              <span className="text-sm">{t.sizeOptions[s]}</span>
            </SelectButton>
          ))}
        </div>
      </Section>

      <Section label={t.year}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(Object.keys(t.yearOptions) as VehicleYear[]).map((y) => (
            <SelectButton
              key={y}
              selected={value.year === y}
              onClick={() => set("year", y)}
              size="sm"
            >
              <span className="text-sm">{t.yearOptions[y]}</span>
            </SelectButton>
          ))}
        </div>
      </Section>

      <Section label={t.engine}>
        <div className="grid grid-cols-1 gap-2.5">
          {(Object.keys(t.engineOptions) as VehicleEngine[]).map((e) => (
            <SelectButton
              key={e}
              selected={value.engine === e}
              onClick={() => set("engine", e)}
              size="sm"
            >
              <span className="text-sm">{t.engineOptions[e]}</span>
            </SelectButton>
          ))}
        </div>
      </Section>
    </StepCard>
  );
};

export const isStep1Valid = (v: VehicleStep): boolean =>
  Boolean(v.brand && v.size && v.year && v.engine && (v.brand !== "other" || v.brandOther));
