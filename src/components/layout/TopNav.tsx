"use client";

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Menu, Search, Bell, ChevronDown, FlaskConical, MapPin, Check } from 'lucide-react';
import clsx from 'clsx';

const ALL_LOCATIONS = 'All Locations';
const locations = [ALL_LOCATIONS, 'Central Lab', 'QA Lab', 'Production Lab', 'R&D Lab'];

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  'dashboard': { title: 'Dashboard', subtitle: 'Overview of your chemical management system' },
  'order-request': { title: 'Order Request', subtitle: 'Submit new chemical order requests' },
  'approvals': { title: 'Approvals', subtitle: 'Review and process pending requests' },
  'check-in': { title: 'Check-in', subtitle: 'Record received chemical inventory' },
  'check-out': { title: 'Check-out', subtitle: 'Dispense chemicals from inventory' },
  'peroxide-monitoring': { title: 'Peroxide Monitoring', subtitle: 'Track and inspect peroxide-forming chemicals' },
  'transaction-history': { title: 'Transaction History', subtitle: 'Complete audit trail of all activities' },
  'extend-shelf-life': { title: 'Extend Shelf Life', subtitle: 'Manage expiry date extension requests' },
  'regulatory': { title: 'Regulatory Related', subtitle: 'Compliance and regulatory tracking' },
  'settings': { title: 'Settings', subtitle: 'System configuration and preferences' },
};

interface TopNavProps {
  onMenuClick: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  const { activeTab, orders, inspections, selectedLocation, setSelectedLocation } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const page = pageTitles[activeTab] || { title: 'LabChem', subtitle: '' };

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const quarantineItems = inspections.filter(i => i.status === 'Quarantine');
  const warningItems = inspections.filter(i => i.status === 'Warning');
  const notifCount = pendingOrders.length + quarantineItems.length;

  const notifications = [
    ...pendingOrders.map(o => ({
      id: o.id,
      text: `New order pending: ${o.chemicalName}`,
      sub: `Requested by ${o.requester} · ${o.location}`,
      color: 'bg-amber-500',
    })),
    ...quarantineItems.map(i => ({
      id: i.id,
      text: `⚠ Quarantine: ${i.chemicalName}`,
      sub: `Lot ${i.lotNumber} — ${i.ppmValue} ppm`,
      color: 'bg-red-500',
    })),
    ...warningItems.slice(0, 2).map(i => ({
      id: i.id + 'w',
      text: `Warning: ${i.chemicalName}`,
      sub: `Lot ${i.lotNumber} — ${i.ppmValue} ppm`,
      color: 'bg-amber-400',
    })),
  ];

  const locationColor = selectedLocation === ALL_LOCATIONS
    ? 'bg-slate-100 text-slate-600 border-slate-200'
    : 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <header className="bg-white border-b border-slate-100 px-4 lg:px-6 py-3.5 flex items-center gap-4 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-slate-800 leading-tight">{page.title}</h1>
        <p className="text-xs text-slate-400 hidden sm:block">{page.subtitle}</p>
      </div>

      {/* Location Selector */}
      <div className="relative hidden sm:block">
        <button
          onClick={() => { setShowLocationMenu(!showLocationMenu); setShowNotif(false); }}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors",
            locationColor
          )}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span className="max-w-[110px] truncate">{selectedLocation}</span>
          <ChevronDown className={clsx("w-3.5 h-3.5 transition-transform", showLocationMenu && "rotate-180")} />
        </button>

        {showLocationMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Select Location</p>
            </div>
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => { setSelectedLocation(loc); setShowLocationMenu(false); }}
                className={clsx(
                  "w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors",
                  selectedLocation === loc ? "text-blue-600 font-semibold" : "text-slate-700"
                )}
              >
                {loc}
                {selectedLocation === loc && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            ))}
          </div>
        )}
        {showLocationMenu && (
          <div className="fixed inset-0 z-40" onClick={() => setShowLocationMenu(false)} />
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-48">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-slate-600 placeholder-slate-400 flex-1 focus:outline-none w-full"
        />
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setShowNotif(!showNotif); setShowLocationMenu(false); }}
          className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {notifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </button>

        {showNotif && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-800">Notifications</p>
              <span className="text-xs text-slate-400">{notifications.length} items</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">All caught up!</p>
              ) : notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${n.color}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{n.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {showNotif && (
          <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
        )}
      </div>

      {/* User Badge */}
      <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
          TP
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-700 leading-tight">Thanakorn P.</p>
          <p className="text-xs text-slate-400">Staff / Admin</p>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
      </div>
    </header>
  );
}
