# 📁 Project Structure

## src/

### 📁 components/

- 📁 layout/
  - Header.jsx
  - Sidebar.jsx

- 📁 ui/
  - Button.jsx
  - Input.jsx
  - Popup.jsx

---

### 📁 contexts/

- 📁 client/
  - clientContext.js
  - ClientProvider.jsx

- 📁 inventory/
  - inventoryContext.js
  - InventoryProvider.jsx

- 📁 quotation/
  - quotationContext.js
  - QuotationProvider.jsx

---

### 📁 features/


- 📁 clients/
  - ClientArea.jsx

  - 📁 components/
    - ClientDetail.jsx

- 📁 dashboard/
  - DashboardArea.jsx
  - InventoryCard.jsx

- 📁 inventory/
  - InventoryArea.jsx

  - 📁 components/
    - InventoryDetail.jsx
    - InventoryForm.jsx

- 📁 payment/
  - PaymentArea.jsx

- 📁 quotation/
  - QuotationArea.jsx

  - 📁 components/
    - QuotationActions.jsx
    - QuotationCard.jsx
    - QuotationForm.jsx
    - QuotationStats.jsx
    - ShowQuotations.jsx
    - StatsCard.jsx

---

### 📁 main-layout/

- DashboardLayout.jsx

---

### 📁 pages/

- LoginPage.jsx

---

### 📁 utils/

- caculateQuotationAmount.js
- getCurrentDateAndTime.js
- handleDownloadPDF.js
- localStorage.js
