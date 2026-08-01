import { BookOpen, Home, Calendar, List, BarChart2, Tag, Clock, Settings, Moon, Sun } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type Page = 'today' | 'calendar' | 'all-tasks' | 'analytics' | 'categories' | 'focus-timer' | 'settings';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (p: Page) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  user: User;
}

const navItems: { id: Page; label: string; Icon: React.ElementType }[] = [
  { id: 'today', label: 'Today', Icon: Home },
  { id: 'calendar', label: 'Calendar', Icon: Calendar },
  { id: 'all-tasks', label: 'All Tasks', Icon: List },
  { id: 'analytics', label: 'Analytics', Icon: BarChart2 },
  { id: 'categories', label: 'Categories', Icon: Tag },
  { id: 'focus-timer', label: 'Focus Timer', Icon: Clock },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

const QUOTES = [
  { text: 'Small progress is still progress.', sub: 'Keep going!' },
  { text: 'Done is better than perfect.', sub: 'Ship it!' },
  { text: 'One task at a time.', sub: 'Stay focused!' },
  { text: 'Consistency beats intensity.', sub: 'Show up daily!' },
];

const quote = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];

export default function Sidebar({ currentPage, onNavigate, darkMode, onToggleDarkMode }: SidebarProps) {
  const dm = darkMode;

  return (
    <aside className={`w-60 flex-shrink-0 flex flex-col h-screen border-r ${dm ? 'bg-[#1a1510] border-[#2a2218] text-[#e8d9b5]' : 'bg-[#f0ead8] border-[#ddd0b5] text-[#2c2416]'}`}>
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 text-center border-b border-current/10">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${dm ? 'bg-[#e8d9b5]' : 'bg-[#2c2416]'}`}>
          <BookOpen size={22} className={dm ? 'text-[#2c2416]' : 'text-[#e8d9b5]'} />
        </div>
        <h1 className="text-3xl font-bold tracking-widest font-serif">TALLY</h1>
        <p className={`text-[10px] tracking-widest mt-1 uppercase leading-relaxed ${dm ? 'text-[#9c8a6a]' : 'text-[#8c7a5e]'}`}>
          A Ledger for the Work<br />You Mean to Do
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, Icon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? dm ? 'bg-[#e8d9b5] text-[#2c2416]' : 'bg-[#2c2416] text-[#e8d9b5]'
                  : dm ? 'text-[#b8a98a] hover:bg-[#2a2218] hover:text-[#e8d9b5]' : 'text-[#6b5c42] hover:bg-[#e4dcc8] hover:text-[#2c2416]'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Quote */}
      <div className={`mx-3 mb-3 p-4 rounded-xl border ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-[#fdfaf4] border-[#ddd0b5]'}`}>
        <div className={`text-lg font-serif text-center mb-1 ${dm ? 'text-[#9c8a6a]' : 'text-[#8c7a5e]'}`}>"</div>
        <p className={`text-sm font-serif text-center leading-snug ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>{quote.text}</p>
        <div className={`border-t my-2 ${dm ? 'border-[#3a3020]' : 'border-[#ddd0b5]'}`} />
        <p className={`text-xs text-center ${dm ? 'text-[#9c8a6a]' : 'text-[#8c7a5e]'}`}>{quote.sub}</p>
      </div>

      {/* Dark mode toggle */}
      <div className={`mx-3 mb-4 px-4 py-3 rounded-xl border flex items-center justify-between ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-[#fdfaf4] border-[#ddd0b5]'}`}>
        <div className="flex items-center gap-2">
          {dm ? <Moon size={14} className="text-[#9c8a6a]" /> : <Sun size={14} className="text-[#8c7a5e]" />}
          <span className={`text-xs font-medium ${dm ? 'text-[#b8a98a]' : 'text-[#6b5c42]'}`}>
            {dm ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>
        <button
          onClick={onToggleDarkMode}
          className={`relative w-11 h-6 rounded-full transition-colors ${dm ? 'bg-[#e8d9b5]' : 'bg-[#c8b898]'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform ${dm ? 'bg-[#2c2416] translate-x-5' : 'bg-[#fdfaf4] translate-x-0.5'}`} />
        </button>
      </div>

      {/* Sign out */}
      <button
        onClick={() => supabase.auth.signOut()}
        className={`mx-3 mb-4 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${dm ? 'text-[#9c8a6a] hover:bg-[#2a2218]' : 'text-[#8c7a5e] hover:bg-[#e4dcc8]'}`}
      >
        Sign Out
      </button>
    </aside>
  );
}
