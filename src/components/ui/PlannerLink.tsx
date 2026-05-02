import { forwardRef, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { Link, useNavigate, type LinkProps } from "react-router-dom";
import { hasLastCalculation } from "@/services/localCalculation";
import { PlannerEntryModal } from "@/components/ui/PlannerEntryModal";

type PlannerLinkProps = Omit<LinkProps, "to"> & {
  to?: LinkProps["to"];
  children: ReactNode;
};

/**
 * Drop-in replacement for <Link to="/planner"> that intercepts clicks when a
 * saved draft exists and shows the "Continue your calculation?" modal.
 *
 * Use this on every entry point into the calculator (Start planning, Planner,
 * Recalculate, etc.).
 */
export const PlannerLink = forwardRef<HTMLAnchorElement, PlannerLinkProps>(
  ({ to = "/planner", onClick, children, ...rest }, ref) => {
    const [open, setOpen] = useState(false);

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (hasLastCalculation()) {
        e.preventDefault();
        setOpen(true);
      }
    };

    return (
      <>
        <Link ref={ref} to={to} {...rest} onClick={handleClick}>
          {children}
        </Link>
        <PlannerEntryModal open={open} onOpenChange={setOpen} />
      </>
    );
  },
);
PlannerLink.displayName = "PlannerLink";

/**
 * Button variant for places that aren't real anchors (e.g. menu items that
 * already have `onClick` handlers like closing a drawer).
 */
type PlannerButtonProps = AnchorHTMLAttributes<HTMLButtonElement> & {
  to?: string;
  beforeNavigate?: () => void;
  children: ReactNode;
};

export const PlannerButton = ({ to = "/planner", beforeNavigate, onClick, children, ...rest }: PlannerButtonProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e as never);
    beforeNavigate?.();
    if (hasLastCalculation()) {
      setOpen(true);
    } else {
      navigate(to);
    }
  };

  return (
    <>
      <button type="button" onClick={handleClick} {...(rest as object)}>
        {children}
      </button>
      <PlannerEntryModal open={open} onOpenChange={setOpen} />
    </>
  );
};
