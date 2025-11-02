# 🚀 Quick Start Guide

## ⚠️ IMPORTANT: Run from Project Folder!

**You must be in the project folder to run commands:**

```bash
cd E:\Quiz_Master
npm start
```

## First Time Setup (Only Once)

1. **Navigate to project folder:**
   ```bash
   cd E:\Quiz_Master
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start MongoDB:**
   - Make sure MongoDB is running on your system
   - On Windows: MongoDB usually runs automatically
   - If not running: Check MongoDB service

4. **Seed the database (optional - only if you want fresh quizzes):**
   ```bash
   npm run seed
   ```

## Running the App (Every Time)

**Option 1: Using Command Line**
```bash
cd E:\Quiz_Master
npm start
```

**Option 2: Double-click `START.bat` (Windows)**
- This automatically navigates to the correct folder and starts the server

The server will start on `http://localhost:3000`

**OR for development with auto-reload:**
```bash
cd E:\Quiz_Master
npm run dev
```

## What Happens Automatically

✅ Server starts on port 3000  
✅ Connects to MongoDB  
✅ Serves the Quiz Master app  
✅ All features work immediately  

## When to Seed Database Again

Only run `npm run seed` if you want to:
- Reset all quizzes to default
- Clear existing quiz data
- Start fresh

**Note:** This will DELETE all existing quizzes and replace them with the seed data.

## Troubleshooting

### Wrong Directory Error?
**Error:** `Could not read package.json`

**Solution:** Make sure you're in the project folder:
```bash
cd E:\Quiz_Master
```

Then run `npm start`

### MongoDB Not Running?
```bash
# Windows
net start MongoDB

# Check if running
mongosh quiz_master
```

### Port Already in Use?
Change PORT in `.env` file or stop the process using port 3000

### Need to Restart?
Just press `Ctrl+C` in terminal and run `npm start` again

## 📝 NPM Scripts

- `npm start` - Start the server (must be in project folder!)
- `npm run dev` - Start with auto-reload
- `npm run seed` - Seed the database with sample quizzes
- `npm run setup` - Install dependencies
