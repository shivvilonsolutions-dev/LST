# 📁 Backend Project Structure


### Core Files

- server.js

## src/

- app.js

---

### 📁 config/

- atlasDb.js
- envConfig.js
- localDb.js
- setDatabase.js

---

### 📁 controllers/

- authController.js
- clientController.js
- importController.js
- inventoryController.js
- quotationController.js
- settingsController.js

### 📁 electron/

- ipcHandlers.js

- 📁 ipc/
  - dialogIPC.js
  - filesystemIPC.js
  - notificationIPC.js
  - printerIPC.js
  - systemIPC.js

- 📁 native/
  - appMenu.js
  - appPaths.js
  - notifications.js
  - tray.js
  - updater.js
  - windowManager.js


---

### 📁 jobs/

- syncJob.js

---

### 📁 middleware/

- authMiddleware.js

---

### 📁 models/


- 📁 atlas/
  - Client.js
  - Inventory.js
  - Quotation.js
  - Settings.js
  - User.js

- 📁 Local/
  - Client.js
  - Inventory.js
  - Quotation.js
  - Settings.js
  - User.js

- getModels.js

---

### 📁 routes/

- authRoutes.js
- clientRoutes.js
- inventoryRoutes.js
- quotationRoutes.js
- settingsRoutes.js

---

### 📁 schemas/

- ClientSchema.js
- InventorySchema.js
- QuotationSchema.js
- SettingsSchema.js
- UserSchema.js

---

### 📁 services/

- authService.js
- clientService.js
- importQuotationService.js
- inventoryService.js
- quotationService.js
- settingsService.js
- syncService.js

---

### 📁 utils/

- 📁 excel/
  - generateQuotationExcel.js

- 📁 pdf/
  - convertExcelToPdf.js

- 📁 storage/
  - createStoragePath.js
  - saveQuotationFiles.js

- checkInternet.js
- generateOTP.js
- generateToken.js
- saveQuotationPdf.js
- sendEmail.js
