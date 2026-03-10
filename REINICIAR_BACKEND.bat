@echo off
echo ========================================
echo Reiniciando Backend con cambios...
echo ========================================
cd backend
echo.
echo Deteniendo procesos Node existentes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Iniciando servidor backend...
start cmd /k "npm start"
echo.
echo Backend reiniciado!
echo Espera unos segundos y recarga la pagina del dashboard
echo.
pause
