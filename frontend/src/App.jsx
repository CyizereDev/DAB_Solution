import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Auth Pages
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Dashboard
import Dashboard from './components/Dashboard/Dashboard';

// Products
import ProductList from './components/Products/ProductList';
import AddProduct from './components/Products/AddProduct';
import EditProduct from './components/Products/EditProduct';

// Customers
import CustomerList from './components/Customers/CustomerList';
import AddCustomer from './components/Customers/AddCustomer';
import EditCustomer from './components/Customers/EditCustomer';
import CustomerDetails from './components/Customers/CustomerDetails';

// Sales
import NewSale from './components/Sales/NewSale';
import SaleList from './components/Sales/SaleList';
import SaleDetails from './components/Sales/SaleDetails';

// Invoices
import InvoiceList from './components/Invoices/InvoiceList'; // Create this component
import InvoiceDetails from './components/Invoices/InvoiceDetails'; // Create this component

// Purchases
import NewPurchase from './components/Purchases/NewPurchase';
import PurchaseList from './components/Purchases/PurchaseList';

// Stock Management
import StockManagement from './components/Stock/StockManagement'; // Create this component

// Employees
import EmployeeList from './components/Employees/EmployeeList';
import AddEmployee from './components/Employees/AddEmployee';
import EditEmployee from './components/Employees/EditEmployee';

// Reports
import ReportDashboard from './components/Reports/ReportDashboard';
import SalesReport from './components/Reports/SalesReport';
import StockReport from './components/Reports/StockReport';
import CustomerReport from './components/Reports/CustomerReport';
import FinancialReport from './components/Reports/FinancialReport';

//settings
import SystemSettings from './components/Settings/SystemSettings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Product Routes */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              
              {/* Customer Routes */}
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/add" element={<AddCustomer />} />
              <Route path="/customers/edit/:id" element={<EditCustomer />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
              
              {/* Sales Routes */}
              <Route path="/sales" element={<SaleList />} />
              <Route path="/sales/new" element={<NewSale />} />
              <Route path="/sales/:id" element={<SaleDetails />} />
              
              {/* Invoice Routes */}
              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/invoices/:id" element={<InvoiceDetails />} />
              
              {/* Purchase Routes */}
              <Route path="/purchases" element={<PurchaseList />} />
              <Route path="/purchases/new" element={<NewPurchase />} />
              
              {/* Stock Management Routes */}
              <Route path="/stock" element={<StockManagement />} />
              
              {/* Employee Routes */}
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employees/add" element={<AddEmployee />} />
              <Route path="/employees/edit/:id" element={<EditEmployee />} />
              
              {/* Report Routes */}
              <Route path="/reports" element={<ReportDashboard />} />
              <Route path="/reports/sales" element={<SalesReport />} />
              <Route path="/reports/stock" element={<StockReport />} />
              <Route path="/reports/customers" element={<CustomerReport />} />
              <Route path="/reports/financial" element={<FinancialReport />} />
              <Route path="/settings" element={<SystemSettings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;