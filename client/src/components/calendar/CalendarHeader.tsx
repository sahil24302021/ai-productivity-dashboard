// client/src/components/calendar/CalendarHeader.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalendarHeaderProps = {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday?: () => void;
};

export function CalendarHeader({
  monthLabel,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
  <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          aria-label="Previous month"
          onClick={onPrev}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-100 bg-white hover:bg-gray-50 transition shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>

        <button
          aria-label="Next month"
          onClick={onNext}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-100 bg-white hover:bg-gray-50 transition shadow-sm"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="text-lg md:text-xl font-semibold tracking-tight text-gray-800">
        {monthLabel}
      </div>

      <div className="flex items-center gap-3">
        {onToday && (
          <button
            onClick={onToday}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            Today
          </button>
        )}
      </div>
    </div>
  );
}
