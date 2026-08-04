@echo off
echo ========================================
echo  Seeding Database with Categories
echo ========================================
echo.

cd server

echo Running seed script...
echo.

node seed.js

echo.
echo ========================================
echo Done! Check the output above.
echo ========================================
echo.
echo If successful, refresh your admin panel.
echo Categories should now appear!
echo.

pause
