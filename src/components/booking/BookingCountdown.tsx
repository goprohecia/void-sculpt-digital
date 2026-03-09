import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const LOCK_DURATION_MS = 10 * 60 * 1000;

interface BookingCountdownProps {
  lockExpiry: number | null;
  onExpired: () => void;
}

export function BookingCountdown({ lockExpiry, onExpired }: BookingCountdownProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!lockExpiry) return;

    const tick = () => {
      const diff = Math.max(0, lockExpiry - Date.now());
      setRemaining(diff);
      if (diff <= 0) {
        onExpired();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockExpiry, onExpired]);

  if (!lockExpiry || remaining <= 0) return null;

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const progress = (remaining / LOCK_DURATION_MS) * 100;
  const isLow = remaining < 2 * 60 * 1000;

  return (
    <div
      className={cn(
        "mb-6 rounded-lg border p-4 transition-colors",
        isLow
          ? "border-destructive/50 bg-destructive/5"
          : "border-primary/30 bg-primary/5"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          {isLow ? (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          ) : (
            <Clock className="h-4 w-4 text-primary" />
          )}
          <span className={isLow ? "text-destructive" : "text-foreground"}>
            Votre créneau est réservé pendant{" "}
            <span className="font-bold tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </span>
        </div>
      </div>
      <Progress
        value={progress}
        className={cn("h-1.5", isLow ? "[&>div]:bg-destructive" : "")}
      />
    </div>
  );
}
