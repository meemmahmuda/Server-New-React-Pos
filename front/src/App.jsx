import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './component/Login';
import Dashboard from './component/Dashboard';
import CategoryList from './component/Categories/CategoryList';
import CreateCategory from './component/Categories/CreateCategory';
import EditCategory from './component/Categories/EditCategory';
import ExpenseList from './component/Expenses/ExpenseList';
import CreateExpense from './component/Expenses/CreateExpense';
import EditExpense from './component/Expenses/EditExpense';
import SupplierList from './component/Suppliers/SupplierList';
import CreateSupplier from './component/Suppliers/CreateSupplier';
import EditSupplier from './component/Suppliers/EditSupplier';
import ProductList from './component/Products/ProductList';
import CreateProduct from './component/Products/CreateProduct';
import EditProduct from './component/Products/EditProduct';
import CreateOrder from './component/Orders/CreateOrder';
import OrderList from './component/Orders/OrderList';
import ShowList from './component/Suppliers/ShowList';
import SalesList from './component/Sales/SalesList';
import ShowSaleList from './component/Sales/ShowSaleList';
import CreateSale from './component/Sales/CreateSale';
import ReturnList from './component/Sales_Return/ReturnList';
import CreateReturn from './component/Sales_Return/CreateReturn';
import SalesReport from './component/Sales/SalesReport';
import PurchaseReport from './component/Orders/PurchaseReport';
import IncomeStatement from './component/IncomeStatement/IncomeStatement';

const App = () => {
  return (
<Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/create" element={<CreateCategory />} />
        <Route path="/categories/edit/:id" element={<EditCategory />} />

        <Route path="/expenses" element={<ExpenseList />} />
        <Route path="/expenses/create" element={<CreateExpense />} />
        <Route path="/expenses/edit/:id" element={<EditExpense />} />

        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/suppliers/create" element={<CreateSupplier />} />
        <Route path="/suppliers/edit/:id" element={<EditSupplier />} />

        <Route path="/products" element={<ProductList />} />
        <Route path="/products/create" element={<CreateProduct />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />

        <Route path="/orders/create" element={<CreateOrder />} />
        <Route path="/orders" element={<OrderList />} />

        <Route path="/suppliers/:id" element={<ShowList />} />

        <Route path="/sales" element={<SalesList />} />

        <Route path="/sales/:customerName" element={<ShowSaleList />} />
        <Route path="/sales/create" element={<CreateSale />} />
        
        <Route path="/sales_returns" element={<ReturnList />} />
        <Route path="/sales_returns/create" element={<CreateReturn />} />

        <Route path="/sales/report" element={<SalesReport />} />
        <Route path="/purchases/report" element={<PurchaseReport />} />

        <Route path="/income-statement" element={<IncomeStatement />} />
        

      </Routes>
    </Router>
  );
};

export default App;