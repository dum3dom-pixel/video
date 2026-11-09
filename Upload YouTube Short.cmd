@echo off
powershell.exe -NoProfile -STA -ExecutionPolicy RemoteSigned -File "%~dp0tools\youtube\upload.ps1"
if errorlevel 1 pause
