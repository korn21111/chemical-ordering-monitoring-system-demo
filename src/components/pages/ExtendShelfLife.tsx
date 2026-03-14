"use client";

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  CalendarClock, CheckCircle, XCircle, Clock, AlertTriangle, Filter,
  ChevronDown, X, Plus, Eye, Calendar, MapPin
} from 'lucide-react';
import clsx from 'clsx';
import { InventoryLot, ShelfLifeExtension, ChemicalCategory, Location } from '@/lib/mockData';

type ExpiryFilter = 'All' | 'Active' | 'Expiring Soon' | 'Expired';

const CATEGORIES: ChemicalCategory[] = ['Chemicals/Reagents', 'Calibration STD', 'Gas', 'Material Supply/Consumables', 'Peroxide'];
const LOCATIONS: Location[] = ['Central Lab', 'QA Lab', 'Production Lab', 'R&D Lab'];

function getDaysUntilExpiry(expiryDate: string): number {
  const now = new Date('2026-03-07');
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getExpiryStatus(days: number): ExpiryFilter {
  if (days < 0) return 'Expired';
  if (days <= 90) return 'Expiring Soon';
  return 'Active';
}

function ExpiryBadge({ days }: { days: number }) {
  const status = getExpiryStatus(days);
  return (
    <span className={clsx('badge', {
      'bg-red-100 text-red-700': status === 'Expired',
      'bg-amber-100 text-amber-700': status === 'Expiring Soon',
      'bg-emerald-100 text-emerald-700': status === 'Active',
    })}>
      {status === 'Expired' ? `Expired ${Math.abs(days)}d ago` : status === 'Expiring Soon' ? `${days}d left` : 'Active'}
    </span>
  );
}

function CategoryBadge({ cat }: { cat: string }) {
  const map: Record<string, string> = {
    'Chemicals/Reagents': 'bg-blue-100 text-blue-700',
    'Calibration STD': 'bg-violet-100 text-violet-700',
    'Gas': 'bg-sky-100 text-sky-700',
    'Material Supply/Consumables': 'bg-teal-100 text-teal-700',
    'Peroxide': 'bg-orange-100 text-orange-700',
  };
  return <span className={clsx('badge', map[cat] || 'badge')}>{cat}</span>;
}

function ExtStatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx('badge', {
      'badge-pending': status === 'Pending',
      'badge-approved': status === 'Approved',
      'badge-rejected': status === 'Rejected',
    })}>
      {status}
    </span>
  );
}

interface ExtensionModalProps {
  lot: InventoryLot;
  onClose: () => void;
  onSubmit: (data: { newExpiryDate: string; reason: string }) => void;
}

