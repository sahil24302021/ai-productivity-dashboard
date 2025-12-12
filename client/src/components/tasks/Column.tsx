import type { ReactNode } from "react";

type StatusKey = "todo" | "in_progress" | "completed";
type DroppableProvided = {
  innerRef: (el: HTMLElement | null) => any;
  droppableProps: Record<string, any>;
  placeholder: ReactNode;
};

type Props = {
  title: string;
  tasks?: any[];
  statusKey: StatusKey;
  onAdd?: (status: StatusKey) => void;
  droppableProvided?: DroppableProvided;
  isDraggingOver?: boolean;
  children?: ReactNode;
};

export default function Column({
  title,
  tasks = [],
  statusKey,
  onAdd,
  droppableProvided,
  isDraggingOver,
  children,
}: Props) {
  return (
    <div className="min-w-[300px] max-w-[320px] flex-shrink-0">
      <div
        ref={droppableProvided?.innerRef}
        {...droppableProvided?.droppableProps}
        className={`
          bg-gradient-to-br from-[#f7faff] to-[#eef3ff]
          rounded-[22px] p-6
          border border-gray-200
          shadow-[0_4px_20px_rgba(0,0,0,0.04)]
          transition-transform duration-200
          ${isDraggingOver ? "ring-2 ring-slate-300" : "hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)]"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[17px] font-semibold text-slate-900 tracking-tight">
            {title}
          </h3>

          <button
            onClick={() => onAdd?.(statusKey)}
            className="
              px-3 py-[6px]
              text-sm font-medium
              rounded-xl
              bg-white border border-gray-200
              shadow-[0_2px_8px_rgba(0,0,0,0.04)]
              hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]
              transition
            "
          >
            + Add
          </button>
        </div>

        {/* Tasks container */}
        <div className="flex flex-col gap-4 min-h-[200px] max-h-[60vh] overflow-y-auto pr-1">
          {tasks.length === 0 && (
            <div className="text-sm text-slate-400">No tasks</div>
          )}

          {children}

          {droppableProvided?.placeholder}
        </div>
      </div>
    </div>
  );
}
