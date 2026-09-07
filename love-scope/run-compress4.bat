@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0compress4.ps1"
