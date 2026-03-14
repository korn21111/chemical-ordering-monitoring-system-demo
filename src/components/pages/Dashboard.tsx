"use client";

import { useApp } from '@/context/AppContext';
import {
  ShoppingCart, Clock, Package, AlertTriangle, TrendingUp, TrendingDown,
  ArrowRight, CheckCircle, XCircle, FlaskConical, MapPin, Users
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import clsx from 'clsx';
import { labLocations, Location } from '@/lib/mockData';

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Pending: 'badge-pending',
    Approved: 'badge-approved',
    Rejected: 'badge-rejected',
    Completed: 'badge-completed',
    Normal: 'badge-normal',
    Warning: 'badge-warning',
    Quarantine: 'badge-quarantine',
  };
  return map[status] || 'badge';
};

const chartData = [
  { month: 'Oct', orders: 4, checkins: 3 },
  { month: 'Nov', orders: 7, checkins: 5 },
  { month: 'Dec', orders: 5, checkins: 4 },
  { month: 'Jan', orders: 9, checkins: 7 },
  { month: 'Feb', orders: 12, checkins: 9 },
  { month: 'Mar', orders: 8, checkins: 6 },
];

const locationColors: Record<Location, { bg: string; border: string; dot: string }> = {
  'Central Lab':   { bg: 'bg-blue-50',   border: 'border-blue-100',   dot: 'bg-blue-500' },
  'QA Lab':        { bg: 'bg-violet-50', border: 'border-violet-100', dot: 'bg-violet-500' },
  'Production Lab':{ bg: 'bg-emerald-50',border: 'border-emerald-100',dot: 'bg-emerald-500' },
  'R&D Lab':       { bg: 'bg-amber-50',  border: 'border-amber-100',  dot: 'bg-amber-500' },
};

