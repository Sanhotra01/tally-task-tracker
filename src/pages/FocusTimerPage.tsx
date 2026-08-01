import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FocusTimerPageProps {
  darkMode: boolean;
}

type Mode = 'focus' | 'break';
const DURATIONS: Record<Mode, number> = { focus: 25 * 60, break: 5 * 60 };

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function FocusTimerPage({ darkMode: dm }: FocusTimerPageProps) {
  const [mode, setMode] = useState<Mode>('focus');
  const [secsLeft, setSecsLeft] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSecsLeft(s => {
          if (s <= 1) {
            if (mode === 'focus') {
              supabase.from('focus_sessions').insert({ duration_seconds: DURATIONS.focus });
              setCycles(c => c + 1);
              setMode('break');
              return DURATIONS.break;
            } else {
              setMode('focus');
              return DURATIONS.focus;
            }
          }
          return s - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode]);

  const reset = () => {
    setRunning(false);
    setSecsLeft(DURATIONS[mode]);
  };

  const switchMode = (m: Mode) => {
    setRunning(false);
    setMode(m);
    setSecsLeft(DURATIONS[m]);
  };

  const mins = Math.floor(secsLeft / 60);
  const secs = secsLeft % 60;
  const total = DURATIONS[mode];
  const progress = ((total - secsLeft) / total) * 100;

  const color = mode === 'focus' ? '#2c2416' : '#4a9a5a';

  return (
    <div className="p-6 flex flex-col items-center">
      {/* Mode toggle */}
      <div className={`flex rounded-xl p-1 mb-8 ${dm ? 'bg-[#221d14]' : 'bg-[#ede8dc]'}`}>
        <button
          onClick={() => switchMode('focus')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            mode === 'focus' ? 'bg-[#2c2416] text-[#e8d9b5]' : dm ? 'text-[#9c8a6a]' : 'text-[#6b5c42]'
          }`}
        >
          <Brain size={15} /> Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            mode === 'break' ? 'bg-[#4a9a5a] text-white' : dm ? 'text-[#9c8a6a]' : 'text-[#6b5c42]'
          }`}
        >
          <Coffee size={15} /> Break
        </button>
      </div>

      {/* Timer ring */}
      <div className="relative w-80 h-80 mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" strokeWidth="6" className={dm ? 'stroke-[#221d14]' : 'stroke-[#ede8dc]'} />
          <circle
            cx="100" cy="100" r="90" fill="none" strokeWidth="6" stroke={color} strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            className="transition-all"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-6xl font-mono font-bold ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>
            {pad(mins)}:{pad(secs)}
          </span>
          <span className={`text-sm uppercase tracking-widest mt-2 ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>
            {mode === 'focus' ? 'Focus Time' : 'Break Time'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setRunning(r => !r)}
          className="w-16 h-16 rounded-full bg-[#2c2416] text-[#e8d9b5] flex items-center justify-center hover:bg-[#3d3020] transition-colors shadow-lg"
        >
          {running ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <button
          onClick={reset}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${dm ? 'border-[#3a3020] text-[#9c8a6a] hover:border-[#e8d9b5] hover:text-[#e8d9b5]' : 'border-[#ddd0b5] text-[#8c7a5e] hover:border-[#2c2416] hover:text-[#2c2416]'}`}
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Cycles */}
      <div className={`rounded-2xl border px-8 py-4 text-center ${dm ? 'bg-[#221d14] border-[#3a3020]' : 'bg-white border-[#e8e0cc]'}`}>
        <p className={`text-xs uppercase tracking-widest mb-1 ${dm ? 'text-[#6b5c42]' : 'text-[#a89878]'}`}>Completed Cycles</p>
        <p className={`text-3xl font-bold ${dm ? 'text-[#e8d9b5]' : 'text-[#2c2416]'}`}>{cycles}</p>
      </div>
    </div>
  );
}
