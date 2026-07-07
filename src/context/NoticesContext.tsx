'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { NOTICES } from '@/lib/data';
import type { Notice } from '@/lib/types';
import { kvGet, kvSet } from '@/lib/supabase/kv';

const NOTICES_KEY = 'notices_data';

interface NoticesCtx {
  notices: Notice[];
  addNotice: (n: Notice) => Promise<boolean>;
  updateNotice: (n: Notice) => Promise<boolean>;
  deleteNotice: (id: string) => Promise<boolean>;
}

const Ctx = createContext<NoticesCtx>({
  notices: [],
  addNotice: async () => false,
  updateNotice: async () => false,
  deleteNotice: async () => false,
});

export function NoticesProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    kvGet<Notice[]>(NOTICES_KEY).then(data => {
      if (data !== null) {
        setNotices(data);
      } else {
        setNotices(NOTICES);
        kvSet(NOTICES_KEY, NOTICES);
      }
      setReady(true);
    });
  }, []);

  const addNotice = async (n: Notice): Promise<boolean> => {
    const updated = [n, ...notices];
    setNotices(updated);
    return kvSet(NOTICES_KEY, updated);
  };

  const updateNotice = async (n: Notice): Promise<boolean> => {
    const updated = notices.map(x => x.id === n.id ? n : x);
    setNotices(updated);
    return kvSet(NOTICES_KEY, updated);
  };

  const deleteNotice = async (id: string): Promise<boolean> => {
    const updated = notices.filter(n => n.id !== id);
    setNotices(updated);
    return kvSet(NOTICES_KEY, updated);
  };

  return (
    <Ctx.Provider value={{ notices, addNotice, updateNotice, deleteNotice }}>
      {children}
    </Ctx.Provider>
  );
}

export const useNotices = () => useContext(Ctx);