export default function Dashboard() {
  const { orders, lots, inspections, transactions, setActiveTab, selectedLocation } = useApp();

  const filterByLoc = <T extends { location?: string }>(arr: T[]) =>
    selectedLocation === 'All Locations' ? arr : arr.filter(x => x.location === selectedLocation);

  const filteredOrders = filterByLoc(orders);
  const filteredLots = filterByLoc(lots);
  const filteredInspections = filterByLoc(inspections);

  const pendingApprovals = filteredOrders.filter(o => o.status === 'Pending').length;
  const totalOrders = filteredOrders.length;
  const availableStock = filteredLots.reduce((s, l) => s + l.remainingQuantity, 0);
  const peroxideWarnings = filteredInspections.filter(i => i.status === 'Warning' || i.status === 'Quarantine').length;

  const recentTxns = [...filterByLoc(transactions)].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const pendingOrders = filteredOrders.filter(o => o.status === 'Pending').slice(0, 4);
  const quarantineLots = filteredInspections.filter(i => i.status === 'Quarantine');
  const warningLots = filteredInspections.filter(i => i.status === 'Warning');
  const lowStockLots = filteredLots.filter(l => l.remainingQuantity / l.receivedQuantity < 0.3 && l.remainingQuantity > 0);

  // Expiring soon (within 90 days from today 2026-03-07)
  const today = new Date('2026-03-07');
  const expiringSoon = filteredLots.filter(l => {
    const days = Math.ceil((new Date(l.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 90;
  });

  return (
    <div className="fade-in space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card">
          <div className="kpi-icon bg-blue-50"><ShoppingCart className="w-6 h-6 text-blue-600" /></div>
          <div>
            <p className="kpi-value">{totalOrders}</p>
            <p className="kpi-label">Total Orders</p>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +3 this week
            </p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon bg-amber-50"><Clock className="w-6 h-6 text-amber-600" /></div>
          <div>
            <p className="kpi-value">{pendingApprovals}</p>
            <p className="kpi-label">Pending Approvals</p>
            <p className="text-xs text-amber-600 font-medium mt-1">Awaiting review</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon bg-emerald-50"><Package className="w-6 h-6 text-emerald-600" /></div>
          <div>
            <p className="kpi-value">{availableStock.toFixed(1)}</p>
            <p className="kpi-label">Available Stock (units)</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{filteredLots.length} active lots</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon bg-red-50"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
          <div>
            <p className="kpi-value">{peroxideWarnings}</p>
            <p className="kpi-label">Peroxide Warnings</p>
            <p className="text-xs text-red-600 font-medium mt-1">{quarantineLots.length} quarantined</p>
          </div>
        </div>
      </div>

      {/* Location Summary Cards */}
      {selectedLocation === 'All Locations' && (
        <div>
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            Location Summary
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {labLocations.map(lab => {
              const locOrders = orders.filter(o => o.location === lab.name);
              const locLots = lots.filter(l => l.location === lab.name);
              const locPending = locOrders.filter(o => o.status === 'Pending').length;
              const locStock = locLots.reduce((s, l) => s + l.remainingQuantity, 0);
              const colors = locationColors[lab.name];
              return (
                <div key={lab.id} className={clsx('rounded-2xl border p-4 space-y-3', colors.bg, colors.border)}>
                  <div className="flex items-center gap-2">
                    <div className={clsx('w-2.5 h-2.5 rounded-full flex-shrink-0', colors.dot)} />
                    <p className="font-bold text-slate-800 text-sm">{lab.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400">Stock</p>
                      <p className="font-bold text-slate-700">{locStock.toFixed(1)} units</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Pending</p>
                      <p className={clsx('font-bold', locPending > 0 ? 'text-amber-600' : 'text-slate-700')}>{locPending}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Lots</p>
                      <p className="font-bold text-slate-700">{locLots.length}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Focal Point</p>
                      <p className="font-bold text-slate-700 truncate">{lab.focalPoint.split(' ')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 border-t border-black/5">
                    <Users className="w-3 h-3 text-slate-400" />
                    <p className="text-xs text-slate-500 truncate">{lab.approver}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chart + Alerts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders Chart */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Order &amp; Check-in Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 6 months activity</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="checkins" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }} />
              <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} fill="url(#orders)" name="Orders" />
              <Area type="monotone" dataKey="checkins" stroke="#10b981" strokeWidth={2} fill="url(#checkins)" name="Check-ins" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500" />Orders</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" />Check-ins</span>
          </div>
        </div>

        {/* Peroxide Alert Widget */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-red-500" />
              Peroxide Alerts
            </h3>
            <button onClick={() => setActiveTab('peroxide-monitoring')} className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-0">
            {[...quarantineLots, ...warningLots].map(ins => (
              <div key={ins.id} className="alert-item">
                <div className={clsx('alert-dot', ins.status === 'Quarantine' ? 'bg-red-500' : 'bg-amber-400')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{ins.chemicalName}</p>
                  <p className="text-xs text-slate-400">Lot {ins.lotNumber}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={clsx('badge text-xs', ins.status === 'Quarantine' ? 'badge-quarantine' : 'badge-warning')}>
                      {ins.status}
                    </span>
                    <span className="text-xs text-slate-500">{ins.ppmValue} ppm</span>
                  </div>
                </div>
              </div>
            ))}
            {quarantineLots.length === 0 && warningLots.length === 0 && (
              <p className="text-sm text-emerald-600 text-center py-6">✓ No active alerts</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
            <button onClick={() => setActiveTab('transaction-history')} className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">ID</th>
                  <th className="table-th">Type</th>
                  <th className="table-th hidden sm:table-cell">Item</th>
                  <th className="table-th hidden md:table-cell">Location</th>
                  <th className="table-th">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTxns.map(txn => (
                  <tr key={txn.id} className="table-row">
                    <td className="table-td font-mono text-xs text-blue-600">{txn.id}</td>
                    <td className="table-td">
                      <span className={clsx('badge text-xs',
                        txn.type === 'Approved' ? 'badge-approved' :
                        txn.type === 'Rejected' ? 'badge-rejected' :
                        txn.type === 'Check-in' ? 'bg-blue-100 text-blue-700' :
                        txn.type === 'Check-out' ? 'bg-purple-100 text-purple-700' :
                        txn.type === 'Inspection' ? 'bg-teal-100 text-teal-700' :
                        txn.type === 'Shelf Life Extended' ? 'bg-indigo-100 text-indigo-700' :
                        'badge-pending'
                      )}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="table-td hidden sm:table-cell truncate max-w-[140px] text-sm">{txn.chemicalName}</td>
                    <td className="table-td hidden md:table-cell text-slate-500 text-xs">
                      {txn.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{txn.location}</span>}
                    </td>
                    <td className="table-td text-slate-400 text-xs">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Pending + Expiring Soon */}
        <div className="space-y-5">
          {/* Pending Approvals */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Pending Approvals</h3>
              <button onClick={() => setActiveTab('approvals')} className="text-xs text-blue-600 hover:underline">Review →</button>
            </div>
            <div className="space-y-3">
              {pendingOrders.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No pending approvals</p>
              ) : pendingOrders.map(o => (
                <div key={o.id} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{o.chemicalName}</p>
                    <p className="text-xs text-slate-500">{o.quantity} {o.unit} · {o.requester}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{o.location} · {o.requestDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Expiring Soon</h3>
              <button onClick={() => setActiveTab('extend-shelf-life')} className="text-xs text-blue-600 hover:underline">Manage →</button>
            </div>
            <div className="space-y-3">
              {expiringSoon.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No lots expiring soon</p>
              ) : expiringSoon.slice(0, 4).map(l => {
                const days = Math.ceil((new Date(l.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={l.id} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <TrendingDown className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{l.chemicalName}</p>
                      <p className="text-xs text-slate-500">Lot {l.lotNumber}</p>
                      <p className="text-xs text-amber-600 font-medium mt-0.5">{days}d until expiry · {l.location}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
