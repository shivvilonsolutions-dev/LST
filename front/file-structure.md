# 📁 Frontend Project Structure

## src/

### 📁 api/

- authApi.js
- axios.js
- clientApi.js
- inventoryApi.js
- quotationApi.js
- settingsApi.js


---

### 📁 components/

- 📁 layout/
  - Header.jsx
  - Sidebar.jsx

- 📁 ui/
  - Button.jsx
  - ErrorMessage.jsx
  - Input.jsx
  - Loader.jsx
  - PageLoader.jsx
  - Popup.jsx


---

### 📁 contexts/

- 📁 auth/
  - AuthContext.js
  - authContext.jsx
  - authReducer.js

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

- 📁 settings/
  - SettingsArea.jsx


---

### 📁 hooks/

- useApiError.js
- useLoading.js


---

### 📁 main-layout/

- Layout.jsx


---

### 📁 pages/

- ForgotPassword.jsx
- LoginPage.jsx
- ResetPassword.jsx


---

### 📁 routes/

- ProtectedRoute.jsx


---

### 📁 utils/

- formatDate.js
- handleDownloadPDF.js
