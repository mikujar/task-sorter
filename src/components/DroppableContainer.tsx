import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import type { Task, ContainerId } from '../types';

interface DroppableContainerProps {
  id: ContainerId;
  title: string;
  tasks: Task[];
  showArrows?: boolean;
  icon: React.ReactNode;
  onDeleteTask?: (id: string) => void;
}

export function DroppableContainer({
  id,
  title,
  tasks,
  showArrows = false,
  icon,
  onDeleteTask,
}: DroppableContainerProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`container ${isOver ? 'container-over' : ''}`}>
      <div className="container-header">
        {icon}
        <h2>{title}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div ref={setNodeRef} className="task-list">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="empty-state">
              {id === 'inbox' ? '拖拽任务到这里' : '从收集箱拖拽任务来排序'}
            </div>
          ) : (
            tasks.map((task, index) => (
              <div key={task.id} className="task-wrapper">
                <TaskCard task={task} onDelete={onDeleteTask} />
                {showArrows && index < tasks.length - 1 && (
                  <div className="arrow-connector">
                    <svg width="24" height="32" viewBox="0 0 24 32">
                      <path
                        d="M12 0 L12 24 M6 18 L12 24 L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
