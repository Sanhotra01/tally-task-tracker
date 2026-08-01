import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { useAllTasks } from '@/hooks/useTasks';
import { Task } from '@/lib/supabase';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarPageProps {
  darkMode: boolean;
}

function toDateStr(d: Date) {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export default function CalendarPage({ darkMode: dm }: CalendarPageProps) {
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selected, setSelected] = useState<string | null>(toDateStr(new Date()));
  const { tasks } = useAllTasks();

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach(t => {
      if (!map[t.scheduled_date]) map[t.scheduled_date] = [];
      map[t.scheduled_date].push(t);
    });
    return map;
  }, [tasks]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = lastDay.getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = toDateStr(new Date());
  const selectedTasks = selected ? tasksByDate[selected] ?? [] : [];

  return (
    <div className="p-6">
      <div className={`rounded-2xl border p-6 ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-white border-[#e8e0cc]'}`}>
        {/* Month nav */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold font-serif ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>
            {MONTHS[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setCursor(new Date(year, month - 1, 1))} className={`p-2 rounded-lg ${dm ? 'hover:bg-[#2a2218] text-[#9c8a6a]' : 'hover:bg-[#ede8dc] text-[#8c7a5e]'}`}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setCursor(new Date(year, month + 1, 1))} className={`p-2 rounded-lg ${dm ? 'hover:bg-[#2a2218] text-[#9c8a6a]' : 'hover:bg-[#ede8dc] text-[#8c7a5e]'}`}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {WEEKDAYS.map(d => (
            <div key={d} className={`text-center text-xs font-semibold uppercase tracking-wider ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell, i) => {
            if (!cell) return <div key={i} />;
            const ds = toDateStr(cell);
            const dayTasks = tasksByDate[ds] ?? [];
            const doneCount = dayTasks.filter(t => t.status === 'done').length;
            const isToday = ds === todayStr;
            const isSelected = ds === selected;

            return (
              <button
                key={i}
                onClick={() => setSelected(ds)}
                className={`aspect-square rounded-xl p-2 flex flex-col items-center justify-start transition-all border ${
                  isSelected
                    ? 'bg-[#2c2416] text-[#e8d9b5] border-[#2c2416]'
                    : isToday
                    ? dm ? 'bg-[#2a3a2a] border-[#4a9a5a]' : 'bg-[#eaf4ec] border-[#4a9a5a]'
                    : dm ? 'bg-[#1a1510] border-[#2a2218] hover:border-[#3a3020]' : 'bg-[#fdfaf4] border-[#e8e0cc] hover:border-[#ddd0b5]'
                }`}
              >
                <span className={`text-sm font-semibold ${isSelected ? '' : dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>{cell.getDate()}</span>
                {dayTasks.length > 0 && (
                  <div className="flex flex-col items-center mt-1 gap-0.5">
                    <span className={`text-[10px] ${isSelected ? 'text-[#b8a98a]' : dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>{dayTasks.length} tasks</span>
                    <div className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {dayTasks.some(t => t.status === 'skipped') && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                      {dayTasks.some(t => t.status === 'pending') && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day tasks */}
      <div className={`mt-6 rounded-2xl border p-6 ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-white border-[#e8e0cc]'}`}>
        <h3 className={`text-lg font-bold mb-4 ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>
          {selected ? new Date(selected + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a day'}
        </h3>
        {selectedTasks.length === 0 ? (
          <p className={`text-sm ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>No tasks scheduled.</p>
        ) : (
          <div className="space-y-2">
            {selectedTasks.map(t => (
              <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${dm ? 'bg-[#1a1510]' : 'bg-[#f5f0e8]'}`}>
                {t.status === 'done' ? <Check size={16} className="text-green-500" /> : t.status === 'skipped' ? <X size={16} className="text-red-400" /> : <div className="w-4 h-4 rounded-full border-2 border-amber-400" />}
                <span className={`text-sm flex-1 ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'} ${t.status === 'done' ? 'line-through opacity-60' : ''}`}>{t.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${dm ? 'bg-[#2a2218] text-[#b8a98a]' : 'bg-gray-100 text-gray-600'}`}>{t.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
