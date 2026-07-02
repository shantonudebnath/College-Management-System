import { createClient } from './client';

const supabase = createClient();
let kvReady = false;
let initFlight: Promise<void> | null = null;

async function ensureKvStore(): Promise<void> {
  if (kvReady) return;
  if (initFlight) return initFlight;
  initFlight = fetch('/api/init-db', { method: 'POST' })
    .then(async r => {
      initFlight = null;
      if (r.ok) {
        await new Promise(res => setTimeout(res, 800));
        kvReady = true;
      }
    })
    .catch(() => { initFlight = null; });
  return initFlight;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from('kv_store')
    .select('value')
    .eq('key', key)
    .single();
  if (error) {
    if (error.message.includes('kv_store')) await ensureKvStore();
    return null;
  }
  if (!data) return null;
  return data.value as T;
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  const { error } = await supabase
    .from('kv_store')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) {
    if (error.message.includes('kv_store')) {
      await ensureKvStore();
      const { error: e2 } = await supabase
        .from('kv_store')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      if (e2) throw new Error(e2.message);
      return;
    }
    throw new Error(error.message);
  }
}