function ExtensionModal({ lot, onClose, onSubmit }: ExtensionModalProps) {
  const [newExpiry, setNewExpiry] = useState('');
  const [reason, setReason] = useState('');
  const isValid = newExpiry && reason.trim() && new Date(newExpiry) > new Date(lot.expiryDate);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
              <CalendarClock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Request Shelf Life Extension</h3>
              <p className="text-xs text-slate-400">Fill in extension details below</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl text-sm">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Item / Lot</p>
              <p className="font-semibold text-slate-700 text-xs leading-tight">{lot.chemicalName}</p>
              <p className="text-slate-500 mt-0.5 font-mono text-xs">{lot.lotNumber}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Location</p>
              <p className="font-semibold text-slate-700 text-xs">{lot.location}</p>
              <p className="text-slate-500 mt-0.5 text-xs">{lot.category}</p>
            </div>
          </div>

          <div>
            <label className="form-label">Current Expiry Date</label>
            <div className="form-input bg-slate-50 text-slate-500 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              {lot.expiryDate}
            </div>
          </div>

          <div>
            <label className="form-label">New Expiry Date *</label>
            <input
              type="date"
              className="form-input"
              value={newExpiry}
              min={lot.expiryDate}
              onChange={e => setNewExpiry(e.target.value)}
            />
            {newExpiry && new Date(newExpiry) <= new Date(lot.expiryDate) && (
              <p className="text-xs text-red-500 mt-1">New date must be after current expiry</p>
            )}
          </div>

          <div>
            <label className="form-label">Reason for Extension *</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Provide scientific or operational justification for the extension..."
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Requested By</label>
            <div className="form-input bg-slate-50 text-slate-500">Thanakorn P. (Staff)</div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1 justify-center">Cancel</button>
          <button
            disabled={!isValid}
            onClick={() => onSubmit({ newExpiryDate: newExpiry, reason })}
            className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CalendarClock className="w-4 h-4" />
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExtendShelfLife() {
  const { lots, shelfLifeExtensions, selectedLocation, requestExtension, approveExtension, rejectExtension } = useApp();

  const [searchName, setSearchName] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterExpiry, setFilterExpiry] = useState<ExpiryFilter>('All');
  const [selectedLot, setSelectedLot] = useState<InventoryLot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [flash, setFlash] = useState<string | null>(null);
  const [activeExtTab, setActiveExtTab] = useState<'Pending' | 'All'>('All');

  const approver = 'Assoc. Prof. Nattapong T.';

  const filteredLots = useMemo(() => {
    return lots.filter(l => {
      const days = getDaysUntilExpiry(l.expiryDate);
      const expiryStatus = getExpiryStatus(days);
      const locationOk = selectedLocation === 'All Locations' ? true : l.location === selectedLocation;
      const filterLocationOk = filterLocation === 'All' ? true : l.location === filterLocation;
      const categoryOk = filterCategory === 'All' ? true : l.category === filterCategory;
      const nameOk = searchName === '' ? true : l.chemicalName.toLowerCase().includes(searchName.toLowerCase());
      const expiryOk = filterExpiry === 'All' ? true : expiryStatus === filterExpiry;
      return locationOk && filterLocationOk && categoryOk && nameOk && expiryOk;
    }).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }, [lots, selectedLocation, filterLocation, filterCategory, searchName, filterExpiry]);

  const filteredExtensions = useMemo(() => {
    const base = activeExtTab === 'Pending'
      ? shelfLifeExtensions.filter(e => e.status === 'Pending')
      : shelfLifeExtensions;
    return base.sort((a, b) => b.requestDate.localeCompare(a.requestDate));
  }, [shelfLifeExtensions, activeExtTab]);

  const pendingCount = shelfLifeExtensions.filter(e => e.status === 'Pending').length;

  const handleSubmitExtension = (data: { newExpiryDate: string; reason: string }) => {
    if (!selectedLot) return;
    requestExtension({
      lotId: selectedLot.id,
      chemicalName: selectedLot.chemicalName,
      category: selectedLot.category,
      lotNumber: selectedLot.lotNumber,
      location: selectedLot.location,
      oldExpiryDate: selectedLot.expiryDate,
      newExpiryDate: data.newExpiryDate,
      reason: data.reason,
      requestedBy: 'Thanakorn P.',
    });
    setShowModal(false);
    setSelectedLot(null);
    setFlash('Extension request submitted successfully.');
    setTimeout(() => setFlash(null), 3000);
  };

  const handleApprove = (id: string) => {
    approveExtension(id, approver);
    setFlash('Extension approved. Lot expiry date updated.');
    setTimeout(() => setFlash(null), 3000);
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) return;
    rejectExtension(id, approver, rejectReason);
    setRejectId(null);
    setRejectReason('');
    setFlash('Extension request rejected.');
    setTimeout(() => setFlash(null), 3000);
  };

  return (
    <div className="fade-in space-y-6">
      {flash && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {flash}
        </div>
      )}

      {pendingCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-xl text-sm text-purple-700 font-medium">
          <CalendarClock className="w-4 h-4 flex-shrink-0" />
          {pendingCount} extension request{pendingCount > 1 ? 's' : ''} awaiting approval
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <h3 className="font-semibold text-slate-700 text-sm">Filters</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="form-label">Item Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search..."
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Category</label>
            <select className="form-input" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Location</label>
            <select className="form-input" value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
              <option value="All">All Locations</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Expiry Status</label>
            <select className="form-input" value={filterExpiry} onChange={e => setFilterExpiry(e.target.value as ExpiryFilter)}>
              {(['All', 'Active', 'Expiring Soon', 'Expired'] as ExpiryFilter[]).map(f =>
                <option key={f} value={f}>{f}</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Lots Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Inventory Lots</h3>
          <span className="text-xs text-slate-400">{filteredLots.length} lots</span>
        </div>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Item Name</th>
                <th className="table-th hidden md:table-cell">Category</th>
                <th className="table-th">Lot Number</th>
                <th className="table-th hidden lg:table-cell">Location</th>
                <th className="table-th">Expiry Date</th>
                <th className="table-th">Status</th>
                <th className="table-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLots.map(lot => {
                const days = getDaysUntilExpiry(lot.expiryDate);
                return (
                  <tr key={lot.id} className="table-row">
                    <td className="table-td">
                      <p className="font-semibold text-slate-800 text-sm">{lot.chemicalName}</p>
                      <p className="text-xs text-slate-400 font-mono">{lot.lotNumber}</p>
                    </td>
                    <td className="table-td hidden md:table-cell">
                      <CategoryBadge cat={lot.category} />
                    </td>
                    <td className="table-td font-mono text-xs text-blue-600">{lot.lotNumber}</td>
                    <td className="table-td hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-sm text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />{lot.location}
                      </span>
                    </td>
                    <td className="table-td text-sm">{lot.expiryDate}</td>
                    <td className="table-td"><ExpiryBadge days={days} /></td>
                    <td className="table-td">
                      <button
                        onClick={() => { setSelectedLot(lot); setShowModal(true); }}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Extend
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredLots.length === 0 && (
                <tr><td colSpan={7} className="text-center text-slate-400 text-sm py-12">No lots found matching filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extension History */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-bold text-slate-800">Extension History</h3>
          <div className="flex items-center gap-2">
            {(['All', 'Pending'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveExtTab(t)}
                className={clsx('px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                  activeExtTab === t ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                )}
              >
                {t} {t === 'Pending' && pendingCount > 0 && (
                  <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredExtensions.map(ext => (
            <div key={ext.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs text-blue-600 font-semibold">{ext.id}</span>
                    <ExtStatusBadge status={ext.status} />
                    <CategoryBadge cat={ext.category} />
                  </div>
                  <p className="font-semibold text-slate-800">{ext.chemicalName}</p>
                  <p className="text-xs text-slate-500 font-mono">{ext.lotNumber}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ext.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{ext.oldExpiryDate} → {ext.newExpiryDate}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 italic">"{ext.reason}"</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Requested by {ext.requestedBy} on {ext.requestDate}
                    {ext.approvedBy && ` · Reviewed by ${ext.approvedBy} on ${ext.reviewDate}`}
                  </p>
                  {ext.rejectReason && (
                    <div className="mt-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-xs text-red-600 font-medium">Rejection: {ext.rejectReason}</p>
                    </div>
                  )}
                </div>

                {ext.status === 'Pending' && (
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(ext.id)}
                      className="btn-success text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" /> Approve
                    </button>
                    <button
                      onClick={() => setRejectId(rejectId === ext.id ? null : ext.id)}
                      className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" /> Reject
                    </button>
                    {rejectId === ext.id && (
                      <div className="mt-1 fade-in">
                        <textarea
                          className="form-textarea text-xs"
                          rows={2}
                          placeholder="Reason for rejection..."
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                        />
                        <button
                          onClick={() => handleReject(ext.id)}
                          disabled={!rejectReason.trim()}
                          className="btn-danger mt-1 w-full justify-center text-xs disabled:opacity-40"
                        >
                          Confirm
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredExtensions.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-12">No extension records found</p>
          )}
        </div>
      </div>

      {showModal && selectedLot && (
        <ExtensionModal
          lot={selectedLot}
          onClose={() => { setShowModal(false); setSelectedLot(null); }}
          onSubmit={handleSubmitExtension}
        />
      )}
    </div>
  );
}
