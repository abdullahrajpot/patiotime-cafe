@echo off
echo ========================================
echo  MongoDB Connection Test and Seed
echo ========================================
echo.

cd server

echo Step 1: Testing MongoDB connection...
echo.
node test-connection.js

if errorlevel 1 (
    echo.
    echo ========================================
    echo Connection test FAILED!
    echo Fix the connection string in .env file
    echo See FIX-502-ERROR.md for help
    echo ========================================
    pause
    exit /b 1
)

echo.
echo ========================================
echo Connection successful!
echo.
echo Press any key to seed the database...
echo (or Ctrl+C to cancel)
pause > nul

echo.
echo Step 2: Seeding database...
echo.
node seed.js

echo.
echo ========================================
echo Done! 
echo.
echo Now:
echo 1. Make sure server is running (npm run dev)
echo 2. Refresh your admin panel
echo 3. Categories should appear!
echo ========================================
echo.

pause
