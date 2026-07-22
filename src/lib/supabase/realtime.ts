import type { RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from './client';

type Listener = () => void;

const kvListeners = new Map<string, Set<Listener>>();
const studentListeners = new Set<Listener>();
const teacherListeners = new Set<Listener>();
let kvChannel: RealtimeChannel | null = null;
let studChannel: RealtimeChannel | null = null;
let tchChannel: RealtimeChannel | null = null;

function initKv() {
  if (kvChannel || typeof window === 'undefined') return;
  kvChannel = createClient()
    .channel('rt_kv_store')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'kv_store' }, (payload) => {
      const key =
        (payload.new as { key?: string }).key ??
        (payload.old as { key?: string }).key;
      if (key) kvListeners.get(key)?.forEach(fn => fn());
    })
    .subscribe();
}

function initStudents() {
  if (studChannel || typeof window === 'undefined') return;
  studChannel = createClient()
    .channel('rt_students')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
      studentListeners.forEach(fn => fn());
    })
    .subscribe();
}

function initTeachers() {
  if (tchChannel || typeof window === 'undefined') return;
  tchChannel = createClient()
    .channel('rt_teachers')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'teachers' }, () => {
      teacherListeners.forEach(fn => fn());
    })
    .subscribe();
}

export function onKvChange(key: string, fn: Listener): () => void {
  if (typeof window === 'undefined') return () => {};
  if (!kvListeners.has(key)) kvListeners.set(key, new Set());
  kvListeners.get(key)!.add(fn);
  initKv();
  return () => { kvListeners.get(key)?.delete(fn); };
}

export function onStudentsChange(fn: Listener): () => void {
  if (typeof window === 'undefined') return () => {};
  studentListeners.add(fn);
  initStudents();
  return () => { studentListeners.delete(fn); };
}

export function onTeachersChange(fn: Listener): () => void {
  if (typeof window === 'undefined') return () => {};
  teacherListeners.add(fn);
  initTeachers();
  return () => { teacherListeners.delete(fn); };
}
