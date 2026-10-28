# LST Quotation Desktop App - Client Setup Guide

## **Installation Steps for Client PC**

### **Step 1: Install MongoDB Community Server (REQUIRED)**

**Why Required:** The app needs a local MongoDB database to work offline and store quotations.

**Download:**
- Direct Link: https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.0.4-signed.msi
- Alternative: https://www.mongodb.com/try/download/community

**Installation:**
1. Run the MongoDB installer
2. **IMPORTANT:** Check "Install MongoDB as a Service"
3. Install with default settings
4. MongoDB service will start automatically

**Verify Installation:**
1. Press `Windows + R`
2. Type: `services.msc`
3. Find "MongoDB"
4. Status should show "Running"

---

### **Step 2: Install LST Quotation Desktop App**

**Installer Location:**
- File: `LST Quotation Desktop App Setup 1.0.0.exe`
- File Size: ~125 MB

**Installation:**
1. Run the installer
2. Follow the installation wizard
3. App installs to: `C:\Users\<username>\AppData\Local\Programs\lst-quotation-desktop-app`
4. Desktop shortcut will be created

---

### **Step 3: Start MongoDB Service (If Not Running)**

**Check Service:**
1. Press `Windows + R`
2. Type: `services.msc`
3. Find "MongoDB"
4. If status is "Stopped" → Right-click → **Start**

**Alternative: Start via Command Prompt**
```bash
net start MongoDB
```

---

### **Step 4: Login to LST App**

**Start the App:**
1. Double-click the desktop shortcut
2. App will open and backend will start automatically

**Login Credentials:**
You need to provide the client with their credentials:

**Example:**
- **Email:** `client@example.com`
- **Password:** `client123`

OR

- **User ID:** `CLIENT001`
- **Password:** `client123`

---

## **How to Create a New User**

### **From Super Admin Panel:**

1. **Login to Super Admin Panel**
   - Email: `odedraarjun928@gmail.com`
   - Password: `admin123`

2. **Go to User Management**
   - Find "All Registered System Users" section
   - Click "Create User" or "Add User" button

3. **Fill User Details**
   - **Name:** Client's name (e.g., "Rahul Sharma")
   - **Email:** Client's email (e.g., "rahul@example.com")
   - **Password:** Set password (e.g., "rahul123")
   - **Role:** Select "ADMIN"

4. **Click "Create User"**
   - System will generate User ID automatically (e.g., "RAHUL001")
   - User created in all databases

5. **Share Credentials with Client**
   - **User ID:** RAHUL001 (or whatever is generated)
   - **Email:** rahul@example.com
   - **Password:** rahul123

---

## **How Quotations Work**

### **Creating Quotations:**

1. **Login to the app**
2. **Go to Quotations page**
3. **Click "+ Create Quotation"**
4. **Fill in:**
   - **Client Name:** Client's name
   - **Mobile:** Mobile number (required)
   - **WhatsApp:** WhatsApp number (optional, uses mobile if empty)
   - **Material details:** Size, Piece, Gauge
   - **Rates:** Rate B1, Rate B2
   - **Other charges:** Bending, Laser Cutting, Add
5. **Click "Create Quotation →"**
6. **Button changes to "Quotation Created ✓"**
7. **App automatically navigates to quotations list**
8. **Quotation appears in the list**

---

## **Quotation Features:**

### **When Client is Offline:**
- ✅ App works normally
- ✅ Data stored in local MongoDB
- ✅ Can create quotations
- ✅ Can add clients
- ✅ Can manage inventory
- ✅ Can generate PDFs
- ✅ Can send WhatsApp messages

### **When Client is Online:**
- ✅ App syncs data to MongoDB Atlas
- ✅ Admin can see data from Atlas
- ✅ Cloud backup is created
- ✅ Data is safe

---

## **Troubleshooting:**

### **Problem: MongoDB Service Won't Start**
**Solution:**
1. Check if port 27017 is available: `netstat -ano | findstr :27017`
2. Check MongoDB logs: `C:\Program Files\MongoDB\Server\X.X\log\mongod.log`
3. Restart MongoDB service in services.msc

### **Problem: App Won't Start**
**Solution:**
1. Check if MongoDB service is running
2. Check if backend is starting (look for console window)
3. Check if port 5000 is available: `netstat -ano | findstr :5000`

### **Problem: Login Fails**
**Solution:**
1. Verify credentials are correct
2. Check if user exists in database
3. Check if MongoDB is running

### **Problem: Quotations Not Saving**
**Solution:**
1. Check if MongoDB service is running
2. Check if backend is running on port 5000
3. Check if form has required fields (Client Name, Mobile)
4. Check console for error messages

---

## **File Organization:**

Quotation files are organized automatically:
```
Documents/LST_Local_Files/<userId>/
├── 2025/
│   ├── 09/
│   │   ├── 16-September/
│   │   │   └── <clientName>/
│   │   │       ├── excel-files/
│   │   │       └── pdf-files/
```

---

## **Contact Support:**

If you face any issues:
- Contact: [Your Contact Information]
- Email: [Your Email]
- Phone: [Your Phone Number]

---

## **System Requirements:**

- **OS:** Windows 10 or higher
- **RAM:** 4GB minimum (8GB recommended)
- **Storage:** 500MB free space
- **Internet:** Required for Atlas sync (optional for offline work)

---

## **Installation Summary:**

**Required:**
1. ✅ MongoDB Community Server (must be installed)
2. ✅ LST Quotation Desktop App Setup 1.0.0.exe

**Optional:**
3. MongoDB Compass (for viewing data)

**Total Setup Time:** ~10-15 minutes

---

**This guide will help you set up the LST Quotation Desktop App on client PCs.**