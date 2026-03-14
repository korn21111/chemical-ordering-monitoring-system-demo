"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  chemicals,
  initialOrders,
  initialLots,
  initialCheckouts,
  initialInspections,
  initialTransactions,
  initialShelfLifeExtensions,
  initialRegulatoryRecords,
  currentUser,
  Chemical,
  Order,
  InventoryLot,
  CheckoutRecord,
  PeroxideInspection,
  Transaction,
  ShelfLifeExtension,
  RegulatoryRecord,
  InspectionStatus,
  TransactionType,
  Location,
  ChemicalCategory,
} from '@/lib/mockData';

interface AppContextType {
  // Data
  chemicals: Chemical[];
  orders: Order[];
  lots: InventoryLot[];
  checkouts: CheckoutRecord[];
  inspections: PeroxideInspection[];
  transactions: Transaction[];
  shelfLifeExtensions: ShelfLifeExtension[];
  regulatoryRecords: RegulatoryRecord[];
  currentUser: typeof currentUser;

  // Location
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;

  // Order Actions
  addOrder: (order: Omit<Order, 'id' | 'requestDate' | 'status'>) => void;
  approveOrder: (orderId: string, approver: string) => void;
  rejectOrder: (orderId: string, approver: string, reason: string) => void;

  // Inventory Actions
  addLot: (lot: Omit<InventoryLot, 'id' | 'remainingQuantity'>) => void;
  addCheckout: (checkout: Omit<CheckoutRecord, 'id' | 'checkoutDate'>) => void;
  addInspection: (inspection: Omit<PeroxideInspection, 'id' | 'status'>) => void;

  // Shelf Life Extension Actions
  requestExtension: (ext: Omit<ShelfLifeExtension, 'id' | 'requestDate' | 'status'>) => void;
  approveExtension: (extId: string, approver: string) => void;
  rejectExtension: (extId: string, approver: string, reason: string) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getPpmStatus = (ppm: number): InspectionStatus => {
  if (ppm > 100) return 'Quarantine';
  if (ppm >= 25) return 'Warning';
  return 'Normal';
};

let txnCounter = initialTransactions.length + 1;
let ordCounter = initialOrders.length + 1;
let lotCounter = initialLots.length + 1;
let coCounter = initialCheckouts.length + 1;
let insCounter = initialInspections.length + 1;
let extCounter = initialShelfLifeExtensions.length + 1;

const pad = (n: number, prefix: string) => `${prefix}${String(n).padStart(3, '0')}`;
const today = () => new Date().toISOString().slice(0, 10);

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [lots, setLots] = useState<InventoryLot[]>(initialLots);
  const [checkouts, setCheckouts] = useState<CheckoutRecord[]>(initialCheckouts);
  const [inspections, setInspections] = useState<PeroxideInspection[]>(initialInspections);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [shelfLifeExtensions, setShelfLifeExtensions] = useState<ShelfLifeExtension[]>(initialShelfLifeExtensions);
  const [regulatoryRecords] = useState<RegulatoryRecord[]>(initialRegulatoryRecords);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');

