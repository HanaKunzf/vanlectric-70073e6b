import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SiteLayout, PageHero, Prose } from "@/components/site/SiteLayout";
import { ReactNode } from "react";

interface Guide {
  slug: string;
  title: string;
  description: string;
  body: ReactNode;
}

const PlannerCta = () => (
  <div className="step-card p-5 mt-8 flex items-center justify-between gap-4 flex-wrap">
    <div>
      <div className="font-display font-semibold text-lg">Apply this to your van</div>
      <p className="text-sm text-muted-foreground">Use the Vanlectric planner to size your real system.</p>
    </div>
    <Link
      to="/planner"
      data-prose-cta
      className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold px-5 py-2.5 rounded-md no-underline hover:bg-[hsl(var(--primary-hover))]"
    >
      Open planner <ArrowRight className="w-4 h-4" />
    </Link>
  </div>
);

const guides: Record<string, Guide> = {
  "battery-sizing": {
    slug: "battery-sizing",
    title: "How to size a campervan battery system",
    description: "Work out daily Wh, autonomy days and the right Ah at 12V for your campervan battery bank.",
    body: (
      <>
        <p>
          Your battery bank has one job: store enough energy to run your appliances when you're not driving,
          not connected to shore power and the sun isn't shining. Sizing it correctly is the single most
          important decision in your van's electrical system.
        </p>
        <h2>Step 1 — Add up your daily consumption</h2>
        <p>
          For every appliance, multiply its power draw (watts) by how many hours per day you use it. The total
          is your daily energy use in <strong>watt-hours (Wh)</strong>. Add a 10% inverter loss for any 230V
          appliance you'll run from the battery.
        </p>
        <h2>Step 2 — Choose autonomy days</h2>
        <p>
          Autonomy is how many days you want to survive without solar input or driving. Two days is a good
          baseline for most builds. Three or more if you stop in shaded spots or build for winter.
        </p>
        <h2>Step 3 — Convert Wh to Ah at 12V</h2>
        <p>
          Divide your total Wh by 12V to get amp-hours. Then add a usable-capacity buffer:
        </p>
        <ul>
          <li><strong>LiFePO4:</strong> usable ~90% of nominal capacity.</li>
          <li><strong>AGM / lead-acid:</strong> usable only ~50% before damage.</li>
        </ul>
        <p>
          Most modern campervan builds use <strong>LiFePO4</strong> for the better cycle life, weight and depth
          of discharge.
        </p>
        <h2>Step 4 — Sanity-check against your charging</h2>
        <p>
          Even a perfect battery is useless if you can't recharge it. Make sure your solar + alternator setup
          can replace your daily Wh during your worst expected day.
        </p>
        <PlannerCta />
      </>
    ),
  },
  "solar-sizing": {
    slug: "solar-sizing",
    title: "Campervan solar sizing explained",
    description: "How climate, season, roof space and orientation determine how many watts of solar your van actually needs.",
    body: (
      <>
        <p>
          Solar is the cheapest way to keep your batteries topped up — but only if it's sized realistically for
          where and when you actually travel.
        </p>
        <h2>The rough rule of thumb</h2>
        <p>
          A flat roof-mounted panel in good summer sun produces about <strong>4–5 Wh per watt of panel per day</strong>.
          In winter or cloudy conditions, expect <strong>1–2 Wh per watt</strong>. So 400 W of panels in summer is
          roughly 1,600–2,000 Wh/day; in deep winter it might be 400–800 Wh.
        </p>
        <h2>What actually changes your output</h2>
        <ul>
          <li><strong>Latitude and season</strong> — winter sun in northern Europe is brutal.</li>
          <li><strong>Shading</strong> — even partial shade tanks output. Park smart.</li>
          <li><strong>Panel orientation</strong> — flat roof panels lose to tilted ones, but they're simpler.</li>
          <li><strong>MPPT controller</strong> — get one. PWM wastes 20–30%.</li>
        </ul>
        <h2>How much should you fit?</h2>
        <p>
          Fit as much wattage as your roof allows, up to the point where you've got 1.5–2× your expected daily Wh
          in summer panel output. That gives you reasonable winter behaviour without an oversized array.
        </p>
        <PlannerCta />
      </>
    ),
  },
  "shore-vs-inverter": {
    slug: "shore-vs-inverter",
    title: "Shore power vs inverter in a campervan",
    description: "When to add an inverter, when to rely on shore power, and how to combine both safely.",
    body: (
      <>
        <p>
          230V appliances in a van can be powered two ways: from <strong>shore power</strong> (a campsite hookup)
          or from your battery via an <strong>inverter</strong>. Most builds need a bit of both — but the right
          balance depends on what you actually plug in.
        </p>
        <h2>Shore-only appliances</h2>
        <p>
          High-power loads like kettles, hairdryers, induction hobs and 2 kW heaters are best treated as{" "}
          <strong>shore-only</strong>. Running them off the battery means a 2,000 W+ inverter, huge cables and
          fast battery drain.
        </p>
        <h2>When an inverter makes sense</h2>
        <ul>
          <li>Laptops and chargers without 12V equivalents.</li>
          <li>A Nespresso machine or small blender used briefly.</li>
          <li>Tools (drills, soldering irons) used occasionally.</li>
        </ul>
        <h2>Combining both</h2>
        <p>
          A typical balanced setup has: a CEE shore inlet, a shore charger that tops up the battery and feeds
          AC sockets when plugged in, plus a modest 1,000–1,500 W inverter for off-grid 230V use. Mark loads in
          Vanlectric as 230V shore-only or 230V via inverter so the planner sizes the inverter and battery
          correctly.
        </p>
        <PlannerCta />
      </>
    ),
  },
  "12v-vs-230v": {
    slug: "12v-vs-230v",
    title: "12V vs 230V campervan appliances",
    description: "A practical guide to choosing 12V native appliances vs running 230V kit through an inverter.",
    body: (
      <>
        <p>
          Every watt that goes through an inverter loses around 10% as heat. So the rule is simple: prefer 12V
          native where it exists, and use 230V only where you have to.
        </p>
        <h2>Use 12V for</h2>
        <ul>
          <li>Lighting (LED strips, spots, reading lamps).</li>
          <li>Compressor fridges (Dometic, Vitrifrigo, Indel B).</li>
          <li>Water pumps, fans, USB charging.</li>
          <li>Diesel and propane heaters.</li>
        </ul>
        <h2>Use 230V (via inverter) for</h2>
        <ul>
          <li>Laptops, monitors, and other office gear.</li>
          <li>Power tools used occasionally.</li>
          <li>Small kitchen appliances (blender, Nespresso) used briefly.</li>
        </ul>
        <h2>Use 230V (shore-only) for</h2>
        <ul>
          <li>Kettles, hairdryers, induction hobs, electric heaters.</li>
        </ul>
        <p>
          The Vanlectric planner asks for the power source of every appliance and reflects the right losses,
          inverter sizing and battery capacity automatically.
        </p>
        <PlannerCta />
      </>
    ),
  },
  tiers: {
    slug: "tiers",
    title: "Low cost vs balanced vs premium campervan electrical setups",
    description: "What you actually get when you upgrade batteries, MPPTs, inverters and DC-DC chargers from low-cost to premium.",
    body: (
      <>
        <p>
          Vanlectric offers three component tiers. Here's what they typically mean in real component choices.
        </p>
        <h2>Low cost</h2>
        <p>
          Generic LiFePO4 batteries, basic PWM/cheap MPPT, modified-sine inverter, no smart shunt. Works for
          weekend trips and short summer use, but tends to need replacement sooner.
        </p>
        <h2>Balanced</h2>
        <p>
          Mid-range LiFePO4 (often with internal BMS and Bluetooth), Victron or similar MPPT, pure-sine inverter,
          smart battery monitor. The sweet spot for most full-time-curious builders.
        </p>
        <h2>Premium</h2>
        <p>
          Top-tier batteries (Victron, Fogstar HV, etc.), Victron MPPT + DC-DC + Multi/Quattro inverter-charger,
          full Cerbo GX monitoring. Pays off if you live in the van year-round in cold climates.
        </p>
        <p>
          Switch tiers in the planner to compare shopping list totals side-by-side.
        </p>
        <PlannerCta />
      </>
    ),
  },
};

export default function GuideArticle() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? guides[slug] : undefined;
  if (!guide) return <Navigate to="/guides" replace />;

  return (
    <SiteLayout title={`${guide.title} — Vanlectric`} description={guide.description}>
      <PageHero eyebrow="Guide" title={guide.title} subtitle={guide.description} />
      <Prose>
        <Link to="/guides" className="inline-flex items-center gap-1 text-sm text-muted-foreground no-underline hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> All guides
        </Link>
        {guide.body}
      </Prose>
    </SiteLayout>
  );
}
