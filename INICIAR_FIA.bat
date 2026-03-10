@echo off
echo ========================================
echo    INICIANDO FIA - POLLO FIESTA
echo ========================================
echo.
echo Por favor espera mientras se inicia el sistema...
echo.

REM Obtener la ruta actual del script
set PROJECT_PATH=%~dp0
set PROJECT_PATH=%PROJECT_PATH:~0,-1%

REM Verificar que la ruta existe
if not exist "%PROJECT_PATH%\backend" (
    echo ERROR: No se encuentra la carpeta backend
    echo Por favor ejecuta este script desde la raiz del proyecto.
    pause
    exit
)

REM Iniciar el backend
echo [1/3] Iniciando servidor backend...
start "FIA Backend" cmd /k "cd /d %PROJECT_PATH%\backend && npm start"

REM Esperar 5 segundos para que el backend inicie
timeout /t 5 /nobreak > nul

REM Iniciar el frontend
echo [2/3] Iniciando aplicacion frontend...
start "FIA Frontend" cmd /k "cd /d %PROJECT_PATH%\frontend && npm run dev"

REM Esperar 8 segundos para que el frontend compile
timeout /t 8 /nobreak > nul

REM Abrir el navegador
echo [3/3] Abriendo navegador...
start http://localhost:5173

echo.
echo ========================================
echo    FIA INICIADO CORRECTAMENTE
echo ========================================
echo.
echo La aplicacion se abrira en tu navegador.
echo.
echo IMPORTANTE: NO CIERRES LAS VENTANAS NEGRAS
echo (son necesarias para que funcione)
echo.
echo Para cerrar el sistema, usa CERRAR_FIA.bat
echo o cierra las ventanas "FIA Backend" y "FIA Frontend"
echo.
pause
