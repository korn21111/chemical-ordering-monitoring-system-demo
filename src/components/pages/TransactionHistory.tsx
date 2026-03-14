"use client";

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { History, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { ChemicalCategory, Location, TransactionType } from '@/lib/mockData';

const CATEGORIES: ChemicalCategory[] = ['Chemicals/Reagents', 'Calibration STD', 'Gas', 'Material Supply/Consumables', 'Peroxide'];
const LOCATIONS: Location[] = ['Central Lab', 'QA Lab', 'Production Lab', 'R&D Lab'];
const TXN_TYPES: TransactionType[] = ['Order Created', 'Approved', 'Rejected', 'Check-in', 'Check-out', 'Inspection', 'Shelf Life Extended'];

function CategoryBadge({ cat }: { cat?: string }) {
  if (!cat) return null;
  const map: Record<string, string> = {
    'Chemicals/Reagents': 'bg-blue-100 text-blue-700',
    'Calibration STD': 'bg-violet-100 text-violet-700',
    'Gas': 'bg-sky-100 text-sky-700',
    'Material Supply/Consumables': 'bg-teal-100 text-teal-700',
    'Peroxide': 'bg-orange-100 text-orange-700',
  };
  return <span className={clsx('badge text-xs', map[cat] || 'badge')}>{cat}</span>;
}

function TypeBadge({ type }: { type: TransactionType }) {
  const map: Record<TransactionType, string> = {
    'Order Created': 'badge-pending',
    'Approved': 'badge-approved',
    'Rejected': 'badge-rejected',
    'Check-in': 'bg-blue-100 text-blue-700',
    'Check-out': 'bg-purple-100 text-purple-700',
    'Inspection': 'bg-teal-100 text-teal-700',
    'Shelf Life Extended': 'bg-indigo-100 text-indigo-700',
  };
  return <span className={clsx('badge text-xs', map[type] || 'badge')}>{type}</span>;
}

export default function TransactionHistory() {
  const { transactions, selectedLocation } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const locOk = selectedLocation === 'All Locations' ? true : t.location === selectedLocation;
      const filterLocOk = filterLocation === 'All' ? true : t.location === filterLocation;
      const typeOk = filterType === 'All' ? true : t.type === filterType;
      const catOk = filterCategory === 'All' ? true : t.category === filterCategory;
      const nameOk = search === '' ? true : (
        t.chemicalName.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.user.toLowerCase().includes(search.toLowerCase())
      );
      return locOk && filterLocOk && typeOk && catOk && nameOk;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, selectedLocation, filterLocation, filterType, filterCategory, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = useMemo(() => ({
    total: filtered.length,
    orders: filtered.filter(t => t.type === 'Order Created').length,
    checkins: filtered.filter(t => t.type === 'Check-in').length,
    checkouts: filtered.filter(t => t.type === 'Check-out').length,
  }), [filtered]);

  return (
    <div className="fade-in space-y-5">
      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Transactions', value: counts.total, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Orders Created', value: counts.orders, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Check-ins', value: counts.checkins, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Check-outs', value: counts.checkouts, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={clsx('rounded-2xl p-4 flex items-center gap-3', s.bg)}>
            <div>
              <p className={clsx('text-2xl font-bold', s.color)}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="form-label">Search</label>
            <input type="text" className="form-input" placeholder="ID, item, or user..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div>
            <label className="form-label">Transaction Type</label>
            <select className="form-input" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
              <option value="All">All Types</option>
              {TXN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Category</label>
            <select className="form-input" value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}>
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Location</label>
            <select className="form-input" value={filterLocation} onChange={e => { setFilterLocation(e.target.value); setPage(1); }}>
              <option value="All">All Locations</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" /> Transaction Log
          </h3>
          <span className="text-xs text-slate-400">{filtered.length} records</span>
        </div>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">ID</th>
                <th className="table-th">Type</th>
                <th className="table-th hidden sm:table-cell">Item</th>
                <th className="table-th hidden md:table-cell">Category</th>
                <th className="table-th hidden lg:table-cell">Location</th>
                <th className="table-th hidden md:table-cell">User</th>
                <th className="table-th hidden lg:table-cell">Qty</th>
                <th className="table-th">Date</th>
                <th className="table-th hidden xl:table-cell">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(txn => (
                <tr key={txn.id} className="table-row">
                  <td className="table-td font-mono text-xs text-blue-600">{txn.id}</td>
                  <td className="table-td"><TypeBadge type={txn.type as TransactionType} /></td>
                  <td className="table-td hidden sm:table-cell text-sm max-w-[130px] truncate">{txn.chemicalName}</td>
                  <td className="table-td hidden md:table-cell"><CategoryBadge cat={txn.category} /></td>
                  <td className="table-td hidden lg:table-cell">
                    {txn.location && (
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />{txn.location}
                      </span>
                    )}
                  </td>
                  <td className="table-td hidden md:table-cell text-xs text-slate-500">{txn.user}</td>
                  <td className="table-td hidden lg:table-cell text-xs text-slate-500">
                    {txn.quantity ? `${txn.quantity} ${txn.unit}` : '—'}
                  </td>
                  <td className="table-td text-xs text-slate-400">{txn.date}</td>
                  <td className="table-td hidden xl:table-cell text-xs text-slate-400 max-w-[140px] truncate">{txn.remarks || txn.status || '—'}</td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr><td colSpan={9} className="text-center text-slate-400 text-sm py-12">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >← Prev</button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
