import { CheckCircle2, XCircle, Flame, Clock } from 'lucide-react';

interface StatsRowProps {
  done: number;
  total: number;
  skipped: number;
  streak: number;
  focusSeconds: number;
  darkMode: boolean;
}

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function StatsRow({ done, total, skipped, streak, focusSeconds, darkMode: dm }: StatsRowProps) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const hrs = Math.floor(focusSeconds / 3600);
  const mins = Math.floor((focusSeconds % 3600) / 60);

  const card = `rounded-2xl border p-4 sm:p-5 flex gap-3 sm:gap-4 items-center lg:flex-1 ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-white border-[#e8e0cc]'}`;
  const iconWrap = 'w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0';
  const bigNum = `text-2xl sm:text-3xl font-bold leading-none ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`;

  return (
    <div className="grid grid-cols-2 lg:flex gap-3 sm:gap-4">
      <div className={card}>
        <div className={`${iconWrap} ${dm ? 'border-[#3a7a4a]' : 'border-[#4a9a5a]'}`}>
          <CheckCircle2 size={22} className="text-[#4a9a5a]" />
        </div>
        <div className="min-w-0">
          <p className={`text-[10px] font-semibold tracking-widest uppercase mb-1 truncate ${dm ? 'text-[#6a8a6a]' : 'text-[#4a9a5a]'}`}>Done Today</p>
          <p className={bigNum}>{done} <span className={`text-sm font-normal ${dm ? 'text-[#9c8a6a]' : 'text-[#8c7a5e]'}`}>tasks</span></p>
          <p className={`text-xs mt-1 ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>{pct}% of total</p>
        </div>
      </div>

      <div className={card}>
        <div className={`${iconWrap} ${dm ? 'border-[#8a3a3a]' : 'border-[#cc4444]'}`}>
          <XCircle size={22} className="text-[#cc4444]" />
        </div>
        <div className="min-w-0">
          <p className={`text-[10px] font-semibold tracking-widest uppercase mb-1 truncate ${dm ? 'text-[#8a4a4a]' : 'text-[#cc4444]'}`}>Skipped Today</p>
          <p className={bigNum}>{skipped} <span className={`text-sm font-normal ${dm ? 'text-[#9c8a6a]' : 'text-[#8c7a5e]'}`}>tasks</span></p>
        </div>
      </div>

      <div className={card}>
        <div className={`${iconWrap} ${dm ? 'border-[#8a6a2a]' : 'border-[#cc8844]'}`}>
          <Flame size={22} className="text-[#cc8844]" />
        </div>
        <div className="min-w-0">
          <p className={`text-[10px] font-semibold tracking-widest uppercase mb-1 truncate ${dm ? 'text-[#8a7a3a]' : 'text-[#cc8844]'}`}>Current Streak</p>
          <p className={bigNum}>{streak} <span className={`text-sm font-normal ${dm ? 'text-[#9c8a6a]' : 'text-[#8c7a5e]'}`}>days</span></p>
          <p className={`text-xs mt-1 ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>Keep it up!</p>
        </div>
      </div>

      <div className={card}>
        <div className={`${iconWrap} ${dm ? 'border-[#3a5a8a]' : 'border-[#4466aa]'}`}>
          <Clock size={22} className="text-[#4466aa]" />
        </div>
        <div className="min-w-0">
          <p className={`text-[10px] font-semibold tracking-widest uppercase mb-1 truncate ${dm ? 'text-[#4a6a9a]' : 'text-[#4466aa]'}`}>Focus Time</p>
          <p className={bigNum}>
            {pad(hrs)}<span className="text-sm">h</span> {pad(mins)}<span className="text-sm">m</span>
          </p>
          <p className={`text-xs mt-1 ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>Today</p>
        </div>
      </div>
    </div>
  );
}
