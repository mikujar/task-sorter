import { useI18n } from '../i18n';
import type { Task } from '../types';

interface TimelineProps {
  tasks: Task[];
  onDelete: (id: string) => void;
}

export function Timeline({ tasks, onDelete }: TimelineProps) {
  const { t, lang } = useI18n();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeStr = date.toLocaleTimeString(lang === 'zh' ? 'zh-CN' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (isToday) {
      return `${t.today} ${timeStr}`;
    } else if (isYesterday) {
      return `${t.yesterday} ${timeStr}`;
    } else {
      return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime();
  });

  return (
    <div className="timeline-container">
      <div className="container-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <h2>{t.timeline}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="timeline-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            {t.emptyTimeline}
          </div>
        ) : (
          <div className="timeline">
            {sortedTasks.map((task) => (
              <div key={task.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-task">
                    <div className="timeline-task-info">
                      <h3 className="task-title">{task.title}</h3>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                    </div>
                    <button 
                      className="delete-button" 
                      onClick={() => onDelete(task.id)}
                      title={t.deleteRecord}
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 4L12 12M12 4L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="timeline-time">{formatDate(task.completedAt!)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
