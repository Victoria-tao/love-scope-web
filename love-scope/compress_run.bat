@echo off
chcp 65001 >nul
echo ==========================================
echo  Compressing MBTI cat images...
echo  Target: pages\personal\images (16 jpg files)
echo ==========================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0compress_images.ps1"
echo.
echo If you see "DONE", compression succeeded.
pause
