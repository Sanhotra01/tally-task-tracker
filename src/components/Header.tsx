import { ChevronLeft, ChevronRight, Search, Bell, Menu } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
  search: string;
  onSearch: (v: string) => void;
  notifications: number;
  user: User;
  darkMode: boolean;
  onOpenMenu: () => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(d: Date) {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatDateShort(d: Date) {
  return `${DAYS_SHORT[d.getDay()]}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

export default function Header({ date, onPrev, onNext, search, onSearch, notifications, user, darkMode: dm, onOpenMenu }: HeaderProps) {
  const initials = (user.email ?? 'U').slice(0, 1).toUpperCase();

  return (
    <header className={`flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b ${dm ? 'bg-[#1a1510] border-[#2a2218]' : 'bg-[#fdfaf4] border-[#ddd0b5]'}`}>
      {/* Hamburger + Date nav */}
      <div className="flex items-center gap-1 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMenu}
          className={`md:hidden p-1.5 rounded-lg transition-colors flex-shrink-0 ${dm ? 'hover:bg-[#2a2218] text-[#9c8a6a]' : 'hover:bg-[#ede8dc] text-[#8c7a5e]'}`}
        >
          <Menu size={20} />
        </button>
        <button onClick={onPrev} className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${dm ? 'hover:bg-[#2a2218] text-[#9c8a6a]' : 'hover:bg-[#ede8dc] text-[#8c7a5e]'}`}>
          <ChevronLeft size={18} />
        </button>
        <span className={`text-sm sm:text-base font-semibold truncate ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>
          <span className="hidden sm:inline">{formatDate(date)}</span>
          <span className="sm:hidden">{formatDateShort(date)}</span>
        </span>
        <button onClick={onNext} className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${dm ? 'hover:bg-[#2a2218] text-[#9c8a6a]' : 'hover:bg-[#ede8dc] text-[#8c7a5e]'}`}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3 order-3 sm:order-none w-full sm:w-auto">
        {/* Search */}
        <div className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 sm:flex-none ${dm ? 'bg-[#221d14] border-[#3a3020] text-[#b8a98a]' : 'bg-white border-[#ddd0b5] text-[#8c7a5e]'}`}>
          <Search size={14} className="flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search tasks..."
            className={`text-sm bg-transparent outline-none w-full sm:w-44 ${dm ? 'text-[#e8d9b5] placeholder-[#6b5c42]' : 'text-[#2c2416] placeholder-[#b8a98a]'}`}
          />
        </div>

        {/* Bell */}
        <div className="relative flex-shrink-0">
          <button className={`p-2 rounded-xl transition-colors ${dm ? 'hover:bg-[#2a2218] text-[#b8a98a]' : 'hover:bg-[#ede8dc] text-[#6b5c42]'}`}>
            <Bell size={18} />
          </button>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#2c2416] text-[#e8d9b5] text-[10px] font-bold flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#2c2416] text-[#e8d9b5] flex items-center justify-center font-bold text-sm flex-shrink-0">
          {initials}
        </div>
      </div>
    </header>
  );
}
