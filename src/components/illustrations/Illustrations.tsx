/**
 * Pencil-sketch style illustrations.
 * Thin strokes (1-1.5px), slight imperfection via subtle wobble in path data,
 * light hatching for shading. Uses currentColor so they inherit text color.
 */

interface IllProps {
  className?: string;
}

export const VanIllustration = ({ className }: IllProps) => (
  <svg
    viewBox="0 0 200 120"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {/* body — slightly imperfect outline */}
    <path d="M11 80 Q10.5 65 10.5 50 Q10 38 22 38 L130 38 L160 55 L184 60 Q192 62 192 70 L192 82 L175 82.5" />
    <path d="M11 82 L52 82" />
    <path d="M82 82 L145 82.5" />
    {/* windshield */}
    <path d="M130 38 L160 55 L130 55 Z" />
    {/* side windows */}
    <rect x="22" y="44" width="42" height="14" rx="1.5" />
    <rect x="72" y="44" width="42" height="14" rx="1.5" />
    {/* hatching on windshield */}
    <path d="M134 41 L156 53" strokeWidth="0.6" opacity="0.5" />
    <path d="M138 41 L156 49" strokeWidth="0.6" opacity="0.5" />
    <path d="M142 41 L156 45" strokeWidth="0.6" opacity="0.5" />
    {/* hatching under van */}
    <path d="M30 88 L40 92" strokeWidth="0.6" opacity="0.4" />
    <path d="M45 88 L55 92" strokeWidth="0.6" opacity="0.4" />
    <path d="M110 88 L120 92" strokeWidth="0.6" opacity="0.4" />
    <path d="M125 88 L135 92" strokeWidth="0.6" opacity="0.4" />
    {/* wheels */}
    <circle cx="65" cy="86" r="11" />
    <circle cx="65" cy="86" r="4" />
    <circle cx="162" cy="86" r="11" />
    <circle cx="162" cy="86" r="4" />
    {/* wheel hatching */}
    <path d="M58 82 L62 90" strokeWidth="0.6" opacity="0.4" />
    <path d="M155 82 L159 90" strokeWidth="0.6" opacity="0.4" />
    {/* solar panel */}
    <rect x="30" y="32" width="90" height="6" />
    <line x1="55" y1="32" x2="55" y2="38" />
    <line x1="80" y1="32" x2="80" y2="38" />
    <line x1="105" y1="32" x2="105" y2="38" />
    {/* panel hatching */}
    <path d="M32 34 L120 34" strokeWidth="0.5" opacity="0.4" />
    <path d="M32 36 L120 36" strokeWidth="0.5" opacity="0.4" />
    {/* small bolt mark */}
    <path d="M158 14 L152 26 L158 26 L154 38 L168 22 L162 22 L166 14 Z" strokeWidth="1" />
  </svg>
);

export const UsageIllustration = ({ className }: IllProps) => (
  <svg
    viewBox="0 0 200 120"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {/* mountains — hand-drawn feel */}
    <path d="M0 90 L40 50 L70 75 L110 35 L160 80 L200 60" />
    {/* hatching on mountain shadows */}
    <path d="M40 55 L52 75" strokeWidth="0.5" opacity="0.45" />
    <path d="M44 60 L54 78" strokeWidth="0.5" opacity="0.45" />
    <path d="M110 40 L130 70" strokeWidth="0.5" opacity="0.45" />
    <path d="M115 45 L132 72" strokeWidth="0.5" opacity="0.45" />
    <path d="M120 50 L135 74" strokeWidth="0.5" opacity="0.45" />
    {/* sun */}
    <circle cx="155" cy="30" r="10" />
    <path d="M155 14 L155 10" />
    <path d="M155 50 L155 46" />
    <path d="M139 30 L135 30" />
    <path d="M175 30 L171 30" />
    <path d="M143 18 L140 15" />
    <path d="M170 42 L167 39" />
    {/* horizon hatching */}
    <path d="M0 95 L200 95" strokeWidth="0.5" opacity="0.3" />
    {/* road dashed */}
    <path d="M20 110 Q100 95 180 110" strokeDasharray="3 4" />
    {/* small van */}
    <path d="M88 82 L88 88 L112 88 L112 84 L108 82 Z" />
    <rect x="91" y="84" width="6" height="3" strokeWidth="0.7" />
    <circle cx="94" cy="89" r="1.5" />
    <circle cx="106" cy="89" r="1.5" />
    {/* tiny bird strokes */}
    <path d="M40 22 Q43 19 46 22" strokeWidth="0.7" />
    <path d="M48 28 Q51 25 54 28" strokeWidth="0.7" />
  </svg>
);
