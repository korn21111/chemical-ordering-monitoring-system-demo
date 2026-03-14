"use client";

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle, XCircle, Eye, AlertTriangle, MapPin, Users, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { labLocations, Order, ChemicalCategory, Location, OrderStatus, initialOrders } from '@/lib/mockData';
import { fetchPurchaseOrders } from '@/lib/supabase/queries';
import type { DbPurchaseOrder } from '@/lib/supabase/types';

// ─── Adapter: DB row → Order ──────────────────────────────────────────────────
function adaptDbOrder(r: DbPurchaseOrder): Order {
  return {
    id: r.po_number ?? r.id,
    chemicalId: r.item_id ?? '',
    chemicalName: r.item_name ?? '—',
    category: (r.category ?? 'Chemicals/Reagents') as ChemicalCategory,
    quantity: r.quantity ?? 0,
    unit: r.unit ?? 'unit',
    purpose: r.purpose ?? '',
    requester: r.requester ?? '—',
    requestDate: r.request_date ?? '—',
    status: (r.status ?? 'Pending') as OrderStatus,
    location: (r.lab_name ?? 'Central Lab') as Location,
    approver: r.approver,
    approveDate: r.approve_date,
    rejectReason: r.reject_reason,
  };
}

function CategoryBadge({ cat }: { cat: string }) {
  const map: Record<string, string> = {
    'Chemicals/Reagents': 'bg-blue-100 text-blue-700',
    'Calibration STD': 'bg-violet-100 text-violet-700',
    'Gas': 'bg-sky-100 text-sky-700',
    'Material Supply/Consumables': 'bg-teal-100 text-teal-700',
    'Peroxide': 'bg-orange-100 text-orange-700',
  };
  if (!cat) return null;
  return <span className={clsx('badge text-xs', map[cat] || 'badge')}>{cat}</span>;
}

