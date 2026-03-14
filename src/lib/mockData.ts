// ─────────────────────────────────────────────────────────────────────────────
// Mock Data for Chemical Ordering and Peroxide Monitoring System
// ─────────────────────────────────────────────────────────────────────────────

export type Location = 'Central Lab' | 'QA Lab' | 'Production Lab' | 'R&D Lab';
export type ChemicalCategory =
  | 'Chemicals/Reagents'
  | 'Calibration STD'
  | 'Gas'
  | 'Material Supply/Consumables'
  | 'Peroxide';
export type OrderStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';
export type InspectionStatus = 'Normal' | 'Warning' | 'Quarantine';
export type TransactionType =
  | 'Order Created'
  | 'Approved'
  | 'Rejected'
  | 'Check-in'
  | 'Check-out'
  | 'Inspection'
  | 'Shelf Life Extended';
export type ExtensionStatus = 'Pending' | 'Approved' | 'Rejected';
export type RegulationStatus = 'Active' | 'Expired' | 'Pending Review';
export type RegulationType =
  | 'Hazardous'
  | 'Controlled Substance'
  | 'Flammable'
  | 'Corrosive'
  | 'Toxic'
  | 'Compressed Gas';

// ─── Location / Lab Data ──────────────────────────────────────────────────────
export interface LabLocation {
  id: string;
  name: Location;
  code: string;
  focalPoint: string;
  approver: string;
  building: string;
  room: string;
  itemCount?: number;
}

export const labLocations: LabLocation[] = [
  {
    id: 'L001',
    name: 'Central Lab',
    code: 'CL',
    focalPoint: 'Thanakorn P.',
    approver: 'Assoc. Prof. Nattapong T.',
    building: 'Science Building A',
    room: 'Room 101',
  },
  {
    id: 'L002',
    name: 'QA Lab',
    code: 'QA',
    focalPoint: 'Nattiya R.',
    approver: 'Dr. Siriwan K.',
    building: 'Quality Block B',
    room: 'Room 205',
  },
  {
    id: 'L003',
    name: 'Production Lab',
    code: 'PL',
    focalPoint: 'Kittipong S.',
    approver: 'Assoc. Prof. Nattapong T.',
    building: 'Production Wing C',
    room: 'Room 310',
  },
  {
    id: 'L004',
    name: 'R&D Lab',
    code: 'RD',
    focalPoint: 'Dr. Siriwan K.',
    approver: 'Assoc. Prof. Nattapong T.',
    building: 'Research Tower D',
    room: 'Room 412',
  },
];

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface Chemical {
  id: string;
  name: string;
  casNumber: string;
  category: ChemicalCategory;
  unit: string;
  isPeroxide: boolean;
  storageLocation: string;
  location: Location;
  minStock?: number;
  cylinderId?: string; // for Gas
  isRegulated?: boolean;
}

export interface Order {
  id: string;
  chemicalId: string;
  chemicalName: string;
  category: ChemicalCategory;
  quantity: number;
  unit: string;
  purpose: string;
  requester: string;
  requestDate: string;
  status: OrderStatus;
  location: Location;
  approver?: string;
  approveDate?: string;
  rejectReason?: string;
}

export interface InventoryLot {
  id: string;
  orderId: string;
  chemicalId: string;
  chemicalName: string;
  category: ChemicalCategory;
  lotNumber: string;
  receivedQuantity: number;
  remainingQuantity: number;
  unit: string;
  receivedDate: string;
  expiryDate: string;
  receivedBy: string;
  isPeroxide: boolean;
  location: Location;
}

export interface CheckoutRecord {
  id: string;
  lotId: string;
  chemicalName: string;
  category: ChemicalCategory;
  lotNumber: string;
  quantity: number;
  unit: string;
  purpose: string;
  checkedOutBy: string;
  checkoutDate: string;
  location: Location;
}

export interface PeroxideInspection {
  id: string;
  lotId: string;
  chemicalName: string;
  lotNumber: string;
  inspectDate: string;
  ppmValue: number;
  inspector: string;
  remarks: string;
  status: InspectionStatus;
  location: Location;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  chemicalName: string;
  category?: ChemicalCategory;
  quantity?: number;
  unit?: string;
  user: string;
  date: string;
  relatedId: string;
  status?: string;
  remarks?: string;
  location?: Location;
}

export interface ShelfLifeExtension {
  id: string;
  lotId: string;
  chemicalName: string;
  category: ChemicalCategory;
  lotNumber: string;
  location: Location;
  oldExpiryDate: string;
  newExpiryDate: string;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  status: ExtensionStatus;
  requestDate: string;
  reviewDate?: string;
  rejectReason?: string;
}

export interface RegulatoryRecord {
  id: string;
  itemName: string;
  itemCode: string;
  category: ChemicalCategory;
  regulationType: RegulationType;
  regulationCode: string;
  location: Location;
  status: RegulationStatus;
  effectiveDate: string;
  expiryDate: string;
  description: string;
  isControlled: boolean;
  linkedLotIds?: string[];
}

