// ─────────────────────────────────────────────────────────────────────────────
// Supabase Query Helpers
// Centralized async functions for fetching data from Supabase.
// Each function returns { data, error } so callers can handle errors gracefully.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';
import type {
  DbVillage,
  DbLab,
  DbCategory,
  DbMaterialListItem,
  DbItemLot,
  DbPurchaseOrder,
  DbShelfLifeExtension,
  DbRegulatoryRecord,
  DbTransactionHistory,
} from './types';

// Generic helper type that matches Supabase's return signature
type QueryResult<T> = Promise<{ data: T[] | null; error: string | null }>;

// ─── Lookup Queries ───────────────────────────────────────────────────────────

/** Fetch all villages */
export async function fetchVillages(): QueryResult<DbVillage> {
  const { data, error } = await supabase
    .from('villages')
    .select('id, name, code')
    .order('name');
  return { data, error: error?.message ?? null };
}

/** Fetch all labs (optionally filtered by village) */
export async function fetchLabs(villageId?: string): QueryResult<DbLab> {
  let query = supabase
    .from('labs')
    .select('id, village_id, name, code, room, building')
    .order('name');
  if (villageId) {
    query = query.eq('village_id', villageId);
  }
  const { data, error } = await query;
  return { data, error: error?.message ?? null };
}

/** Fetch all categories */
export async function fetchCategories(): QueryResult<DbCategory> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');
  return { data, error: error?.message ?? null };
}

// ─── Material List ────────────────────────────────────────────────────────────

/**
 * Fetch all available items from the material_list_view.
 * This is used to populate the item selector in Order Request.
 */
export async function fetchMaterialList(): QueryResult<DbMaterialListItem> {
  const { data, error } = await supabase
    .from('material_list_view')
    .select('*')
    .order('name');
  return { data, error: error?.message ?? null };
}

// ─── Inventory / Lots ─────────────────────────────────────────────────────────

/**
 * Fetch item lots (checkin inventory).
 * Optionally filter by village_id.
 */
export async function fetchItemLots(villageId?: string): QueryResult<DbItemLot> {
  let query = supabase
    .from('item_lots')
    .select('*')
    .order('received_date', { ascending: false });
  if (villageId) {
    query = query.eq('village_id', villageId);
  }
  const { data, error } = await query;
  return { data, error: error?.message ?? null };
}

// ─── Purchase Orders ──────────────────────────────────────────────────────────

/**
 * Fetch purchase orders.
 * Optionally filter by village_id.
 */
export async function fetchPurchaseOrders(villageId?: string): QueryResult<DbPurchaseOrder> {
  let query = supabase
    .from('purchase_orders')
    .select('*')
    .order('request_date', { ascending: false });
  if (villageId) {
    query = query.eq('village_id', villageId);
  }
  const { data, error } = await query;
  return { data, error: error?.message ?? null };
}

// ─── Shelf Life Extensions ────────────────────────────────────────────────────

/**
 * Fetch shelf life extension requests.
 * Optionally filter by village_id.
 */
export async function fetchShelfLifeExtensions(villageId?: string): QueryResult<DbShelfLifeExtension> {
  let query = supabase
    .from('shelf_life_extensions')
    .select('*')
    .order('request_date', { ascending: false });
  if (villageId) {
    query = query.eq('village_id', villageId);
  }
  const { data, error } = await query;
  return { data, error: error?.message ?? null };
}

// ─── Regulatory Records ───────────────────────────────────────────────────────

/**
 * Fetch regulatory compliance records.
 * Optionally filter by village_id.
 */
export async function fetchRegulatoryRecords(villageId?: string): QueryResult<DbRegulatoryRecord> {
  let query = supabase
    .from('regulatory_records')
    .select('*')
    .order('item_name');
  if (villageId) {
    query = query.eq('village_id', villageId);
  }
  const { data, error } = await query;
  return { data, error: error?.message ?? null };
}

// ─── Transaction History ──────────────────────────────────────────────────────

/**
 * Fetch transaction history records.
 * Optionally filter by village_id.
 */
export async function fetchTransactionHistory(villageId?: string): QueryResult<DbTransactionHistory> {
  let query = supabase
    .from('transaction_history')
    .select('*')
    .order('transaction_date', { ascending: false });
  if (villageId) {
    query = query.eq('village_id', villageId);
  }
  const { data, error } = await query;
  return { data, error: error?.message ?? null };
}
