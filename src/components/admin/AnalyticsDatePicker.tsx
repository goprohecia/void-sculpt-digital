import { useState } from "react";
import { format, startOfMonth, startOfWeek, subMonths, startOfYear } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DateRange {
  from: Date;
  to: Date;
}

const SHORTCUTS = [
  { label: "Cette semaine", getRange: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: new Date() }) },
  { label: "Ce mois", getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  { label: "3 derniers mois", getRange: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
  { label: "Cette année", getRange: () => ({ from: startOfYear(new Date()), to: new Date() }) },
] as const;

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function AnalyticsDatePicker({ value, onChange }: Props) {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Shortcuts */}
      {SHORTCUTS.map((s) => (
        <Button
          key={s.label}
          variant="outline"
          size="sm"
          className="text-xs h-8"
          onClick={() => onChange(s.getRange())}
        >
          {s.label}
        </Button>
      ))}

      {/* From date */}
      <Popover open={fromOpen} onOpenChange={setFromOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn("h-8 text-xs gap-1.5 min-w-[120px] justify-start")}>
            <CalendarIcon className="h-3.5 w-3.5" />
            {format(value.from, "dd MMM yyyy", { locale: fr })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value.from}
            onSelect={(d) => { if (d) { onChange({ ...value, from: d }); setFromOpen(false); } }}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground text-xs">→</span>

      {/* To date */}
      <Popover open={toOpen} onOpenChange={setToOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn("h-8 text-xs gap-1.5 min-w-[120px] justify-start")}>
            <CalendarIcon className="h-3.5 w-3.5" />
            {format(value.to, "dd MMM yyyy", { locale: fr })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value.to}
            onSelect={(d) => { if (d) { onChange({ ...value, to: d }); setToOpen(false); } }}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
