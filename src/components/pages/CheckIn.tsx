"use client";

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { chemicals, teamMembers, ChemicalCategory, Location } from '@/lib/mockData';
import { PackagePlus, CheckCircle, MapPin } from 'lucide-react';
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

export default function CheckIn() {
  const { orders, lots, addLot, selectedLocation } = useApp();

  const approvedOrders = orders.filter(o => o.status === 'Approved');

  const [orderId, setOrderId] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [receivedQty, setReceivedQty] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [receivedBy, setReceivedBy] = useState('');
  const [location, setLocation] = useState<Location>(
    selectedLocation !== 'All Locations' ? selectedLocation as Location : 'Central Lab'
  );
  const [success, setSuccess] = useState(false);

  const selectedOrder = orders.find(o => o.id === orderId);
  const selectedChem = selectedOrder ? chemicals.find(c => c.id === selectedOrder.chemicalId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !lotNumber || !receivedQty || !expiryDate || !receivedBy) return;
    const order = orders.find(o => o.id === orderId)!;
    const chem = chemicals.find(c => c.id === order.chemicalId)!;
    addLot({
      orderId: order.id,
      chemicalId: order.chemicalId,
      chemicalName: order.chemicalName,
      category: order.category,
      lotNumber,
      receivedQuantity: parseFloat(receivedQty),
      unit: chem.unit,
      receivedDate: new Date().toISOString().slice(0, 10),
      expiryDate,
      receivedBy,
      isPeroxide: chem.isPeroxide,
      location,
    });
    setOrderId(''); setLotNumber(''); setReceivedQty(''); setExpiryDate(''); setReceivedBy('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const recentLots = [...lots]
    .sort((a, b) => b.receivedDate.localeCompare(a.receivedDate))
    .slice(0, 8);

  return (
    <div className="fade-in space-y-6">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Chemical received and added to inventory successfully!
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Check-in Form */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
              <PackagePlus className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Receive Chemical</h3>
              <p className="text-xs text-slate-400">Record a new lot from approved order</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Approved Order *</label>
              <select className="form-input" value={orderId} onChange={e => setOrderId(e.target.value)} required>
                <option value="">Select approved order...</option>
                {approvedOrders.map(o => (
                  <option key={o.id} value={o.id}>{o.id} — {o.chemicalName} ({o.quantity} {o.unit}) [{o.location}]</option>
                ))}
              </select>
              {approvedOrders.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">No approved orders pending check-in.</p>
              )}
            </div>

            {selectedOrder && selectedChem && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 fade-in">
                <div className="flex justify-between">
                  <span className="text-slate-500">Chemical</span>
                  <span className="font-semibold text-slate-700">{selectedOrder.chemicalName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Category</span>
                  <CategoryBadge cat={selectedOrder.category} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ordered Qty</span>
                  <span className="font-semibold text-slate-700">{selectedOrder.quantity} {selectedChem.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location</span>
                  <span className="font-semibold text-slate-700">{selectedOrder.location}</span>
                </div>
                {selectedChem.isPeroxide && (
                  <p className="text-orange-600 font-semibold">⚠ Peroxide-forming — schedule inspection</p>
                )}
              </div>
            )}

            <div>
              <label className="form-label">Lot Number *</label>
              <input type="text" className="form-input" placeholder="e.g. HP-2026-0001" value={lotNumber} onChange={e => setLotNumber(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Received Qty *</label>
                <input type="number" min="0.01" step="any" className="form-input" placeholder="Qty" value={receivedQty} onChange={e => setReceivedQty(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Unit</label>
                <div className="form-input bg-slate-50 text-slate-500">{selectedChem?.unit || '—'}</div>
              </div>
            </div>

            <div>
              <label className="form-label">Expiry Date *</label>
              <input type="date" className="form-input" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required />
            </div>

            <div>
              <label className="form-label">Storage Location *</label>
              <select className="form-input" value={location} onChange={e => setLocation(e.target.value as Location)} required>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Received By *</label>
              <select className="form-input" value={receivedBy} onChange={e => setReceivedBy(e.target.value)} required>
                <option value="">Select person...</option>
                {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
            </div>

            <button type="submit" className="btn-primary w-full justify-center">
              <PackagePlus className="w-4 h-4" /> Record Check-in
            </button>
          </form>
        </div>

        {/* Inventory Table */}
        <div className="xl:col-span-3 card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Received Lots</h3>
            <span className="text-xs text-slate-400">{lots.length} lots total</span>
          </div>
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Chemical</th>
                  <th className="table-th hidden md:table-cell">Category</th>
                  <th className="table-th">Lot No.</th>
                  <th className="table-th hidden lg:table-cell">Location</th>
                  <th className="table-th">Qty</th>
                  <th className="table-th hidden sm:table-cell">Expiry</th>
                </tr>
              </thead>
              <tbody>
                {recentLots.map(lot => (
                  <tr key={lot.id} className="table-row">
                    <td className="table-td">
                      <p className="font-semibold text-slate-800 text-sm truncate max-w-[130px]">{lot.chemicalName}</p>
                      <p className="text-xs text-slate-400">{lot.receivedDate}</p>
                    </td>
                    <td className="table-td hidden md:table-cell"><CategoryBadge cat={lot.category} /></td>
                    <td className="table-td font-mono text-xs text-blue-600">{lot.lotNumber}</td>
                    <td className="table-td hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />{lot.location}
                      </span>
                    </td>
                    <td className="table-td">
                      <p className="text-sm font-semibold">{lot.remainingQuantity}/{lot.receivedQuantity}</p>
                      <p className="text-xs text-slate-400">{lot.unit}</p>
                    </td>
                    <td className="table-td hidden sm:table-cell text-xs text-slate-500">{lot.expiryDate}</td>
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
