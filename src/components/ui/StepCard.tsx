import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StepCardProps {
  title: string;
  illustration?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const StepCard = ({ title, illustration, children, className }: StepCardProps) => {
  return (
    <div
      className={cn(
        "step-card w-full max-w-[720px] lg:max-w-[1040px] xl:max-w-[1120px] mx-auto",
        "p-5 sm:p-7 lg:p-9 animate-step-in",
        className,
      )}
    >
      {/* Header: stack on mobile, side-by-side from md up. Compact on desktop. */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-5 md:mb-6 lg:mb-7">
        {illustration && (
          <div className="mb-4 md:mb-0 md:order-2 md:flex-shrink-0 flex justify-center md:justify-end">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center text-primary">
              {illustration}
            </div>
          </div>
        )}
        <div className="flex-1 md:order-1 min-w-0">
          <h2
            className="font-display font-bold text-foreground normal-case tracking-tight leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 1.2rem + 2.4vw, 2.75rem)" }}
          >
            {title}
          </h2>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
};
