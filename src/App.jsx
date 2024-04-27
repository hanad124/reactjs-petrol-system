import { useEffect, useState, useContext } from "react";
import "./index.css";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Employee from "./pages/employee/Employee";
import Supplier from "./pages/supplier/Supplier";
import Fuel from "./pages/fuel/Fuel";
import Purchase from "./pages/purchase/Purchase";
import Customer from "./pages/customer/Customer";
import Sales from "./pages/sales/Sales";
import Users from "./pages/users/Users";
import SinglEmployee from "./pages/singleEmployee/SingleEmployee";
import NewEmployee from "./pages/newEmployee/NewEmployee";
import NewUser from "./pages/newUser/NewUser";
import EditUser from "./pages/editUser/EditUser";
import EditEmployee from "./pages/editEmployee/EditEmployee";
import SingleUser from "./pages/singleUser/SingleUser";
import NewSupplier from "./pages/newSupplier/NewSupplier";
import EditSupplier from "./pages/editSupplier/EditSupplier";
import NewFuel from "./pages/newFuel/NewFuel";
import EditFuel from "./pages/editFuel/EditFuel";
import NewPurchase from "./pages/newPurchase/NewPurchase";
import NewCustomer from "./pages/newCustomer/NewCustomer";
import NewSales from "./pages/newSales/NewSales";
import EditPurchase from "./pages/editPurchase/EditPurchase";
import EditCustomer from "./pages/editCustomer/EditCustomer";
import PurchaseReport from "./pages/reports/purchaseReport/PurchaseReport";
import ReportView from "./pages/reports/purReportView/PurRepView";
import SalesReport from "./pages/reports/salesReport/SalesReport";
import SalesReportView from "./pages/reports/salesReportView/salesRepView";
import EditSales from "./pages/editSales/EditSales";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";

import EditUserContext from "./context/EditUserContext";
import EditEmployeeContext from "./context/EditEmployeeContext";
import SupplierContext from "./context/SupplierContext";
import FuelContext from "./context/FuelContext";
import PurchaseContext from "./context/PurchaseContext";
import CustomerContext from "./context/CustomerContext";
import { AuthContext } from "./context/AuthContext";

import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const [editUser, setEditUser] = useState([]);
  const [employeeId, SetEmployeeId] = useState([]);
  const [supplierId, SetSupplierId] = useState([]);
  const [customerId, SetCustomerId] = useState([]);
  const [fuelId, SetFuelId] = useState([]);
  const [purchaseId, SetPurchaseId] = useState([]);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <EditUserContext.Provider value={{ editUser, setEditUser }}>
          <EditEmployeeContext.Provider value={{ employeeId, SetEmployeeId }}>
            <SupplierContext.Provider value={{ supplierId, SetSupplierId }}>
              <FuelContext.Provider value={{ fuelId, SetFuelId }}>
                <PurchaseContext.Provider value={{ purchaseId, SetPurchaseId }}>
                  <CustomerContext.Provider
                    value={{ customerId, SetCustomerId }}
                  >
                    <Routes>
                      <Route path="/">
                        <Route path="login" element={<Login />} />
                        <Route
                          path="forgotPassword"
                          element={<ForgotPassword />}
                        />
                        <Route
                          index
                          element={
                            <RequireAuth>
                              <Layout>
                                <Home />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route path="/employees">
                          <Route
                            index
                            element={
                              <RequireAuth>
                                <Layout>
                                  <Employee />
                                </Layout>
                              </RequireAuth>
                            }
                          />
                        </Route>
                        <Route
                          path="/employees/single-employee"
                          element={
                            <RequireAuth>
                              <Layout>
                                <SinglEmployee />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/employees/new-employee"
                          element={
                            <RequireAuth>
                              <Layout>
                                <NewEmployee />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/employees/edit-employee"
                          element={
                            <RequireAuth>
                              <Layout>
                                <EditEmployee />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/supplier"
                          element={
                            <RequireAuth>
                              <Layout>
                                <Supplier />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/supplier/new-supplier"
                          element={
                            <RequireAuth>
                              <Layout>
                                <NewSupplier />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/supplier/edit-supplier"
                          element={
                            <RequireAuth>
                              <Layout>
                                <EditSupplier />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/fuel"
                          element={
                            <RequireAuth>
                              <Layout>
                                <Fuel />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/fuel/new-fuel"
                          element={
                            <RequireAuth>
                              <Layout>
                                <NewFuel />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/fuel/edit-fuel"
                          element={
                            <RequireAuth>
                              <Layout>
                                <EditFuel />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/purchase"
                          element={
                            <RequireAuth>
                              <Layout>
                                <Purchase />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/purchase/edit-purchase"
                          element={
                            <RequireAuth>
                              <Layout>
                                <EditPurchase />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/purchase/new-purchase"
                          element={
                            <RequireAuth>
                              <Layout>
                                <NewPurchase />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/customer"
                          element={
                            <RequireAuth>
                              <Layout>
                                <Customer />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/customer/new-customer"
                          element={
                            <RequireAuth>
                              <Layout>
                                <NewCustomer />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/customers/edit-customer"
                          element={
                            <RequireAuth>
                              <Layout>
                                <EditCustomer />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/sales"
                          element={
                            <RequireAuth>
                              <Layout>
                                <Sales />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/sales/new-sales"
                          element={
                            <RequireAuth>
                              <Layout>
                                <NewSales />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/sales/edit-sales"
                          element={
                            <RequireAuth>
                              <Layout>
                                <EditSales />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/users"
                          element={
                            <RequireAuth>
                              <Layout>
                                <Users />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/users/new-user"
                          element={
                            <RequireAuth>
                              <Layout>
                                <NewUser />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/users/edit-user"
                          element={
                            <RequireAuth>
                              <Layout>
                                <EditUser />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/users/single-user"
                          element={
                            <RequireAuth>
                              <Layout>
                                <SingleUser />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/purchaseReport"
                          element={
                            <RequireAuth>
                              <Layout>
                                <PurchaseReport />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/reportview"
                          element={
                            <RequireAuth>
                              <Layout>
                                <ReportView />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/salesReport"
                          element={
                            <RequireAuth>
                              <Layout>
                                <SalesReport />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                        <Route
                          path="/sales-reportview"
                          element={
                            <RequireAuth>
                              <Layout>
                                <SalesReportView />
                              </Layout>
                            </RequireAuth>
                          }
                        />
                      </Route>
                    </Routes>
                  </CustomerContext.Provider>
                </PurchaseContext.Provider>
              </FuelContext.Provider>
            </SupplierContext.Provider>
          </EditEmployeeContext.Provider>
        </EditUserContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
