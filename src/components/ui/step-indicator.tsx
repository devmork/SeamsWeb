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
                  done && "bg-sticker-green-tint border-sticker-green/30 text-sticker-green-ink",
                  active && "bg-primary-soft border-primary/30 text-primary",
                  !done && !active && "border-hairline text-ink-faint",
                )}>
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[11px]",
                  active
                    ? "text-primary font-medium"
                    : "text-ink-muted",
                )}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-2 mb-4",
                  done ? "bg-sticker-green/40" : "bg-hairline",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
