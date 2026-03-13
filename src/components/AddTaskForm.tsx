import { useState } from 'react';
import { useI18n } from '../i18n';

interface AddTaskFormProps {
  onAdd: (title: string, description?: string) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <div className="input-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.addTaskPlaceholder}
          className="task-input"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.addDescPlaceholder}
          className="task-input task-input-desc"
        />
      </div>
      <button type="submit" className="add-button">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 4V16M4 10H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {t.add}
      </button>
    </form>
  );
}
