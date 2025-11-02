# 🚨 URGENT: Rotate MongoDB Credentials (5 MINUTES)

## ⚠️ Your credentials are exposed! Do this NOW:

### Step 1: Go to MongoDB Atlas (2 min)
1. **Open**: https://cloud.mongodb.com
2. **Login** with your account

### Step 2: Create New User (1 min)
1. Click **"Database Access"** (left sidebar)
2. Click **"+ ADD NEW DATABASE USER"**
3. **Username**: Enter anything (e.g., `quizmaster_new`)
4. **Password**: Click **"Autogenerate Secure Password"** → **COPY IT!**
5. **Database User Privileges**: Select **"Read and write to any database"**
6. Click **"Add User"**

### Step 3: Get Connection String (1 min)
1. Click **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. **Copy** the connection string
5. **Replace** `<password>` with the password you just copied

### Step 4: Update Local .env (30 sec)
1. Create `.env` file in project folder (if it doesn't exist)
2. Add:
   ```
   MONGODB_URI=mongodb+srv://YOUR_NEW_USERNAME:YOUR_NEW_PASSWORD@YOUR_CLUSTER.mongodb.net/quiz_master
   PORT=3000
   SESSION_SECRET=your-random-secret-here
   ```

### Step 5: Delete Old User (30 sec)
1. Go back to **"Database Access"**
2. Find your **old user** (the exposed one)
3. Click **"..."** → **"Delete"**
4. Confirm

### Step 6: Test (30 sec)
```cmd
npm start
```
Check if it connects successfully!

---

## ✅ After Rotating:

Run `CLEAN_SECRETS.bat` to remove secrets from Git history, then:
```cmd
git push --force
```

---

**Time taken: ~5 minutes | Security: CRITICAL** 🔒

