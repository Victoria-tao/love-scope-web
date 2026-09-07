@echo off
chcp 65001 >nul
echo ==========================================
echo  Compressing MBTI cat images...
echo  (This compresses 16 images in pages\personal\images)
echo ==========================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0compress_images.ps1"
echo.
echo If you see "DONE", compression succeeded.
pause
