/**
 * Pencil-sketch style schematic diagrams for the Van Electrical Guide.
 * Forest-green line art, thin strokes, slight imperfection. Use currentColor
 * so they inherit the surrounding text colour (typically text-primary).
 *
 * Each diagram is mobile-friendly: viewBox-based SVG that scales by width.
 */

interface Props {
  className?: string;
  title?: string;
}

const baseProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Small reusable building blocks ---------------------------------------------
const Box = ({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={3} />
    <text
      x={x + w / 2}
      y={y + h / 2 + 3}
      textAnchor="middle"
      fontSize={8}
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      fill="currentColor"
      stroke="none"
    >
      {label}
    </text>
  </g>
);

const Arrow = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  // arrow head
  const ax = x2 - ux * 5;
  const ay = y2 - uy * 5;
  const px = -uy * 3;
  const py = ux * 3;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line x1={ax + px} y1={ay + py} x2={x2} y2={y2} />
      <line x1={ax - px} y1={ay - py} x2={x2} y2={y2} />
    </g>
  );
};

// 1. Big picture --------------------------------------------------------------
export const BigPictureDiagram = ({ className, title }: Props) => (
  <svg viewBox="0 0 320 220" className={className} {...baseProps} aria-label={title ?? "Overall system diagram"} role="img">
    {/* Solar */}
    <Box x={10} y={10} w={70} h={22} label="Solar panel" />
    <Box x={110} y={10} w={50} h={22} label="MPPT" />
    {/* Alternator */}
    <Box x={10} y={50} w={70} h={22} label="Alternator" />
    <Box x={110} y={50} w={50} h={22} label="DC-DC" />
    {/* Shore */}
    <Box x={10} y={90} w={70} h={22} label="Shore power" />
    <Box x={110} y={90} w={50} h={22} label="Shore charger" />
    {/* Battery */}
    <Box x={195} y={50} w={55} h={22} label="Battery" />
    {/* Fuse box / loads */}
    <Box x={195} y={130} w={55} h={22} label="Fuse box" />
    <Box x={130} y={170} w={70} h={22} label="12V loads" />
    {/* Inverter / 230V */}
    <Box x={265} y={130} w={45} h={22} label="Inverter" />
    <Box x={250} y={170} w={60} h={22} label="230V loads" />

    {/* Arrows */}
    <Arrow x1={80} y1={21} x2={110} y2={21} />
    <Arrow x1={160} y1={21} x2={222} y2={50} />
    <Arrow x1={80} y1={61} x2={110} y2={61} />
    <Arrow x1={160} y1={61} x2={195} y2={61} />
    <Arrow x1={80} y1={101} x2={110} y2={101} />
    <Arrow x1={160} y1={101} x2={222} y2={72} />
    {/* battery → fusebox */}
    <Arrow x1={222} y1={72} x2={222} y2={130} />
    <Arrow x1={222} y1={152} x2={180} y2={170} />
    {/* battery → inverter */}
    <Arrow x1={250} y1={61} x2={287} y2={130} />
    <Arrow x1={287} y1={152} x2={280} y2={170} />

    {/* hatching detail */}
    <path d="M14 35 L20 39" strokeWidth="0.5" opacity="0.4" />
    <path d="M22 35 L28 39" strokeWidth="0.5" opacity="0.4" />
  </svg>
);

