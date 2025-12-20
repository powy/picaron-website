@echo off
REM This batch file runs the PowerShell cache-clearing script
REM Double-click this file to clear cache and rebuild

powershell -ExecutionPolicy Bypass -File "%~dp0clear-cache.ps1"
pause
