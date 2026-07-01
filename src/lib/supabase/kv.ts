import { createClient } from './client';

const supabase = createClient();

export async function kvGet<T>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from('kv_store')
    .select('value')
    .eq('key', key)
    .single();
  if (error || !data) return null;
  return data.value as T;
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  const { error } = await supabase.from('kv_store').upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}
