import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useFocusTime(date: string) {
  const [totalSeconds, setTotalSeconds] = useState(0);

  const fetch = useCallback(async () => {
    const start = `${date}T00:00:00Z`;
    const end = `${date}T23:59:59Z`;
    const { data } = await supabase
      .from('focus_sessions')
      .select('duration_seconds')
      .gte('created_at', start)
      .lte('created_at', end);
    if (data) {
      const sum = data.reduce((acc, s) => acc + (s.duration_seconds ?? 0), 0);
      setTotalSeconds(sum);
    }
  }, [date]);

  useEffect(() => { fetch(); }, [fetch]);

  return { totalSeconds, refetch: fetch };
}

export function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('tasks')
        .select('scheduled_date, status')
        .eq('status', 'done')
        .order('scheduled_date', { ascending: false });

      if (!data || data.length === 0) { setStreak(0); return; }

      const doneDays = [...new Set(data.map(t => t.scheduled_date))].sort().reverse();
      let count = 0;
      const today = new Date();
      for (let i = 0; i < doneDays.length; i++) {
        const expected = new Date(today);
        expected.setDate(today.getDate() - i);
        const expectedStr = expected.toISOString().slice(0, 10);
        if (doneDays[i] === expectedStr) count++;
        else break;
      }
      setStreak(count);
    })();
  }, []);

  return streak;
}