// ─── Chemicals ────────────────────────────────────────────────────────────────
export const chemicals: Chemical[] = [
  // Chemicals/Reagents
  { id: 'C001', name: 'Acetone', casNumber: '67-64-1', category: 'Chemicals/Reagents', unit: 'L', isPeroxide: false, storageLocation: 'Cabinet A-1', location: 'Central Lab', isRegulated: false },
  { id: 'C004', name: 'Hydrochloric Acid 37%', casNumber: '7647-01-0', category: 'Chemicals/Reagents', unit: 'L', isPeroxide: false, storageLocation: 'Acid Cabinet B-1', location: 'QA Lab', isRegulated: true },
  { id: 'C005', name: 'Sodium Hydroxide', casNumber: '1310-73-2', category: 'Chemicals/Reagents', unit: 'kg', isPeroxide: false, storageLocation: 'Cabinet C-2', location: 'Central Lab', isRegulated: false },
  { id: 'C006', name: 'Methanol', casNumber: '67-56-1', category: 'Chemicals/Reagents', unit: 'L', isPeroxide: false, storageLocation: 'Cabinet A-2', location: 'Production Lab', isRegulated: true },
  { id: 'C008', name: 'Ethanol 95%', casNumber: '64-17-5', category: 'Chemicals/Reagents', unit: 'L', isPeroxide: false, storageLocation: 'Cabinet A-3', location: 'R&D Lab', isRegulated: false },
  { id: 'C009', name: 'Sulfuric Acid 98%', casNumber: '7664-93-9', category: 'Chemicals/Reagents', unit: 'L', isPeroxide: false, storageLocation: 'Acid Cabinet B-2', location: 'QA Lab', isRegulated: true },
  { id: 'C010', name: 'Isopropyl Alcohol', casNumber: '67-63-0', category: 'Chemicals/Reagents', unit: 'L', isPeroxide: false, storageLocation: 'Cabinet A-4', location: 'Production Lab', isRegulated: false },
  { id: 'C012', name: 'Phosphoric Acid 85%', casNumber: '7664-38-2', category: 'Chemicals/Reagents', unit: 'L', isPeroxide: false, storageLocation: 'Acid Cabinet B-3', location: 'Central Lab', isRegulated: false },

  // Peroxide-forming
  { id: 'C002', name: 'Hydrogen Peroxide 30%', casNumber: '7722-84-1', category: 'Peroxide', unit: 'L', isPeroxide: true, storageLocation: 'Fridge P-1', location: 'Central Lab', isRegulated: true },
  { id: 'C003', name: 'Diethyl Ether', casNumber: '60-29-7', category: 'Peroxide', unit: 'L', isPeroxide: true, storageLocation: 'Fridge P-2', location: 'R&D Lab', isRegulated: true },
  { id: 'C007', name: 'Tetrahydrofuran (THF)', casNumber: '109-99-9', category: 'Peroxide', unit: 'L', isPeroxide: true, storageLocation: 'Fridge P-3', location: 'R&D Lab', isRegulated: true },
  { id: 'C011', name: 'Di-tert-butyl peroxide', casNumber: '110-05-4', category: 'Peroxide', unit: 'mL', isPeroxide: true, storageLocation: 'Fridge P-4', location: 'Central Lab', isRegulated: true },

  // Calibration STD
  { id: 'C013', name: 'pH Buffer Solution 4.0', casNumber: 'N/A', category: 'Calibration STD', unit: 'mL', isPeroxide: false, storageLocation: 'STD Cabinet Q-1', location: 'QA Lab', isRegulated: false },
  { id: 'C014', name: 'pH Buffer Solution 7.0', casNumber: 'N/A', category: 'Calibration STD', unit: 'mL', isPeroxide: false, storageLocation: 'STD Cabinet Q-1', location: 'QA Lab', isRegulated: false },
  { id: 'C015', name: 'Conductivity Standard 1413 μS/cm', casNumber: 'N/A', category: 'Calibration STD', unit: 'mL', isPeroxide: false, storageLocation: 'STD Cabinet Q-2', location: 'QA Lab', isRegulated: false },
  { id: 'C016', name: 'Turbidity Standard 100 NTU', casNumber: 'N/A', category: 'Calibration STD', unit: 'mL', isPeroxide: false, storageLocation: 'STD Cabinet Q-2', location: 'Central Lab', isRegulated: false },
  { id: 'C017', name: 'TOC Standard (1000 ppm)', casNumber: 'N/A', category: 'Calibration STD', unit: 'mL', isPeroxide: false, storageLocation: 'STD Cabinet R-1', location: 'R&D Lab', isRegulated: false },

  // Gas
  { id: 'C018', name: 'Nitrogen Gas (N₂)', casNumber: '7727-37-9', category: 'Gas', unit: 'cylinder', isPeroxide: false, storageLocation: 'Gas Storage G-1', location: 'Central Lab', cylinderId: 'CYL-N2-001', isRegulated: false },
  { id: 'C019', name: 'Carbon Dioxide (CO₂)', casNumber: '124-38-9', category: 'Gas', unit: 'cylinder', isPeroxide: false, storageLocation: 'Gas Storage G-2', location: 'Production Lab', cylinderId: 'CYL-CO2-001', isRegulated: false },
  { id: 'C020', name: 'Argon Gas (Ar)', casNumber: '7440-37-1', category: 'Gas', unit: 'cylinder', isPeroxide: false, storageLocation: 'Gas Storage G-1', location: 'R&D Lab', cylinderId: 'CYL-AR-001', isRegulated: false },
  { id: 'C021', name: 'Oxygen Gas (O₂)', casNumber: '7782-44-7', category: 'Gas', unit: 'cylinder', isPeroxide: false, storageLocation: 'Gas Storage G-3', location: 'Production Lab', cylinderId: 'CYL-O2-001', isRegulated: true },

  // Material Supply / Consumables
  { id: 'C022', name: 'Nitrile Gloves (M)', casNumber: 'N/A', category: 'Material Supply/Consumables', unit: 'box', isPeroxide: false, storageLocation: 'Supply Cabinet S-1', location: 'Central Lab', minStock: 5, isRegulated: false },
  { id: 'C023', name: 'Whatman Filter Paper No.1', casNumber: 'N/A', category: 'Material Supply/Consumables', unit: 'pack', isPeroxide: false, storageLocation: 'Supply Cabinet S-1', location: 'QA Lab', minStock: 3, isRegulated: false },
  { id: 'C024', name: 'Lab Wipes (Kimwipes)', casNumber: 'N/A', category: 'Material Supply/Consumables', unit: 'box', isPeroxide: false, storageLocation: 'Supply Cabinet S-2', location: 'Production Lab', minStock: 10, isRegulated: false },
  { id: 'C025', name: 'PTFE Membrane Filter 0.45μm', casNumber: 'N/A', category: 'Material Supply/Consumables', unit: 'pack', isPeroxide: false, storageLocation: 'Supply Cabinet S-2', location: 'R&D Lab', minStock: 2, isRegulated: false },
];

