import { useMemo } from 'react';
import { useAllTasks } from '@/hooks/useTasks';
import { Check, X, Clock } from 'lucide-react';

const CATEGORY_META: Record<string, { color: string; bg: string; border: string }> = {
  Programming: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  Reading: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  Health: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  Work: { color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
  Learning: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  Writing: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  General: { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
};

interface CategoriesPageProps {
  darkMode: boolean;
}

export default function CategoriesPage({ darkMode: dm }: CategoriesPageProps) {
  const { tasks } = useAllTasks();

  const categories = useMemo(() => {
    const map: Record<string, { total: number; done: number; skipped: number; pending: number; minutes: number }> = {};
    tasks.forEach(t => {
      if (!map[t.category]) map[t.category] = { total: 0, done: 0, skipped: 0, pending: 0, minutes: 0 };
      map[t.category].total++;
      map[t.category].minutes += t.duration_minutes;
      if (t.status === 'done') map[t.category].done++;
      else if (t.status === 'skipped') map[t.category].skipped++;
      else map[t.category].pending++;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [tasks]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className={`col-span-3 text-center py-12 text-sm ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>
            No categories yet — add tasks to see them here.
          </div>
        ) : categories.map(([cat, s]) => {
          const meta = CATEGORY_META[cat] ?? CATEGORY_META.General;
          const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
          return (
            <div key={cat} className={`rounded-2xl border p-5 ${dm ? 'bg-[#221d14] border-[#3a3020]' : `${meta.bg} ${meta.border}`}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${dm ? 'text-[#e8d9b5]' : meta.color}`}>{cat}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${dm ? 'bg-[#2a2218] text-[#b8a98a]' : 'bg-white/60 text-gray-600'}`}>{s.total} tasks</span>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  <span className={dm ? 'text-[#9c8a6a]' : 'text-gray-600'}>{s.done} completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <X size={14} className="text-red-400" />
                  <span className={dm ? 'text-[#9c8a6a]' : 'text-gray-600'}>{s.skipped} skipped</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-blue-500" />
                  <span className={dm ? 'text-[#9c8a6a]' : 'text-gray-600'}>{Math.floor(s.minutes / 60)}h {s.minutes % 60}m planned</span>
                </div>
              </div>

              <div className={`h-2 rounded-full overflow-hidden ${dm ? 'bg-[#1a1510]' : 'bg-white/50'}`}>
                <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className={`text-xs mt-1.5 text-right ${dm ? 'text-[#6b5c42]' : 'text-gray-500'}`}>{pct}% done</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
