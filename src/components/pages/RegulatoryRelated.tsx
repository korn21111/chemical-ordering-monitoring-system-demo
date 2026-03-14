"use client";

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Shield, Eye, Filter, MapPin, AlertTriangle, CheckCircle,
  Clock, ChevronDown, X, FileText, Calendar
} from 'lucide-react';
import clsx from 'clsx';
import { ChemicalCategory, Location, RegulationType, RegulationStatus, RegulatoryRecord } from '@/lib/mockData';

const CATEGORIES: ChemicalCategory[] = ['Chemicals/Reagents', 'Calibration STD', 'Gas', 'Material Supply/Consumables', 'Peroxide'];
const LOCATIONS: Location[] = ['Central Lab', 'QA Lab', 'Production Lab', 'R&D Lab'];
const REG_TYPES: RegulationType[] = ['Hazardous', 'Controlled Substance', 'Flammable', 'Corrosive', 'Toxic', 'Compressed Gas'];

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

function RegTypeBadge({ type }: { type: RegulationType }) {
  const map: Record<RegulationType, string> = {
    'Hazardous': 'bg-red-100 text-red-700',
    'Controlled Substance': 'bg-purple-100 text-purple-700',
    'Flammable': 'bg-orange-100 text-orange-700',
    'Corrosive': 'bg-amber-100 text-amber-700',
    'Toxic': 'bg-rose-100 text-rose-700',
    'Compressed Gas': 'bg-sky-100 text-sky-700',
  };
  return <span className={clsx('badge', map[type] || 'badge')}>{type}</span>;
}

function StatusBadge({ status }: { status: RegulationStatus }) {
  return (
    <span className={clsx('badge', {
      'badge-approved': status === 'Active',
      'badge-rejected': status === 'Expired',
      'badge-pending': status === 'Pending Review',
    })}>
      {status}
    </span>
  );
}

interface DetailPanelProps {
  record: RegulatoryRecord;
  onClose: () => void;
}

function DetailPanel({ record, onClose }: DetailPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">{record.itemName}</h3>
              <p className="text-xs text-slate-400">{record.regulationCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {record.isControlled && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700">Regulatory Controlled Item</p>
                <p className="text-xs text-red-600 mt-0.5">This item is subject to regulatory control. Ensure compliance at all times.</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <CategoryBadge cat={record.category} />
            <RegTypeBadge type={record.regulationType} />
            <StatusBadge status={record.status} />
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            {[
              ['Item Code', record.itemCode],
              ['Location', record.location],
              ['Regulation Code', record.regulationCode],
              ['Regulation Type', record.regulationType],
              ['Effective Date', record.effectiveDate],
              ['Expiry Date', record.expiryDate],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">{record.description}</p>
          </div>

          {record.linkedLotIds && record.linkedLotIds.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Linked Lots</p>
              <div className="flex flex-wrap gap-2">
                {record.linkedLotIds.map(lotId => (
                  <span key={lotId} className="font-mono text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100">{lotId}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegulatoryRelated() {
  const { regulatoryRecords, selectedLocation } = useApp();

  const [searchName, setSearchName] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterRegType, setFilterRegType] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<RegulatoryRecord | null>(null);

  const filtered = useMemo(() => {
    return regulatoryRecords.filter(r => {
      const locationOk = selectedLocation === 'All Locations' ? true : r.location === selectedLocation;
      const filterLocationOk = filterLocation === 'All' ? true : r.location === filterLocation;
      const categoryOk = filterCategory === 'All' ? true : r.category === filterCategory;
      const regTypeOk = filterRegType === 'All' ? true : r.regulationType === filterRegType;
      const nameOk = searchName === '' ? true : r.itemName.toLowerCase().includes(searchName.toLowerCase());
      const statusOk = filterStatus === 'All' ? true : r.status === filterStatus;
      return locationOk && filterLocationOk && categoryOk && regTypeOk && nameOk && statusOk;
    });
  }, [regulatoryRecords, selectedLocation, filterLocation, filterCategory, filterRegType, searchName, filterStatus]);

  const stats = useMemo(() => ({
    total: filtered.length,
    active: filtered.filter(r => r.status === 'Active').length,
    pendingReview: filtered.filter(r => r.status === 'Pending Review').length,
    controlled: filtered.filter(r => r.isControlled).length,
  }), [filtered]);

  return (
    <div className="fade-in space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card">
          <div className="kpi-icon bg-blue-50"><FileText className="w-6 h-6 text-blue-600" /></div>
          <div>
            <p className="kpi-value">{stats.total}</p>
            <p className="kpi-label">Total Records</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon bg-emerald-50"><CheckCircle className="w-6 h-6 text-emerald-600" /></div>
          <div>
            <p className="kpi-value">{stats.active}</p>
            <p className="kpi-label">Active Regulations</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon bg-amber-50"><Clock className="w-6 h-6 text-amber-600" /></div>
          <div>
            <p className="kpi-value">{stats.pendingReview}</p>
            <p className="kpi-label">Pending Review</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon bg-red-50"><Shield className="w-6 h-6 text-red-600" /></div>
          <div>
            <p className="kpi-value">{stats.controlled}</p>
            <p className="kpi-label">Controlled Items</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <h3 className="font-semibold text-slate-700 text-sm">Filters</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
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
            <label className="form-label">Regulation Type</label>
            <select className="form-input" value={filterRegType} onChange={e => setFilterRegType(e.target.value)}>
              <option value="All">All Types</option>
              {REG_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
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
            <label className="form-label">Status</label>
            <select className="form-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Regulatory Records</h3>
          <span className="text-xs text-slate-400">{filtered.length} records</span>
        </div>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Item Name</th>
                <th className="table-th hidden md:table-cell">Category</th>
                <th className="table-th hidden lg:table-cell">Regulation Type</th>
                <th className="table-th hidden xl:table-cell">Regulation Code</th>
                <th className="table-th hidden lg:table-cell">Location</th>
                <th className="table-th">Status</th>
                <th className="table-th hidden xl:table-cell">Effective Date</th>
                <th className="table-th hidden xl:table-cell">Expiry Date</th>
                <th className="table-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(record => (
                <tr key={record.id} className="table-row">
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      {record.isControlled && (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{record.itemName}</p>
                        <p className="text-xs text-slate-400 font-mono">{record.itemCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-td hidden md:table-cell"><CategoryBadge cat={record.category} /></td>
                  <td className="table-td hidden lg:table-cell"><RegTypeBadge type={record.regulationType} /></td>
                  <td className="table-td hidden xl:table-cell font-mono text-xs text-slate-600">{record.regulationCode}</td>
                  <td className="table-td hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-sm text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400" />{record.location}
                    </span>
                  </td>
                  <td className="table-td"><StatusBadge status={record.status} /></td>
                  <td className="table-td hidden xl:table-cell text-xs text-slate-500">{record.effectiveDate}</td>
                  <td className="table-td hidden xl:table-cell text-xs text-slate-500">{record.expiryDate}</td>
                  <td className="table-td">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center text-slate-400 text-sm py-12">No regulatory records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRecord && (
        <DetailPanel record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
    </div>
  );
}
