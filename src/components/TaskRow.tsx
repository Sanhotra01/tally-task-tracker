import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Check, X, Trash2 } from 'lucide-react';
import { Task, TaskStatus } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

interface TaskRowProps {
  task: Task;
  onStatus: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  darkMode: boolean;
  onFocusTime: (secs: number) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Programming: 'bg-purple-100 text-purple-700 border-purple-200',
  Reading: 'bg-blue-100 text-blue-700 border-blue-200',
  Health: 'bg-orange-100 text-orange-700 border-orange-200',
  Work: 'bg-sky-100 text-sky-700 border-sky-200',
  Learning: 'bg-green-100 text-green-700 border-green-200',
  Writing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  General: 'bg-gray-100 text-gray-700 border-gray-200',
};

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// DAY_LABELS is Mon–Sun (indices 0–6), JS getDay() is Sun=0..Sat=6
function getCheckedDays(scheduledDate: string): boolean[] {
  const d = new Date(scheduledDate + 'T12:00:00');
  const jsDay = d.getDay(); // 0=Sun, 1=Mon … 6=Sat
  const arrayIndex = jsDay === 0 ? 6 : jsDay - 1; // map to Mon=0…Sun=6
  return DAY_LABELS.map((_, i) => i === arrayIndex);
}


function pad(n: number) { return String(n).padStart(2, '0'); }

export default function TaskRow({ task, onStatus, onDelete, darkMode: dm, onFocusTime }: TaskRowProps) {
  const totalSecs = task.duration_minutes * 60;
  const [secsLeft, setSecsLeft] = useState(totalSecs);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const sessionStart = useRef<number | null>(null);

  const checkedDays = getCheckedDays(task.scheduled_date);

  useEffect(() => {
    if (running) {
      sessionStart.current = Date.now();
      intervalRef.current = window.setInterval(() => {
        setSecsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (sessionStart.current !== null) {
        const elapsed = Math.floor((Date.now() - sessionStart.current) / 1000);
        if (elapsed > 0) {
          supabase.from('focus_sessions').insert({ task_id: task.id, duration_seconds: elapsed });
          onFocusTime(elapsed);
        }
        sessionStart.current = null;
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const mins = Math.floor(secsLeft / 60);
  const secs = secsLeft % 60;
  const progress = ((totalSecs - secsLeft) / totalSecs) * 100;

  const catColor = CATEGORY_COLORS[task.category] ?? CATEGORY_COLORS.General;
  const dmCat = dm
    ? 'bg-[#2a2218] text-[#b8a98a] border-[#3a3020]'
    : catColor;

  const statusDotColor =
    task.status === 'done' ? 'bg-green-500' :
    task.status === 'skipped' ? 'bg-red-400' : 'bg-amber-400';

  return (
    <div className={`rounded-2xl border px-5 py-4 transition-all ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-white border-[#e8e0cc]'} ${task.status !== 'pending' ? 'opacity-75' : ''}`}>
      <div className="flex items-center gap-4">
        {/* Title + meta */}
        <div className="min-w-0 w-52 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDotColor}`} />
            <span className={`font-semibold text-sm ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'} ${task.status === 'done' ? 'line-through' : ''}`}>
              {task.title}
            </span>
          </div>
          <div className="flex items-center gap-2 pl-4">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${dmCat}`}>{task.category}</span>
          </div>
          <div className={`pl-4 mt-1 text-[11px] ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>
            Added {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &bull; {task.duration_minutes} min
          </div>
        </div>

        {/* Day checkboxes */}
        <div className="flex items-center gap-1.5">
          {DAY_LABELS.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className={`text-[9px] font-medium ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>{d}</span>
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                checkedDays[i]
                  ? task.status === 'skipped' && i === Math.min(Math.floor((Date.now() - new Date(task.created_at).getTime()) / 86400000), 4)
                    ? 'bg-red-100 border-red-300'
                    : 'bg-[#4a9a5a] border-[#4a9a5a]'
                  : dm ? 'border-[#3a3020]' : 'border-[#ddd0b5]'
              }`}>
                {checkedDays[i] && (
                  task.status === 'skipped' && i === Math.min(Math.floor((Date.now() - new Date(task.created_at).getTime()) / 86400000), 4)
                    ? <X size={11} className="text-red-500" />
                    : <Check size={11} className="text-white" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => setRunning(r => !r)}
            disabled={task.status !== 'pending'}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
              running
                ? 'border-[#4a9a5a] text-[#4a9a5a]'
                : dm ? 'border-[#3a3020] text-[#6b5c42] hover:border-[#e8d9b5] hover:text-[#e8d9b5]' : 'border-[#ddd0b5] text-[#8c7a5e] hover:border-[#2c2416] hover:text-[#2c2416]'
            } disabled:opacity-40`}
          >
            {running ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>

          <div className="w-20">
            <div className={`text-lg font-mono font-bold leading-none ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>
              {pad(mins)}:{pad(secs)}
            </div>
            <div className={`text-[10px] ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>remaining</div>
            <div className={`mt-1.5 h-1 rounded-full overflow-hidden ${dm ? 'bg-[#2a2218]' : 'bg-[#ede8dc]'}`}>
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => onStatus(task.id, task.status === 'done' ? 'pending' : 'done')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
              task.status === 'done'
                ? 'bg-[#4a9a5a] border-[#4a9a5a] text-white'
                : dm ? 'border-[#3a3020] text-[#6a9a7a] hover:bg-[#2a3a2a]' : 'border-[#b8d8be] text-[#4a9a5a] hover:bg-[#eaf4ec]'
            }`}
          >
            <Check size={12} />
            DONE
          </button>
          <button
            onClick={() => onStatus(task.id, task.status === 'skipped' ? 'pending' : 'skipped')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
              task.status === 'skipped'
                ? 'bg-red-500 border-red-500 text-white'
                : dm ? 'border-[#3a3020] text-[#9a5a5a] hover:bg-[#3a2a2a]' : 'border-[#e8b8b8] text-[#cc4444] hover:bg-[#fef0f0]'
            }`}
          >
            <X size={12} />
            SKIP
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className={`p-2 rounded-xl transition-colors ${dm ? 'text-[#6b5c42] hover:bg-[#2a2218] hover:text-[#e8d9b5]' : 'text-[#c0aa88] hover:bg-[#f5ede0] hover:text-[#2c2416]'}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
