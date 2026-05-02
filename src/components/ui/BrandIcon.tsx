import {
  // navigation / van
  Truck, Map, Home as HomeIcon, Tent, Compass,
  // climate / weather
  Sun, Cloud, CloudSun, Snowflake, Leaf, Thermometer,
  // electrical / system
  Zap, Plug, Plug2, BatteryCharging, BatteryFull, Cable, CircuitBoard,
  // appliances / home
  Refrigerator, ChefHat, Flame, ShowerHead, Droplets, Wind, AirVent,
  Laptop, Music, Wrench, Lightbulb, Bike, Scissors, Coffee,
  // people
  User, Users,
  // roof / obstacles
  RectangleHorizontal, Square, Fan, Satellite, Antenna, Ruler,
  // wizard / meta
  Briefcase, Layers, Wallet, Route, Clock,
  // ui states
  Info, AlertTriangle, Sparkles, Check, Mail, Cookie, Pencil,
  // misc
  Car, MapPin,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Vanlectric icon registry.
 * Single source of truth for the editorial monoline icon language.
 * All icons render as outline SVG via lucide-react with rounded caps/joins.
 */
const REGISTRY = {
  // --- vehicle / context ---
  van: Truck,
  vehicle: Truck,
  car: Car,
  route: Route,
  drive: Route,
  map: Map,
  pin: MapPin,
  compass: Compass,
  home: HomeIcon,
  tent: Tent,
  travel: Map,

  // --- climate / weather / season ---
  sun: Sun,
  cloud: Cloud,
  partlyCloudy: CloudSun,
  cold: Snowflake,
  snow: Snowflake,
  ac: Snowflake,
  warm: Thermometer,
  hot: Thermometer,
  leaf: Leaf,
  autumn: Leaf,
  mixedClimate: CloudSun,

  // --- electrical / charging ---
  zap: Zap,
  shore: Plug,
  plug: Plug,
  outlet: Plug2,
  battery: BatteryFull,
  charger: BatteryCharging,
  cable: Cable,
  mppt: CircuitBoard,
  inverter: CircuitBoard,

  // --- appliances ---
  fridge: Refrigerator,
  cooking: ChefHat,
  flame: Flame,
  heating: Flame,
  shower: ShowerHead,
  water: Droplets,
  fan: Wind,
  vent: AirVent,
  electronics: Laptop,
  remoteWork: Laptop,
  entertainment: Music,
  tools: Wrench,
  lighting: Lightbulb,
  sport: Bike,
  personalCare: Scissors,
  coffee: Coffee,

  // --- people ---
  person: User,
  people: Users,
  family: Users,

  // --- roof / obstacles ---
  window: RectangleHorizontal,
  smallWindow: Square,
  largeWindow: RectangleHorizontal,
  rooftop: HomeIcon,
  roofFan: Fan,
  satellite: Satellite,
  antenna: Antenna,
  rack: Ruler,
  other: Square,

  // --- wizard meta ---
  usage: Tent,
  appliances: Plug,
  driving: Route,
  shorePower: Plug,
  roof: HomeIcon,
  remote: Laptop,
  season: Leaf,
  insulation: Layers,
  budget: Wallet,
  existing: Wrench,
  briefcase: Briefcase,
  clock: Clock,

  // --- ui states ---
  info: Info,
  warning: AlertTriangle,
  alert: AlertTriangle,
  sparkles: Sparkles,
  check: Check,
  mail: Mail,
  cookie: Cookie,
  edit: Pencil,
  report: Mail,
} as const satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof REGISTRY;

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<IconSize, number> = {
  xs: 16, // inline text
  sm: 20, // small UI / nav
  md: 24, // form cards / section labels
  lg: 32, // feature illustrations
  xl: 48, // section illustrations
};

export interface BrandIconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  name: IconKey;
  size?: IconSize | number;
  /** Visual tone. Defaults to currentColor so it inherits typography color. */
  tone?: "default" | "primary" | "accent" | "muted" | "current";
  className?: string;
  strokeWidth?: number;
}

/**
 * Resolve a possibly-unknown key to a registered icon.
 * Falls back to a small filled circle (Square) if missing — keeps layout stable.
 */
export const resolveIcon = (name: string): LucideIcon =>
  (REGISTRY as Record<string, LucideIcon>)[name] ?? Square;

export const BrandIcon = ({
  name,
  size = "sm",
  tone = "current",
  className,
  strokeWidth = 1.75,
  ...rest
}: BrandIconProps) => {
  const Icon = resolveIcon(name);
  const px = typeof size === "number" ? size : SIZE_PX[size];
  const toneClass =
    tone === "primary"
      ? "text-primary"
      : tone === "accent"
        ? "text-accent"
        : tone === "muted"
          ? "text-muted-foreground"
          : tone === "default"
            ? "text-foreground"
            : "";
  return (
    <Icon
      width={px}
      height={px}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", toneClass, className)}
      {...rest}
    />
  );
};

export default BrandIcon;
