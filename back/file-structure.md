# 📁 Backend Project Structure

## src/

### Core Files

- app.js
- server.js

---

### 📁 config/

- atlasDb.js
- envConfig.js
- localDb.js

---

### 📁 controllers/

- authController.js
- clientController.js
- inventoryController.js
- quotationController.js
- settingsController.js

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

- 📁 local/
  - Client.js
  - Inventory.js
  - Quotation.js
  - Settings.js
  - User.js

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
- inventoryService.js
- quotationService.js
- settingsService.js
- syncService.js


---

### 📁 utils/

- checkInternet.js
- generateOTP.js
- generateToken.js
- saveQuotationPdf.js
- sendEmail.js