// 2. Battery ------------------------------------------------------------------
export const BatteryDiagram = ({ className, title }: Props) => (
  <svg viewBox="0 0 240 110" className={className} {...baseProps} aria-label={title ?? "Battery diagram"} role="img">
    <rect x={70} y={25} width={100} height={55} rx={4} />
    <rect x={62} y={35} width={8} height={14} />
    <rect x={62} y={56} width={8} height={14} />
    <text x={120} y={48} textAnchor="middle" fontSize={9} fontFamily="ui-sans-serif" fill="currentColor" stroke="none">LiFePO4</text>
    <text x={120} y={62} textAnchor="middle" fontSize={8} fontFamily="ui-sans-serif" fill="currentColor" stroke="none">12V · Ah</text>
    {/* + and - */}
    <text x={56} y={45} fontSize={9} fill="currentColor" stroke="none">+</text>
    <text x={56} y={68} fontSize={9} fill="currentColor" stroke="none">−</text>
    {/* fuse on positive */}
    <line x1={170} y1={42} x2={195} y2={42} />
    <circle cx={200} cy={42} r={5} />
    <text x={200} y={45} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">F</text>
    <line x1={205} y1={42} x2={225} y2={42} />
    {/* disconnect */}
    <line x1={170} y1={63} x2={195} y2={63} />
    <line x1={195} y1={63} x2={208} y2={55} />
    <line x1={208} y1={63} x2={225} y2={63} />
    <text x={205} y={80} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">disconnect</text>
    <text x={200} y={28} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">main fuse</text>
  </svg>
);

// 3. Solar --------------------------------------------------------------------
export const SolarDiagram = ({ className, title }: Props) => (
  <svg viewBox="0 0 320 130" className={className} {...baseProps} aria-label={title ?? "Solar charging diagram"} role="img">
    {/* panel */}
    <rect x={10} y={20} width={60} height={36} />
    <line x1={10} y1={32} x2={70} y2={32} strokeWidth="0.6" opacity="0.5" />
    <line x1={10} y1={44} x2={70} y2={44} strokeWidth="0.6" opacity="0.5" />
    <line x1={30} y1={20} x2={30} y2={56} strokeWidth="0.6" opacity="0.5" />
    <line x1={50} y1={20} x2={50} y2={56} strokeWidth="0.6" opacity="0.5" />
    <text x={40} y={70} textAnchor="middle" fontSize={8} fill="currentColor" stroke="none">Solar panel</text>
    {/* MC4 */}
    <Box x={85} y={28} w={35} h={20} label="MC4" />
    {/* gland */}
    <Box x={130} y={28} w={40} h={20} label="Gland" />
    {/* MPPT */}
    <Box x={180} y={28} w={45} h={20} label="MPPT" />
    {/* fuse */}
    <circle cx={245} cy={38} r={7} />
    <text x={245} y={41} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">F</text>
    {/* battery */}
    <Box x={265} y={28} w={45} h={20} label="Battery" />
    {/* arrows */}
    <Arrow x1={70} y1={38} x2={85} y2={38} />
    <Arrow x1={120} y1={38} x2={130} y2={38} />
    <Arrow x1={170} y1={38} x2={180} y2={38} />
    <Arrow x1={225} y1={38} x2={238} y2={38} />
    <Arrow x1={252} y1={38} x2={265} y2={38} />
    {/* sun */}
    <circle cx={40} cy={95} r={8} />
    <line x1={40} y1={80} x2={40} y2={84} />
    <line x1={28} y1={95} x2={32} y2={95} />
    <line x1={48} y1={95} x2={52} y2={95} />
    <line x1={31} y1={86} x2={34} y2={89} />
    <line x1={46} y1={86} x2={49} y2={89} />
  </svg>
);

// 4. DC-DC --------------------------------------------------------------------
export const DcDcDiagram = ({ className, title }: Props) => (
  <svg viewBox="0 0 320 100" className={className} {...baseProps} aria-label={title ?? "DC-DC diagram"} role="img">
    <Box x={10} y={30} w={70} h={26} label="Alternator" />
    <circle cx={95} cy={43} r={7} />
    <text x={95} y={46} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">F</text>
    <Box x={115} y={30} w={70} h={26} label="DC-DC" />
    <circle cx={200} cy={43} r={7} />
    <text x={200} y={46} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">F</text>
    <Box x={220} y={30} w={85} h={26} label="House battery" />
    <Arrow x1={80} y1={43} x2={88} y2={43} />
    <Arrow x1={102} y1={43} x2={115} y2={43} />
    <Arrow x1={185} y1={43} x2={193} y2={43} />
    <Arrow x1={207} y1={43} x2={220} y2={43} />
    <text x={95} y={75} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">input fuse</text>
    <text x={200} y={75} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">output fuse</text>
  </svg>
);

