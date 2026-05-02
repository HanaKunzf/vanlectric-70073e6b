/**
 * Pencil-sketch style illustrations.
 * Thin strokes (1-1.5px), light hatching, slightly imperfect lines.
 * All use currentColor to inherit from text color.
 */

interface IllProps {
  className?: string;
}

const baseProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// ---------- STEP 1 ----------
// Camper van facing right. Long body (living area) at left, short cab + sloped
// windshield at right. Subtle roof solar panel + tiny lightning bolt accent.
export const VanIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 200 120" className={className} {...baseProps} aria-hidden>
    {/* Ground line — very subtle */}
    <path d="M8 96 L192 96" strokeWidth="0.5" opacity="0.35" />

    {/* Body silhouette — single continuous outline.
        Start: rear bottom-left, up the rear, across roof, down windshield,
        across hood, down front bumper, along underside back to start. */}
    <path d="
      M18 82
      L18 44
      Q18 38 24 38
      L138 38
      Q146 38 150 44
      L162 60
      L182 62
      Q188 63 188 68
      L188 82
    " />

    {/* Underside between wheels */}
    <path d="M18 82 L46 82" />
    <path d="M76 82 L150 82" />
    <path d="M178 82 L188 82" />

    {/* Sliding-door rear window */}
    <rect x="28" y="46" width="40" height="16" rx="1.5" />
    {/* Mid window */}
    <rect x="74" y="46" width="40" height="16" rx="1.5" />
    {/* Door seam */}
    <line x1="71" y1="40" x2="71" y2="80" strokeWidth="0.6" opacity="0.45" />
    {/* Body waistline */}
    <line x1="20" y1="68" x2="148" y2="68" strokeWidth="0.5" opacity="0.35" />

    {/* Cab windshield (sloped) */}
    <path d="M138 42 L158 60 L150 60 Z" />
    {/* Cab door window */}
    <rect x="152" y="50" width="22" height="12" rx="1.5" opacity="0.9" />
    {/* Door handle */}
    <line x1="156" y1="68" x2="162" y2="68" strokeWidth="0.6" opacity="0.5" />
    {/* Side mirror */}
    <path d="M178 56 L184 54" strokeWidth="0.8" />
    {/* Headlight */}
    <path d="M184 70 L188 70" strokeWidth="0.8" />

    {/* Wheels */}
    <circle cx="61" cy="86" r="10" />
    <circle cx="61" cy="86" r="3.5" />
    <circle cx="164" cy="86" r="10" />
    <circle cx="164" cy="86" r="3.5" />
    {/* Wheel arch hints */}
    <path d="M50 82 Q61 70 72 82" strokeWidth="0.5" opacity="0.35" />
    <path d="M153 82 Q164 70 175 82" strokeWidth="0.5" opacity="0.35" />

    {/* Roof solar panel */}
    <rect x="32" y="32" width="86" height="6" rx="0.5" />
    <line x1="60" y1="32" x2="60" y2="38" strokeWidth="0.5" opacity="0.55" />
    <line x1="89" y1="32" x2="89" y2="38" strokeWidth="0.5" opacity="0.55" />

    {/* Tiny lightning bolt — Vanlectric detail */}
    <path d="M30 14 L24 24 L29 24 L26 32 L34 22 L29 22 L32 14 Z" strokeWidth="0.9" />
  </svg>
);

// ---------- STEP 2 ----------
export const UsageIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 200 120" className={className} {...baseProps} aria-hidden>
    <path d="M0 90 L40 50 L70 75 L110 35 L160 80 L200 60" />
    <path d="M40 55 L52 75" strokeWidth="0.5" opacity="0.45" />
    <path d="M44 60 L54 78" strokeWidth="0.5" opacity="0.45" />
    <path d="M110 40 L130 70" strokeWidth="0.5" opacity="0.45" />
    <path d="M115 45 L132 72" strokeWidth="0.5" opacity="0.45" />
    <circle cx="155" cy="30" r="10" />
    <path d="M155 14 L155 10" />
    <path d="M139 30 L135 30" />
    <path d="M175 30 L171 30" />
    <path d="M143 18 L140 15" />
    <path d="M170 42 L167 39" />
    <path d="M20 110 Q100 95 180 110" strokeDasharray="3 4" />
    <path d="M88 82 L88 88 L112 88 L112 84 L108 82 Z" />
    <rect x="91" y="84" width="6" height="3" strokeWidth="0.7" />
    <circle cx="94" cy="89" r="1.5" />
    <circle cx="106" cy="89" r="1.5" />
    <path d="M40 22 Q43 19 46 22" strokeWidth="0.7" />
    <path d="M48 28 Q51 25 54 28" strokeWidth="0.7" />
  </svg>
);

