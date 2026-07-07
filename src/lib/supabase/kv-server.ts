import { createClient } from '@supabase/supabase-js';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = ReturnType<typeof createClient<any, any, any>>;

// Singleton: reused across requests within the same lambda instance
let _client: AnyClient | null = null;

function adminClient(): AnyClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    // Service role key bypasses RLS; falls back to anon key (needs permissive RLS policy)
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    _client = createClient(url, key, { auth: { persistSession: false } }) as AnyClient;
  }
  return _client;
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
