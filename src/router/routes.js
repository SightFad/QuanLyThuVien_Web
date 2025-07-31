/**
 * Route definitions with lazy loading
 */
import React from 'react';
import { withLazyLoading } from '../components/LazyRoute';
import { LoadingSpinner } from '../components/shared';

// Loading fallback component
const RouteLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" text="Đang tải trang..." />
  </div>
);

// Lazy-loaded components
const Dashboard = withLazyLoading(
  () => import('../pages/Dashboard'),
  <RouteLoading />
);

const BookManagement = withLazyLoading(
  () => import('../pages/BookManagement'),
  <RouteLoading />
);

const ReaderManagement = withLazyLoading(
  () => import('../pages/ReaderManagement'),
  <RouteLoading />
);

const BorrowManagement = withLazyLoading(
  () => import('../pages/BorrowManagement'),
  <RouteLoading />
);

const UserManagement = withLazyLoading(
  () => import('../pages/UserManagement'),
  <RouteLoading />
);

const SystemSettings = withLazyLoading(
  () => import('../pages/SystemSettings'),
  <RouteLoading />
);

const BackupManagement = withLazyLoading(
  () => import('../pages/BackupManagement'),
  <RouteLoading />
);

// Reader pages
const ReaderHome = withLazyLoading(
  () => import('../pages/reader/ReaderHome'),
  <RouteLoading />
);

const ReaderSearch = withLazyLoading(
  () => import('../pages/reader/ReaderSearch'),
  <RouteLoading />
);

const ReaderMyBooks = withLazyLoading(
  () => import('../pages/reader/ReaderMyBooks'),
  <RouteLoading />
);

const ReaderHistory = withLazyLoading(
  () => import('../pages/reader/ReaderHistory'),
  <RouteLoading />
);

const ReaderProfile = withLazyLoading(
  () => import('../pages/reader/ReaderProfile'),
  <RouteLoading />
);

const ReaderReservations = withLazyLoading(
  () => import('../pages/reader/ReaderReservations'),
  <RouteLoading />
);

const ReaderFines = withLazyLoading(
  () => import('../pages/reader/ReaderFines'),
  <RouteLoading />
);

// Librarian pages
const LibrarianDashboard = withLazyLoading(
  () => import('../pages/librarian/LibrarianDashboard'),
  <RouteLoading />
);

const LibrarianReports = withLazyLoading(
  () => import('../pages/librarian/LibrarianReports'),
  <RouteLoading />
);

const ReservationManagement = withLazyLoading(
  () => import('../pages/librarian/ReservationManagement'),
  <RouteLoading />
);

// Accountant pages
const AccountantDashboard = withLazyLoading(
  () => import('../pages/accountant/AccountantDashboard'),
  <RouteLoading />
);

const FinancialTransactions = withLazyLoading(
  () => import('../pages/accountant/FinancialTransactions'),
  <RouteLoading />
);

const PurchaseProposals = withLazyLoading(
  () => import('../pages/accountant/PurchaseProposals'),
  <RouteLoading />
);

const PurchaseOrders = withLazyLoading(
  () => import('../pages/accountant/PurchaseOrders'),
  <RouteLoading />
);

const SupplierManagement = withLazyLoading(
  () => import('../pages/accountant/SupplierManagement'),
  <RouteLoading />
);

const FinancialReports = withLazyLoading(
  () => import('../pages/accountant/FinancialReports'),
  <RouteLoading />
);

// Manager pages
const ManagerDashboard = withLazyLoading(
  () => import('../pages/manager/ManagerDashboard'),
  <RouteLoading />
);

const ManagerApprovals = withLazyLoading(
  () => import('../pages/manager/ManagerApprovals'),
  <RouteLoading />
);

// Warehouse pages
const WarehouseDashboard = withLazyLoading(
  () => import('../pages/warehouse/WarehouseDashboard'),
  <RouteLoading />
);

const InventoryManagement = withLazyLoading(
  () => import('../pages/warehouse/InventoryManagement'),
  <RouteLoading />
);

const StockReports = withLazyLoading(
  () => import('../pages/warehouse/StockReports'),
  <RouteLoading />
);

const BookImports = withLazyLoading(
  () => import('../pages/warehouse/BookImports'),
  <RouteLoading />
);

const InventoryChecks = withLazyLoading(
  () => import('../pages/warehouse/InventoryChecks'),
  <RouteLoading />
);

