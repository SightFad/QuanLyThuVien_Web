/**
 * Route definitions with lazy loading
 */
import React from "react";
import { withLazyLoading } from "../components/LazyRoute";
import { PageLoading } from "../components/shared";

// Loading fallback component
const RouteLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <PageLoading size="lg" text="Đang tải trang..." />
  </div>
);

// Lazy-loaded components
const Dashboard = withLazyLoading(
  () => import("../pages/Dashboard"),
  <RouteLoading />
);

const BookManagement = withLazyLoading(
  () => import("../pages/BookManagement"),
  <RouteLoading />
);

const ReaderManagement = withLazyLoading(
  () => import("../pages/ReaderManagement"),
  <RouteLoading />
);

const BorrowManagement = withLazyLoading(
  () => import("../pages/BorrowManagement"),
  <RouteLoading />
);

const UserManagement = withLazyLoading(
  () => import("../pages/UserManagement"),
  <RouteLoading />
);

const SystemSettings = withLazyLoading(
  () => import("../pages/SystemSettings"),
  <RouteLoading />
);

const BackupManagement = withLazyLoading(
  () => import("../pages/BackupManagement"),
  <RouteLoading />
);

// Reader pages
const ReaderHome = withLazyLoading(
  () => import("../pages/reader/ReaderHome"),
  <RouteLoading />
);

const ReaderSearch = withLazyLoading(
  () => import("../pages/reader/ReaderSearch"),
  <RouteLoading />
);

const ReaderMyBooks = withLazyLoading(
  () => import("../pages/reader/ReaderMyBooks"),
  <RouteLoading />
);

const ReaderProfile = withLazyLoading(
  () => import("../pages/reader/ReaderProfile"),
  <RouteLoading />
);

const ReaderReservations = withLazyLoading(
  () => import("../pages/reader/ReaderReservations"),
  <RouteLoading />
);

const ReaderFines = withLazyLoading(
  () => import("../pages/reader/ReaderFines"),
  <RouteLoading />
);

// Librarian pages
const LibrarianDashboard = withLazyLoading(
  () => import("../pages/librarian/LibrarianDashboard"),
  <RouteLoading />
);

const LibrarianReports = withLazyLoading(
  () => import("../pages/librarian/LibrarianReports"),
  <RouteLoading />
);

const ReservationManagement = withLazyLoading(
  () => import("../pages/librarian/ReservationManagement"),
  <RouteLoading />
);

const BookReservationManagement = withLazyLoading(
  () => import("../pages/librarian/BookReservationManagement"),
  <RouteLoading />
);

const ViolationManagement = withLazyLoading(
  () => import("../pages/librarian/ViolationManagement"),
  <RouteLoading />
);

const ReportManagement = withLazyLoading(
  () => import("../pages/librarian/ReportManagement"),
  <RouteLoading />
);

// Accountant pages
const AccountantDashboard = withLazyLoading(
  () => import("../pages/accountant/AccountantDashboard"),
  <RouteLoading />
);

const FinancialTransactions = withLazyLoading(
  () => import("../pages/accountant/FinancialTransactions"),
  <RouteLoading />
);

const PurchaseProposals = withLazyLoading(
  () => import("../pages/accountant/PurchaseProposals"),
  <RouteLoading />
);

const PurchaseOrders = withLazyLoading(
  () => import("../pages/accountant/PurchaseOrders"),
  <RouteLoading />
);

const SupplierManagement = withLazyLoading(
  () => import("../pages/accountant/SupplierManagement"),
  <RouteLoading />
);

const FinancialReports = withLazyLoading(
  () => import("../pages/accountant/FinancialReports"),
  <RouteLoading />
);

// Manager pages
const ManagerDashboard = withLazyLoading(
  () => import("../pages/manager/ManagerDashboard"),
  <RouteLoading />
);

const ManagerApprovals = withLazyLoading(
  () => import("../pages/manager/ManagerApprovals"),
  <RouteLoading />
);

// Warehouse pages
const WarehouseDashboard = withLazyLoading(
  () => import("../pages/warehouse/WarehouseDashboard"),
  <RouteLoading />
);

const InventoryManagement = withLazyLoading(
  () => import("../pages/warehouse/InventoryManagement"),
  <RouteLoading />
);

const StockReports = withLazyLoading(
  () => import("../pages/warehouse/StockReports"),
  <RouteLoading />
);

const BookImports = withLazyLoading(
  () => import("../pages/warehouse/BookImports"),
  <RouteLoading />
);

