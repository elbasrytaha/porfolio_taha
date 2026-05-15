# ─────────────────────────────────────────────
# TAHA ELBASRY PORTFOLIO — GitHub Deploy Script
# Run this AFTER installing Git for Windows
# ─────────────────────────────────────────────

Write-Host "=== DEPLOYING TAHA ELBASRY PORTFOLIO ===" -ForegroundColor Cyan

# 1. Init git repo
git init
git add .
git commit -m "feat: ultra-premium portfolio — Taha Elbasry"

# 2. Connect to GitHub
git remote add origin https://github.com/elbasrytaha/portfolio.git
git branch -M main
git push -u origin main

Write-Host "✓ Code pushed to GitHub" -ForegroundColor Green

# 3. Deploy to GitHub Pages
npm run deploy

Write-Host ""
Write-Host "✅ DONE! Portfolio live at:" -ForegroundColor Green
Write-Host "   https://elbasrytaha.github.io/portfolio/" -ForegroundColor Cyan
