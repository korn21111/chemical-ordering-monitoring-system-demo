"use client";

import { useApp } from '@/context/AppContext';
import { Settings as SettingsIcon, Users, MapPin, Bell, Shield, Package } from 'lucide-react';
import { labLocations } from '@/lib/mockData';
import clsx from 'clsx';

const locationColors: Record<string, { dot: string; bg: string; border: string }> = {
  'Central Lab':    { dot: 'bg-blue-500',    bg: 'bg-blue-50',    border: 'border-blue-100' },
  'QA Lab':         { dot: 'bg-violet-500',  bg: 'bg-violet-50',  border: 'border-violet-100' },
  'Production Lab': { dot: 'bg-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  'R&D Lab':        { dot: 'bg-amber-500',   bg: 'bg-amber-50',   border: 'border-amber-100' },
};

const CATEGORIES = [
  { name: 'Chemicals/Reagents', desc: 'Solvents, acids, bases, reagents. Supports expiry tracking, lot management, and peroxide workflow.', badge: 'bg-blue-100 text-blue-700' },
  { name: 'Calibration STD', desc: 'Reference standards and buffer solutions. ISO-traceable. Certificate management and expiry control.', badge: 'bg-violet-100 text-violet-700' },
  { name: 'Gas', desc: 'Compressed gas cylinders. Cylinder ID tracking, location assignment, and safety compliance.', badge: 'bg-sky-100 text-sky-700' },
  { name: 'Material Supply/Consumables', desc: 'Lab consumables (gloves, filters, wipes). Minimum stock tracking, no peroxide workflow.', badge: 'bg-teal-100 text-teal-700' },
  { name: 'Peroxide', desc: 'Peroxide-forming chemicals requiring periodic PPM inspection and special storage.', badge: 'bg-orange-100 text-orange-700' },
];

export default function Settings() {
  const { chemicals, lots, orders } = useApp();

  return (
    <div className="fade-in space-y-6 max-w-4xl">
      {/* System Info */}
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">System Information</h3>
            <p className="text-xs text-slate-400">Chemical Ordering and Peroxide Monitoring System</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Items', value: chemicals.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Lots', value: lots.length, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Total Orders', value: orders.length, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Lab Locations', value: labLocations.length, icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(s => (
            <div key={s.label} className={clsx('rounded-xl p-4 flex items-center gap-3', s.bg)}>
              <s.icon className={clsx('w-5 h-5', s.color)} />
              <div>
                <p className={clsx('text-xl font-bold', s.color)}>{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locations & Focal Points */}
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Lab Locations &amp; Focal Points</h3>
            <p className="text-xs text-slate-400">4 locations sharing one system database</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {labLocations.map(lab => {
            const colors = locationColors[lab.name] || { dot: 'bg-slate-400', bg: 'bg-slate-50', border: 'border-slate-100' };
            const locLots = lots.filter(l => l.location === lab.name).length;
            const locOrders = orders.filter(o => o.location === lab.name).length;
            return (
              <div key={lab.id} className={clsx('rounded-2xl border p-5 space-y-4', colors.bg, colors.border)}>
                <div className="flex items-center gap-2.5">
                  <div className={clsx('w-3 h-3 rounded-full flex-shrink-0', colors.dot)} />
                  <div>
                    <p className="font-bold text-slate-800">{lab.name}</p>
                    <p className="text-xs text-slate-500">{lab.building} · {lab.room}</p>
                  </div>
                  <span className="ml-auto text-xs font-mono text-slate-400 bg-white/80 px-2 py-0.5 rounded-lg border">{lab.code}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Focal Point</p>
                    <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />{lab.focalPoint}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Approver</p>
                    <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />{lab.approver}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-black/5 text-xs text-slate-500">
                  <span>{locLots} lots in inventory</span>
                  <span>·</span>
                  <span>{locOrders} orders total</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Configuration */}
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Item Categories</h3>
            <p className="text-xs text-slate-400">Configured categories and their handling rules</p>
          </div>
        </div>
        <div className="space-y-3">
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className={clsx('badge shrink-0 mt-0.5', cat.badge)}>{cat.name}</span>
              <p className="text-sm text-slate-600 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Notification Rules</h3>
            <p className="text-xs text-slate-400">Automated alert thresholds</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Peroxide Warning Threshold', value: '25 ppm', note: 'Alert sent to focal point' },
            { label: 'Peroxide Quarantine Threshold', value: '100 ppm', note: 'Immediate isolation required' },
            { label: 'Low Stock Threshold', value: '30% remaining', note: 'Reorder notification triggered' },
            { label: 'Expiry Warning Window', value: '90 days', note: 'Appears in Expiring Soon widget' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-400">{item.note}</p>
              </div>
              <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team / Users */}
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-slate-600" />
          </div>
          <h3 className="font-bold text-slate-800">Team Members</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'Dr. Siriwan K.', role: 'Requester / R&D Lab', avatar: 'SK', color: 'bg-purple-500' },
            { name: 'Assoc. Prof. Nattapong T.', role: 'Approver (Central/Production/R&D)', avatar: 'NT', color: 'bg-blue-600' },
            { name: 'Thanakorn P.', role: 'Staff / Admin · Central Lab FP', avatar: 'TP', color: 'bg-emerald-500' },
            { name: 'Nattiya R.', role: 'Staff · QA Lab FP', avatar: 'NR', color: 'bg-amber-500' },
            { name: 'Kittipong S.', role: 'Requester · Production Lab FP', avatar: 'KS', color: 'bg-rose-500' },
          ].map(m => (
            <div key={m.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0', m.color)}>
                {m.avatar}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{m.name}</p>
                <p className="text-xs text-slate-400">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