// ---------- STEP 3 — Climate ----------
export const ClimateIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 200 120" className={className} {...baseProps} aria-hidden>
    {/* sun */}
    <circle cx="55" cy="40" r="14" />
    <path d="M55 18 L55 14" /><path d="M55 66 L55 62" />
    <path d="M33 40 L29 40" /><path d="M81 40 L77 40" />
    <path d="M40 25 L37 22" /><path d="M73 55 L70 52" />
    <path d="M40 55 L37 58" /><path d="M73 25 L70 28" />
    {/* cloud */}
    <path d="M115 50 Q108 50 108 42 Q108 32 120 32 Q125 26 134 28 Q145 28 147 38 Q156 38 156 48 Q156 56 148 56 L116 56 Q108 56 108 50" />
    {/* snowflake */}
    <g transform="translate(155 85)">
      <path d="M0 -10 L0 10" /><path d="M-10 0 L10 0" />
      <path d="M-7 -7 L7 7" /><path d="M-7 7 L7 -7" />
      <path d="M0 -10 L-2 -7" /><path d="M0 -10 L2 -7" />
      <path d="M0 10 L-2 7" /><path d="M0 10 L2 7" />
    </g>
    {/* thermometer */}
    <g transform="translate(35 80)">
      <rect x="-4" y="-22" width="8" height="26" rx="4" />
      <circle cx="0" cy="8" r="6" />
      <line x1="0" y1="-18" x2="0" y2="6" strokeWidth="0.7" opacity="0.5" />
    </g>
    {/* drizzle hatching */}
    <path d="M120 62 L117 70" strokeWidth="0.6" opacity="0.5" />
    <path d="M130 62 L127 70" strokeWidth="0.6" opacity="0.5" />
    <path d="M140 62 L137 70" strokeWidth="0.6" opacity="0.5" />
  </svg>
);

// ---------- STEP 4 — Appliances ----------
export const AppliancesIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 200 120" className={className} {...baseProps} aria-hidden>
    {/* fridge */}
    <rect x="20" y="25" width="35" height="70" rx="3" />
    <line x1="20" y1="48" x2="55" y2="48" />
    <circle cx="50" cy="38" r="1" fill="currentColor" />
    <circle cx="50" cy="60" r="1" fill="currentColor" />
    {/* lightbulb */}
    <circle cx="95" cy="40" r="11" />
    <path d="M88 50 L102 50" />
    <path d="M89 54 L101 54" />
    <path d="M91 58 L99 58" />
    <path d="M91 38 L93 42 L97 36 L99 42" strokeWidth="0.7" opacity="0.6" />
    {/* coffee mug */}
    <path d="M75 78 L75 95 Q75 102 82 102 L98 102 Q105 102 105 95 L105 78 Z" />
    <path d="M105 82 Q113 82 113 90 Q113 96 105 96" />
    <path d="M82 70 Q82 65 85 67 Q88 70 85 73" strokeWidth="0.7" />
    <path d="M92 70 Q92 65 95 67 Q98 70 95 73" strokeWidth="0.7" />
    {/* laptop */}
    <path d="M130 35 L175 35 L175 65 L130 65 Z" />
    <path d="M125 65 L180 65 L182 70 L123 70 Z" />
    <line x1="135" y1="40" x2="170" y2="40" strokeWidth="0.5" opacity="0.4" />
    <line x1="135" y1="45" x2="165" y2="45" strokeWidth="0.5" opacity="0.4" />
    {/* fan */}
    <circle cx="155" cy="92" r="13" />
    <path d="M155 92 L155 80" /><path d="M155 92 L165 99" />
    <path d="M155 92 L145 99" />
    <circle cx="155" cy="92" r="2" fill="currentColor" />
  </svg>
);

// ---------- STEP 5 — Driving ----------
export const DrivingIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 200 120" className={className} {...baseProps} aria-hidden>
    {/* steering wheel */}
    <circle cx="100" cy="60" r="32" />
    <circle cx="100" cy="60" r="6" />
    <line x1="100" y1="34" x2="100" y2="54" />
    <line x1="74" y1="60" x2="94" y2="60" />
    <line x1="126" y1="60" x2="106" y2="60" />
    <line x1="100" y1="66" x2="100" y2="92" />
    {/* speed lines */}
    <path d="M30 40 L50 40" strokeWidth="0.7" opacity="0.5" />
    <path d="M25 50 L48 50" strokeWidth="0.7" opacity="0.5" />
    <path d="M30 60 L50 60" strokeWidth="0.7" opacity="0.5" />
    <path d="M150 40 L170 40" strokeWidth="0.7" opacity="0.5" />
    <path d="M152 50 L175 50" strokeWidth="0.7" opacity="0.5" />
    <path d="M150 60 L170 60" strokeWidth="0.7" opacity="0.5" />
    {/* clock badge */}
    <circle cx="100" cy="60" r="14" strokeWidth="0.7" opacity="0.4" />
  </svg>
);

