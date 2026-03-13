import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Language = 'zh' | 'en';

const translations = {
  zh: {
    appTitle: '任务排序器',
    appSubtitle: '拖拽卡片来整理你的任务优先级',
    inbox: '收集箱',
    sorted: '排序任务',
    timeline: '时间轴',
    addTaskPlaceholder: '任务标题',
    addDescPlaceholder: '任务描述（可选）',
    add: '添加',
    emptyInbox: '拖拽任务到这里',
    emptySorted: '从收集箱拖拽任务来排序',
    emptyTimeline: '完成任务后会显示在这里',
    complete: '完成任务',
    delete: '删除任务',
    deleteRecord: '删除记录',
    today: '今天',
    yesterday: '昨天',
  },
  en: {
    appTitle: 'Task Sorter',
    appSubtitle: 'Drag cards to organize your task priorities',
    inbox: 'Inbox',
    sorted: 'Sorted Tasks',
    timeline: 'Timeline',
    addTaskPlaceholder: 'Task title',
    addDescPlaceholder: 'Description (optional)',
    add: 'Add',
    emptyInbox: 'Drag tasks here',
    emptySorted: 'Drag tasks from inbox to sort',
    emptyTimeline: 'Completed tasks will appear here',
    complete: 'Complete task',
    delete: 'Delete task',
    deleteRecord: 'Delete record',
    today: 'Today',
    yesterday: 'Yesterday',
  },
};

type Translations = typeof translations.zh;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | null>(null);

const LANG_STORAGE_KEY = 'task-sorter-lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return (saved === 'en' || saved === 'zh') ? saved : 'zh';
  });

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  const t = translations[lang];

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
