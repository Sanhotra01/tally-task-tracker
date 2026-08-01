import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useFocusTime, useStreak } from '@/hooks/useFocusTime';
import StatsRow from '@/components/StatsRow';
import TaskList from '@/components/TaskList';

interface TodayPageProps {
  date: Date;
  search: string;
  darkMode: boolean;
}

function toDateStr(d: Date) {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export default function TodayPage({ date, search, darkMode }: TodayPageProps) {
  const dateStr = toDateStr(date);
  const { tasks, loading, addTask, updateStatus, deleteTask } = useTasks(dateStr);
  const { totalSeconds, refetch: refetchFocus } = useFocusTime(dateStr);
  const streak = useStreak();

  const stats = useMemo(() => ({
    done: tasks.filter(t => t.status === 'done').length,
    total: tasks.length,
    skipped: tasks.filter(t => t.status === 'skipped').length,
  }), [tasks]);

  return (
    <div className="p-6 space-y-6">
      <StatsRow
        done={stats.done}
        total={stats.total}
        skipped={stats.skipped}
        streak={streak}
        focusSeconds={totalSeconds}
        darkMode={darkMode}
      />

      <TaskList
        tasks={tasks}
        onAddTask={addTask}
        onStatus={updateStatus}
        onDelete={deleteTask}
        search={search}
        darkMode={darkMode}
        onFocusTime={refetchFocus}
      />

      {loading && <div className="text-center text-sm text-[#a89878]">Loading…</div>}
    </div>
  );
}
