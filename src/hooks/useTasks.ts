import { useState, useEffect, useCallback } from 'react';
import { supabase, Task, TaskStatus } from '@/lib/supabase';

export function useTasks(date: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('scheduled_date', date)
      .order('created_at', { ascending: true });

    if (!error && data) setTasks(data as Task[]);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string, category: string, durationMinutes: number) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, category, duration_minutes: durationMinutes, scheduled_date: date })
      .select()
      .single();
    if (!error && data) setTasks(prev => [...prev, data as Task]);
  };

  const updateStatus = async (id: string, status: TaskStatus) => {
    const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, loading, addTask, updateStatus, deleteTask, refetch: fetchTasks };
}

export function useAllTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('scheduled_date', { ascending: false });
    if (!error && data) setTasks(data as Task[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const updateStatus = async (id: string, status: TaskStatus) => {
    const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, loading, updateStatus, deleteTask, refetch: fetchTasks };
}
