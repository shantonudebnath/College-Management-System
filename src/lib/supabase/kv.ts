const ls = typeof window !== 'undefined' ? window.localStorage : null;
const lk = (k: string) => `nim_kv_${k}`;

// Synchronous read from localStorage — returns instantly, no network
export function kvGetSync<T>(key: string): T | null {
  try {
    const raw = ls?.getItem(lk(key));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch { return null; }
}

export async function kvGet<T>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`/api/kv?key=${encodeURIComponent(key)}`);
    if (res.ok) {
      const { value } = await res.json();
      if (value !== null && value !== undefined) {
        ls?.setItem(lk(key), JSON.stringify(value));
        return value as T;
      }
      // Supabase returned null — only clear local cache if local is also null/absent
      // (prevents data loss when a kvSet POST failed silently)
      const localRaw = ls?.getItem(lk(key));
      if (!localRaw || localRaw === 'null') {
        ls?.removeItem(lk(key));
        return null;
      }
      // Local has data but Supabase doesn't — trust local, re-sync to Supabase
      const localVal = JSON.parse(localRaw) as T;
      if (localVal !== null && localVal !== undefined) {
        fetch('/api/kv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: localVal }),
        }).catch(() => {});
        return localVal;
      }
      ls?.removeItem(lk(key));
      return null;
    }
  } catch {}
  // Fallback: localStorage (offline or API error)
  const raw = ls?.getItem(lk(key));
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function kvSet(key: string, value: unknown): Promise<boolean> {
  // Always save locally so data is never lost
  ls?.setItem(lk(key), JSON.stringify(value));

  try {
    const res = await fetch('/api/kv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
