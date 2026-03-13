import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { DroppableContainer } from './components/DroppableContainer';
import { TaskCard } from './components/TaskCard';
import { AddTaskForm } from './components/AddTaskForm';
import type { Task, ContainerId } from './types';
import './App.css';

const STORAGE_KEY = 'task-sorter-data';

const defaultInboxTasks: Task[] = [
  { id: '1', title: '学习 React', description: '深入理解 Hooks' },
  { id: '2', title: '写文档', description: '完善项目文档' },
  { id: '3', title: '代码审查', description: '审查团队 PR' },
  { id: '4', title: '修复 Bug', description: '处理用户反馈的问题' },
];

const defaultSortedTasks: Task[] = [
  { id: '5', title: '需求分析', description: '整理产品需求' },
  { id: '6', title: '技术方案', description: '设计技术架构' },
];

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load data from localStorage:', e);
  }
  return null;
}

function App() {
  const [inboxTasks, setInboxTasks] = useState<Task[]>(() => {
    const saved = loadFromStorage();
    return saved?.inboxTasks ?? defaultInboxTasks;
  });
  const [sortedTasks, setSortedTasks] = useState<Task[]>(() => {
    const saved = loadFromStorage();
    return saved?.sortedTasks ?? defaultSortedTasks;
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    const data = { inboxTasks, sortedTasks };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [inboxTasks, sortedTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string): ContainerId | null => {
    if (inboxTasks.find((t) => t.id === id)) return 'inbox';
    if (sortedTasks.find((t) => t.id === id)) return 'sorted';
    if (id === 'inbox' || id === 'sorted') return id as ContainerId;
    return null;
  };

  const findTask = (id: string): Task | null => {
    return (
      inboxTasks.find((t) => t.id === id) ||
      sortedTasks.find((t) => t.id === id) ||
      null
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = findTask(event.active.id as string);
    setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    const task = findTask(activeId);
    if (!task) return;

    if (activeContainer === 'inbox') {
      setInboxTasks((tasks) => tasks.filter((t) => t.id !== activeId));
      setSortedTasks((tasks) => {
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const insertIndex = overIndex >= 0 ? overIndex : tasks.length;
        return [...tasks.slice(0, insertIndex), task, ...tasks.slice(insertIndex)];
      });
    } else {
      setSortedTasks((tasks) => tasks.filter((t) => t.id !== activeId));
      setInboxTasks((tasks) => {
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const insertIndex = overIndex >= 0 ? overIndex : tasks.length;
        return [...tasks.slice(0, insertIndex), task, ...tasks.slice(insertIndex)];
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const setTasks = activeContainer === 'inbox' ? setInboxTasks : setSortedTasks;
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((t) => t.id === activeId);
        const newIndex = tasks.findIndex((t) => t.id === overId);
        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
  };

  const handleAddTask = (title: string, description?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
    };
    setInboxTasks((tasks) => [...tasks, newTask]);
  };

  const handleDeleteTask = (id: string) => {
    setInboxTasks((tasks) => tasks.filter((t) => t.id !== id));
    setSortedTasks((tasks) => tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>任务排序器</h1>
        <p>拖拽卡片来整理你的任务优先级</p>
      </header>

      <AddTaskForm onAdd={handleAddTask} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          <DroppableContainer
            id="inbox"
            title="收集箱"
            tasks={inboxTasks}
            onDeleteTask={handleDeleteTask}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 8L5.5 4H18.5L21 8M3 8V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V8M3 8H21M10 12H14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <DroppableContainer
            id="sorted"
            title="排序任务"
            tasks={sortedTasks}
            showArrows
            onDeleteTask={handleDeleteTask}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6H21M3 12H15M3 18H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default App;