export default function Approvals() {
  const { approveOrder, rejectOrder, selectedLocation } = useApp();

  // ─── Supabase data ────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPurchaseOrders().then(({ data, error }) => {
      if (cancelled) return;
      if (error || !data) {
        setOrders(initialOrders);
        setDataError(error ?? 'Failed to load orders. Showing demo data.');
      } else {
        setOrders(data.length === 0 ? initialOrders : data.map(adaptDbOrder));
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // ─── Local interaction state ──────────────────────────────────────────────
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected' | 'Completed'>('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [flash, setFlash] = useState<{ type: 'approve' | 'reject'; id: string } | null>(null);

  const approver = 'Assoc. Prof. Nattapong T.';

  const getFocalPoint = (location: string) =>
    labLocations.find(l => l.name === location);

  const filtered = orders.filter(o => {
    const statusOk = activeFilter === 'All' || o.status === activeFilter;
    const locOk = selectedLocation === 'All Locations' ? true : o.location === selectedLocation;
    const filterLocOk = locationFilter === 'All' || o.location === locationFilter;
    return statusOk && locOk && filterLocOk;
  });
  const sorted = [...filtered].sort((a, b) => b.requestDate.localeCompare(a.requestDate));

  const handleApprove = (orderId: string) => {
    approveOrder(orderId, approver);
    // Also update local DB-sourced list
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'Approved' as OrderStatus, approver, approveDate: new Date().toISOString().split('T')[0] } : o
    ));
    setFlash({ type: 'approve', id: orderId });
    setSelectedOrder(null);
    setTimeout(() => setFlash(null), 2500);
  };

  const handleReject = (orderId: string) => {
    if (!rejectReason.trim()) return;
    rejectOrder(orderId, approver, rejectReason);
    // Also update local DB-sourced list
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'Rejected' as OrderStatus, approver, rejectReason } : o
    ));
    setFlash({ type: 'reject', id: orderId });
    setSelectedOrder(null);
    setRejectReason('');
    setShowRejectInput(false);
    setTimeout(() => setFlash(null), 2500);
  };

  const statusBadge = (s: string) =>
    s === 'Pending' ? 'badge-pending' :
    s === 'Approved' ? 'badge-approved' :
    s === 'Rejected' ? 'badge-rejected' : 'badge-completed';

  const filters = ['All', 'Pending', 'Approved', 'Rejected', 'Completed'] as const;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="fade-in space-y-5">
      {flash && (
        <div className={clsx(
          "border rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2",
          flash.type === 'approve' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        )}>
          {flash.type === 'approve' ? (
            <><CheckCircle className="w-4 h-4" /> Order approved successfully! Stock will be updated upon check-in.</>
          ) : (
            <><XCircle className="w-4 h-4" /> Order rejected with reason noted.</>
          )}
        </div>
      )}

      {dataError && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {dataError}
        </div>
      )}

      {!loading && pendingCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {pendingCount} order{pendingCount > 1 ? 's' : ''} awaiting your approval
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={clsx(
              'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              activeFilter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            )}
          >
            {f}
            {f === 'Pending' && pendingCount > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
        <select
          className="ml-auto form-input w-auto text-sm py-2"
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
        >
          <option value="All">All Locations</option>
          {['Central Lab', 'QA Lab', 'Production Lab', 'R&D Lab'].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Orders List */}
        <div className="xl:col-span-3 card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Request List</h3>
            <span className="text-xs text-slate-400">{loading ? 'Loading…' : `${sorted.length} records`}</span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading orders…</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sorted.map(order => {
                const focalPoint = getFocalPoint(order.location);
                return (
                  <div
                    key={order.id}
                    className={clsx(
                      "p-4 cursor-pointer transition-all duration-150",
                      selectedOrder?.id === order.id ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-slate-50 border-l-4 border-transparent"
                    )}
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs text-blue-600 font-semibold">{order.id}</span>
                          <span className={clsx('badge', statusBadge(order.status))}>{order.status}</span>
                          <CategoryBadge cat={order.category} />
                        </div>
                        <p className="font-semibold text-slate-800 truncate">{order.chemicalName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{order.quantity} {order.unit} · {order.requester}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{order.location}</span>
                          {focalPoint && (
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{focalPoint.focalPoint}</span>
                          )}
                          <span>{order.requestDate}</span>
                        </div>
                      </div>
                      <Eye className={clsx("w-4 h-4 flex-shrink-0 mt-1", selectedOrder?.id === order.id ? "text-blue-500" : "text-slate-300")} />
                    </div>
                  </div>
                );
              })}
              {sorted.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-12">No orders found</p>
              )}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="xl:col-span-2 space-y-4">
          {selectedOrder ? (
            <div className="card fade-in space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Request Details</h3>
                <span className={clsx('badge', statusBadge(selectedOrder.status))}>{selectedOrder.status}</span>
              </div>

              {/* Location + Focal Point Box */}
              {(() => {
                const fp = getFocalPoint(selectedOrder.location);
                return fp ? (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-1">
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {selectedOrder.location}
                    </p>
                    <p className="text-xs text-blue-700">Focal Point: <span className="font-semibold">{fp.focalPoint}</span></p>
                    <p className="text-xs text-blue-700">Approver: <span className="font-semibold">{fp.approver}</span></p>
                  </div>
                ) : null;
              })()}

              <div className="space-y-3">
                {[
                  ['Order ID', selectedOrder.id],
                  ['Chemical', selectedOrder.chemicalName],
                  ['Category', selectedOrder.category],
                  ['Quantity', `${selectedOrder.quantity} ${selectedOrder.unit}`],
                  ['Requester', selectedOrder.requester],
                  ['Request Date', selectedOrder.requestDate],
                  ['Purpose', selectedOrder.purpose],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-2 gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
                    <span className="text-sm text-slate-700 font-medium">{value}</span>
                  </div>
                ))}

                {selectedOrder.approver && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Reviewed By</span>
                      <span className="text-sm text-slate-700 font-medium">{selectedOrder.approver}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Review Date</span>
                      <span className="text-sm text-slate-700 font-medium">{selectedOrder.approveDate}</span>
                    </div>
                  </>
                )}

                {selectedOrder.rejectReason && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-xs font-semibold text-red-500 mb-1">Rejection Reason</p>
                    <p className="text-sm text-red-700">{selectedOrder.rejectReason}</p>
                  </div>
                )}
              </div>

              {selectedOrder.status === 'Pending' && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleApprove(selectedOrder.id)} className="btn-success flex-1 justify-center">
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => setShowRejectInput(!showRejectInput)} className="btn-danger flex-1 justify-center">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                  {showRejectInput && (
                    <div className="fade-in">
                      <label className="form-label">Rejection Reason*</label>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        placeholder="Provide reason for rejection..."
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                      />
                      <button
                        onClick={() => handleReject(selectedOrder.id)}
                        disabled={!rejectReason.trim()}
                        className="btn-danger mt-2 w-full justify-center"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">Select an order</p>
              <p className="text-slate-400 text-sm mt-1">Click any request to view details and take action</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
