import Layout from "./main-layout/Layout"
import LoginPage from "./pages/LoginPage"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import DashboardArea from "./features/dashboard/DashboardArea";
import MaterialArea from "./features/material/MaterialArea";
import QuotationArea from "./features/quotation/QuotationArea";
import PaymentArea from "./features/payment/PaymentArea";
import QuotationForm from "./features/quotation/components/QuotationForm";
import QuotationProvider from "./contexts/quotation/QuotationProvider";
import QuotationDetail from "./features/quotation/components/QuotationDetail";

function App() {

  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardArea />} />
              <Route path="/materials" element={<MaterialArea />} />
              <Route path="/payment" element={<PaymentArea />} />
              <Route path="/quotations" element={
                <QuotationProvider>
                  <QuotationArea />
                </QuotationProvider>
              } />

              <Route path="/quotations/send-quotation" element={
                <QuotationProvider>
                  <QuotationForm />
                </QuotationProvider>
              } />

              <Route path="/quotations/:id" element={
                <QuotationProvider>
                  <QuotationDetail />
                </QuotationProvider>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
