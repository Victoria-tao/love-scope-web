@echo off
chcp 65001 >nul
title 月下签 - 图片压缩工具
echo ========================================
echo    月下签小程序 - 图片批量压缩
echo ========================================
echo.
echo 正在压缩图片，请稍候...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0压缩图片.ps1"

echo.
echo 压缩完成！请在微信开发者工具中重新编译。
pause
