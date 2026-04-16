import Layout from "./main-layout/Layout";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import DashboardArea from "./features/dashboard/DashboardArea";
import InventoryArea from "./features/inventory/InventoryArea";
import QuotationArea from "./features/quotation/QuotationArea";
import PaymentArea from "./features/payment/PaymentArea";
import QuotationForm from "./features/quotation/components/QuotationForm";
import QuotationDetail from "./features/quotation/components/QuotationDetail";
import InventoryDetail from "./features/inventory/components/InventoryDetail"
import InventoryForm from "./features/inventory/components/InventoryForm";

import QuotationProvider from "./contexts/quotation/QuotationProvider";
import InventoryProvider from "./contexts/inventory/InventoryProvider";

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

          
          <Route path="/payment" element={<PaymentArea />} />

          {/* ✅ Wrap once here */}
          <Route
            path="/quotations"
            element={
              <QuotationProvider>
                <QuotationArea />
              </QuotationProvider>
            }
          />

          <Route
            path="/quotations/send-quotation"
            element={
              <QuotationProvider>
                <QuotationForm />
              </QuotationProvider>
            }
          />

          <Route
            path="/quotations/:id"
            element={
              <QuotationProvider>
                <QuotationDetail />
              </QuotationProvider>
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;