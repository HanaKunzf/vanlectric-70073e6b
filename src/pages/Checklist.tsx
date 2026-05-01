import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, ArrowRight } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";

const sections = [
  {
    title: "Appliances and loads",
    items: [
      "List every appliance with its power (W) and daily use (h)",
      "Mark each as 12V, 230V via inverter, or 230V shore-only",
      "Identify any high-power loads (kettle, induction, hairdryer)",
    ],
  },
  {
    title: "Battery system",
    items: [
      "Total daily Wh × autonomy days = required usable Wh",
      "Choose chemistry (LiFePO4 strongly recommended)",
      "Plan battery location with ventilation and secure mounting",
      "Battery main fuse sized to battery & cable rating",
      "Battery disconnect switch on positive line",
    ],
  },
  {
    title: "Solar charging",
    items: [
      "Panel wattage matches daily Wh × climate factor",
      "MPPT controller (not PWM) sized to panel array",
      "Cable from panels to MPPT in correct gauge",
      "Fuse between MPPT and battery",
      "Roof penetrations sealed and watertight",
    ],
  },
  {
    title: "DC/DC charging",
    items: [
      "DC-DC charger sized to alternator capacity (typ. 30–50A)",
      "Fused on input (starter battery side) and output",
      "Correct cable gauge for full charger current",
      "Ignition / D+ trigger wired correctly",
    ],
  },
  {
    title: "Shore power",
    items: [
      "CEE 16A inlet mounted to van body",
      "RCD/MCB protection on AC distribution",
      "Shore charger sized to battery bank",
      "AC sockets clearly labelled",
    ],
  },
  {
    title: "Inverter",
    items: [
      "Sized to peak 230V load (battery-powered only)",
      "Pure-sine wave for sensitive electronics",
      "Inverter feed fused close to the battery",
      "Adequate ventilation around the inverter",
    ],
  },
  {
    title: "Fuses and protection",
    items: [
      "Main battery fuse (MEGA/Class T)",
      "Fuse for inverter feed",
      "Fuse for MPPT to battery",
      "Fuse for DC-DC charger input and output",
      "12V fuse box for downstream circuits",
    ],
  },
  {
    title: "Cables and distribution",
    items: [
      "Positive and negative busbars",
      "Cable gauges sized to current and length",
      "Crimped lugs (not soldered) on high-current terminations",
      "Cables protected against chafing where they pass through metal",
    ],
  },
  {
    title: "Monitoring",
    items: [
      "Battery monitor / smart shunt installed on negative",
      "Voltage and current visible from the living area",
      "Optional GX device for full system overview",
    ],
  },
  {
    title: "Safety checks",
    items: [
      "All connections torqued to spec",
      "Polarity double-checked before first power-up",
      "Smoke and CO alarms (where applicable)",
      "First-time power-up done with low-current test load",
      "Final review by a qualified electrician where required by law",
    ],
  },
];

export default function Checklist() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = sections
      .map((s) => `## ${s.title}\n${s.items.map((i) => `- [ ] ${i}`).join("\n")}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(`Vanlectric — Campervan electrical checklist\n\n${text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <SiteLayout
      title="Campervan electrical system checklist — Vanlectric"
      description="A complete DIY campervan electrical checklist: appliances, battery, solar, DC-DC, shore power, inverter, fuses, cables, monitoring and safety."
    >
      <PageHero
        eyebrow="Checklist"
        title="Campervan electrical system checklist"
        subtitle="Use this to sanity-check your build before powering anything up."
      />
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="flex items-center justify-end mb-5">
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 border border-border bg-card text-foreground text-sm font-sans font-semibold px-4 py-2 rounded-md hover:bg-card/70"
          >
            {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy checklist</>}
          </button>
        </div>

        <div className="space-y-5">
          {sections.map((s) => (
            <section key={s.title} className="step-card p-5">
              <h2 className="font-display font-semibold text-lg mb-3">{s.title}</h2>
              <ul className="space-y-2">
                {s.items.map((i) => (
                  <li key={i} className="flex gap-2 items-start text-sm text-foreground/85">
                    <input type="checkbox" className="mt-1 accent-[hsl(var(--primary))]" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="step-card p-5 mt-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-display font-semibold text-lg">Need component sizes?</div>
            <p className="text-sm text-muted-foreground">Run your van through the planner first.</p>
          </div>
          <Link
            to="/planner"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold px-5 py-2.5 rounded-md hover:bg-[hsl(var(--primary-hover))]"
          >
            Open planner <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
