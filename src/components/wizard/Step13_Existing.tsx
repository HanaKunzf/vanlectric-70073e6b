import { useNavigate, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import { StepCard } from "@/components/ui/StepCard";
import { HelperText } from "@/components/ui/WarningBanner";
import { FEATURES } from "@/config/features";
import { en } from "@/i18n/en";
import type { ExistingStep, BatteryChemistry, WizardState } from "@/types";

interface Props {
  value: ExistingStep;
  onChange: (next: ExistingStep) => void;
}

export const Step13_Existing = ({ value, onChange }: Props) => {
  const enabled = FEATURES.EXISTING_COMPONENTS;
  const navigate = useNavigate();
  const location = useLocation();
  const wizard = (location.state as { wizard?: WizardState })?.wizard;

  const skipToResults = () => {
    onChange({ ...value, skip: true });
    navigate("/results", { state: { wizard: { ...(wizard ?? {}), step13: { ...value, skip: true } } } });
  };

  return (
    <StepCard title="Do you already have any components?">
      <HelperText>Optional — skip if you're starting from scratch</HelperText>

      <div className="relative">
        <div className={enabled ? "" : "pointer-events-none select-none opacity-40 blur-[2px]"}>
          <ExistingForm value={value} onChange={onChange} />
        </div>

        {!enabled && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
            <div className="rounded-full bg-card border border-primary px-4 py-2 inline-flex items-center gap-2 shadow-sm">
              <Lock className="w-4 h-4 text-primary" />
              <span className="font-sans font-bold text-primary tracking-wide">{en.pro.badge}</span>
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold text-primary text-center">
              Analyse your existing system with PRO
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                onClick={() => alert(en.pro.locked)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors font-sans font-semibold text-sm min-h-[44px]"
              >
                Unlock PRO
              </button>
              <button
                type="button"
                onClick={skipToResults}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors font-sans font-semibold text-sm min-h-[44px]"
              >
                Skip — show full new system
              </button>
            </div>
          </div>
        )}
      </div>
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