  const addTxn = (t: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...t, id: pad(txnCounter++, 'TXN-') }, ...prev]);
  };

  // ─── Order Actions ─────────────────────────────────────────────────────────
  const addOrder = (order: Omit<Order, 'id' | 'requestDate' | 'status'>) => {
    const id = pad(ordCounter++, 'ORD-');
    const newOrder: Order = { ...order, id, requestDate: today(), status: 'Pending' };
    setOrders(prev => [newOrder, ...prev]);
    addTxn({ type: 'Order Created', chemicalName: order.chemicalName, category: order.category, quantity: order.quantity, unit: order.unit, user: order.requester, date: today(), relatedId: id, location: order.location });
  };

  const approveOrder = (orderId: string, approver: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Approved', approver, approveDate: today() } : o));
    const order = orders.find(o => o.id === orderId);
    if (order) addTxn({ type: 'Approved', chemicalName: order.chemicalName, category: order.category, quantity: order.quantity, unit: order.unit, user: approver, date: today(), relatedId: orderId, status: 'Approved', location: order.location });
  };

  const rejectOrder = (orderId: string, approver: string, reason: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Rejected', approver, approveDate: today(), rejectReason: reason } : o));
    const order = orders.find(o => o.id === orderId);
    if (order) addTxn({ type: 'Rejected', chemicalName: order.chemicalName, category: order.category, quantity: order.quantity, unit: order.unit, user: approver, date: today(), relatedId: orderId, status: 'Rejected', remarks: reason, location: order.location });
  };

  // ─── Inventory Actions ─────────────────────────────────────────────────────
  const addLot = (lot: Omit<InventoryLot, 'id' | 'remainingQuantity'>) => {
    const id = pad(lotCounter++, 'LOT-');
    const newLot: InventoryLot = { ...lot, id, remainingQuantity: lot.receivedQuantity };
    setLots(prev => [newLot, ...prev]);
    setOrders(prev => prev.map(o => o.id === lot.orderId ? { ...o, status: 'Completed' } : o));
    addTxn({ type: 'Check-in', chemicalName: lot.chemicalName, category: lot.category, quantity: lot.receivedQuantity, unit: lot.unit, user: lot.receivedBy, date: today(), relatedId: id, remarks: `Lot ${lot.lotNumber}`, location: lot.location });
  };

  const addCheckout = (checkout: Omit<CheckoutRecord, 'id' | 'checkoutDate'>) => {
    const id = pad(coCounter++, 'CO-');
    const newCo: CheckoutRecord = { ...checkout, id, checkoutDate: today() };
    setCheckouts(prev => [newCo, ...prev]);
    setLots(prev => prev.map(l => l.id === checkout.lotId ? { ...l, remainingQuantity: l.remainingQuantity - checkout.quantity } : l));
    addTxn({ type: 'Check-out', chemicalName: checkout.chemicalName, category: checkout.category, quantity: checkout.quantity, unit: checkout.unit, user: checkout.checkedOutBy, date: today(), relatedId: id, remarks: `Lot ${checkout.lotNumber}`, location: checkout.location });
  };

  const addInspection = (inspection: Omit<PeroxideInspection, 'id' | 'status'>) => {
    const id = pad(insCounter++, 'INS-');
    const status = getPpmStatus(inspection.ppmValue);
    const newIns: PeroxideInspection = { ...inspection, id, status };
    setInspections(prev => [newIns, ...prev]);
    addTxn({ type: 'Inspection', chemicalName: inspection.chemicalName, category: 'Peroxide', user: inspection.inspector, date: today(), relatedId: id, status, remarks: `${inspection.ppmValue} ppm - ${inspection.remarks}`, location: inspection.location });
  };

  // ─── Shelf Life Extension Actions ──────────────────────────────────────────
  const requestExtension = (ext: Omit<ShelfLifeExtension, 'id' | 'requestDate' | 'status'>) => {
    const id = pad(extCounter++, 'EXT-');
    const newExt: ShelfLifeExtension = { ...ext, id, requestDate: today(), status: 'Pending' };
    setShelfLifeExtensions(prev => [newExt, ...prev]);
    addTxn({ type: 'Shelf Life Extended', chemicalName: ext.chemicalName, category: ext.category, user: ext.requestedBy, date: today(), relatedId: id, status: 'Pending', remarks: `Request: ${ext.oldExpiryDate} → ${ext.newExpiryDate}`, location: ext.location });
  };

  const approveExtension = (extId: string, approver: string) => {
    const ext = shelfLifeExtensions.find(e => e.id === extId);
    if (!ext) return;
    setShelfLifeExtensions(prev => prev.map(e => e.id === extId ? { ...e, status: 'Approved', approvedBy: approver, reviewDate: today() } : e));
    // Update the lot's expiry date
    setLots(prev => prev.map(l => l.id === ext.lotId ? { ...l, expiryDate: ext.newExpiryDate } : l));
    addTxn({ type: 'Shelf Life Extended', chemicalName: ext.chemicalName, category: ext.category, user: approver, date: today(), relatedId: extId, status: 'Approved', remarks: `Approved: expiry updated to ${ext.newExpiryDate}`, location: ext.location });
  };

  const rejectExtension = (extId: string, approver: string, reason: string) => {
    const ext = shelfLifeExtensions.find(e => e.id === extId);
    if (!ext) return;
    setShelfLifeExtensions(prev => prev.map(e => e.id === extId ? { ...e, status: 'Rejected', approvedBy: approver, reviewDate: today(), rejectReason: reason } : e));
    addTxn({ type: 'Shelf Life Extended', chemicalName: ext.chemicalName, category: ext.category, user: approver, date: today(), relatedId: extId, status: 'Rejected', remarks: `Rejected: ${reason}`, location: ext.location });
  };

  return (
    <AppContext.Provider value={{
      chemicals, orders, lots, checkouts, inspections, transactions,
      shelfLifeExtensions, regulatoryRecords, currentUser,
      selectedLocation, setSelectedLocation,
      addOrder, approveOrder, rejectOrder,
      addLot, addCheckout, addInspection,
      requestExtension, approveExtension, rejectExtension,
      activeTab, setActiveTab,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
