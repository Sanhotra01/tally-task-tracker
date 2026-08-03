import { useState } from 'react';
import { Plus, ChevronDown, PenLine } from 'lucide-react';
import { Task, TaskStatus } from '@/lib/supabase';
import TaskRow from '@/components/TaskRow';

const CATEGORIES = ['General', 'Programming', 'Reading', 'Health', 'Work', 'Learning', 'Writing'];
const DURATIONS = [15, 25, 30, 45, 60, 90, 120];

type Filter = 'all' | 'pending' | 'done' | 'skipped';
type SortKey = 'created' | 'title' | 'duration';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (title: string, cat: string, dur: number) => void;
  onStatus: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  search: string;
  darkMode: boolean;
  onFocusTime: (secs: number) => void;
}

export default function TaskList({ tasks, onAddTask, onStatus, onDelete, search, darkMode: dm, onFocusTime }: TaskListProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [duration, setDuration] = useState(60);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<SortKey>('created');
  const [showCatDrop, setShowCatDrop] = useState(false);

  const handleAdd = () => {
    if (!title.trim()) return;
    onAddTask(title.trim(), category, duration);
    setTitle('');
  };

  const filtered = tasks
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'duration') return b.duration_minutes - a.duration_minutes;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    done: tasks.filter(t => t.status === 'done').length,
    skipped: tasks.filter(t => t.status === 'skipped').length,
  };

  const inp = `px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${dm ? 'bg-[#221d14] border-[#3a3020] text-[#e8d9b5] placeholder-[#6b5c42] focus:border-[#e8d9b5]' : 'bg-white border-[#ddd0b5] text-[#2c2416] placeholder-[#b8a98a] focus:border-[#2c2416]'}`;

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'pending', label: `Pending (${counts.pending})` },
    { key: 'done', label: `Done (${counts.done})` },
    { key: 'skipped', label: `Skipped (${counts.skipped})` },
  ];

  return (
    <div className="space-y-4">
      {/* Add Task Input */}
      <div className={`rounded-2xl border p-4 flex flex-wrap items-center gap-3 ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-white border-[#e8e0cc]'}`}>
        <PenLine size={16} className={`hidden sm:block flex-shrink-0 ${dm ? 'text-[#6b5c42]' : 'text-[#b8a98a]'}`} />
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a task to the ledger..."
          className={`flex-1 min-w-[140px] text-sm bg-transparent outline-none ${dm ? 'text-[#e8d9b5] placeholder-[#6b5c42]' : 'text-[#2c2416] placeholder-[#b8a98a]'}`}
        />

        {/* Category dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCatDrop(!showCatDrop)}
            className={`flex items-center gap-1.5 text-xs ${inp} py-2`}
          >
            {category}
            <ChevronDown size={12} />
          </button>
          {showCatDrop && (
            <div className={`absolute right-0 top-full mt-1 w-36 rounded-xl border shadow-lg z-10 py-1 ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-white border-[#ddd0b5]'}`}>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => { setCategory(c); setShowCatDrop(false); }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${dm ? 'text-[#b8a98a] hover:bg-[#2a2218]' : 'text-[#6b5c42] hover:bg-[#f5ede0]'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="relative">
          <select
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            className={`${inp} py-2 appearance-none pr-7 cursor-pointer`}
          >
            {DURATIONS.map(d => <option key={d} value={d}>{d} min</option>)}
          </select>
          <ChevronDown size={12} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${dm ? 'text-[#6b5c42]' : 'text-[#b8a98a]'}`} />
        </div>

        <button
          onClick={handleAdd}
          disabled={!title.trim()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2c2416] text-[#e8d9b5] rounded-xl text-sm font-semibold hover:bg-[#3d3020] transition-colors disabled:opacity-40 w-full sm:w-auto"
        >
          <Plus size={15} />
          ADD TASK
        </button>
      </div>

      {/* Filters + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-[#2c2416] text-[#e8d9b5]'
                  : dm ? 'text-[#9c8a6a] hover:bg-[#2a2218]' : 'text-[#6b5c42] border border-[#ddd0b5] hover:bg-[#f0ead8]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>Sort by:</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className={`text-xs px-3 py-1.5 rounded-lg border outline-none ${dm ? 'bg-[#221d14] border-[#3a3020] text-[#b8a98a]' : 'bg-white border-[#ddd0b5] text-[#6b5c42]'}`}
          >
            <option value="created">Created</option>
            <option value="title">Title</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className={`text-center py-12 text-sm ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>
            {search ? 'No tasks match your search.' : 'No tasks yet — add one above!'}
          </div>
        ) : (
          filtered.map(t => (
            <TaskRow
              key={t.id}
              task={t}
              onStatus={onStatus}
              onDelete={onDelete}
              darkMode={dm}
              onFocusTime={onFocusTime}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {tasks.length > 0 && (
        <div className={`rounded-2xl border px-4 sm:px-6 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-white border-[#e8e0cc]'}`}>
          <div className={`flex items-center gap-2 ${dm ? 'text-[#9c8a6a]' : 'text-[#6b5c42]'}`}>
            <span>Total Tasks: {tasks.length}</span>
          </div>
          <div className="flex items-center gap-2 text-[#4a9a5a]">
            <span>Completed: {counts.done}</span>
          </div>
          <div className="flex items-center gap-2 text-[#cc4444]">
            <span>Skipped: {counts.skipped}</span>
          </div>
          <div className="sm:ml-auto flex items-center gap-2 text-[#4466aa]">
            <span>Completion Rate: {tasks.length > 0 ? Math.round((counts.done / tasks.length) * 100) : 0}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
