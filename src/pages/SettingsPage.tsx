import { useState } from 'react';
import { User as UserIcon, Moon, Sun, Type, Palette, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface SettingsPageProps {
  user: User;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsPage({ user, darkMode, onToggleDarkMode }: SettingsPageProps) {
  const [notif, setNotif] = useState(true);
  const [sound, setSound] = useState(false);

  const dm = darkMode;
  const card = `rounded-2xl border p-6 ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-white border-[#e8e0cc]'}`;
  const label = `text-sm font-semibold ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`;
  const sub = `text-xs ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`;

  return (
    <div className="p-6 max-w-2xl space-y-4">
      {/* Profile */}
      <div className={card}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#2c2416] text-[#e8d9b5] flex items-center justify-center text-2xl font-bold">
            {(user.email ?? 'U').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h3 className={label}>{user.email}</h3>
            <p className={sub}>Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className={card}>
        <div className="flex items-center gap-2 mb-4">
          <Palette size={16} className={dm ? 'text-[#9c8a6a]' : 'text-[#8c7a5e]'} />
          <h3 className={label}>Appearance</h3>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {dm ? <Moon size={16} className="text-[#9c8a6a]" /> : <Sun size={16} className="text-[#8c7a5e]" />}
            <div>
              <p className={label}>Dark Mode</p>
              <p className={sub}>Switch between light and dark themes</p>
            </div>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${dm ? 'bg-[#e8d9b5]' : 'bg-[#c8b898]'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform ${dm ? 'bg-[#2c2416] translate-x-6' : 'bg-white translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className={card}>
        <div className="flex items-center gap-2 mb-4">
          <Type size={16} className={dm ? 'text-[#9c8a6a]' : 'text-[#8c7a5e]'} />
          <h3 className={label}>Notifications</h3>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className={label}>Task Reminders</p>
            <p className={sub}>Get notified about pending tasks</p>
          </div>
          <button
            onClick={() => setNotif(!notif)}
            className={`relative w-12 h-6 rounded-full transition-colors ${notif ? 'bg-[#2c2416]' : dm ? 'bg-[#3a3020]' : 'bg-[#ddd0b5]'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notif ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className={label}>Timer Sound</p>
            <p className={sub}>Play sound when timer ends</p>
          </div>
          <button
            onClick={() => setSound(!sound)}
            className={`relative w-12 h-6 rounded-full transition-colors ${sound ? 'bg-[#2c2416]' : dm ? 'bg-[#3a3020]' : 'bg-[#ddd0b5]'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${sound ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Account */}
      <div className={card}>
        <div className="flex items-center gap-2 mb-4">
          <UserIcon size={16} className={dm ? 'text-[#9c8a6a]' : 'text-[#8c7a5e]'} />
          <h3 className={label}>Account</h3>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
