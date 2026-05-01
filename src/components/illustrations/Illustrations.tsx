interface VanIllustrationProps {
  className?: string;
}

export const VanIllustration = ({ className }: VanIllustrationProps) => (
  <svg
    viewBox="0 0 200 120"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {/* body */}
    <path d="M10 80 L10 50 Q10 38 22 38 L130 38 L160 55 L185 60 Q192 62 192 70 L192 82 L175 82" />
    <path d="M10 82 L52 82" />
    <path d="M82 82 L145 82" />
    {/* windshield */}
    <path d="M130 38 L160 55 L130 55 Z" fill="hsl(var(--primary) / 0.15)" />
    {/* side window */}
    <rect x="22" y="44" width="42" height="14" rx="2" fill="hsl(var(--primary) / 0.1)" />
    <rect x="72" y="44" width="42" height="14" rx="2" fill="hsl(var(--primary) / 0.1)" />
    {/* wheels */}
    <circle cx="65" cy="86" r="11" />
    <circle cx="65" cy="86" r="4" />
    <circle cx="162" cy="86" r="11" />
    <circle cx="162" cy="86" r="4" />
    {/* solar panel */}
    <rect x="30" y="32" width="90" height="6" fill="hsl(var(--primary) / 0.3)" />
    <line x1="55" y1="32" x2="55" y2="38" />
    <line x1="80" y1="32" x2="80" y2="38" />
    <line x1="105" y1="32" x2="105" y2="38" />
    {/* bolt */}
    <path
      d="M155 12 L148 28 L156 28 L150 42 L168 22 L160 22 L165 12 Z"
      fill="hsl(var(--primary))"
      stroke="none"
    />
  </svg>
);

export const UsageIllustration = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 200 120"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {/* mountains */}
    <path d="M0 90 L40 50 L70 75 L110 35 L160 80 L200 60 L200 110 L0 110 Z" fill="hsl(var(--primary) / 0.08)" />
    <path d="M0 90 L40 50 L70 75 L110 35 L160 80 L200 60" />
    {/* sun */}
    <circle cx="155" cy="30" r="12" fill="hsl(var(--primary) / 0.2)" />
    <circle cx="155" cy="30" r="8" stroke="hsl(var(--primary))" />
    {/* road */}
    <path d="M20 110 L100 95 L180 110" stroke="hsl(var(--primary))" strokeDasharray="4 4" />
    {/* small van */}
    <rect x="88" y="82" width="24" height="12" rx="2" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" />
    <circle cx="94" cy="96" r="2" fill="hsl(var(--primary))" stroke="none" />
    <circle cx="106" cy="96" r="2" fill="hsl(var(--primary))" stroke="none" />
  </svg>
);
