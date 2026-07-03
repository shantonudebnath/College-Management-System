const ls = typeof window !== 'undefined' ? window.localStorage : null;
const lk = (k: string) => `nim_kv_${k}`;

export async function kvGet<T>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`/api/kv?key=${encodeURIComponent(key)}`);
    if (res.ok) {
      const { value } = await res.json();
      if (value !== null && value !== undefined) return value as T;
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
