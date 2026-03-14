"use client";

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { chemicals, teamMembers, ChemicalCategory, Location } from '@/lib/mockData';
import { PlusCircle, CheckCircle, FlaskConical, MapPin } from 'lucide-react';
import clsx from 'clsx';

const CATEGORIES: ChemicalCategory[] = ['Chemicals/Reagents', 'Calibration STD', 'Gas', 'Material Supply/Consumables', 'Peroxide'];
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

export default function OrderRequest() {
  const { orders, addOrder, selectedLocation } = useApp();

  const [chemId, setChemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purpose, setPurpose] = useState('');
  const [requester, setRequester] = useState('');
  const [location, setLocation] = useState<Location>(
    selectedLocation !== 'All Locations' ? selectedLocation as Location : 'Central Lab'
  );
  const [filterCat, setFilterCat] = useState('All');
  const [success, setSuccess] = useState(false);

  const filteredChems = filterCat === 'All' ? chemicals : chemicals.filter(c => c.category === filterCat);
  const selectedChem = chemicals.find(c => c.id === chemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chemId || !quantity || !purpose || !requester) return;
    const chem = chemicals.find(c => c.id === chemId)!;
    addOrder({
      chemicalId: chem.id,
      chemicalName: chem.name,
      category: chem.category,
      quantity: parseFloat(quantity),
      unit: chem.unit,
      purpose,
      requester,
      location,
    });
    setChemId(''); setQuantity(''); setPurpose(''); setRequester('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const recentOrders = [...orders]
    .sort((a, b) => b.requestDate.localeCompare(a.requestDate))
    .slice(0, 6);

  const statusBadge = (s: string) =>
    s === 'Pending' ? 'badge-pending' :
    s === 'Approved' ? 'badge-approved' :
    s === 'Rejected' ? 'badge-rejected' : 'badge-completed';

  return (
    <div className="fade-in space-y-6">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Order submitted successfully! Awaiting approval.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Order Form */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">New Order Request</h3>
              <p className="text-xs text-slate-400">Fill in details to submit</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Filter */}
            <div>
              <label className="form-label">Filter by Category</label>
              <select className="form-input" value={filterCat} onChange={e => { setFilterCat(e.target.value); setChemId(''); }}>
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Chemical Selection */}
            <div>
              <label className="form-label">Item / Chemical *</label>
              <select className="form-input" value={chemId} onChange={e => setChemId(e.target.value)} required>
                <option value="">Select an item...</option>
                {filteredChems.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.unit}) [{c.category}]</option>
                ))}
              </select>
            </div>

            {/* Show selected item details */}
            {selectedChem && (
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Category</span>
                  <CategoryBadge cat={selectedChem.category} />
                </div>
                {selectedChem.casNumber !== 'N/A' && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">CAS Number</span>
                    <span className="font-mono font-semibold text-slate-700">{selectedChem.casNumber}</span>
                  </div>
                )}
                {selectedChem.cylinderId && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Cylinder ID</span>
                    <span className="font-mono font-semibold text-slate-700">{selectedChem.cylinderId}</span>
                  </div>
                )}
                {selectedChem.isPeroxide && (
                  <div className="flex items-center gap-1.5 text-orange-600 font-semibold">
                    <FlaskConical className="w-3.5 h-3.5" />
                    Peroxide-forming — inspection required
                  </div>
                )}
                {selectedChem.minStock !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Min Stock</span>
                    <span className="font-semibold text-slate-700">{selectedChem.minStock} {selectedChem.unit}</span>
                  </div>
                )}
                {selectedChem.isRegulated && (
                  <div className="text-red-600 font-semibold flex items-center gap-1">⚠ Regulated item — compliance required</div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Quantity *</label>
                <input type="number" min="0.01" step="any" className="form-input" placeholder="e.g. 5" value={quantity} onChange={e => setQuantity(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Unit</label>
                <div className="form-input bg-slate-50 text-slate-500">{selectedChem?.unit || '—'}</div>
              </div>
            </div>

            <div>
              <label className="form-label">Location *</label>
              <select className="form-input" value={location} onChange={e => setLocation(e.target.value as Location)} required>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Purpose / Justification *</label>
              <textarea className="form-textarea" rows={3} placeholder="Describe the intended use..." value={purpose} onChange={e => setPurpose(e.target.value)} required />
            </div>

            <div>
              <label className="form-label">Requested By *</label>
              <select className="form-input" value={requester} onChange={e => setRequester(e.target.value)} required>
                <option value="">Select requester...</option>
                {teamMembers.map(m => <option key={m.id} value={m.name}>{m.name} ({m.role})</option>)}
              </select>
            </div>

            <button type="submit" className="btn-primary w-full justify-center">
              <PlusCircle className="w-4 h-4" /> Submit Order Request
            </button>
          </form>
        </div>

        {/* Recent Orders */}
        <div className="xl:col-span-3 card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Orders</h3>
            <span className="text-xs text-slate-400">{orders.length} total</span>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.map(order => (
              <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs text-blue-600 font-semibold">{order.id}</span>
                      <span className={clsx('badge', statusBadge(order.status))}>{order.status}</span>
                      <CategoryBadge cat={order.category} />
                    </div>
                    <p className="font-semibold text-slate-800 text-sm truncate">{order.chemicalName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{order.quantity} {order.unit} · {order.requester}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{order.location}</span>
                      <span>{order.requestDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
