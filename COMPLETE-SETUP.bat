@echo off
echo ========================================
echo   Complete Server Setup Script
echo ========================================
echo.

cd server

echo Step 1: Checking .env file...
echo.

findstr /C:"<db_username>" .env >nul
if %errorlevel%==0 (
    echo ❌ ERROR: .env file still has placeholder!
    echo.
    echo You need to replace ^<db_username^> with your actual MongoDB username.
    echo.
    echo 1. Open: server\.env
    echo 2. Find your MongoDB username at: https://cloud.mongodb.com
    echo    Go to: Database Access
    echo 3. Replace ^<db_username^> with your actual username
    echo 4. Save the file
    echo 5. Run this script again
    echo.
    echo See URGENT-FIX-NEEDED.md for detailed instructions.
    echo.
    pause
    exit /b 1
)

echo ✅ .env file looks good!
echo.

echo Step 2: Installing dependencies...
echo.

npm install

if errorlevel 1 (
    echo.
    echo ❌ npm install failed!
    echo Check the error messages above.
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed!
echo.

echo Step 3: Testing MongoDB connection...
echo.

node test-connection.js

if errorlevel 1 (
    echo.
    echo ❌ MongoDB connection failed!
    echo See the error messages above.
    echo Check FIX-502-ERROR.md for troubleshooting.
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ MongoDB connected successfully!
echo.

echo Step 4: Seeding database with categories and items...
echo.

node seed.js

if errorlevel 1 (
    echo.
    echo ❌ Seeding failed!
    echo Check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅✅✅ SETUP COMPLETE! ✅✅✅
echo ========================================
echo.
echo What's been done:
echo   ✅ Dependencies installed (including multer)
echo   ✅ MongoDB connection verified
echo   ✅ Database seeded with 3 categories
echo   ✅ Database seeded with 18 menu items
echo.
echo Next steps:
echo   1. Start the server:
echo      cd server
echo      npm run dev
echo.
echo   2. Start the client (new terminal):
echo      cd client
echo      npm run dev
echo.
echo   3. Open admin panel:
echo      http://localhost:5173/admin
echo.
echo   4. Click "Menu Items" → "+ Add New Item"
echo   5. Categories should now appear in dropdown!
echo.
echo ========================================
echo.

pause
