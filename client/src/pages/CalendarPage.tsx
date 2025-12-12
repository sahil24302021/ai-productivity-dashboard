import Calendar from "@/components/calendar/Calendar";
import { UpcomingTasks } from "@/components/calendar/UpcomingTasks";

export default function CalendarPage() {
  return (
    <div className="w-full px-10 py-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Calendar</h1>
          <p className="mt-1 text-sm text-gray-500">Plan your tasks by day.</p>
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <Calendar />
          </div>
          <div className="lg:col-span-1">
            <UpcomingTasks />
          </div>
        </div>
      </div>
    </div>
  );
}


