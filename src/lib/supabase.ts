import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TaskStatus = 'pending' | 'done' | 'skipped';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  category: string;
  duration_minutes: number;
  status: TaskStatus;
  scheduled_date: string;
  created_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  task_id: string | null;
  duration_seconds: number;
  created_at: string;
}
