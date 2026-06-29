'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { NOTICES } from '@/lib/data';
import type { Notice } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface NoticesCtx {
  notices: Notice[];
  addNotice: (n: Notice) => void;
  updateNotice: (n: Notice) => void;
  deleteNotice: (id: string) => void;
}

const Ctx = createContext<NoticesCtx>({
  notices: NOTICES,
  addNotice: () => {},
  updateNotice: () => {},
  deleteNotice: () => {},
});

function mapRow(row: Record<string, unknown>): Notice {
  return {
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    date: row.date as string,
    type: row.type as Notice['type'],
    target: row.target as Notice['target'],
    isImportant: row.is_important as boolean,
    postedBy: row.posted_by as string,
    attachmentName: row.attachment_name as string | undefined,
    attachmentData: row.attachment_data as string | undefined,
  };
}

export function NoticesProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>(NOTICES);
  const [ready, setReady] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setNotices(data.map(mapRow));
        }
        setReady(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNotice = async (n: Notice) => {
    const { error } = await supabase.from('notices').insert({
      id: n.id,
      title: n.title,
      content: n.content,
      date: n.date,
      type: n.type,
      target: n.target,
      is_important: n.isImportant,
      posted_by: n.postedBy,
      attachment_name: n.attachmentName ?? null,
      attachment_data: n.attachmentData ?? null,
    });
    if (!error) setNotices(prev => [n, ...prev]);
  };

  const updateNotice = async (n: Notice) => {
    const { error } = await supabase.from('notices').update({
      title: n.title, content: n.content, type: n.type, target: n.target,
      is_important: n.isImportant,
      attachment_name: n.attachmentName ?? null,
      attachment_data: n.attachmentData ?? null,
    }).eq('id', n.id);
    if (!error) setNotices(prev => prev.map(x => x.id === n.id ? n : x));
  };

  const deleteNotice = async (id: string) => {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (!error) setNotices(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Ctx.Provider value={{ notices: ready ? notices : NOTICES, addNotice, updateNotice, deleteNotice }}>
      {children}
    </Ctx.Provider>
  );
}

export const useNotices = () => useContext(Ctx);
