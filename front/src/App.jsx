import Layout from "./main-layout/Layout";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import DashboardArea from "./features/dashboard/DashboardArea";
import InventoryArea from "./features/inventory/InventoryArea";
import QuotationArea from "./features/quotation/QuotationArea";
import PaymentArea from "./features/payment/PaymentArea";
import ClientArea from "./features/clients/ClientArea"

import QuotationForm from "./features/quotation/components/QuotationForm";
import QuotationDetail from "./features/quotation/components/QuotationDetail";
import InventoryDetail from "./features/inventory/components/InventoryDetail"
import InventoryForm from "./features/inventory/components/InventoryForm";
import ClientDetail from "./features/clients/components/ClientDetail"

import QuotationProvider from "./contexts/quotation/QuotationProvider";
import InventoryProvider from "./contexts/inventory/InventoryProvider";
import ClientProvider from "./contexts/client/ClientProvider"
import { ClientContext } from "./contexts/client/clientContext";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Main Layout */}
        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={
              <InventoryProvider>
                <QuotationProvider>
                  <DashboardArea />
                </QuotationProvider>
              </InventoryProvider>
            }
          />

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

          <Route
            path="/clients"
            element={
              <QuotationProvider>
                <ClientProvider>
                  <ClientArea />
                </ClientProvider>
              </QuotationProvider>
            }
          />

          <Route
            path="/clients/:id"
            element={
              <QuotationProvider>
                <ClientProvider>
                  <ClientDetail />
                </ClientProvider>
              </QuotationProvider>
            }
          />


          <Route path="/payment" element={<PaymentArea />} />

          <Route
            path="/quotations"
            element={
              <ClientProvider>
                <QuotationProvider>
                  <QuotationArea />
                </QuotationProvider>
              </ClientProvider>
            }
          />

          <Route
            path="/quotations/send-quotation"
            element={
              <ClientProvider>
                <QuotationProvider>
                  <QuotationForm />
                </QuotationProvider>
              </ClientProvider>
            }
          />

          <Route
            path="/quotations/:id"
            element={
              <ClientProvider>
                <QuotationProvider>
                  <QuotationDetail />
                </QuotationProvider>
              </ClientProvider>
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;