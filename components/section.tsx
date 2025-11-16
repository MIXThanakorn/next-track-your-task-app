import TaskCard from "@/components/taskcard";
import { TaskItem } from "@/types/task";

export default function Section({
  title,
  emptyText,
  items,
  onStart,
  onDone,
  onDelete,
  onEdit,
}: {
  title: string;
  emptyText: string;
  items: TaskItem[];
  onStart: (id: string) => void;
  onDone: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">{emptyText}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((task) => (
            <TaskCard
              key={task.task_id}
              task={task}
              onStart={onStart}
              onDone={onDone}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
