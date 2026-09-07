@echo off
set LOG=C:\Users\jd\Doubao\chats\2026-08-29\new-chat-2\love-scope\build_log.txt
echo Build started > "%LOG%"

set CLI=
if exist "C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat" (
  set CLI=C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat
  echo Found CLI at Program Files (x86) >> "%LOG%"
)
if exist "C:\Program Files\Tencent\微信web开发者工具\cli.bat" (
  set CLI=C:\Program Files\Tencent\微信web开发者工具\cli.bat
  echo Found CLI at Program Files >> "%LOG%"
)

if "%CLI%"=="" (
  echo CLI_NOT_FOUND >> "%LOG%"
  dir "C:\Program Files (x86)\Tencent\" >> "%LOG%" 2>&1
  dir "C:\Program Files\Tencent\" >> "%LOG%" 2>&1
  exit /b 1
)

echo Using CLI: %CLI% >> "%LOG%"
echo Running build... >> "%LOG%"
call "%CLI%" build --project "C:\Users\jd\Doubao\chats\2026-08-29\new-chat-2\love-scope" >> "%LOG%" 2>&1
echo EXIT_CODE=%errorlevel% >> "%LOG%"
echo DONE >> "%LOG%"
