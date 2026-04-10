import DashboardLayout from "./main-layout/DashboardLayout"
import LoginPage from "./pages/LoginPage"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import DashboardArea from "./features/dashboard/DashboardArea";
import MaterialArea from "./features/material/MaterialArea";
import QuotationArea from "./features/quotation/QuotationArea";
import PaymentArea from "./features/payment/PaymentArea";
import QuotationForm from "./features/quotation/components/QuotationForm";

function App() {

  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardArea />} />
              <Route path="/materials" element={<MaterialArea />} />
              <Route path="/payment" element={<PaymentArea />} />
              <Route path="/quotation" element={<QuotationArea />} />

              <Route path="/quotation/send-quotation" element={<QuotationForm />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