// ---------- STEP 6 — Shore power ----------
export const ShoreIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 200 120" className={className} {...baseProps} aria-hidden>
    {/* plug */}
    <rect x="40" y="45" width="35" height="30" rx="4" />
    <line x1="50" y1="38" x2="50" y2="45" />
    <line x1="65" y1="38" x2="65" y2="45" />
    <line x1="75" y1="60" x2="95" y2="60" />
    {/* socket */}
    <rect x="125" y="40" width="40" height="40" rx="4" />
    <circle cx="138" cy="55" r="2" />
    <circle cx="152" cy="55" r="2" />
    <path d="M138 68 L152 68" />
    {/* zap */}
    <path d="M105 50 L100 60 L106 60 L101 72 L114 58 L108 58 L112 50 Z" />
    {/* hatching */}
    <path d="M45 80 L75 80" strokeWidth="0.5" opacity="0.4" />
    <path d="M125 85 L165 85" strokeWidth="0.5" opacity="0.4" />
  </svg>
);

// ---------- STEP 7 — Roof ----------
export const RoofIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 200 120" className={className} {...baseProps} aria-hidden>
    {/* van top-down outline */}
    <rect x="25" y="25" width="150" height="70" rx="6" />
    {/* solar panels */}
    <rect x="40" y="40" width="50" height="25" />
    <line x1="55" y1="40" x2="55" y2="65" strokeWidth="0.6" opacity="0.5" />
    <line x1="70" y1="40" x2="70" y2="65" strokeWidth="0.6" opacity="0.5" />
    <line x1="40" y1="52" x2="90" y2="52" strokeWidth="0.6" opacity="0.5" />
    <rect x="100" y="40" width="50" height="25" />
    <line x1="115" y1="40" x2="115" y2="65" strokeWidth="0.6" opacity="0.5" />
    <line x1="130" y1="40" x2="130" y2="65" strokeWidth="0.6" opacity="0.5" />
    <line x1="100" y1="52" x2="150" y2="52" strokeWidth="0.6" opacity="0.5" />
    {/* fan */}
    <circle cx="160" cy="78" r="8" />
    <line x1="160" y1="70" x2="160" y2="86" />
    <line x1="152" y1="78" x2="168" y2="78" />
    {/* antenna */}
    <line x1="35" y1="78" x2="35" y2="88" />
    <circle cx="35" cy="78" r="2" />
  </svg>
);

// ---------- STEP 8 — People ----------
export const PeopleIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 200 120" className={className} {...baseProps} aria-hidden>
    {/* person 1 */}
    <circle cx="70" cy="40" r="10" />
    <path d="M55 90 Q55 65 70 65 Q85 65 85 90" />
    {/* person 2 */}
    <circle cx="110" cy="42" r="9" />
    <path d="M97 92 Q97 70 110 70 Q123 70 123 92" />
    {/* person 3 small */}
    <circle cx="140" cy="55" r="6" />
    <path d="M132 90 Q132 75 140 75 Q148 75 148 90" />
    {/* ground line */}
    <path d="M40 100 L170 100" strokeWidth="0.6" opacity="0.5" />
    <path d="M50 105 L60 105" strokeWidth="0.5" opacity="0.4" />
    <path d="M150 105 L165 105" strokeWidth="0.5" opacity="0.4" />
  </svg>
);

// ---------- STEP 9 — Remote work ----------
export const RemoteWorkIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 200 120" className={className} {...baseProps} aria-hidden>
    {/* laptop */}
    <path d="M55 35 L145 35 L145 80 L55 80 Z" />
    <path d="M45 80 L155 80 L160 90 L40 90 Z" />
    {/* screen content */}
    <line x1="65" y1="45" x2="135" y2="45" strokeWidth="0.6" opacity="0.5" />
    <line x1="65" y1="52" x2="120" y2="52" strokeWidth="0.6" opacity="0.5" />
    <line x1="65" y1="59" x2="130" y2="59" strokeWidth="0.6" opacity="0.5" />
    <line x1="65" y1="66" x2="110" y2="66" strokeWidth="0.6" opacity="0.5" />
    {/* wifi */}
    <path d="M165 30 Q175 20 185 30" strokeWidth="0.8" />
    <path d="M168 35 Q175 28 182 35" strokeWidth="0.8" />
    <circle cx="175" cy="40" r="1.5" fill="currentColor" />
    {/* coffee */}
    <path d="M22 75 L22 88 Q22 92 26 92 L36 92 Q40 92 40 88 L40 75 Z" />
    <path d="M40 78 Q44 78 44 82 Q44 86 40 86" />
  </svg>
);

