import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { steps: string[]; current: number };

export function StepIndicator({ steps, current }: Props) {
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border flex items-center justify-center text-xs font-medium transition-colors",
                  done && "bg-green-50 border-green-300 text-green-700",
                  active && "bg-blue-50 border-blue-300 text-blue-700",
                  !done && !active && "border-border text-muted-foreground",
                )}>
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[11px]",
                  active
                    ? "text-blue-600 font-medium"
                    : "text-muted-foreground",
                )}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-2 mb-4",
                  done ? "bg-green-300" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
