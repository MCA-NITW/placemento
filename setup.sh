#!/bin/bash

# Placemento Project Setup Script
echo "🎓 Setting up Placemento - Placement Management System"
echo "==============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is available"
else
    echo "⚠️  MongoDB not found locally. Make sure to configure MongoDB Atlas connection in .env"
fi

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
if [ ! -f package.json ]; then
    echo "❌ Server package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
if [ ! -f package.json ]; then
    echo "❌ Client package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

cd ..

# Create environment file if it doesn't exist
if [ ! -f server/.env ]; then
    echo "🔧 Creating environment configuration..."
    cp server/.env.example server/.env
    echo "⚠️  Please configure server/.env with your database and email settings"
fi

# Create logs directory
mkdir -p server/logs

# Display setup completion
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure your environment variables in server/.env"
echo "2. Set up your MongoDB database (local or MongoDB Atlas)"
echo "3. Configure email settings for OTP verification"
echo ""
echo "🚀 To start the development servers:"
echo "   npm run dev         # Start both client and server"
echo "   npm run server      # Start only the server"
echo "   npm run client      # Start only the client"
echo ""
echo "📚 Additional Information:"
echo "   • Client runs on: http://localhost:3000"
echo "   • Server runs on: http://localhost:5000"
echo "   • Admin accounts need manual verification in the database"
echo ""
echo "💡 For production deployment, make sure to:"
echo "   • Use secure JWT secrets"
echo "   • Configure proper CORS settings"
echo "   • Set up proper MongoDB authentication"
echo "   • Configure email service for OTP"
echo ""
