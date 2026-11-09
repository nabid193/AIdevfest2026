@echo off
setlocal
rem Make the bundled Node and pnpm available to this process and its children.
rem No permanent PATH or machine configuration changes are made.
set "PROJECT_RUNTIME=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies"
if exist "%PROJECT_RUNTIME%\bin\fallback\pnpm.cmd" if exist "%PROJECT_RUNTIME%\node\bin\node.exe" set "PATH=%PROJECT_RUNTIME%\node\bin;%PROJECT_RUNTIME%\bin\fallback;%PATH%"
where node.exe >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 24.x or newer in the Node.js 24 line, then reopen PowerShell.
  exit /b 1
)
where pnpm.cmd >nul 2>nul
if errorlevel 1 (
  echo pnpm was not found. Install pnpm 11.19.0 and reopen PowerShell.
  exit /b 1
)
pushd "%~dp0"
if errorlevel 1 exit /b 1
if "%~1"=="" (
  call pnpm.cmd dev
) else (
  call pnpm.cmd %*
)
set "PROJECT_EXIT=%ERRORLEVEL%"
popd
exit /b %PROJECT_EXIT%
