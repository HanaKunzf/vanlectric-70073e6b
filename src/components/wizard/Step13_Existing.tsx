import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { StepCard } from "@/components/ui/StepCard";
import { ProModal } from "@/components/ui/ProModal";
import { FEATURES } from "@/config/features";
import { en } from "@/i18n/en";
import type { ExistingStep, BatteryChemistry, WizardState } from "@/types";

interface Props {
  value: ExistingStep;
  onChange: (next: ExistingStep) => void;
}

export const Step13_Existing = ({ value = {}, onChange }: Props) => {
  const enabled = FEATURES.EXISTING_COMPONENTS;
  const navigate = useNavigate();
  const location = useLocation();
  const [proOpen, setProOpen] = useState(false);
  const wizard = (location.state as { wizard?: WizardState })?.wizard;

  const showFreeResult = () => {
    onChange({ ...value, skip: true });
    navigate("/results", {
      state: { wizard: { ...(wizard ?? {}), step13: { ...value, skip: true } } },
    });
  };

  return (
    <StepCard title="Already have some components?">
      <p className="text-sm sm:text-base text-muted-foreground font-sans -mt-1 mb-5">
        Optional PRO feature — skip this and see your full result for free.
      </p>

      {/* Reassurance / free-result hero */}
      <div className="rounded-xl border-2 border-primary bg-primary/5 p-5 sm:p-6 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-primary">
              Your calculation is ready
            </h3>
            <p className="text-sm sm:text-base text-foreground/80 font-sans mt-1">
              You can view your full recommended system for free now. PRO will later let you
              enter components you already own and check how far they can take you.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={showFreeResult}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors font-sans font-semibold text-base min-h-[48px]"
        >
          Show my free result
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* PRO preview — clearly secondary */}
      <div className="rounded-lg border border-border bg-card/60 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/60 bg-card px-2 py-0.5 text-[10px] font-bold text-primary tracking-wider">
            <Lock className="w-3 h-3" /> {en.pro.badge}
          </span>
          <span className="text-xs sm:text-sm font-sans font-semibold text-muted-foreground uppercase tracking-wide">
            Optional — coming soon
          </span>
        </div>
        <h4 className="font-display text-lg sm:text-xl font-bold text-foreground">
          Analyse existing components — PRO coming soon
        </h4>
        <p className="text-sm text-muted-foreground font-sans mt-1 mb-4">
          Enter the battery, panels, charger or inverter you already have, and we'll tell you
          how far they can take you and what to add.
        </p>

        <div className="relative">
          <div className={enabled ? "" : "pointer-events-none select-none opacity-30 blur-[2px]"}>
            <ExistingForm value={value} onChange={onChange} />
          </div>
          {!enabled && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setProOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors font-sans font-semibold text-sm min-h-[40px]"
              >
                Notify me when PRO is ready
              </button>
            </div>
          )}
        </div>
      </div>

      <ProModal open={proOpen} onClose={() => setProOpen(false)} />
    </StepCard>
  );
};

const Row = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
  <div className="border-b border-border/60 py-4">
    <div className="font-display text-lg font-semibold mb-2">
      <span className="mr-2" aria-hidden>{icon}</span>{title}
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

const NumberInput = ({ value, onChange, label, min = 0, max }: { value?: number; onChange: (n: number) => void; label: string; min?: number; max?: number }) => (
  <label className="inline-flex items-center gap-2 text-sm font-sans">
    <span className="text-muted-foreground">{label}</span>
    <input
      type="number"
      min={min}
      max={max}
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-24 bg-background border border-border rounded px-2 py-1 text-right"
    />
  </label>
);

