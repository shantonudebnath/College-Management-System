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
    .maybeSingle();

  if (error) {
    if (error.message.includes('kv_store') || error.message.includes('permission')) tryInitTable();
    const raw = ls?.getItem(lk(key));
    return raw ? (JSON.parse(raw) as T) : null;
  }

  if (data) return data.value as T;
  // Table exists but no row yet — fall back to localStorage
  const raw = ls?.getItem(lk(key));
  return raw ? (JSON.parse(raw) as T) : null;
}

// Returns true if Supabase write succeeded, false if only localStorage saved
export async function kvSet(key: string, value: unknown): Promise<boolean> {
  ls?.setItem(lk(key), JSON.stringify(value));

  const { error } = await supabase
    .from('kv_store')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) {
    if (error.message.includes('kv_store') || error.message.includes('permission') || error.message.includes('42501') || error.message.includes('policy')) {
      tryInitTable();
      return false;
    }
    throw new Error(error.message);
  }
  return true;
}