// ---------- STEP 10 — Season ----------
export const SeasonIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 200 120" className={className} {...baseProps} aria-hidden>
    {/* sun (summer) */}
    <circle cx="40" cy="40" r="9" />
    <path d="M40 25 L40 22" /><path d="M40 58 L40 55" />
    <path d="M25 40 L22 40" /><path d="M58 40 L55 40" />
    {/* leaf (autumn) */}
    <path d="M85 30 Q95 30 100 40 Q100 50 85 50 Q75 50 75 40 Q75 32 85 30 Z" />
    <path d="M85 30 L85 50" strokeWidth="0.6" opacity="0.5" />
    {/* snowflake (winter) */}
    <g transform="translate(135 40)">
      <path d="M0 -10 L0 10" /><path d="M-10 0 L10 0" />
      <path d="M-7 -7 L7 7" /><path d="M-7 7 L7 -7" />
    </g>
    {/* flower (spring) */}
    <g transform="translate(175 40)">
      <circle cx="0" cy="0" r="3" />
      <circle cx="-7" cy="0" r="4" />
      <circle cx="7" cy="0" r="4" />
      <circle cx="0" cy="-7" r="4" />
      <circle cx="0" cy="7" r="4" />
    </g>
    {/* divider arc */}
    <path d="M20 80 Q100 70 180 80" strokeWidth="0.6" opacity="0.5" strokeDasharray="3 3" />
    <path d="M50 95 L50 100" strokeWidth="0.5" opacity="0.4" />
    <path d="M100 95 L100 100" strokeWidth="0.5" opacity="0.4" />
    <path d="M150 95 L150 100" strokeWidth="0.5" opacity="0.4" />
  </svg>
);

// ---------- STEP 11 — Insulation ----------
export const InsulationIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 200 120" className={className} {...baseProps} aria-hidden>
    {/* van wall cross-section */}
    <rect x="40" y="20" width="120" height="80" />
    {/* outer skin */}
    <line x1="48" y1="20" x2="48" y2="100" strokeWidth="0.8" />
    {/* inner panel */}
    <line x1="152" y1="20" x2="152" y2="100" strokeWidth="0.8" />
    {/* insulation hatching */}
    {Array.from({ length: 16 }).map((_, i) => (
      <path
        key={i}
        d={`M${50 + i * 6.5} 25 Q${53 + i * 6.5} 35 ${50 + i * 6.5} 45 Q${47 + i * 6.5} 55 ${50 + i * 6.5} 65 Q${53 + i * 6.5} 75 ${50 + i * 6.5} 95`}
        strokeWidth="0.6"
        opacity="0.55"
      />
    ))}
    {/* heat arrows escaping */}
    <path d="M165 35 L180 30" strokeWidth="0.7" opacity="0.5" />
    <path d="M178 28 L180 30 L178 32" strokeWidth="0.7" opacity="0.5" />
    <path d="M165 60 L180 60" strokeWidth="0.7" opacity="0.5" />
    <path d="M178 58 L180 60 L178 62" strokeWidth="0.7" opacity="0.5" />
  </svg>
);

// ---------- STEP 12 — Budget ----------
export const BudgetIllustration = ({ className }: IllProps) => (
  <svg viewBox="0 0 200 120" className={className} {...baseProps} aria-hidden>
    {/* coin stack */}
    <ellipse cx="60" cy="40" rx="22" ry="6" />
    <path d="M38 40 L38 50 Q38 56 60 56 Q82 56 82 50 L82 40" />
    <ellipse cx="60" cy="55" rx="22" ry="6" strokeWidth="0.6" opacity="0.6" />
    <path d="M38 55 L38 65 Q38 71 60 71 Q82 71 82 65 L82 55" />
    <ellipse cx="60" cy="70" rx="22" ry="6" strokeWidth="0.6" opacity="0.6" />
    <path d="M38 70 L38 80 Q38 86 60 86 Q82 86 82 80 L82 70" />
    <text x="60" y="48" textAnchor="middle" fontSize="9" fontFamily="serif" fill="currentColor" stroke="none">€</text>
    {/* wallet */}
    <rect x="115" y="50" width="55" height="38" rx="4" />
    <path d="M115 60 L170 60" />
    <circle cx="160" cy="69" r="2" />
    <path d="M125 50 Q125 42 135 42 L155 42 Q165 42 165 50" strokeWidth="0.7" opacity="0.6" />
  </svg>
);
