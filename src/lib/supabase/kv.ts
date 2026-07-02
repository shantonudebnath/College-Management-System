import { createClient } from './client';

const supabase = createClient();
const ls = typeof window !== 'undefined' ? window.localStorage : null;
const lk = (k: string) => `nim_kv_${k}`;

let initFlight: Promise<void> | null = null;
let tableOk = false;

function tryInitTable(): void {
  if (tableOk || initFlight) return;
  initFlight = fetch('/api/init-db', { method: 'POST' })
    .then(async r => {
      if (r.ok) { await new Promise(x => setTimeout(x, 800)); tableOk = true; }
      initFlight = null;
    })
    .catch(() => { initFlight = null; });
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from('kv_store')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    if (error.message.includes('kv_store')) tryInitTable();
    // Fall back to localStorage for any read error (table missing, row not found, etc.)
    const raw = ls?.getItem(lk(key));
    return raw ? (JSON.parse(raw) as T) : null;
  }

  return data ? (data.value as T) : null;
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  // Always write locally first so data is never lost
  ls?.setItem(lk(key), JSON.stringify(value));

  const { error } = await supabase
    .from('kv_store')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) {
    if (error.message.includes('kv_store')) {
      tryInitTable(); // attempt to create table in background
      return; // data is safe in localStorage
    }
    throw new Error(error.message);
  }
}
