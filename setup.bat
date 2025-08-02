@echo off
REM Placemento Project Setup Script for Windows
echo 🎓 Setting up Placemento - Placement Management System
echo ===============================================

REM Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 20+ and try again.
    pause
    exit /b 1
)

echo ✅ Node.js detected
node -v

REM Check if MongoDB is available
mongod --version >nul 2>&1
if %errorlevel% eq 0 (
    echo ✅ MongoDB is available
) else (
    echo ⚠️  MongoDB not found locally. Make sure to configure MongoDB Atlas connection in .env
)

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
if not exist package.json (
    echo ❌ Server package.json not found!
    pause
    exit /b 1
)

call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

REM Install client dependencies
echo 📦 Installing client dependencies...
cd ..\client
if not exist package.json (
    echo ❌ Client package.json not found!
    pause
    exit /b 1
)

call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)

cd ..

REM Create environment file if it doesn't exist
if not exist server\.env (
    echo 🔧 Creating environment configuration...
    copy server\.env.example server\.env
    echo ⚠️  Please configure server/.env with your database and email settings
)

REM Create logs directory
if not exist server\logs mkdir server\logs

REM Display setup completion
echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next Steps:
echo 1. Configure your environment variables in server/.env
echo 2. Set up your MongoDB database (local or MongoDB Atlas)
echo 3. Configure email settings for OTP verification
echo.
echo 🚀 To start the development servers:
echo    npm run dev         # Start both client and server
echo    npm run server      # Start only the server
echo    npm run client      # Start only the client
echo.
echo 📚 Additional Information:
echo    • Client runs on: http://localhost:3000
echo    • Server runs on: http://localhost:5000
echo    • Admin accounts need manual verification in the database
echo.
echo 💡 For production deployment, make sure to:
echo    • Use secure JWT secrets
echo    • Configure proper CORS settings
echo    • Set up proper MongoDB authentication
echo    • Configure email service for OTP
echo.
pause