const ExistingForm = ({ value, onChange }: Props) => {
  const setBattery = (b: ExistingStep["battery"]) => onChange({ ...value, battery: b });
  const setSolar = (s: ExistingStep["solar"]) => onChange({ ...value, solar: s });
  return (
    <div>
      <Row title="Battery" icon="🔋">
        <label className="flex items-center gap-2 text-sm font-sans">
          <input type="radio" checked={!value.battery} onChange={() => setBattery(undefined)} /> I don't have one
        </label>
        <label className="flex items-center gap-2 text-sm font-sans">
          <input type="radio" checked={!!value.battery} onChange={() => setBattery({ qty: 1, ah: 100, chemistry: "lifepo4" })} /> I have:
        </label>
        {value.battery && (
          <div className="ml-6 flex flex-wrap items-center gap-3">
            <NumberInput label="Qty" min={1} max={4} value={value.battery.qty} onChange={(n) => setBattery({ ...value.battery!, qty: n })} />
            <NumberInput label="Ah" value={value.battery.ah} onChange={(n) => setBattery({ ...value.battery!, ah: n })} />
            <div className="flex items-center gap-3 text-sm font-sans">
              {(["lifepo4", "agm", "other"] as BatteryChemistry[]).map((c) => (
                <label key={c} className="inline-flex items-center gap-1">
                  <input type="radio" checked={value.battery!.chemistry === c} onChange={() => setBattery({ ...value.battery!, chemistry: c })} />
                  {c === "lifepo4" ? "LiFePO4" : c === "agm" ? "AGM" : "Other"}
                </label>
              ))}
            </div>
          </div>
        )}
      </Row>

      <Row title="Solar panels" icon="☀️">
        <label className="flex items-center gap-2 text-sm font-sans">
          <input type="radio" checked={!value.solar} onChange={() => setSolar(undefined)} /> I don't have any
        </label>
        <label className="flex items-center gap-2 text-sm font-sans">
          <input type="radio" checked={!!value.solar} onChange={() => setSolar({ qty: 1, watts: 100 })} /> I have:
        </label>
        {value.solar && (
          <div className="ml-6 flex flex-wrap items-center gap-3">
            <NumberInput label="Qty" min={1} max={4} value={value.solar.qty} onChange={(n) => setSolar({ ...value.solar!, qty: n })} />
            <NumberInput label="W" value={value.solar.watts} onChange={(n) => setSolar({ ...value.solar!, watts: n })} />
          </div>
        )}
      </Row>

      <Row title="MPPT controller" icon="📟">
        <label className="flex items-center gap-2 text-sm font-sans">
          <input type="radio" checked={!value.mppt} onChange={() => onChange({ ...value, mppt: undefined })} /> None
        </label>
        <label className="flex items-center gap-2 text-sm font-sans">
          <input type="radio" checked={!!value.mppt} onChange={() => onChange({ ...value, mppt: { amps: 30 } })} /> I have one:
        </label>
        {value.mppt && (
          <div className="ml-6">
            <NumberInput label="Max amps" value={value.mppt.amps} onChange={(n) => onChange({ ...value, mppt: { amps: n } })} />
          </div>
        )}
      </Row>

      <Row title="DC-DC charger" icon="🚗">
        <label className="flex items-center gap-2 text-sm font-sans">
          <input type="radio" checked={!value.dcdc} onChange={() => onChange({ ...value, dcdc: false })} /> None
        </label>
        <label className="flex items-center gap-2 text-sm font-sans">
          <input type="radio" checked={!!value.dcdc} onChange={() => onChange({ ...value, dcdc: true })} /> I have one
        </label>
      </Row>

      <Row title="Shore power charger" icon="🔌">
        <label className="flex items-center gap-2 text-sm font-sans">
          <input type="radio" checked={!value.shore} onChange={() => onChange({ ...value, shore: undefined })} /> None
        </label>
        <label className="flex items-center gap-2 text-sm font-sans">
          <input type="radio" checked={!!value.shore} onChange={() => onChange({ ...value, shore: { amps: 20 } })} /> I have one:
        </label>
        {value.shore && (
          <div className="ml-6">
            <NumberInput label="Amps" value={value.shore.amps} onChange={(n) => onChange({ ...value, shore: { amps: n } })} />
          </div>
        )}
      </Row>

      <Row title="Inverter" icon="⚡">
        <label className="flex items-center gap-2 text-sm font-sans">
          <input type="radio" checked={!value.inverter} onChange={() => onChange({ ...value, inverter: undefined })} /> None
        </label>
        <label className="flex items-center gap-2 text-sm font-sans">
          <input type="radio" checked={!!value.inverter} onChange={() => onChange({ ...value, inverter: { watts: 1000 } })} /> I have one:
        </label>
        {value.inverter && (
          <div className="ml-6">
            <NumberInput label="W" value={value.inverter.watts} onChange={(n) => onChange({ ...value, inverter: { watts: n } })} />
          </div>
        )}
      </Row>
    </div>
  );
};

export const isStep13Valid = (_v: ExistingStep) => true;
