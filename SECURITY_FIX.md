# 🔒 SECURITY FIX - MongoDB Credentials Exposed

## ⚠️ URGENT: Your MongoDB Atlas credentials were exposed on GitHub!

### Immediate Steps Required:

## 1️⃣ ROTATE YOUR MONGODB ATLAS CREDENTIALS (DO THIS FIRST!)

### Step 1: Log into MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Log in with your account

### Step 2: Create a New Database User
1. Click on **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a new username (e.g., `quiz_master_user`)
5. Generate a strong password (click "Autogenerate Secure Password" and save it!)
6. Set privileges to **"Read and write to any database"** (or more restrictive if needed)
7. Click **"Add User"**

### Step 3: Get New Connection String
1. Click on **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the new connection string
5. Replace `<password>` with your new password

### Step 4: Update Your Local .env File
1. Open your `.env` file in the project folder
2. Replace the old `MONGODB_URI` with the new one
3. Save the file

### Step 5: Delete the Old Database User
1. Go back to **"Database Access"**
2. Find your old user (the one with exposed credentials)
3. Click the **"..."** menu → **"Delete"**
4. Confirm deletion

---

## 2️⃣ REMOVE SECRETS FROM GIT HISTORY

The exposed credentials are still in your Git history. You need to remove them:

### Option A: Using BFG Repo-Cleaner (Recommended - Easier)

1. **Download BFG**: https://rtyley.github.io/bfg-repo-cleaner/
2. **Create a file with your exposed URI** (e.g., `secrets.txt`):
   ```
   mongodb+srv://YOUR_OLD_USERNAME:YOUR_OLD_PASSWORD@cluster.mongodb.net
   ```
   (Replace with your actual exposed credentials)

3. **Run BFG**:
   ```cmd
   java -jar bfg.jar --replace-text secrets.txt
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

4. **Force push** (⚠️ This rewrites history):
   ```cmd
   git push --force
   ```

### Option B: Using git-filter-branch (Manual)

```cmd
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all
git push --force --all
```

---

## 3️⃣ VERIFY .GITIGNORE IS CORRECT

Make sure your `.gitignore` includes:
```
.env
*.env
.env.local
```

✅ Already done! Your `.gitignore` has `.env` listed.

---

## 4️⃣ CREATE/UPDATE .ENV FILE LOCALLY

Create a `.env` file in your project root (if it doesn't exist):

```env
PORT=3000
MONGODB_URI=mongodb+srv://YOUR_NEW_USERNAME:YOUR_NEW_PASSWORD@YOUR_CLUSTER.mongodb.net/quiz_master
SESSION_SECRET=your-random-secret-key-here
```

**⚠️ NEVER commit this file to Git!**

---

## 5️⃣ UPDATE GITHUB ALERT STATUS

After completing steps 1-4:
1. Go to your GitHub repository
2. Find the security alert about the exposed secret
3. Click on it
4. Mark it as **"Revoked"** or **"Resolved"**

---

## 6️⃣ CHECK FOR OTHER EXPOSED SECRETS

Run this command to search your entire Git history:
```cmd
git log --all --full-history --source --all -S "mongodb+srv://" --pretty=format:"%H %an %ad %s" --date=short
```

If it finds anything, those commits still contain the secret.

---

## ✅ Verification Checklist

- [ ] Created new MongoDB Atlas database user
- [ ] Deleted old database user from Atlas
- [ ] Updated local `.env` file with new credentials
- [ ] Removed secret from Git history (using BFG or filter-branch)
- [ ] Force pushed to GitHub
- [ ] Tested application with new credentials
- [ ] Marked GitHub alert as resolved

---

## 🛡️ Best Practices for the Future

1. **Always use `.env` file** for secrets (never hardcode)
2. **Add `.env` to `.gitignore`** (already done ✅)
3. **Use `.env.example`** to show structure without actual values
4. **Review commits before pushing** - check `git diff` before committing
5. **Enable GitHub's secret scanning** (usually enabled by default)
6. **Rotate credentials immediately** if exposed
7. **Use environment variables** in hosting platforms (Heroku, Railway, etc.)

---

## 📞 Need Help?

If you're stuck on any step, the most important thing is **Step 1: Rotate your MongoDB credentials** - do this immediately to prevent unauthorized access!

