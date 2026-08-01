import { useState } from 'react';
import { useAllTasks } from '@/hooks/useTasks';
import { TaskStatus } from '@/lib/supabase';
import { Check, X, Trash2, Calendar as CalIcon } from 'lucide-react';

interface AllTasksPageProps {
  darkMode: boolean;
}

export default function AllTasksPage({ darkMode: dm }: AllTasksPageProps) {
  const { tasks, loading, updateStatus, deleteTask } = useAllTasks();
  const [filter, setFilter] = useState<'all' | 'pending' | 'done' | 'skipped'>('all');

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const grouped = filtered.reduce((acc, t) => {
    if (!acc[t.scheduled_date]) acc[t.scheduled_date] = [];
    acc[t.scheduled_date].push(t);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="p-6 space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'done', 'skipped'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-[#2c2416] text-[#e8d9b5]'
                : dm ? 'text-[#9c8a6a] hover:bg-[#2a2218]' : 'text-[#6b5c42] border border-[#ddd0b5] hover:bg-[#f0ead8]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={`text-center py-12 text-sm ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>Loading…</div>
      ) : sortedDates.length === 0 ? (
        <div className={`text-center py-12 text-sm ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>No tasks found.</div>
      ) : (
        sortedDates.map(date => (
          <div key={date} className={`rounded-2xl border p-5 ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-white border-[#e8e0cc]'}`}>
            <div className={`flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider ${dm ? 'text-[#9c8a6a]' : 'text-[#8c7a5e]'}`}>
              <CalIcon size={13} />
              {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="space-y-2">
              {grouped[date].map(t => (
                <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${dm ? 'bg-[#1a1510]' : 'bg-[#f5f0e8]'}`}>
                  <button
                    onClick={() => updateStatus(t.id, t.status === 'done' ? 'pending' : 'done')}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      t.status === 'done' ? 'bg-green-500 border-green-500' : dm ? 'border-[#3a3020]' : 'border-[#b8a98a]'
                    }`}
                  >
                    {t.status === 'done' && <Check size={11} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'} ${t.status === 'done' ? 'line-through opacity-60' : ''}`}>{t.title}</div>
                    <div className={`text-xs ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>{t.category} &bull; {t.duration_minutes} min</div>
                  </div>
                  {t.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(t.id, 'skipped')}
                      className={`p-1.5 rounded-lg ${dm ? 'text-[#6b5c42] hover:bg-[#2a2218]' : 'text-[#b8a98a] hover:bg-[#ede8dc]'}`}
                    >
                      <X size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(t.id)}
                    className={`p-1.5 rounded-lg ${dm ? 'text-[#6b5c42] hover:bg-[#2a2218]' : 'text-[#b8a98a] hover:bg-[#ede8dc]'}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