// 5. Shore --------------------------------------------------------------------
export const ShoreDiagram = ({ className, title }: Props) => (
  <svg viewBox="0 0 320 110" className={className} {...baseProps} aria-label={title ?? "Shore power diagram"} role="img">
    <Box x={10} y={30} w={70} h={26} label="CEE inlet" />
    <Box x={95} y={30} w={70} h={26} label="RCD/MCB" />
    <Box x={180} y={30} w={70} h={26} label="Shore charger" />
    <Box x={260} y={30} w={50} h={26} label="Battery" />
    <Arrow x1={80} y1={43} x2={95} y2={43} />
    <Arrow x1={165} y1={43} x2={180} y2={43} />
    <Arrow x1={250} y1={43} x2={260} y2={43} />
    <text x={130} y={75} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">protection</text>
  </svg>
);

// 6. 12V system ---------------------------------------------------------------
export const TwelveVDiagram = ({ className, title }: Props) => (
  <svg viewBox="0 0 320 150" className={className} {...baseProps} aria-label={title ?? "12V distribution"} role="img">
    <Box x={10} y={20} w={60} h={26} label="Battery" />
    <circle cx={85} cy={33} r={7} />
    <text x={85} y={36} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">F</text>
    <Box x={105} y={20} w={60} h={26} label="Busbar" />
    <Box x={180} y={20} w={70} h={26} label="Fuse box" />
    <Arrow x1={70} y1={33} x2={78} y2={33} />
    <Arrow x1={92} y1={33} x2={105} y2={33} />
    <Arrow x1={165} y1={33} x2={180} y2={33} />
    {/* circuits */}
    <Box x={20} y={90} w={50} h={20} label="Lights" />
    <Box x={85} y={90} w={50} h={20} label="Pump" />
    <Box x={150} y={90} w={50} h={20} label="Fridge" />
    <Box x={215} y={90} w={50} h={20} label="Fan" />
    <Box x={275} y={90} w={35} h={20} label="USB" />
    {/* lines down */}
    <Arrow x1={215} y1={46} x2={45} y2={90} />
    <Arrow x1={215} y1={46} x2={110} y2={90} />
    <Arrow x1={215} y1={46} x2={175} y2={90} />
    <Arrow x1={215} y1={46} x2={240} y2={90} />
    <Arrow x1={215} y1={46} x2={292} y2={90} />
    <text x={160} y={130} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">each circuit individually fused</text>
  </svg>
);

// 7. 230V AC ------------------------------------------------------------------
export const AcDiagram = ({ className, title }: Props) => (
  <svg viewBox="0 0 320 110" className={className} {...baseProps} aria-label={title ?? "230V AC diagram"} role="img">
    <Box x={10} y={30} w={60} h={26} label="Shore inlet" />
    <Box x={85} y={30} w={70} h={26} label="RCD / RCBO" />
    <Box x={170} y={30} w={50} h={26} label="MCBs" />
    <Box x={235} y={30} w={75} h={26} label="230V sockets" />
    <Arrow x1={70} y1={43} x2={85} y2={43} />
    <Arrow x1={155} y1={43} x2={170} y2={43} />
    <Arrow x1={220} y1={43} x2={235} y2={43} />
    <text x={160} y={80} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">protection · electrician check</text>
  </svg>
);

// 8. Inverter -----------------------------------------------------------------
export const InverterDiagram = ({ className, title }: Props) => (
  <svg viewBox="0 0 320 100" className={className} {...baseProps} aria-label={title ?? "Inverter diagram"} role="img">
    <Box x={10} y={30} w={60} h={26} label="Battery" />
    <circle cx={85} cy={43} r={7} />
    <text x={85} y={46} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">F</text>
    <Box x={105} y={30} w={70} h={26} label="Inverter" />
    <Box x={195} y={30} w={115} h={26} label="230V appliance" />
    <Arrow x1={70} y1={43} x2={78} y2={43} />
    <Arrow x1={92} y1={43} x2={105} y2={43} />
    <Arrow x1={175} y1={43} x2={195} y2={43} />
    <text x={140} y={75} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none">12V DC → 230V AC</text>
  </svg>
);
