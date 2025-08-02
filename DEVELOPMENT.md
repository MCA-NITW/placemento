# Development Guide - Placemento

## 🛠️ Development Setup

### Prerequisites
- **Node.js 20+** - [Download here](https://nodejs.org/)
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### Quick Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/MCA-NITW/placemento.git
   cd placemento
   ```

2. **Run setup script**
   ```bash
   # On Linux/macOS
   chmod +x setup.sh
   ./setup.sh
   
   # On Windows
   setup.bat
   ```

3. **Configure environment**
   - Edit `server/.env` with your database and email settings
   - See [Environment Configuration](#environment-configuration) below

4. **Start development servers**
   ```bash
   npm run dev  # Starts both client and server
   ```

## 📁 Project Structure

```
placemento/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Server utilities
│   └── package.json
└── package.json          # Root package file
```

## 🔧 Environment Configuration

### Server Environment Variables (server/.env)
```env
# Database Configuration
DB_CONNECTION_STRING=mongodb://localhost:27017/placemento
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/placemento

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_SALT_ROUNDS=10

# Email Configuration (for OTP verification)
EMAIL_ID=your_gmail_id@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Setting up Gmail for OTP
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this app password in `EMAIL_PASSWORD`

## 🗄️ Database Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/placemento`

### Option 2: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create database user
4. Get connection string and add to `.env`

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start both client and server
npm run dev

# Start only server (localhost:5000)
npm run server

# Start only client (localhost:3000)
npm run client
```

### Production Mode
```bash
# Build client for production
cd client && npm run build

# Start server in production
cd server && npm start
```

## 👥 User Roles & Access

### Student Role
- Register with NIT Warangal email (@student.nitw.ac.in)
- View companies and placement statistics
- Share placement experiences
- Update profile information

### Placement Coordinator (PC)
- All student permissions
- Verify student accounts
- Add/edit company information
- Manage student placement data

### Admin
- All PC permissions
- Promote users to PC or Admin
- Full system access and control

### Initial Admin Setup
Since there's no initial admin in the system:
1. Register a user account normally
2. Manually update the user's role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@student.nitw.ac.in" },
     { $set: { role: "admin", isVerified: true } }
   )
   ```

## 🔐 Authentication Flow

1. **Registration**: Users register with NITW email
2. **Email Verification**: OTP sent to email for verification
3. **Admin Verification**: Admin manually verifies student accounts
4. **Login**: JWT-based authentication
5. **Role-based Access**: Different features based on user role

## 🧪 Testing the Application

### Test Data Creation
1. Create admin account (see Initial Admin Setup)
2. Register test student accounts
3. Add sample company data
4. Create placement experiences

### API Testing
Use tools like Postman or Thunder Client to test API endpoints:
- Base URL: `http://localhost:5000`
- Include JWT token in Authorization header for protected routes

## 🚀 Key Features Implementation

### Student Management
- Registration and verification system
- Profile management with academic details
- Placement status tracking
- Advanced filtering and search

### Company Management
- Company registration and details
- Placement criteria and cutoffs
- Interview process tracking
- Status management (ongoing/completed/cancelled)

### Experience Sharing
- Rich experience forms with ratings
- Tag-based categorization
- Interview process details
- Tips for future candidates

### Analytics & Statistics
- Placement statistics dashboard
- Company performance metrics
- Student success rates
- Visual data representation

## 🔧 Development Tips

### Code Style
- Use ESLint and Prettier for consistent formatting
- Follow React best practices for components
- Use meaningful variable and function names
- Add comments for complex logic

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/feature-name
```

### Common Issues

**MongoDB Connection Issues**
- Ensure MongoDB is running
- Check connection string format
- Verify network access (for Atlas)

**Email OTP Not Working**
- Verify Gmail App Password
- Check email service configuration
- Ensure 2FA is enabled on Gmail

**Build Errors**
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all environment variables

## 📦 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the client: `cd client && npm run build`
2. Deploy the `build` folder
3. Set up redirects for React Router

### Backend Deployment (Railway/Render)
1. Set environment variables on platform
2. Deploy from GitHub repository
3. Ensure MongoDB Atlas connection

### Environment Variables for Production
- Use strong JWT secrets
- Configure CORS for your domain
- Set NODE_ENV=production
- Use MongoDB Atlas for database

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes following code style
4. Test thoroughly
5. Submit pull request

## 📞 Support

For issues and questions:
- Create GitHub Issue
- Contact development team
- Check existing documentation

---

Happy coding! 🎉
