import { Mail } from "lucide-react";
import { SiteLayout, PageHero, Prose } from "@/components/site/SiteLayout";

export default function Contact() {
  return (
    <SiteLayout
      title="Contact Vanlectric"
      description="Get in touch with Vanlectric — feedback, suggestions and questions about the campervan electrical planner."
    >
      <PageHero eyebrow="Contact" title="Get in touch" subtitle="Feedback, ideas and corrections are always welcome." />
      <Prose>
        <p>
          Vanlectric is a small project run by a single builder, so replies may take a few days. The fastest
          way to reach us is by email:
        </p>
        <p>
          <a href="mailto:hello@vanlectric.com" className="inline-flex items-center gap-2">
            <Mail className="w-4 h-4" /> hello@vanlectric.com
          </a>
        </p>
        <p>
          If you spot something inaccurate in the planner, a guide, or the example setups, please tell us —
          we'd rather fix it than leave anyone with a wrongly sized battery bank.
        </p>
        <p>
          A web contact form is on the roadmap and will replace this email-only contact when the backend is in place.
        </p>
      </Prose>
    </SiteLayout>
  );
}
