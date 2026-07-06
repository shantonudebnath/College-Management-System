import { createClient } from '@supabase/supabase-js';

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Service role key bypasses RLS; falls back to anon key (needs permissive RLS policy)
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function kvGet(key: string): Promise<unknown> {
  const { data, error } = await adminClient()
    .from('kv_store')
    .select('value')
    .eq('key', key)
    .single();
  if (error) return null;
  return data?.value ?? null;
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  await adminClient()
    .from('kv_store')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
}