// ─── Orders ───────────────────────────────────────────────────────────────────
export const initialOrders: Order[] = [
  { id: 'ORD-001', chemicalId: 'C002', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', quantity: 5, unit: 'L', purpose: 'Sterilization experiments', requester: 'Dr. Siriwan K.', requestDate: '2026-02-10', status: 'Completed', location: 'Central Lab', approver: 'Assoc. Prof. Nattapong T.', approveDate: '2026-02-11' },
  { id: 'ORD-002', chemicalId: 'C004', chemicalName: 'Hydrochloric Acid 37%', category: 'Chemicals/Reagents', quantity: 2, unit: 'L', purpose: 'pH calibration', requester: 'Thanakorn P.', requestDate: '2026-02-15', status: 'Completed', location: 'QA Lab', approver: 'Dr. Siriwan K.', approveDate: '2026-02-16' },
  { id: 'ORD-003', chemicalId: 'C003', chemicalName: 'Diethyl Ether', category: 'Peroxide', quantity: 3, unit: 'L', purpose: 'Extraction process for organic synthesis', requester: 'Dr. Siriwan K.', requestDate: '2026-02-20', status: 'Approved', location: 'R&D Lab', approver: 'Assoc. Prof. Nattapong T.', approveDate: '2026-02-21' },
  { id: 'ORD-004', chemicalId: 'C006', chemicalName: 'Methanol', category: 'Chemicals/Reagents', quantity: 10, unit: 'L', purpose: 'HPLC mobile phase', requester: 'Nattiya R.', requestDate: '2026-02-25', status: 'Pending', location: 'Production Lab' },
  { id: 'ORD-005', chemicalId: 'C007', chemicalName: 'Tetrahydrofuran (THF)', category: 'Peroxide', quantity: 4, unit: 'L', purpose: 'Polymer dissolution', requester: 'Kittipong S.', requestDate: '2026-02-28', status: 'Pending', location: 'R&D Lab' },
  { id: 'ORD-006', chemicalId: 'C001', chemicalName: 'Acetone', category: 'Chemicals/Reagents', quantity: 20, unit: 'L', purpose: 'General lab cleaning', requester: 'Thanakorn P.', requestDate: '2026-03-01', status: 'Pending', location: 'Central Lab' },
  { id: 'ORD-007', chemicalId: 'C011', chemicalName: 'Di-tert-butyl peroxide', category: 'Peroxide', quantity: 500, unit: 'mL', purpose: 'Radical polymerization initiator', requester: 'Dr. Siriwan K.', requestDate: '2026-03-03', status: 'Rejected', location: 'R&D Lab', approver: 'Assoc. Prof. Nattapong T.', approveDate: '2026-03-04', rejectReason: 'Insufficient safety documentation' },
  { id: 'ORD-008', chemicalId: 'C005', chemicalName: 'Sodium Hydroxide', category: 'Chemicals/Reagents', quantity: 5, unit: 'kg', purpose: 'Titration and neutralization', requester: 'Nattiya R.', requestDate: '2026-03-05', status: 'Approved', location: 'Central Lab', approver: 'Assoc. Prof. Nattapong T.', approveDate: '2026-03-06' },
  { id: 'ORD-009', chemicalId: 'C013', chemicalName: 'pH Buffer Solution 4.0', category: 'Calibration STD', quantity: 500, unit: 'mL', purpose: 'pH meter calibration', requester: 'Nattiya R.', requestDate: '2026-03-01', status: 'Completed', location: 'QA Lab', approver: 'Dr. Siriwan K.', approveDate: '2026-03-02' },
  { id: 'ORD-010', chemicalId: 'C018', chemicalName: 'Nitrogen Gas (N₂)', category: 'Gas', quantity: 2, unit: 'cylinder', purpose: 'Inert atmosphere for reactions', requester: 'Kittipong S.', requestDate: '2026-03-02', status: 'Pending', location: 'Central Lab' },
  { id: 'ORD-011', chemicalId: 'C022', chemicalName: 'Nitrile Gloves (M)', category: 'Material Supply/Consumables', quantity: 10, unit: 'box', purpose: 'Lab safety stock replenishment', requester: 'Thanakorn P.', requestDate: '2026-03-04', status: 'Approved', location: 'Central Lab', approver: 'Assoc. Prof. Nattapong T.', approveDate: '2026-03-05' },
  { id: 'ORD-012', chemicalId: 'C009', chemicalName: 'Sulfuric Acid 98%', category: 'Chemicals/Reagents', quantity: 1, unit: 'L', purpose: 'COD digestion', requester: 'Nattiya R.', requestDate: '2026-03-06', status: 'Pending', location: 'QA Lab' },
];

// ─── Inventory Lots ───────────────────────────────────────────────────────────
export const initialLots: InventoryLot[] = [
  { id: 'LOT-001', orderId: 'ORD-001', chemicalId: 'C002', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', lotNumber: 'HP-2025-0123', receivedQuantity: 5, remainingQuantity: 2.5, unit: 'L', receivedDate: '2026-02-12', expiryDate: '2027-02-12', receivedBy: 'Thanakorn P.', isPeroxide: true, location: 'Central Lab' },
  { id: 'LOT-002', orderId: 'ORD-002', chemicalId: 'C004', chemicalName: 'Hydrochloric Acid 37%', category: 'Chemicals/Reagents', lotNumber: 'HCL-2025-0456', receivedQuantity: 2, remainingQuantity: 1.2, unit: 'L', receivedDate: '2026-02-17', expiryDate: '2028-02-17', receivedBy: 'Nattiya R.', isPeroxide: false, location: 'QA Lab' },
  { id: 'LOT-003', orderId: 'ORD-003', chemicalId: 'C003', chemicalName: 'Diethyl Ether', category: 'Peroxide', lotNumber: 'DE-2026-0089', receivedQuantity: 3, remainingQuantity: 3, unit: 'L', receivedDate: '2026-02-22', expiryDate: '2026-04-22', receivedBy: 'Thanakorn P.', isPeroxide: true, location: 'R&D Lab' },
  { id: 'LOT-004', orderId: 'ORD-001', chemicalId: 'C002', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', lotNumber: 'HP-2025-0099', receivedQuantity: 2, remainingQuantity: 0.5, unit: 'L', receivedDate: '2026-01-15', expiryDate: '2026-03-15', receivedBy: 'Nattiya R.', isPeroxide: true, location: 'Central Lab' },
  { id: 'LOT-005', orderId: 'ORD-009', chemicalId: 'C013', chemicalName: 'pH Buffer Solution 4.0', category: 'Calibration STD', lotNumber: 'PHB4-2026-0011', receivedQuantity: 500, remainingQuantity: 450, unit: 'mL', receivedDate: '2026-03-03', expiryDate: '2026-09-03', receivedBy: 'Nattiya R.', isPeroxide: false, location: 'QA Lab' },
  { id: 'LOT-006', orderId: 'ORD-011', chemicalId: 'C022', chemicalName: 'Nitrile Gloves (M)', category: 'Material Supply/Consumables', lotNumber: 'GLV-2026-0055', receivedQuantity: 10, remainingQuantity: 7, unit: 'box', receivedDate: '2026-03-06', expiryDate: '2029-03-06', receivedBy: 'Thanakorn P.', isPeroxide: false, location: 'Central Lab' },
  { id: 'LOT-007', orderId: 'ORD-002', chemicalId: 'C015', chemicalName: 'Conductivity Standard 1413 μS/cm', category: 'Calibration STD', lotNumber: 'CS-2025-0078', receivedQuantity: 250, remainingQuantity: 200, unit: 'mL', receivedDate: '2026-01-20', expiryDate: '2026-07-20', receivedBy: 'Nattiya R.', isPeroxide: false, location: 'QA Lab' },
  { id: 'LOT-008', orderId: 'ORD-010', chemicalId: 'C018', chemicalName: 'Nitrogen Gas (N₂)', category: 'Gas', lotNumber: 'N2-CYL-2026-003', receivedQuantity: 1, remainingQuantity: 0.6, unit: 'cylinder', receivedDate: '2026-02-28', expiryDate: '2027-02-28', receivedBy: 'Kittipong S.', isPeroxide: false, location: 'Central Lab' },
];

// ─── Checkout Records ─────────────────────────────────────────────────────────
export const initialCheckouts: CheckoutRecord[] = [
  { id: 'CO-001', lotId: 'LOT-001', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', lotNumber: 'HP-2025-0123', quantity: 1, unit: 'L', purpose: 'Sterilization run #1', checkedOutBy: 'Dr. Siriwan K.', checkoutDate: '2026-02-14', location: 'Central Lab' },
  { id: 'CO-002', lotId: 'LOT-001', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', lotNumber: 'HP-2025-0123', quantity: 0.5, unit: 'L', purpose: 'Sterilization run #2', checkedOutBy: 'Kittipong S.', checkoutDate: '2026-02-20', location: 'Central Lab' },
  { id: 'CO-003', lotId: 'LOT-002', chemicalName: 'Hydrochloric Acid 37%', category: 'Chemicals/Reagents', lotNumber: 'HCL-2025-0456', quantity: 0.5, unit: 'L', purpose: 'Buffer preparation', checkedOutBy: 'Nattiya R.', checkoutDate: '2026-02-18', location: 'QA Lab' },
  { id: 'CO-004', lotId: 'LOT-001', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', lotNumber: 'HP-2025-0123', quantity: 1, unit: 'L', purpose: 'Surface decontamination', checkedOutBy: 'Thanakorn P.', checkoutDate: '2026-02-28', location: 'Central Lab' },
  { id: 'CO-005', lotId: 'LOT-004', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', lotNumber: 'HP-2025-0099', quantity: 1.5, unit: 'L', purpose: 'Oxidation experiment', checkedOutBy: 'Dr. Siriwan K.', checkoutDate: '2026-02-05', location: 'Central Lab' },
  { id: 'CO-006', lotId: 'LOT-005', chemicalName: 'pH Buffer Solution 4.0', category: 'Calibration STD', lotNumber: 'PHB4-2026-0011', quantity: 50, unit: 'mL', purpose: 'Weekly pH meter calibration', checkedOutBy: 'Nattiya R.', checkoutDate: '2026-03-05', location: 'QA Lab' },
];

// ─── Peroxide Inspections ──────────────────────────────────────────────────────
export const initialInspections: PeroxideInspection[] = [
  { id: 'INS-001', lotId: 'LOT-001', chemicalName: 'Hydrogen Peroxide 30%', lotNumber: 'HP-2025-0123', inspectDate: '2026-02-13', ppmValue: 15, inspector: 'Thanakorn P.', remarks: 'Initial inspection post-delivery', status: 'Normal', location: 'Central Lab' },
  { id: 'INS-002', lotId: 'LOT-001', chemicalName: 'Hydrogen Peroxide 30%', lotNumber: 'HP-2025-0123', inspectDate: '2026-02-27', ppmValue: 28, inspector: 'Nattiya R.', remarks: 'Slight increase noted', status: 'Warning', location: 'Central Lab' },
  { id: 'INS-003', lotId: 'LOT-003', chemicalName: 'Diethyl Ether', lotNumber: 'DE-2026-0089', inspectDate: '2026-02-23', ppmValue: 8, inspector: 'Thanakorn P.', remarks: 'New lot, normal levels', status: 'Normal', location: 'R&D Lab' },
  { id: 'INS-004', lotId: 'LOT-004', chemicalName: 'Hydrogen Peroxide 30%', lotNumber: 'HP-2025-0099', inspectDate: '2026-02-10', ppmValue: 110, inspector: 'Kittipong S.', remarks: 'Old lot, high peroxide formation. Isolate immediately.', status: 'Quarantine', location: 'Central Lab' },
  { id: 'INS-005', lotId: 'LOT-003', chemicalName: 'Diethyl Ether', lotNumber: 'DE-2026-0089', inspectDate: '2026-03-06', ppmValue: 32, inspector: 'Nattiya R.', remarks: 'Increasing trend. Monitor closely.', status: 'Warning', location: 'R&D Lab' },
];

// ─── Transactions ─────────────────────────────────────────────────────────────
export const initialTransactions: Transaction[] = [
  { id: 'TXN-001', type: 'Order Created', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', quantity: 5, unit: 'L', user: 'Dr. Siriwan K.', date: '2026-02-10', relatedId: 'ORD-001', location: 'Central Lab' },
  { id: 'TXN-002', type: 'Approved', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', quantity: 5, unit: 'L', user: 'Assoc. Prof. Nattapong T.', date: '2026-02-11', relatedId: 'ORD-001', status: 'Approved', location: 'Central Lab' },
  { id: 'TXN-003', type: 'Check-in', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', quantity: 5, unit: 'L', user: 'Thanakorn P.', date: '2026-02-12', relatedId: 'LOT-001', remarks: 'Lot HP-2025-0123', location: 'Central Lab' },
  { id: 'TXN-004', type: 'Inspection', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', user: 'Thanakorn P.', date: '2026-02-13', relatedId: 'INS-001', status: 'Normal', remarks: '15 ppm', location: 'Central Lab' },
  { id: 'TXN-005', type: 'Check-out', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', quantity: 1, unit: 'L', user: 'Dr. Siriwan K.', date: '2026-02-14', relatedId: 'CO-001', remarks: 'Lot HP-2025-0123', location: 'Central Lab' },
  { id: 'TXN-006', type: 'Order Created', chemicalName: 'Hydrochloric Acid 37%', category: 'Chemicals/Reagents', quantity: 2, unit: 'L', user: 'Thanakorn P.', date: '2026-02-15', relatedId: 'ORD-002', location: 'QA Lab' },
  { id: 'TXN-007', type: 'Approved', chemicalName: 'Hydrochloric Acid 37%', category: 'Chemicals/Reagents', quantity: 2, unit: 'L', user: 'Dr. Siriwan K.', date: '2026-02-16', relatedId: 'ORD-002', status: 'Approved', location: 'QA Lab' },
  { id: 'TXN-008', type: 'Check-in', chemicalName: 'Hydrochloric Acid 37%', category: 'Chemicals/Reagents', quantity: 2, unit: 'L', user: 'Nattiya R.', date: '2026-02-17', relatedId: 'LOT-002', remarks: 'Lot HCL-2025-0456', location: 'QA Lab' },
  { id: 'TXN-009', type: 'Check-out', chemicalName: 'Hydrochloric Acid 37%', category: 'Chemicals/Reagents', quantity: 0.5, unit: 'L', user: 'Nattiya R.', date: '2026-02-18', relatedId: 'CO-003', location: 'QA Lab' },
  { id: 'TXN-010', type: 'Order Created', chemicalName: 'Diethyl Ether', category: 'Peroxide', quantity: 3, unit: 'L', user: 'Dr. Siriwan K.', date: '2026-02-20', relatedId: 'ORD-003', location: 'R&D Lab' },
  { id: 'TXN-011', type: 'Check-out', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', quantity: 0.5, unit: 'L', user: 'Kittipong S.', date: '2026-02-20', relatedId: 'CO-002', location: 'Central Lab' },
  { id: 'TXN-012', type: 'Approved', chemicalName: 'Diethyl Ether', category: 'Peroxide', quantity: 3, unit: 'L', user: 'Assoc. Prof. Nattapong T.', date: '2026-02-21', relatedId: 'ORD-003', status: 'Approved', location: 'R&D Lab' },
  { id: 'TXN-013', type: 'Check-in', chemicalName: 'Diethyl Ether', category: 'Peroxide', quantity: 3, unit: 'L', user: 'Thanakorn P.', date: '2026-02-22', relatedId: 'LOT-003', remarks: 'Lot DE-2026-0089', location: 'R&D Lab' },
  { id: 'TXN-014', type: 'Inspection', chemicalName: 'Diethyl Ether', category: 'Peroxide', user: 'Thanakorn P.', date: '2026-02-23', relatedId: 'INS-003', status: 'Normal', remarks: '8 ppm', location: 'R&D Lab' },
  { id: 'TXN-015', type: 'Order Created', chemicalName: 'Methanol', category: 'Chemicals/Reagents', quantity: 10, unit: 'L', user: 'Nattiya R.', date: '2026-02-25', relatedId: 'ORD-004', location: 'Production Lab' },
  { id: 'TXN-016', type: 'Inspection', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', user: 'Nattiya R.', date: '2026-02-27', relatedId: 'INS-002', status: 'Warning', remarks: '28 ppm - elevated', location: 'Central Lab' },
  { id: 'TXN-017', type: 'Check-out', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', quantity: 1, unit: 'L', user: 'Thanakorn P.', date: '2026-02-28', relatedId: 'CO-004', location: 'Central Lab' },
  { id: 'TXN-018', type: 'Order Created', chemicalName: 'Tetrahydrofuran (THF)', category: 'Peroxide', quantity: 4, unit: 'L', user: 'Kittipong S.', date: '2026-02-28', relatedId: 'ORD-005', location: 'R&D Lab' },
  { id: 'TXN-019', type: 'Order Created', chemicalName: 'Acetone', category: 'Chemicals/Reagents', quantity: 20, unit: 'L', user: 'Thanakorn P.', date: '2026-03-01', relatedId: 'ORD-006', location: 'Central Lab' },
  { id: 'TXN-020', type: 'Order Created', chemicalName: 'Di-tert-butyl peroxide', category: 'Peroxide', quantity: 500, unit: 'mL', user: 'Dr. Siriwan K.', date: '2026-03-03', relatedId: 'ORD-007', location: 'R&D Lab' },
  { id: 'TXN-021', type: 'Rejected', chemicalName: 'Di-tert-butyl peroxide', category: 'Peroxide', quantity: 500, unit: 'mL', user: 'Assoc. Prof. Nattapong T.', date: '2026-03-04', relatedId: 'ORD-007', status: 'Rejected', remarks: 'Insufficient safety documentation', location: 'R&D Lab' },
  { id: 'TXN-022', type: 'Order Created', chemicalName: 'Sodium Hydroxide', category: 'Chemicals/Reagents', quantity: 5, unit: 'kg', user: 'Nattiya R.', date: '2026-03-05', relatedId: 'ORD-008', location: 'Central Lab' },
  { id: 'TXN-023', type: 'Approved', chemicalName: 'Sodium Hydroxide', category: 'Chemicals/Reagents', quantity: 5, unit: 'kg', user: 'Assoc. Prof. Nattapong T.', date: '2026-03-06', relatedId: 'ORD-008', status: 'Approved', location: 'Central Lab' },
  { id: 'TXN-024', type: 'Inspection', chemicalName: 'Diethyl Ether', category: 'Peroxide', user: 'Nattiya R.', date: '2026-03-06', relatedId: 'INS-005', status: 'Warning', remarks: '32 ppm - increasing', location: 'R&D Lab' },
];

// ─── Shelf Life Extensions ────────────────────────────────────────────────────
export const initialShelfLifeExtensions: ShelfLifeExtension[] = [
  {
    id: 'EXT-001', lotId: 'LOT-003', chemicalName: 'Diethyl Ether', category: 'Peroxide', lotNumber: 'DE-2026-0089', location: 'R&D Lab',
    oldExpiryDate: '2026-04-22', newExpiryDate: '2026-06-22', reason: 'Manufacturer confirmed stability data supports 2-month extension under proper cold storage conditions.',
    requestedBy: 'Dr. Siriwan K.', approvedBy: 'Assoc. Prof. Nattapong T.', status: 'Approved', requestDate: '2026-03-01', reviewDate: '2026-03-03',
  },
  {
    id: 'EXT-002', lotId: 'LOT-004', chemicalName: 'Hydrogen Peroxide 30%', category: 'Peroxide', lotNumber: 'HP-2025-0099', location: 'Central Lab',
    oldExpiryDate: '2026-03-15', newExpiryDate: '2026-05-15', reason: 'Internal QC test passed within acceptable range. Re-test showed <25 ppm peroxide. Requesting extension.',
    requestedBy: 'Thanakorn P.', status: 'Pending', requestDate: '2026-03-06',
  },
  {
    id: 'EXT-003', lotId: 'LOT-005', chemicalName: 'pH Buffer Solution 4.0', category: 'Calibration STD', lotNumber: 'PHB4-2026-0011', location: 'QA Lab',
    oldExpiryDate: '2026-09-03', newExpiryDate: '2026-12-03', reason: 'Unused, sealed portion. Reference standard verification confirmed accuracy within ±0.01 pH.',
    requestedBy: 'Nattiya R.', status: 'Pending', requestDate: '2026-03-05',
  },
  {
    id: 'EXT-004', lotId: 'LOT-007', chemicalName: 'Conductivity Standard 1413 μS/cm', category: 'Calibration STD', lotNumber: 'CS-2025-0078', location: 'QA Lab',
    oldExpiryDate: '2026-07-20', newExpiryDate: '2026-10-20', reason: 'Lot tested against NIST traceable standard. Results within ±0.5% tolerance.',
    requestedBy: 'Nattiya R.', approvedBy: 'Dr. Siriwan K.', status: 'Approved', requestDate: '2026-02-15', reviewDate: '2026-02-17',
  },
  {
    id: 'EXT-005', lotId: 'LOT-002', chemicalName: 'Hydrochloric Acid 37%', category: 'Chemicals/Reagents', lotNumber: 'HCL-2025-0456', location: 'QA Lab',
    oldExpiryDate: '2028-02-17', newExpiryDate: '2029-02-17', reason: 'Tightly sealed, no signs of degradation. Chemical stability study supports extension.',
    requestedBy: 'Nattiya R.', approvedBy: undefined, status: 'Rejected', requestDate: '2026-02-20', reviewDate: '2026-02-22',
    rejectReason: 'Extension period exceeds maximum allowed for controlled acid. Reorder instead.',
  },
];

// ─── Regulatory Records ────────────────────────────────────────────────────────
export const initialRegulatoryRecords: RegulatoryRecord[] = [
  {
    id: 'REG-001', itemName: 'Hydrogen Peroxide 30%', itemCode: 'C002', category: 'Peroxide', regulationType: 'Hazardous', regulationCode: 'OSHA-HAZ-1910.1200',
    location: 'Central Lab', status: 'Active', effectiveDate: '2024-01-01', expiryDate: '2026-12-31',
    description: 'Classified as oxidizer and corrosive. Requires SDS, secondary containment, and PPE. Annual inspection required.', isControlled: true, linkedLotIds: ['LOT-001', 'LOT-004'],
  },
  {
    id: 'REG-002', itemName: 'Hydrochloric Acid 37%', itemCode: 'C004', category: 'Chemicals/Reagents', regulationType: 'Corrosive', regulationCode: 'OSHA-HAZ-1910.1200-C',
    location: 'QA Lab', status: 'Active', effectiveDate: '2024-01-01', expiryDate: '2026-12-31',
    description: 'Strong corrosive acid. Must be stored in acid cabinet with proper ventilation. Emergency eyewash required within 10 seconds.', isControlled: true, linkedLotIds: ['LOT-002'],
  },
  {
    id: 'REG-003', itemName: 'Methanol', itemCode: 'C006', category: 'Chemicals/Reagents', regulationType: 'Flammable', regulationCode: 'NFPA-704-F3',
    location: 'Production Lab', status: 'Active', effectiveDate: '2023-06-01', expiryDate: '2027-05-31',
    description: 'Flammable liquid (flash point 11°C). Store in fireproof cabinet away from ignition sources. Toxic via ingestion and inhalation.', isControlled: true, linkedLotIds: [],
  },
  {
    id: 'REG-004', itemName: 'Diethyl Ether', itemCode: 'C003', category: 'Peroxide', regulationType: 'Flammable', regulationCode: 'OSHA-HAZ-1910.1200-F',
    location: 'R&D Lab', status: 'Active', effectiveDate: '2024-03-15', expiryDate: '2027-03-14',
    description: 'Extremely flammable. Peroxide-forming chemical requiring periodic inspection. Store in explosion-proof refrigerator.', isControlled: true, linkedLotIds: ['LOT-003'],
  },
  {
    id: 'REG-005', itemName: 'Sulfuric Acid 98%', itemCode: 'C009', category: 'Chemicals/Reagents', regulationType: 'Corrosive', regulationCode: 'GHS-COR-05',
    location: 'QA Lab', status: 'Active', effectiveDate: '2024-01-01', expiryDate: '2026-12-31',
    description: 'Highly corrosive. Reacts violently with water. Requires specialized PPE and deluge shower nearby. Reported as DEA List II chemical.', isControlled: true, linkedLotIds: [],
  },
  {
    id: 'REG-006', itemName: 'Nitrogen Gas (N₂)', itemCode: 'C018', category: 'Gas', regulationType: 'Compressed Gas', regulationCode: 'DOT-CGA-C-7',
    location: 'Central Lab', status: 'Active', effectiveDate: '2025-01-01', expiryDate: '2027-12-31',
    description: 'Compressed gas cylinder. Must be secured with chain/bracket at all times. Asphyxiation hazard in enclosed spaces. Annual cylinder inspection required.', isControlled: false, linkedLotIds: ['LOT-008'],
  },
  {
    id: 'REG-007', itemName: 'Oxygen Gas (O₂)', itemCode: 'C021', category: 'Gas', regulationType: 'Compressed Gas', regulationCode: 'DOT-CGA-C-7-OX',
    location: 'Production Lab', status: 'Active', effectiveDate: '2025-01-01', expiryDate: '2027-12-31',
    description: 'Oxidizer. Compressed gas cylinder. No oil or grease contact. Separate storage from flammables. Promotes combustion.', isControlled: true, linkedLotIds: [],
  },
  {
    id: 'REG-008', itemName: 'pH Buffer Solution 4.0', itemCode: 'C013', category: 'Calibration STD', regulationType: 'Controlled Substance', regulationCode: 'ISO-17034-STD',
    location: 'QA Lab', status: 'Active', effectiveDate: '2025-06-01', expiryDate: '2026-05-31',
    description: 'Certified Reference Material per ISO 17034. Must be stored and handled according to certificate. Traceability records must be maintained for 5 years.', isControlled: true, linkedLotIds: ['LOT-005'],
  },
  {
    id: 'REG-009', itemName: 'Conductivity Standard 1413 μS/cm', itemCode: 'C015', category: 'Calibration STD', regulationType: 'Controlled Substance', regulationCode: 'ISO-17034-STD',
    location: 'QA Lab', status: 'Pending Review', effectiveDate: '2025-01-01', expiryDate: '2026-06-30',
    description: 'NIST-traceable reference standard. Certificate renewal due. Must be revalidated before next audit cycle.', isControlled: true, linkedLotIds: ['LOT-007'],
  },
  {
    id: 'REG-010', itemName: 'Di-tert-butyl peroxide', itemCode: 'C011', category: 'Peroxide', regulationType: 'Hazardous', regulationCode: 'OSHA-PSM-1910.119',
    location: 'Central Lab', status: 'Active', effectiveDate: '2024-06-01', expiryDate: '2027-05-31',
    description: 'Organic peroxide, Class I flammable. Requires Process Safety Management plan. Maximum storage quantity: 250 mL. Safety training mandatory for all handlers.', isControlled: true, linkedLotIds: [],
  },
  {
    id: 'REG-011', itemName: 'Tetrahydrofuran (THF)', itemCode: 'C007', category: 'Peroxide', regulationType: 'Flammable', regulationCode: 'NFPA-704-F3-TOX',
    location: 'R&D Lab', status: 'Active', effectiveDate: '2023-01-01', expiryDate: '2026-12-31',
    description: 'Flammable and peroxide-forming. Rapid evaporation increases flammability risk. Peroxide test strips required monthly. SDS must be accessible.', isControlled: false, linkedLotIds: [],
  },
  {
    id: 'REG-012', itemName: 'Nitrile Gloves (M)', itemCode: 'C022', category: 'Material Supply/Consumables', regulationType: 'Hazardous', regulationCode: 'CE-PPE-CAT-III',
    location: 'Central Lab', status: 'Active', effectiveDate: '2025-01-01', expiryDate: '2027-12-31',
    description: 'Category III PPE under EU PPE regulation. Must meet EN374 standard for chemical resistance. Batch certification must be on file.', isControlled: false, linkedLotIds: [],
  },
];

// ─── Users / Team ─────────────────────────────────────────────────────────────
export const teamMembers = [
  { id: 'U001', name: 'Dr. Siriwan K.', role: 'Requester', avatar: 'SK' },
  { id: 'U002', name: 'Assoc. Prof. Nattapong T.', role: 'Approver', avatar: 'NT' },
  { id: 'U003', name: 'Thanakorn P.', role: 'Staff', avatar: 'TP' },
  { id: 'U004', name: 'Nattiya R.', role: 'Staff', avatar: 'NR' },
  { id: 'U005', name: 'Kittipong S.', role: 'Requester', avatar: 'KS' },
];

export const currentUser = teamMembers[2]; // Thanakorn P. (Staff/Admin)
