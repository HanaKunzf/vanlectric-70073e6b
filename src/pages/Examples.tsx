import { Link } from "react-router-dom";
import { PlannerLink } from "@/components/ui/PlannerLink";
import { ArrowRight, Check, X } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";

const setups = [
  {
    name: "Low cost weekend setup",
    profile: "Weekend van. 2–3 nights off-grid in summer. Mostly a bed-on-wheels with a fridge and lights.",
    appliances: ["12V LED lighting", "12V compressor fridge (40L)", "USB charging", "12V water pump", "Phone + small laptop charging"],
    battery: "100 Ah LiFePO4 (≈1.2 kWh)",
    solar: "200 W roof-mounted",
    inverter: "Optional 300 W pure-sine (or none)",
    charging: "Single solar MPPT, optional cheap shore charger",
    cost: "€800 – €1,400",
    pros: ["Cheap to build", "Fast install", "Good summer behaviour"],
    cons: ["Marginal in winter", "No high-power 230V appliances", "Components last 3–5 years"],
  },
  {
    name: "Balanced off-grid setup",
    profile: "Long-trip van. Several weeks off-grid. Remote work, cooking, occasional 230V appliances.",
    appliances: ["12V lighting + fridge (90L)", "Diesel heater", "Laptop + monitor via inverter", "12V water pump + fans", "Occasional Nespresso / blender"],
    battery: "200–300 Ah LiFePO4 (≈2.5–3.8 kWh)",
    solar: "400 W roof-mounted with MPPT",
    inverter: "1,500 W pure-sine",
    charging: "MPPT + 30A DC-DC charger + shore charger",
    cost: "€2,500 – €4,500",
    pros: ["Real off-grid capability", "Handles remote work", "Good winter buffer"],
    cons: ["Heavier", "More cabling", "Needs careful battery placement"],
  },
  {
    name: "Premium full-time vanlife setup",
    profile: "Lived-in van. Year-round, including winter. High comfort, induction cooking on shore, full monitoring.",
    appliances: ["Large 12V fridge + freezer", "Induction hob (shore-only)", "Diesel heater + boiler", "Multiple laptops + screens", "Hairdryer / kettle on shore"],
    battery: "400–600 Ah LiFePO4 (≈5–7.5 kWh)",
    solar: "600–800 W with high-efficiency MPPT",
    inverter: "2,000–3,000 W inverter-charger (Multi/Quattro)",
    charging: "MPPT + 50A DC-DC + integrated shore charger + Cerbo GX",
    cost: "€7,000 – €12,000+",
    pros: ["Year-round comfort", "Full monitoring", "Handles cold climates"],
    cons: ["Expensive", "Heavy — affects payload", "Longer install"],
  },
];

export default function Examples() {
  return (
    <SiteLayout
      title="Example campervan electrical setups — Vanlectric"
      description="Three example campervan electrical setups: low cost weekend, balanced off-grid and premium full-time vanlife. Battery, solar, inverter and cost ranges."
    >
      <PageHero
        eyebrow="Example setups"
        title="Three example campervan electrical setups"
        subtitle="Real-world starting points. Use the planner to adapt any of them to your own appliances and travel style."
      />
      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-6">
        {setups.map((s) => (
          <article key={s.name} className="step-card p-6">
            <h2 className="font-display font-bold text-2xl text-primary mb-1">{s.name}</h2>
            <p className="text-sm text-muted-foreground mb-5">{s.profile}</p>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-1">Example appliances</div>
                <ul className="list-disc pl-5 space-y-1 text-foreground/85">
                  {s.appliances.map((a) => <li key={a}>{a}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <div><span className="font-semibold">Battery:</span> {s.battery}</div>
                <div><span className="font-semibold">Solar:</span> {s.solar}</div>
                <div><span className="font-semibold">Inverter:</span> {s.inverter}</div>
                <div><span className="font-semibold">Charging:</span> {s.charging}</div>
                <div><span className="font-semibold">Indicative cost:</span> {s.cost}</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-border text-sm">
              <div>
                <div className="font-semibold mb-1 flex items-center gap-1"><Check className="w-4 h-4 text-primary" /> Pros</div>
                <ul className="space-y-1 text-foreground/85">
                  {s.pros.map((p) => <li key={p}>• {p}</li>)}
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-1 flex items-center gap-1"><X className="w-4 h-4 text-accent" /> Limitations</div>
                <ul className="space-y-1 text-foreground/85">
                  {s.cons.map((c) => <li key={c}>• {c}</li>)}
                </ul>
              </div>
            </div>
          </article>
        ))}

        <div className="step-card p-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground">
            Costs are indicative ranges and vary by brand, country and supplier.
          </p>
          <PlannerLink
            to="/planner"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold px-5 py-2.5 rounded-md hover:bg-[hsl(var(--primary-hover))]"
          >
            Build your own <ArrowRight className="w-4 h-4" />
          </PlannerLink>
        </div>
      </div>
    </SiteLayout>
  );
}
