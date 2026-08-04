@echo off
echo ========================================
echo  Installing Server Dependencies
echo ========================================
echo.

cd server

echo Installing packages...
echo.

npm install

echo.
echo ========================================
echo Done! Dependencies installed.
echo ========================================
echo.
echo Now you can start the server:
echo   npm run dev
echo.

pause