// Route configurations
export const routes = [
  // Common routes
  {
    path: '/',
    component: Dashboard,
    exact: true,
    roles: ['Admin', 'Quản lý', 'Thủ thư', 'Kế toán', 'Thủ kho'],
  },
  {
    path: '/books',
    component: BookManagement,
    roles: ['Admin', 'Quản lý', 'Thủ thư'],
  },
  {
    path: '/readers',
    component: ReaderManagement,
    roles: ['Admin', 'Quản lý', 'Thủ thư'],
  },
  {
    path: '/borrows',
    component: BorrowManagement,
    roles: ['Admin', 'Quản lý', 'Thủ thư'],
  },
  {
    path: '/users',
    component: UserManagement,
    roles: ['Admin', 'Quản lý'],
  },
  {
    path: '/settings',
    component: SystemSettings,
    roles: ['Admin'],
  },
  {
    path: '/backup',
    component: BackupManagement,
    roles: ['Admin'],
  },

  // Reader routes
  {
    path: '/reader',
    component: ReaderHome,
    exact: true,
    roles: ['Độc giả'],
  },
  {
    path: '/reader/search',
    component: ReaderSearch,
    roles: ['Độc giả'],
  },
  {
    path: '/reader/my-books',
    component: ReaderMyBooks,
    roles: ['Độc giả'],
  },
  {
    path: '/reader/history',
    component: ReaderHistory,
    roles: ['Độc giả'],
  },
  {
    path: '/reader/profile',
    component: ReaderProfile,
    roles: ['Độc giả'],
  },
  {
    path: '/reader/reservations',
    component: ReaderReservations,
    roles: ['Độc giả'],
  },
  {
    path: '/reader/fines',
    component: ReaderFines,
    roles: ['Độc giả'],
  },

  // Librarian routes
  {
    path: '/librarian',
    component: LibrarianDashboard,
    exact: true,
    roles: ['Thủ thư'],
  },
  {
    path: '/librarian/reports',
    component: LibrarianReports,
    roles: ['Thủ thư'],
  },
  {
    path: '/librarian/reservations',
    component: ReservationManagement,
    roles: ['Thủ thư'],
  },

  // Accountant routes
  {
    path: '/accountant',
    component: AccountantDashboard,
    exact: true,
    roles: ['Kế toán'],
  },
  {
    path: '/accountant/transactions',
    component: FinancialTransactions,
    roles: ['Kế toán'],
  },
  {
    path: '/accountant/purchase-proposals',
    component: PurchaseProposals,
    roles: ['Kế toán'],
  },
  {
    path: '/accountant/purchase-orders',
    component: PurchaseOrders,
    roles: ['Kế toán'],
  },
  {
    path: '/accountant/suppliers',
    component: SupplierManagement,
    roles: ['Kế toán'],
  },
  {
    path: '/accountant/reports',
    component: FinancialReports,
    roles: ['Kế toán'],
  },

  // Manager routes
  {
    path: '/manager',
    component: ManagerDashboard,
    exact: true,
    roles: ['Quản lý'],
  },
  {
    path: '/manager/approvals',
    component: ManagerApprovals,
    roles: ['Quản lý'],
  },

  // Warehouse routes
  {
    path: '/warehouse',
    component: WarehouseDashboard,
    exact: true,
    roles: ['Thủ kho'],
  },
  {
    path: '/warehouse/inventory',
    component: InventoryManagement,
    roles: ['Thủ kho'],
  },
  {
    path: '/warehouse/reports',
    component: StockReports,
    roles: ['Thủ kho'],
  },
  {
    path: '/warehouse/imports',
    component: BookImports,
    roles: ['Thủ kho'],
  },
  {
    path: '/warehouse/checks',
    component: InventoryChecks,
    roles: ['Thủ kho'],
  },
];

// Get routes by role
export const getRoutesByRole = (userRole) => {
  return routes.filter(route => 
    !route.roles || route.roles.includes(userRole)
  );
};

// Get default route by role
export const getDefaultRoute = (userRole) => {
  const roleRoutes = {
    'Admin': '/',
    'Quản lý': '/manager',
    'Thủ thư': '/librarian',
    'Kế toán': '/accountant',
    'Thủ kho': '/warehouse',
    'Độc giả': '/reader',
  };
  
  return roleRoutes[userRole] || '/';
};

export {
  Dashboard,
  BookManagement,
  ReaderManagement,
  BorrowManagement,
  UserManagement,
  SystemSettings,
  BackupManagement,
  ReaderHome,
  ReaderSearch,
  ReaderMyBooks,
  ReaderHistory,
  ReaderProfile,
  ReaderReservations,
  ReaderFines,
  LibrarianDashboard,
  LibrarianReports,
  ReservationManagement,
  AccountantDashboard,
  FinancialTransactions,
  PurchaseProposals,
  PurchaseOrders,
  SupplierManagement,
  FinancialReports,
  ManagerDashboard,
  ManagerApprovals,
  WarehouseDashboard,
  InventoryManagement,
  StockReports,
  BookImports,
  InventoryChecks,
};