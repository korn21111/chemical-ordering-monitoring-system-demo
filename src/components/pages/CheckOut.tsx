"use client";

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { teamMembers, Location, ChemicalCategory } from '@/lib/mockData';
import { PackageMinus, CheckCircle, MapPin } from 'lucide-react';
import clsx from 'clsx';

const LOCATIONS: Location[] = ['Central Lab', 'QA Lab', 'Production Lab', 'R&D Lab'];

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

export default function CheckOut() {
  const { lots, checkouts, addCheckout, selectedLocation } = useApp();

  const [lotId, setLotId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purpose, setPurpose] = useState('');
  const [checkedOutBy, setCheckedOutBy] = useState('');
  const [filterLocation, setFilterLocation] = useState(
    selectedLocation !== 'All Locations' ? selectedLocation as Location | 'All' : 'All'
  );
  const [success, setSuccess] = useState(false);

  const availableLots = useMemo(() => {
    return lots.filter(l => {
      const hasStock = l.remainingQuantity > 0;
      const locOk = selectedLocation === 'All Locations' ? true : l.location === selectedLocation;
      const filterLocOk = filterLocation === 'All' ? true : l.location === filterLocation;
      return hasStock && locOk && filterLocOk;
    });
  }, [lots, selectedLocation, filterLocation]);

  const selectedLot = lots.find(l => l.id === lotId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotId || !quantity || !purpose || !checkedOutBy) return;
    const lot = lots.find(l => l.id === lotId)!;
    if (parseFloat(quantity) > lot.remainingQuantity) return;
    addCheckout({
      lotId,
      chemicalName: lot.chemicalName,
      category: lot.category,
      lotNumber: lot.lotNumber,
      quantity: parseFloat(quantity),
      unit: lot.unit,
      purpose,
      checkedOutBy,
      location: lot.location,
    });
    setLotId(''); setQuantity(''); setPurpose(''); setCheckedOutBy('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const recentCheckouts = [...checkouts]
    .sort((a, b) => b.checkoutDate.localeCompare(a.checkoutDate))
    .slice(0, 8);

  return (
    <div className="fade-in space-y-6">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Checkout recorded and inventory updated!
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Checkout Form */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
              <PackageMinus className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Dispense Chemical</h3>
              <p className="text-xs text-slate-400">Check out from inventory</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Filter by Location</label>
              <select className="form-input" value={filterLocation} onChange={e => { setFilterLocation(e.target.value as Location | 'All'); setLotId(''); }}>
                <option value="All">All Locations</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Select Lot *</label>
              <select className="form-input" value={lotId} onChange={e => setLotId(e.target.value)} required>
                <option value="">Select available lot...</option>
                {availableLots.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.chemicalName} — {l.lotNumber} ({l.remainingQuantity} {l.unit} left) [{l.location}]
                  </option>
                ))}
              </select>
            </div>

            {selectedLot && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Category</span>
                  <CategoryBadge cat={selectedLot.category} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Available</span>
                  <span className="font-semibold text-emerald-700">{selectedLot.remainingQuantity} {selectedLot.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expiry</span>
                  <span className="font-semibold text-slate-700">{selectedLot.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location</span>
                  <span className="font-semibold text-slate-700">{selectedLot.location}</span>
                </div>
                {selectedLot.isPeroxide && (
                  <p className="text-orange-600 font-semibold">⚠ Peroxide-forming chemical</p>
                )}
                {/* Stock bar */}
                <div className="pt-1">
                  <div className="bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (selectedLot.remainingQuantity / selectedLot.receivedQuantity) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{Math.round((selectedLot.remainingQuantity / selectedLot.receivedQuantity) * 100)}% remaining</p>
                </div>
              </div>
            )}

            <div>
              <label className="form-label">Quantity to Dispense *</label>
              <input
                type="number" min="0.01" step="any"
                max={selectedLot?.remainingQuantity}
                className="form-input"
                placeholder="Amount"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
              />
              {selectedLot && parseFloat(quantity) > selectedLot.remainingQuantity && (
                <p className="text-xs text-red-500 mt-1">Exceeds available stock ({selectedLot.remainingQuantity} {selectedLot.unit})</p>
              )}
            </div>

            <div>
              <label className="form-label">Purpose *</label>
              <textarea className="form-textarea" rows={2} placeholder="Intended use..." value={purpose} onChange={e => setPurpose(e.target.value)} required />
            </div>

            <div>
              <label className="form-label">Checked Out By *</label>
              <select className="form-input" value={checkedOutBy} onChange={e => setCheckedOutBy(e.target.value)} required>
                <option value="">Select person...</option>
                {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={!!(selectedLot && parseFloat(quantity) > selectedLot.remainingQuantity)}
              className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <PackageMinus className="w-4 h-4" /> Record Check-out
            </button>
          </form>
        </div>

        {/* Checkout History Table */}
        <div className="xl:col-span-3 card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Checkout History</h3>
            <span className="text-xs text-slate-400">{checkouts.length} records</span>
          </div>
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Chemical</th>
                  <th className="table-th hidden md:table-cell">Category</th>
                  <th className="table-th">Lot</th>
                  <th className="table-th hidden lg:table-cell">Location</th>
                  <th className="table-th">Qty</th>
                  <th className="table-th hidden sm:table-cell">By</th>
                  <th className="table-th">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentCheckouts.map(co => (
                  <tr key={co.id} className="table-row">
                    <td className="table-td">
                      <p className="font-semibold text-slate-800 text-sm truncate max-w-[120px]">{co.chemicalName}</p>
                    </td>
                    <td className="table-td hidden md:table-cell"><CategoryBadge cat={co.category} /></td>
                    <td className="table-td font-mono text-xs text-blue-600">{co.lotNumber}</td>
                    <td className="table-td hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />{co.location}
                      </span>
                    </td>
                    <td className="table-td text-sm font-semibold">{co.quantity} {co.unit}</td>
                    <td className="table-td hidden sm:table-cell text-xs text-slate-500">{co.checkedOutBy}</td>
                    <td className="table-td text-xs text-slate-400">{co.checkoutDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
