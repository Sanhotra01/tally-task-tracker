import { useMemo } from 'react';
import { useAllTasks } from '@/hooks/useTasks';
import { supabase } from '@/lib/supabase';
import { useFocusTime } from '@/hooks/useFocusTime';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface AnalyticsPageProps {
  darkMode: boolean;
}

function toDateStr(d: Date) {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export default function AnalyticsPage({ darkMode: dm }: AnalyticsPageProps) {
  const { tasks } = useAllTasks();
  const todayStr = toDateStr(new Date());
  const { totalSeconds } = useFocusTime(todayStr);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const skipped = tasks.filter(t => t.status === 'skipped').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    const byCategory: Record<string, { total: number; done: number }> = {};
    tasks.forEach(t => {
      if (!byCategory[t.category]) byCategory[t.category] = { total: 0, done: 0 };
      byCategory[t.category].total++;
      if (t.status === 'done') byCategory[t.category].done++;
    });

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const ds = toDateStr(d);
      const dayTasks = tasks.filter(t => t.scheduled_date === ds);
      return {
        label: MONTHS[d.getMonth()] + ' ' + d.getDate(),
        done: dayTasks.filter(t => t.status === 'done').length,
        total: dayTasks.length,
      };
    });

    return { total, done, skipped, pending, completionRate, byCategory, last7Days };
  }, [tasks]);

  const maxDayCount = Math.max(...stats.last7Days.map(d => d.total), 1);
  const cats = Object.entries(stats.byCategory).sort((a, b) => b[1].total - a[1].total);

  const card = `rounded-2xl border p-6 ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-white border-[#e8e0cc]'}`;

  const focusHrs = Math.floor(totalSeconds / 3600);
  const focusMins = Math.floor((totalSeconds % 3600) / 60);

  return (
    <div className="p-6 space-y-4">
      {/* Top stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className={card}>
          <p className={`text-xs uppercase tracking-widest mb-2 ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>Total Tasks</p>
          <p className={`text-3xl font-bold ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>{stats.total}</p>
        </div>
        <div className={card}>
          <p className={`text-xs uppercase tracking-widest mb-2 ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>Completed</p>
          <p className="text-3xl font-bold text-green-500">{stats.done}</p>
        </div>
        <div className={card}>
          <p className={`text-xs uppercase tracking-widest mb-2 ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>Skipped</p>
          <p className="text-3xl font-bold text-red-400">{stats.skipped}</p>
        </div>
        <div className={card}>
          <p className={`text-xs uppercase tracking-widest mb-2 ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>Focus Today</p>
          <p className={`text-3xl font-bold ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>{focusHrs}h {focusMins}m</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 7-day chart */}
        <div className={card}>
          <h3 className={`text-sm font-semibold mb-4 ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>Last 7 Days</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {stats.last7Days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-32 gap-0.5">
                  <div
                    className="w-full bg-red-300 rounded-t"
                    style={{ height: `${(d.total - d.done) / maxDayCount * 100}%` }}
                  />
                  <div
                    className="w-full bg-green-400 rounded-t"
                    style={{ height: `${d.done / maxDayCount * 100}%` }}
                  />
                </div>
                <span className={`text-[10px] ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>{d.label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 justify-center">
            <span className="flex items-center gap-1.5 text-xs"><span className="w-2.5 h-2.5 rounded bg-green-400" /> <span className={dm ? 'text-[#9c8a6a]' : 'text-[#6b5c42]'}>Done</span></span>
            <span className="flex items-center gap-1.5 text-xs"><span className="w-2.5 h-2.5 rounded bg-red-300" /> <span className={dm ? 'text-[#9c8a6a]' : 'text-[#6b5c42]'}>Not done</span></span>
          </div>
        </div>

        {/* Category breakdown */}
        <div className={card}>
          <h3 className={`text-sm font-semibold mb-4 ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>By Category</h3>
          {cats.length === 0 ? (
            <p className={`text-sm ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>No data yet.</p>
          ) : (
            <div className="space-y-3">
              {cats.map(([cat, { total, done }]) => {
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}>{cat}</span>
                      <span className={dm ? 'text-[#9c8a6a]' : 'text-[#6b5c42]'}>{done}/{total} ({pct}%)</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${dm ? 'bg-[#1a1510]' : 'bg-[#ede8dc]'}`}>
                      <div className="h-full bg-[#2c2416] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Completion ring */}
      <div className={card}>
        <h3 className={`text-sm font-semibold mb-4 ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>Overall Completion</h3>
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" className={dm ? 'stroke-[#1a1510]' : 'stroke-[#ede8dc]'} />
              <circle
                cx="50" cy="50" r="42" fill="none" strokeWidth="8" stroke="#4a9a5a" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - stats.completionRate / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>{stats.completionRate}%</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className={dm ? 'text-[#9c8a6a]' : 'text-[#6b5c42]'}>Completed: <span className="font-bold text-green-500">{stats.done}</span></div>
            <div className={dm ? 'text-[#9c8a6a]' : 'text-[#6b5c42]'}>Pending: <span className={`font-bold ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>{stats.pending}</span></div>
            <div className={dm ? 'text-[#9c8a6a]' : 'text-[#6b5c42]'}>Skipped: <span className="font-bold text-red-400">{stats.skipped}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
