'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Fee, Waiver } from '@/lib/types';
import { kvGet, kvGetSync, kvSet } from '@/lib/supabase/kv';

const FEES_KEY = 'fees_data';
const WAIVERS_KEY = 'waivers_data';

interface FeesCtx {
  fees: Fee[];
  waivers: Waiver[];
  loading: boolean;
  upsertFee: (fee: Fee) => Promise<void>;
  deleteFee: (id: string) => Promise<void>;
  setFees: (fees: Fee[]) => Promise<void>;
  upsertWaiver: (waiver: Waiver) => Promise<void>;
  deleteWaiver: (id: string) => Promise<void>;
  setWaivers: (waivers: Waiver[]) => Promise<void>;
}

const Ctx = createContext<FeesCtx>({
  fees: [], waivers: [], loading: true,
  upsertFee: async () => {}, deleteFee: async () => {}, setFees: async () => {},
  upsertWaiver: async () => {}, deleteWaiver: async () => {}, setWaivers: async () => {},
});

export function FeesProvider({ children }: { children: ReactNode }) {
  const [fees, setFeesState] = useState<Fee[]>(kvGetSync<Fee[]>(FEES_KEY) ?? []);
  const [waivers, setWaiversState] = useState<Waiver[]>(kvGetSync<Waiver[]>(WAIVERS_KEY) ?? []);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const [feesData, waiversData] = await Promise.all([
      kvGet<Fee[]>(FEES_KEY),
      kvGet<Waiver[]>(WAIVERS_KEY),
    ]);
    setFeesState(feesData ?? []);
    setWaiversState(waiversData ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const upsertFee = async (fee: Fee) => {
    const updated = fees.find(f => f.id === fee.id)
      ? fees.map(f => f.id === fee.id ? fee : f)
      : [fee, ...fees];
    setFeesState(updated);
    await kvSet(FEES_KEY, updated);
  };

  const deleteFee = async (id: string) => {
    const updated = fees.filter(f => f.id !== id);
    setFeesState(updated);
    await kvSet(FEES_KEY, updated);
  };

  const setFees = async (updated: Fee[]) => {
    setFeesState(updated);
    await kvSet(FEES_KEY, updated);
  };

  const upsertWaiver = async (waiver: Waiver) => {
    const updated = waivers.find(w => w.id === waiver.id)
      ? waivers.map(w => w.id === waiver.id ? waiver : w)
      : [waiver, ...waivers];
    setWaiversState(updated);
    await kvSet(WAIVERS_KEY, updated);
  };

  const deleteWaiver = async (id: string) => {
    const updated = waivers.filter(w => w.id !== id);
    setWaiversState(updated);
    await kvSet(WAIVERS_KEY, updated);
  };

  const setWaivers = async (updated: Waiver[]) => {
    setWaiversState(updated);
    await kvSet(WAIVERS_KEY, updated);
  };

  return (
    <Ctx.Provider value={{ fees, waivers, loading, upsertFee, deleteFee, setFees, upsertWaiver, deleteWaiver, setWaivers }}>
      {children}
    </Ctx.Provider>
  );
}

export const useFees = () => useContext(Ctx);