const InventoryChecks = withLazyLoading(
  () => import("../pages/warehouse/InventoryChecks"),
  <RouteLoading />
);

// Route configurations
export const routes = [
  // Common routes
  {
    path: "/",
    component: Dashboard,
    exact: true,
    roles: ["Admin", "Quản lý", "Librarian", "Accountant", "Thủ kho"],
  },
  {
    path: "/books",
    component: BookManagement,
    roles: ["Admin", "Quản lý", "Librarian"],
  },
  {
    path: "/readers",
    component: ReaderManagement,
    roles: ["Admin", "Quản lý", "Librarian"],
  },
  {
    path: "/borrows",
    component: BorrowManagement,
    roles: ["Admin", "Quản lý", "Librarian"],
  },
  {
    path: "/users",
    component: UserManagement,
    roles: ["Admin", "Quản lý"],
  },
  {
    path: "/settings",
    component: SystemSettings,
    roles: ["Admin"],
  },
  {
    path: "/backup",
    component: BackupManagement,
    roles: ["Admin"],
  },

  // Reader routes
  {
    path: "/reader",
    component: ReaderHome,
    exact: true,
    roles: ["Reader"],
  },
  {
    path: "/reader/search",
    component: ReaderSearch,
    roles: ["Reader"],
  },
  {
    path: "/reader/my-books",
    component: ReaderMyBooks,
    roles: ["Reader"],
  },
  {
    path: "/reader/profile",
    component: ReaderProfile,
    roles: ["Reader"],
  },
  {
    path: "/reader/reservations",
    component: ReaderReservations,
    roles: ["Reader"],
  },
  {
    path: "/reader/fines",
    component: ReaderFines,
    roles: ["Reader"],
  },

  // Librarian routes
  {
    path: "/librarian",
    component: LibrarianDashboard,
    exact: true,
    roles: ["Librarian"],
  },
  {
    path: "/librarian/reports",
    component: LibrarianReports,
    roles: ["Librarian"],
  },
  {
    path: "/librarian/reservations",
    component: ReservationManagement,
    roles: ["Librarian"],
  },
  {
    path: "/librarian/book-reservations",
    component: BookReservationManagement,
    roles: ["Librarian"],
  },
  {
    path: "/librarian/violations",
    component: ViolationManagement,
    roles: ["Librarian"],
  },
  {
    path: "/librarian/reports-management",
    component: ReportManagement,
    roles: ["Librarian"],
  },

  // Accountant routes
  {
    path: "/accountant",
    component: AccountantDashboard,
    exact: true,
    roles: ["Accountant"],
  },
  {
    path: "/accountant/transactions",
    component: FinancialTransactions,
    roles: ["Accountant"],
  },
  {
    path: "/accountant/purchase-proposals",
    component: PurchaseProposals,
    roles: ["Accountant"],
  },
  {
    path: "/accountant/purchase-orders",
    component: PurchaseOrders,
    roles: ["Accountant"],
  },
  {
    path: "/accountant/suppliers",
    component: SupplierManagement,
    roles: ["Accountant"],
  },
  {
    path: "/accountant/reports",
    component: FinancialReports,
    roles: ["Accountant"],
  },

  // Manager routes
  {
    path: "/manager",
    component: ManagerDashboard,
    exact: true,
    roles: ["Quản lý"],
  },
  {
    path: "/manager/approvals",
    component: ManagerApprovals,
    roles: ["Quản lý"],
  },

  // Warehouse routes
  {
    path: "/warehouse",
    component: WarehouseDashboard,
    exact: true,
    roles: ["Thủ kho"],
  },
  {
    path: "/warehouse/inventory",
    component: InventoryManagement,
    roles: ["Thủ kho"],
  },
  {
    path: "/warehouse/reports",
    component: StockReports,
    roles: ["Thủ kho"],
  },
  {
    path: "/warehouse/imports",
    component: BookImports,
    roles: ["Thủ kho"],
  },
  {
    path: "/warehouse/checks",
    component: InventoryChecks,
    roles: ["Thủ kho"],
  },
];

// Get routes by role
export const getRoutesByRole = (userRole) => {
  return routes.filter(
    (route) => !route.roles || route.roles.includes(userRole)
  );
};

// Get default route by role
export const getDefaultRoute = (userRole) => {
  const roleRoutes = {
    Admin: "/",
    "Quản lý": "/manager",
    Librarian: "/librarian",
    Accountant: "/accountant",
    "Thủ kho": "/warehouse",
    Reader: "/reader",
  };

  return roleRoutes[userRole] || "/";
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
