# 🚀 How to Run Quiz Master from Terminal

## ✅ PowerShell Commands (Your Terminal)

**Step 1:** Open PowerShell and type:
```powershell
cd E:\Quiz_Master
```

**Step 2:** Start the server:
```powershell
npm start
```

**That's it!** Server will start on `http://localhost:3000`

---

## ✅ Command Prompt (CMD) Commands

**Step 1:** Open CMD and type:
```cmd
cd E:\Quiz_Master
```

**Step 2:** Start the server:
```cmd
npm start
```

**OR combine both (only in CMD):**
```cmd
cd E:\Quiz_Master && npm start
```

---

## 🛑 Stop the Server

**In terminal, press:** `Ctrl + C`

**OR double-click:** `STOP_SERVER.bat`

---

## ⚠️ If Port is Already in Use

**PowerShell:**
```powershell
Get-Process -Name node | Stop-Process -Force
cd E:\Quiz_Master
npm start
```

**CMD:**
```cmd
taskkill /F /IM node.exe
cd E:\Quiz_Master
npm start
```

---

## 📋 Quick Copy-Paste Commands

**For PowerShell:**
```
cd E:\Quiz_Master
npm start
```

**For CMD:**
```
cd E:\Quiz_Master && npm start
```

---

## 🎯 Easiest Method (No Terminal!)

**Just double-click:** `START.bat` file

This automatically:
- Navigates to the correct folder
- Starts the server
- Shows you the status

---

## ✅ Success Messages

When working correctly, you'll see:
```
Server is running on http://localhost:3000
Connected to MongoDB
```

Then open: `http://localhost:3000` in your browser!


