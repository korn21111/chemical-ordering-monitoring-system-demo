"use client";

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { chemicals, teamMembers, Location } from '@/lib/mockData';
import { FlaskConical, Plus, MapPin, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const LOCATIONS: Location[] = ['Central Lab', 'QA Lab', 'Production Lab', 'R&D Lab'];

export default function PeroxideMonitoring() {
  const { lots, inspections, addInspection, selectedLocation } = useApp();

  const [lotId, setLotId] = useState('');
  const [ppmValue, setPpmValue] = useState('');
  const [inspector, setInspector] = useState('');
  const [remarks, setRemarks] = useState('');
  const [filterLocation, setFilterLocation] = useState<string>(
    selectedLocation !== 'All Locations' ? selectedLocation : 'All'
  );
  const [success, setSuccess] = useState(false);

  const peroxideLots = useMemo(() => lots.filter(l => {
    const isPerox = l.isPeroxide;
    const locOk = selectedLocation === 'All Locations' ? true : l.location === selectedLocation;
    const filterLocOk = filterLocation === 'All' ? true : l.location === filterLocation;
    return isPerox && locOk && filterLocOk;
  }), [lots, selectedLocation, filterLocation]);

  const selectedLot = lots.find(l => l.id === lotId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotId || !ppmValue || !inspector) return;
    const lot = lots.find(l => l.id === lotId)!;
    addInspection({
      lotId,
      chemicalName: lot.chemicalName,
      lotNumber: lot.lotNumber,
      inspectDate: new Date().toISOString().slice(0, 10),
      ppmValue: parseFloat(ppmValue),
      inspector,
      remarks,
      location: lot.location,
    });
    setLotId(''); setPpmValue(''); setRemarks(''); setInspector('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const getPpmStatus = (ppm: number) => ppm > 100 ? 'Quarantine' : ppm >= 25 ? 'Warning' : 'Normal';
  const statusBadge = (s: string) =>
    s === 'Normal' ? 'badge-normal' : s === 'Warning' ? 'badge-warning' : 'badge-quarantine';

  const filteredInspections = useMemo(() => {
    return inspections.filter(i => {
      const locOk = selectedLocation === 'All Locations' ? true : i.location === selectedLocation;
      const filterLocOk = filterLocation === 'All' ? true : i.location === filterLocation;
      return locOk && filterLocOk;
    }).sort((a, b) => b.inspectDate.localeCompare(a.inspectDate));
  }, [inspections, selectedLocation, filterLocation]);

  const quarantineCount = filteredInspections.filter(i => i.status === 'Quarantine').length;
  const warningCount = filteredInspections.filter(i => i.status === 'Warning').length;

  return (
    <div className="fade-in space-y-6">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
          <FlaskConical className="w-4 h-4" /> Peroxide inspection recorded successfully!
        </div>
      )}

      {(quarantineCount > 0 || warningCount > 0) && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            <span className="font-bold">Active Alerts: </span>
            {quarantineCount > 0 && <span>{quarantineCount} quarantine{quarantineCount > 1 ? 's' : ''} </span>}
            {warningCount > 0 && <span>{warningCount} warning{warningCount > 1 ? 's' : ''}</span>}
          </div>
        </div>
      )}

      {/* Location Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-slate-400" /> Filter Location:
        </label>
        <div className="flex gap-2 flex-wrap">
          {['All', ...LOCATIONS].map(loc => (
            <button
              key={loc}
              onClick={() => setFilterLocation(loc)}
              className={clsx('px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border',
                filterLocation === loc ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >{loc}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Inspection Form */}
        <div className="xl:col-span-2 space-y-5">
          <div className="card">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">New Inspection</h3>
                <p className="text-xs text-slate-400">Record peroxide PPM reading</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Peroxide Lot *</label>
                <select className="form-input" value={lotId} onChange={e => setLotId(e.target.value)} required>
                  <option value="">Select lot to inspect...</option>
                  {peroxideLots.map(l => (
                    <option key={l.id} value={l.id}>{l.chemicalName} — {l.lotNumber} [{l.location}]</option>
                  ))}
                </select>
              </div>

              {selectedLot && (
                <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-xs space-y-1.5 fade-in">
                  <p className="text-slate-500">Lot <span className="font-mono font-bold text-slate-700">{selectedLot.lotNumber}</span></p>
                  <p className="text-slate-500">Location: <span className="font-semibold text-slate-700">{selectedLot.location}</span></p>
                  <p className="text-slate-500">Expiry: <span className="font-semibold text-slate-700">{selectedLot.expiryDate}</span></p>
                  <p className="text-slate-500">Remaining: <span className="font-semibold text-slate-700">{selectedLot.remainingQuantity} {selectedLot.unit}</span></p>
                </div>
              )}

              <div>
                <label className="form-label">PPM Reading *</label>
                <input
                  type="number" min="0" step="0.1" className="form-input"
                  placeholder="e.g. 25"
                  value={ppmValue}
                  onChange={e => setPpmValue(e.target.value)}
                  required
                />
                {ppmValue && (
                  <div className={clsx('mt-1.5 text-xs font-semibold flex items-center gap-1',
                    getPpmStatus(parseFloat(ppmValue)) === 'Normal' ? 'text-emerald-600' :
                    getPpmStatus(parseFloat(ppmValue)) === 'Warning' ? 'text-amber-600' : 'text-red-600'
                  )}>
                    → Status: {getPpmStatus(parseFloat(ppmValue))}
                    {getPpmStatus(parseFloat(ppmValue)) === 'Quarantine' && ' — ISOLATE IMMEDIATELY'}
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">Inspector *</label>
                <select className="form-input" value={inspector} onChange={e => setInspector(e.target.value)} required>
                  <option value="">Select inspector...</option>
                  {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Remarks</label>
                <textarea className="form-textarea" rows={2} placeholder="Observations..." value={remarks} onChange={e => setRemarks(e.target.value)} />
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                <Plus className="w-4 h-4" /> Record Inspection
              </button>
            </form>
          </div>

          {/* PPM Legend */}
          <div className="card">
            <h4 className="font-bold text-slate-800 text-sm mb-3">PPM Thresholds</h4>
            <div className="space-y-2">
              {[
                { label: 'Normal', range: '< 25 ppm', cls: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', w: '25%' },
                { label: 'Warning', range: '25–100 ppm', cls: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400', w: '60%' },
                { label: 'Quarantine', range: '> 100 ppm', cls: 'bg-red-100 text-red-700', bar: 'bg-red-500', w: '100%' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className={clsx('badge shrink-0', item.cls)}>{item.label}</span>
                  <span className="text-xs text-slate-500 w-20 shrink-0">{item.range}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full">
                    <div className={clsx('h-2 rounded-full', item.bar)} style={{ width: item.w }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inspection History */}
        <div className="xl:col-span-3 card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Inspection History</h3>
            <span className="text-xs text-slate-400">{filteredInspections.length} records</span>
          </div>
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Chemical</th>
                  <th className="table-th">Lot</th>
                  <th className="table-th hidden lg:table-cell">Location</th>
                  <th className="table-th">PPM</th>
                  <th className="table-th">Status</th>
                  <th className="table-th hidden sm:table-cell">Inspector</th>
                  <th className="table-th">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredInspections.map(ins => (
                  <tr key={ins.id} className="table-row">
                    <td className="table-td">
                      <p className="font-semibold text-slate-800 text-sm truncate max-w-[120px]">{ins.chemicalName}</p>
                    </td>
                    <td className="table-td font-mono text-xs text-blue-600">{ins.lotNumber}</td>
                    <td className="table-td hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />{ins.location}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className={clsx('font-bold text-sm',
                        ins.status === 'Normal' ? 'text-emerald-600' :
                        ins.status === 'Warning' ? 'text-amber-600' : 'text-red-600'
                      )}>{ins.ppmValue}</span>
                    </td>
                    <td className="table-td"><span className={clsx('badge', statusBadge(ins.status))}>{ins.status}</span></td>
                    <td className="table-td hidden sm:table-cell text-xs text-slate-500">{ins.inspector}</td>
                    <td className="table-td text-xs text-slate-400">{ins.inspectDate}</td>
                  </tr>
                ))}
                {filteredInspections.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-slate-400 text-sm py-12">No inspections found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
