import React from "react";
import Dashboard from "./Pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import Sale from "./Pages/Sale";
import POS from "./Pages/POS";
import CashRegister from "./Pages/CashRegister";
import Kitchen from "./Pages/Kitchen";
import OrderHistory from "./Pages/OrderHistory";
import AddPurchase from "./Pages/AddPurchase";
import PurchaseHistory from "./Pages/PurchaseHistory.jsx";
import { DarkModeProvider } from "./Components/DarkModeContext.jsx";
import AddFoodItem from "./Pages/AddFoodItem.jsx";
import Table from "./Pages/Table.jsx";
import TableFormModal from "./Pages/TableFormModal.jsx";
import FoodItems from "./Pages/FoodItems.jsx";
import FoodGroups from "./Pages/FoodGroups.jsx";
import Modifiers from "./Pages/Modifiers.jsx";
import AddModifiers from "./Pages/AddModifiers.jsx";
import AddIngredient from "./Pages/AddIngredient.jsx";
import Ingredient from "./Pages/Ingredient.jsx";
import Accounts from "./Pages/Accounts.jsx";
import Deposits from "./Pages/Deposits.jsx";
import Transfers from "./Pages/Transfers.jsx";
import Expenses from "./Pages/Expenses";
import Transactions from "./Pages/Transactions.jsx";
import AddCustomer from "./Pages/AddCustomer.jsx";
import Customers from "./Pages/Customers.jsx";
import AddSupplier from "./Pages/AddSuppliers.jsx";
import Suppliers from "./Pages/Suppliers.jsx";
import WorkPeriodReport from "./Pages/WorkPeriodReport.jsx";
import SaleReport from "./Pages/SaleReport.jsx";
import ItemSaleReport from "./Pages/ItemSaleReport.jsx";
import SaleSummaryReport from "./Pages/SaleSummaryReport.jsx";
import SaleDetailedReport from "./Pages/SaleDetailedReport.jsx";
import PurchaseReport from "./Pages/PurchaseReport.jsx";
import ExpenseReport from "./Pages/ExpensesReport.jsx";
import StockAlertReport from "./Pages/StockAlertReport.jsx";
import CustomerDueReport from "./Pages/CustomerDueReport.jsx";
import SupplierDueReport from "./Pages/SupplierDueReport.jsx";
import AttendanceReport from "./Pages/AttendanceReport.jsx";
import Department from "./Pages/Departments.jsx";
import Designation from "./Pages/Designation.jsx";
import OfficeShift from "./Pages/OfficeShift.jsx";
import Employee from "./Pages/Employee.jsx";
import AddEmployee from "./Pages/AddEmployee.jsx";
import Holidays from "./Pages/Holidays.jsx";
import LeaveRequest from "./Pages/LeaveRequest.jsx";
import User from "./Pages/User.jsx";
import AddUser from "./Pages/AddUser.jsx";
import PaymentMethods from "./Pages/PaymentMethods.jsx";
import TaxRates from "./Pages/TaxRates.jsx";
import Discounts from "./Pages/Discounts.jsx";
import Charges from "./Pages/Charges.jsx";
import ChangePassword from "./Pages/ChangePassword.jsx";
import Logout from "./Pages/Logout.jsx";
import Company from "./Pages/Compnay.jsx";
import Login from "./Pages/Login.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import General from "./Pages/General.jsx";
import System from "./Pages/System.jsx";
import Email from "./Pages/Email.jsx";
import Language from "./Pages/Language.jsx";
import EmailTemplates from "./Pages/EmailTemplates.jsx";
import Payroll from "./Pages/Payroll.jsx";
import Attendance from "./Pages/Attendence.jsx";
import CreatePermission from "./Pages/CreatePermission.jsx";
function App() {
  return (
    <>
      <DarkModeProvider>
        <div className="App min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/admin" element={<MainLayout />}>
                <Route index element={<Dashboard />} />

                {/* Use relative paths here */}
                <Route path="addpurchase" element={<AddPurchase />} />
                <Route path="purchasehistory" element={<PurchaseHistory />} />
                <Route path="addfooditem" element={<AddFoodItem />} />
                <Route path="table" element={<Table />} />
                <Route path="tableformmodal" element={<TableFormModal />} />
                <Route path="fooditems" element={<FoodItems />} />
                <Route path="foodgroups" element={<FoodGroups />} />
                <Route path="modifiers" element={<Modifiers />} />
                <Route path="addmodifiers" element={<AddModifiers />} />
                <Route path="ingredient" element={<Ingredient />} />
                <Route path="addingredient" element={<AddIngredient />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="deposits" element={<Deposits />} />
                <Route path="transfers" element={<Transfers />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="addCustomer" element={<AddCustomer />} />
                <Route path="customers" element={<Customers />} />
                <Route path="addSupplier" element={<AddSupplier />} />
                <Route path="Suppliers" element={<Suppliers />} />
                <Route path="weekperiodreport" element={<WorkPeriodReport />} />
                <Route path="salereport" element={<SaleReport />} />
                <Route path="itemsalereport" element={<ItemSaleReport />} />
                <Route
                  path="salesummaryreport"
                  element={<SaleSummaryReport />}
                />
                <Route
                  path="saledetailedreport"
                  element={<SaleDetailedReport />}
                />
                <Route path="purchasereport" element={<PurchaseReport />} />
                <Route path="expensereport" element={<ExpenseReport />} />
                <Route path="stockalertreport" element={<StockAlertReport />} />
                <Route
                  path="customerduereport"
                  element={<CustomerDueReport />}
                />
                <Route
                  path="supplierduereport"
                  element={<SupplierDueReport />}
                />
                <Route path="attendancereport" element={<AttendanceReport />} />
                <Route path="department" element={<Department />} />
                <Route path="designation" element={<Designation />} />
                <Route path="officeshift" element={<OfficeShift />} />
                <Route path="employee" element={<Employee />} />
                <Route path="addemployee" element={<AddEmployee />} />
                <Route path="holidays" element={<Holidays />} />
                <Route path="leaverequest" element={<LeaveRequest />} />
                <Route path="user" element={<User />} />
                <Route path="adduser" element={<AddUser />} />
                <Route path="paymentmethods" element={<PaymentMethods />} />
                <Route path="taxrates" element={<TaxRates />} />
                <Route path="discounts" element={<Discounts />} />
                <Route path="charges" element={<Charges />} />
                <Route path="company" element={<Company />} />
                <Route path="changepassword" element={<ChangePassword />} />
                <Route path="general" element={<General />} />
                <Route path="system" element={<System />} />
                <Route path="email" element={<Email />} />
                <Route path="language" element={<Language />} />
                <Route path="emailtemplates" element={<EmailTemplates />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="payroll" element={<Payroll />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="createpermission" element={<CreatePermission />} />
                <Route path="sale" element={<Sale />} />
                <Route path="pos" element={<POS />} />
                <Route path="cashregister" element={<CashRegister />} />
                <Route path="kitchen" element={<Kitchen />} />
                <Route path="orderhistory" element={<OrderHistory />} />
              </Route>
              <Route path="/" element={<Logout />} />
            </Routes>
          </Router>
        </div>
      </DarkModeProvider>
    </>
  );
}

export default App;
