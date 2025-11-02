@echo off
echo ========================================
echo CLEANING EXPOSED SECRETS FROM GIT HISTORY
echo ========================================
echo.
echo WARNING: This will rewrite Git history!
echo Make sure you've rotated your MongoDB credentials FIRST!
echo.
pause

echo Removing .env file from all commits (if it exists)...
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all

echo.
echo Cleaning up Git references...
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo.
echo ========================================
echo DONE! Now run: git push --force
echo ========================================
echo.
echo IMPORTANT: This rewrites history. All collaborators must re-clone.
pause

