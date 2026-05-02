import { Link } from "react-router-dom";
import { PlannerLink } from "@/components/ui/PlannerLink";
import { SiteLayout, PageHero, Prose } from "@/components/site/SiteLayout";

export default function About() {
  return (
    <SiteLayout
      title="About Vanlectric — campervan electrical planning for DIY builders"
      description="Vanlectric was created to help DIY campervan builders understand their electrical system before buying components."
    >
      <PageHero eyebrow="About" title="About Vanlectric" />
      <Prose>
        <p>
          Vanlectric was created to help DIY campervan builders understand their electrical system{" "}
          <strong>before they start buying components</strong>. Most beginners get stuck on the same questions:
          how big should my battery be? How much solar do I need? Do I really need an inverter?
        </p>
        <p>
          The Vanlectric planner answers those questions in plain English, based on the appliances you actually
          plan to use — not generic templates. The goal is not to replace an electrician, but to make sure
          you walk into your build, your shopping cart and any conversation with a professional already knowing
          roughly what your system should look like.
        </p>
        <p>
          The tool is free, requires no account, and works on a phone in the van.
        </p>
        <p>
          <PlannerLink to="/planner">Try the planner</PlannerLink> · <Link to="/resources">Browse resources</Link> ·{" "}
          <Link to="/contact">Get in touch</Link>
        </p>
      </Prose>
    </SiteLayout>
  );
}
