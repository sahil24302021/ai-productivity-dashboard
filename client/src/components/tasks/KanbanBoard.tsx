// src/components/tasks/KanbanBoard.tsx
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Column from "@/components/tasks/Column";
import KanbanCard from "@/components/tasks/KanbanCard";
import { useTasks } from "@/hooks/useTasks";
import { useTaskModal } from "@/hooks/useTaskModal";


type StatusKey = "todo" | "in_progress" | "completed";
const STATUS: Array<{ key: StatusKey; title: string }> = [
  { key: "todo", title: "To Do" },
  { key: "in_progress", title: "In Progress" },
  { key: "completed", title: "Done" },
];

export default function KanbanBoard() {
  const { tasks = [], updateTask } = useTasks();
  const openModal = useTaskModal((s) => s.open);

  const [columns, setColumns] = useState<Record<StatusKey, any[]>>({
    todo: [],
    in_progress: [],
    completed: [],
  });

  useEffect(() => {
    const next: Record<StatusKey, any[]> = { todo: [], in_progress: [], completed: [] };

    (tasks as any[]).forEach((t: any) => {
      const status: StatusKey = (t.status ?? "todo") as StatusKey;
      next[status].push(t);
    });

    (Object.keys(next) as StatusKey[]).forEach((k: StatusKey) =>
      next[k].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    );

    setColumns(next);
  }, [tasks]);

  const handleAddTask = (statusKey: StatusKey) => {
    openModal({ mode: "create", defaultStatus: statusKey });
  };

  const onDragEnd = async ({ source, destination }: any) => {
    if (!destination) return;

  const sId: StatusKey = source.droppableId as StatusKey;
  const dId: StatusKey = destination.droppableId as StatusKey;

  const newCols: Record<StatusKey, any[]> = structuredClone(columns);
    const [moved] = newCols[sId].splice(source.index, 1);
    newCols[dId].splice(destination.index, 0, moved);

  newCols[dId].forEach((t: any, i: number) => (t.order = i));
  newCols[sId].forEach((t: any, i: number) => (t.order = i));

    setColumns(newCols);

  await updateTask(moved.id, { status: dId, order: destination.index });
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-3">
        Drag cards to reorder or move between columns.
      </p>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {STATUS.map((s) => (
            <Droppable droppableId={s.key} key={s.key}>
              {(provided, snapshot) => (
                <Column
                  title={s.title}
                  tasks={columns[s.key] as unknown as any[]}
                  statusKey={s.key as StatusKey}
                  onAdd={() => handleAddTask(s.key)}
                  droppableProvided={{
                    innerRef: provided.innerRef,
                    droppableProps: provided.droppableProps,
                    placeholder: provided.placeholder,
                  }}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {columns[s.key].map((task: any, index: number) => (
                    <Draggable
                      key={String(task.id)}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(prov, snap) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          style={{
                            marginBottom: 12,
                            ...prov.draggableProps.style,
                          }}
                        >
                          <KanbanCard task={task} isDragging={snap.isDragging} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </Column>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
