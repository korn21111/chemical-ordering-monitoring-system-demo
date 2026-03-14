"use client";

import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard, ClipboardList, CheckCircle, PackagePlus, PackageMinus,
  FlaskConical, History, Settings, X, Beaker, ChevronRight,
  CalendarClock, Shield
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
  { id: 'order-request', label: 'Order Request', icon: ClipboardList, section: 'main' },
  { id: 'approvals', label: 'Approvals', icon: CheckCircle, section: 'main' },
  { id: 'check-in', label: 'Check-in', icon: PackagePlus, section: 'main' },
  { id: 'check-out', label: 'Check-out', icon: PackageMinus, section: 'main' },
  { id: 'peroxide-monitoring', label: 'Peroxide Monitoring', icon: FlaskConical, section: 'main' },
  { id: 'transaction-history', label: 'Transaction History', icon: History, section: 'main' },
  { id: 'extend-shelf-life', label: 'Extend Shelf Life', icon: CalendarClock, section: 'compliance' },
  { id: 'regulatory', label: 'Regulatory', icon: Shield, section: 'compliance' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'system' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { activeTab, setActiveTab, orders, shelfLifeExtensions } = useApp();
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const pendingExtensions = shelfLifeExtensions.filter(e => e.status === 'Pending').length;

  const handleNav = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  const mainItems = navItems.filter(n => n.section === 'main');
  const complianceItems = navItems.filter(n => n.section === 'compliance');
  const systemItems = navItems.filter(n => n.section === 'system');

  const renderItem = (item: typeof navItems[0]) => {
    const { id, label, icon: Icon } = item;
    return (
      <button
        key={id}
        onClick={() => handleNav(id)}
        className={clsx(
          "sidebar-item w-full text-left",
          activeTab === id && "active"
        )}
      >
        <Icon style={{ width: '18px', height: '18px' }} className="flex-shrink-0" />
        <span className="flex-1">{label}</span>
        {id === 'approvals' && pendingCount > 0 && (
          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {pendingCount}
          </span>
        )}
        {id === 'extend-shelf-life' && pendingExtensions > 0 && (
          <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {pendingExtensions}
          </span>
        )}
        {activeTab === id && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 ease-in-out",
        "w-64 bg-gradient-to-b from-slate-800 to-slate-900",
        "lg:translate-x-0 lg:z-auto lg:static lg:flex",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Beaker className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-tight">LabChem</p>
            <p className="text-slate-400 text-xs truncate">Ordering &amp; Monitoring</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Section */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto sidebar-scroll space-y-0.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 pb-2">Main Menu</p>
          {mainItems.map(renderItem)}

          <div className="pt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 pb-2">Compliance</p>
            {complianceItems.map(renderItem)}
          </div>

          <div className="pt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 pb-2">System</p>
            {systemItems.map(renderItem)}
          </div>
        </nav>

        {/* User Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              TP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">Thanakorn P.</p>
              <p className="text-slate-400 text-xs">Staff / Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
