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
        "step-card w-full max-w-2xl mx-auto p-6 sm:p-10 animate-step-in",
        className,
      )}
    >
      <div className="flex flex-col md:flex-row md:items-start md:gap-8">
        {illustration && (
          <div className="mb-6 md:mb-0 md:order-2 md:flex-shrink-0 flex justify-center md:justify-end">
            <div className="w-28 h-28 md:w-44 md:h-44 flex items-center justify-center text-primary">
              {illustration}
            </div>
          </div>
        )}
        <div className="flex-1 md:order-1">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};
