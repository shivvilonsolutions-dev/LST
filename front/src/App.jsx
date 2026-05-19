import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./main-layout/Layout";

import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import ClientArea from "./features/clients/ClientArea";
import ClientDetail from "./features/clients/components/ClientDetail";
import DashboardArea from "./features/dashboard/DashboardArea";
import InventoryArea from "./features/inventory/InventoryArea";
import InventoryDetail from "./features/inventory/components/InventoryDetail";
import InventoryForm from "./features/inventory/components/InventoryForm";
import PaymentArea from "./features/payment/PaymentArea";
import QuotationArea from "./features/quotation/QuotationArea";
import QuotationForm from "./features/quotation/components/QuotationForm";
import QuotationDetail from "./features/quotation/components/QuotationDetail";
import SettingsArea from "./features/settings/SettingsArea";

import QuotationProvider from "./contexts/quotation/QuotationProvider";
import InventoryProvider from "./contexts/inventory/InventoryProvider";
import ClientProvider from "./contexts/client/ClientProvider";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* MAIN LAYOUT */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <QuotationProvider>
                <InventoryProvider>
                  <DashboardArea />
                </InventoryProvider>
              </QuotationProvider>
            }
          />


          {/* INVENTORY */}
          <Route
            path="/inventories"
            element={
              <InventoryProvider>
                <InventoryArea />
              </InventoryProvider>
            }
          />

          <Route
            path="/inventories/new-inventory"
            element={
              <InventoryProvider>
                <InventoryForm />
              </InventoryProvider>
            }
          />

          <Route
            path="/inventories/:id"
            element={
              <InventoryProvider>
                <InventoryDetail />
              </InventoryProvider>
            }
          />


          {/* CLIENTS */}
          <Route
            path="/clients"
            element={
              <ClientProvider>
                <QuotationProvider>
                  <ClientArea />
                </QuotationProvider>
              </ClientProvider>
            }
          />

          <Route
            path="/clients/:id"
            element={
              <ClientProvider>
                <QuotationProvider>
                  <ClientDetail />
                </QuotationProvider>
              </ClientProvider>
            }
          />


          {/* PAYMENT */}
          <Route
            path="/payment"
            element={<PaymentArea />}
          />


          {/* QUOTATIONS */}
          <Route
            path="/quotations"
            element={
              <QuotationProvider>
                <ClientProvider>
                  <QuotationArea />
                </ClientProvider>
              </QuotationProvider>
            }
          />

          <Route
            path="/quotations/send-quotation"
            element={
              <QuotationProvider>
                <ClientProvider>
                  <QuotationForm />
                </ClientProvider>
              </QuotationProvider>
            }
          />

          <Route
            path="/quotations/:id"
            element={
              <QuotationProvider>
                <ClientProvider>
                  <QuotationDetail />
                </ClientProvider>
              </QuotationProvider>
            }
          />


          <Route
            path="/settings"
            element={<SettingsArea />}
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;