# ========================================
# Next.js Cache Clearing & Rebuild Script
# ========================================
# This script clears all Next.js caches and rebuilds the application
# Usage: .\clear-cache.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next.js Cache Cleaner & Rebuilder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clear .next directory (build output)
Write-Host "[1/4] Clearing .next directory..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "  ✓ .next directory cleared" -ForegroundColor Green
} else {
    Write-Host "  → .next directory not found (already clean)" -ForegroundColor Gray
}

# Step 2: Clear .swc directory (SWC compiler cache)
Write-Host "[2/4] Clearing .swc cache..." -ForegroundColor Yellow
if (Test-Path ".swc") {
    Remove-Item -Recurse -Force .swc
    Write-Host "  ✓ .swc cache cleared" -ForegroundColor Green
} else {
    Write-Host "  → .swc cache not found (already clean)" -ForegroundColor Gray
}

# Step 3: Clear node_modules cache
Write-Host "[3/4] Clearing node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache
    Write-Host "  ✓ node_modules cache cleared" -ForegroundColor Green
} else {
    Write-Host "  → node_modules cache not found (already clean)" -ForegroundColor Gray
}

# Step 4: Rebuild the application
Write-Host "[4/4] Building application..." -ForegroundColor Yellow
Write-Host ""

$buildSuccess = $false
try {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        $buildSuccess = $true
    }
} catch {
    Write-Host "Build failed with error: $_" -ForegroundColor Red
}

Write-Host ""
if ($buildSuccess) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ Cache cleared and build complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Restart your dev server: npm run dev" -ForegroundColor White
    Write-Host "  2. Hard refresh browser: Ctrl+Shift+R" -ForegroundColor White
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ✗ Build failed - check errors above" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
}
Write-Host ""
