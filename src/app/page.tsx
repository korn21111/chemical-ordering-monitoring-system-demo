"use client";

import { useApp } from '@/context/AppContext';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/components/pages/Dashboard';
import OrderRequest from '@/components/pages/OrderRequest';
import Approvals from '@/components/pages/Approvals';
import CheckIn from '@/components/pages/CheckIn';
import CheckOut from '@/components/pages/CheckOut';
import PeroxideMonitoring from '@/components/pages/PeroxideMonitoring';
import TransactionHistory from '@/components/pages/TransactionHistory';
import Settings from '@/components/pages/Settings';
import ExtendShelfLife from '@/components/pages/ExtendShelfLife';
import RegulatoryRelated from '@/components/pages/RegulatoryRelated';

function PageContent() {
  const { activeTab } = useApp();

  const pages: Record<string, React.ReactNode> = {
    'dashboard': <Dashboard />,
    'order-request': <OrderRequest />,
    'approvals': <Approvals />,
    'check-in': <CheckIn />,
    'check-out': <CheckOut />,
    'peroxide-monitoring': <PeroxideMonitoring />,
    'transaction-history': <TransactionHistory />,
    'extend-shelf-life': <ExtendShelfLife />,
    'regulatory': <RegulatoryRelated />,
    'settings': <Settings />,
  };

  return <>{pages[activeTab] || <Dashboard />}</>;
}

export default function Home() {
  return (
    <AppLayout>
      <PageContent />
    </AppLayout>
  );
}
