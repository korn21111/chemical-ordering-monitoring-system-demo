// ─────────────────────────────────────────────────────────────────────────────
// Supabase DB Types
// These mirror the actual database table shapes (snake_case column names).
// Keep these separate from the mockData.ts types to avoid confusion.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Lookup Tables ────────────────────────────────────────────────────────────

export interface DbVillage {
  id: string;
  name: string;
  code: string;
}

export interface DbLab {
  id: string;
  village_id: string;
  name: string;
  code: string;
  room?: string;
  building?: string;
}

export interface DbCategory {
  id: string;
  name: string;
}

// ─── Items / Material List ────────────────────────────────────────────────────

/** Comes from the `material_list_view` view in Supabase */
export interface DbMaterialListItem {
  id: string;
  name: string;
  cas_number?: string;
  category?: string;
  category_id?: string;
  unit?: string;
  is_peroxide?: boolean;
  is_regulated?: boolean;
  cylinder_id?: string;
  min_stock?: number;
  vendor_id?: string;
  vendor_name?: string;
}

// ─── Inventory Lots ───────────────────────────────────────────────────────────

export interface DbItemLot {
  id: string;
  item_id: string;
  item_name?: string;
  category?: string;
  lot_number: string;
  purchase_order_id?: string;
  village_id?: string;
  lab_id?: string;
  lab_name?: string;
  received_quantity: number;
  remaining_quantity: number;
  unit?: string;
  received_date?: string;
  expiry_date?: string;
  received_by?: string;
  is_peroxide?: boolean;
}

// ─── Purchase Orders ──────────────────────────────────────────────────────────

export interface DbPurchaseOrder {
  id: string;
  po_number?: string;
  item_id?: string;
  item_name?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  purpose?: string;
  requester?: string;
  request_date?: string;
  status?: string;
  village_id?: string;
  lab_id?: string;
  lab_name?: string;
  approver?: string;
  approve_date?: string;
  reject_reason?: string;
}

// ─── Shelf Life Extensions ────────────────────────────────────────────────────

export interface DbShelfLifeExtension {
  id: string;
  lot_id?: string;
  item_name?: string;
  category?: string;
  lot_number?: string;
  lab_name?: string;
  village_id?: string;
  old_expiry_date?: string;
  new_expiry_date?: string;
  reason?: string;
  requested_by?: string;
  approved_by?: string;
  status?: string;
  request_date?: string;
  review_date?: string;
  reject_reason?: string;
}

// ─── Regulatory Records ───────────────────────────────────────────────────────

export interface DbRegulatoryRecord {
  id: string;
  item_name?: string;
  item_code?: string;
  category?: string;
  regulation_type?: string;
  regulation_code?: string;
  lab_name?: string;
  village_id?: string;
  status?: string;
  effective_date?: string;
  expiry_date?: string;
  description?: string;
  is_controlled?: boolean;
  linked_lot_ids?: string[];
}

// ─── Transaction History ──────────────────────────────────────────────────────

export interface DbTransactionHistory {
  id: string;
  type?: string;
  item_name?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  user_name?: string;
  transaction_date?: string;
  related_id?: string;
  status?: string;
  remarks?: string;
  lab_name?: string;
  village_id?: string;
}
