'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Fee, Waiver } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const FEES_CACHE = 'nim_fees_cache';
const WAIVERS_CACHE = 'nim_waivers_cache';

function readCache<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : []; } catch { return []; }
}
function writeCache(key: string, data: unknown[]) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

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

function feeToRow(f: Fee) {
  return {
    id: f.id, student_id: f.studentId, student_name: f.studentName,
    class: f.class, fee_type: f.feeType, amount: f.amount,
    discount: f.discount ?? 0, due_date: f.dueDate, paid_date: f.paidDate ?? null,
    status: f.status, receipt_no: f.receiptNo ?? null,
  };
}

function rowToFee(r: Record<string, unknown>): Fee {
  return {
    id: r.id as string, studentId: r.student_id as string, studentName: r.student_name as string,
    class: r.class as string, feeType: r.fee_type as string, amount: r.amount as number,
    discount: r.discount as number | undefined, dueDate: r.due_date as string,
    paidDate: r.paid_date as string | undefined, status: r.status as Fee['status'],
    receiptNo: r.receipt_no as string | undefined,
  };
}

function waiverToRow(w: Waiver) {
  return {
    id: w.id, student_id: w.studentId, student_name: w.studentName,
    class: w.class, waiver_type: w.waiverType, waiver_value: w.waiverValue,
    reason: w.reason, fee_types: w.feeTypes, applied_date: w.appliedDate, is_active: w.isActive,
  };
}

function rowToWaiver(r: Record<string, unknown>): Waiver {
  return {
    id: r.id as string, studentId: r.student_id as string, studentName: r.student_name as string,
    class: r.class as string, waiverType: r.waiver_type as Waiver['waiverType'],
    waiverValue: r.waiver_value as number, reason: r.reason as string,
    feeTypes: (r.fee_types as string[]) ?? [], appliedDate: r.applied_date as string,
    isActive: r.is_active as boolean,
  };
}

export function FeesProvider({ children }: { children: ReactNode }) {
  const cachedFees = readCache<Fee>(FEES_CACHE);
  const cachedWaivers = readCache<Waiver>(WAIVERS_CACHE);
  const [fees, setFeesState] = useState<Fee[]>(cachedFees);
  const [waivers, setWaiversState] = useState<Waiver[]>(cachedWaivers);
  const [loading, setLoading] = useState(cachedFees.length === 0);
  const supabase = createClient();

  const refetch = useCallback(async () => {
    if (fees.length === 0) setLoading(true);
    const [feesRes, waiversRes] = await Promise.all([
      supabase.from('fees').select('*').order('created_at', { ascending: false }),
      supabase.from('waivers').select('*'),
    ]);
    if (!feesRes.error && feesRes.data) {
      const mapped = feesRes.data.map(rowToFee);
      setFeesState(mapped);
      writeCache(FEES_CACHE, mapped);
    }
    if (!waiversRes.error && waiversRes.data) {
      const mapped = waiversRes.data.map(rowToWaiver);
      setWaiversState(mapped);
      writeCache(WAIVERS_CACHE, mapped);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  useEffect(() => { refetch(); }, [refetch]);

  const upsertFee = async (fee: Fee) => {
    setFeesState(prev => {
      const exists = prev.find(f => f.id === fee.id);
      return exists ? prev.map(f => f.id === fee.id ? fee : f) : [fee, ...prev];
    });
    await supabase.from('fees').upsert(feeToRow(fee));
  };

  const deleteFee = async (id: string) => {
    setFeesState(prev => prev.filter(f => f.id !== id));
    await supabase.from('fees').delete().eq('id', id);
  };

  const setFees = async (updated: Fee[]) => {
    setFeesState(updated);
    await supabase.from('fees').upsert(updated.map(feeToRow));
  };

  const upsertWaiver = async (waiver: Waiver) => {
    setWaiversState(prev => {
      const exists = prev.find(w => w.id === waiver.id);
      return exists ? prev.map(w => w.id === waiver.id ? waiver : w) : [waiver, ...prev];
    });
    await supabase.from('waivers').upsert(waiverToRow(waiver));
  };

  const deleteWaiver = async (id: string) => {
    setWaiversState(prev => prev.filter(w => w.id !== id));
    await supabase.from('waivers').delete().eq('id', id);
  };

  const setWaivers = async (updated: Waiver[]) => {
    setWaiversState(updated);
    await supabase.from('waivers').upsert(updated.map(waiverToRow));
  };

  return (
    <Ctx.Provider value={{ fees, waivers, loading, upsertFee, deleteFee, setFees, upsertWaiver, deleteWaiver, setWaivers }}>
      {children}
    </Ctx.Provider>
  );
}

export const useFees = () => useContext(Ctx);
