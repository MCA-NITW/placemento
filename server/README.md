# Placemento Backend Server

A robust Node.js backend API server for the Placemento placement management system. Built with Express.js, MongoDB, and comprehensive authentication features.

## 🚀 Features

- **RESTful API** - Complete CRUD operations for all resources
- **JWT Authentication** - Secure token-based authentication system
- **Password Security** - bcrypt password hashing and validation
- **Email Services** - Nodemailer integration for notifications
- **Database Management** - MongoDB with Mongoose ODM
- **Comprehensive Logging** - Winston logging system
- **CORS Support** - Cross-origin resource sharing enabled
- **Environment Configuration** - dotenv configuration management
- **Database Fallback** - Atlas + Local MongoDB connection options
- **API Rate Limiting** - Request rate limiting middleware
- **Input Validation** - Comprehensive data validation

## 📋 Prerequisites

Before running the server, ensure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (Local installation or MongoDB Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd placemento/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the server directory:
   ```env
   # Database Configuration
   DB_CONNECTION_STRING=mongodb+srv://<username>:<password>@cluster.mongodb.net/placemento
   LOCAL_DB_CONNECTION_STRING=mongodb://localhost:27017/placemento
   
   # JWT Configuration
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_SERVICE=gmail
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Seed the database with initial data
   npm run seed
   ```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```
Starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```
Starts the server in production mode.

### Available Scripts
- `npm run dev` - Development server with hot reload
- `npm start` - Production server
- `npm run seed` - Seed database with initial data
- `npm run test:stats` - Run statistics tests

## 🏗️ Project Structure

```
server/
├── controllers/          # Business logic controllers
│   ├── authController.js     # Authentication logic
│   ├── companyController.js  # Company management
│   ├── experienceController.js # Experience sharing
│   ├── statsController.js    # Statistics and analytics
│   └── userController.js     # User management
├── middleware/           # Custom middleware
│   └── authMiddleware.js     # JWT authentication middleware
├── models/              # Database models
│   ├── Company.js           # Company schema
│   ├── Experience.js        # Experience schema
│   ├── Otp.js              # OTP verification schema
│   └── User.js             # User schema
├── routes/              # API route definitions
│   ├── authRoutes.js        # Authentication endpoints
│   ├── companyRoutes.js     # Company endpoints
│   ├── experienceRoutes.js  # Experience endpoints
│   ├── statsRoutes.js       # Statistics endpoints
│   └── userRoutes.js        # User endpoints
├── utils/               # Utility functions
│   ├── limiter.js           # Rate limiting configuration
│   ├── logger.js            # Winston logging setup
│   └── validateUser.js      # User validation utilities
├── .env                 # Environment variables
├── index.js             # Main server file
├── package.json         # Dependencies and scripts
├── seedDatabase.js      # Database seeding script
└── testStats.js         # Statistics testing script
```

## 🔌 API Endpoints

### Authentication Routes (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/verify-otp` - OTP verification

### User Routes (`/users`)
- `GET /users` - Get all users (Admin only)
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `DELETE /users/:id` - Delete user (Admin only)

### Company Routes (`/companies`)
- `GET /companies` - Get all companies
- `POST /companies` - Create new company
- `GET /companies/:id` - Get company by ID
- `PUT /companies/:id` - Update company
- `DELETE /companies/:id` - Delete company

### Experience Routes (`/experiences`)
- `GET /experiences` - Get all experiences
- `POST /experiences` - Create new experience
- `GET /experiences/:id` - Get experience by ID
- `PUT /experiences/:id` - Update experience
- `DELETE /experiences/:id` - Delete experience

### Statistics Routes (`/stats`)
- `GET /stats/overview` - Get placement overview statistics
- `GET /stats/companies` - Get company-wise statistics
- `GET /stats/students` - Get student statistics
- `GET /stats/trends` - Get placement trends

### Utility Routes
- `GET /token-check` - Verify JWT token validity

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/admin/company),
  profile: {
    rollNumber: String,
    branch: String,
    cgpa: Number,
    skills: [String],
    resume: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Company Model
```javascript
{
  name: String,
  description: String,
  website: String,
  industry: String,
  location: String,
  size: String,
  packages: {
    minimum: Number,
    maximum: Number,
    average: Number
  },
  requirements: {
    branches: [String],
    minCGPA: Number,
    skills: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Experience Model
```javascript
{
  author: ObjectId (User),
  company: ObjectId (Company),
  title: String,
  content: String,
  rating: Number,
  tags: [String],
  isAnonymous: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Model
```javascript
{
  email: String,
  otp: String,
  purpose: String,
  expiresAt: Date,
  createdAt: Date
}
```

## 🔐 Authentication & Security

### JWT Authentication
- Tokens expire in 24 hours by default
- Middleware validates tokens on protected routes
- Refresh token mechanism available

### Password Security
- bcrypt hashing with salt rounds
- Password strength validation
- Secure password reset flow

### API Security
- CORS enabled for cross-origin requests
- Rate limiting to prevent abuse
- Input validation and sanitization
- Environment variable protection

## 📧 Email Service

The server includes email functionality for:
- User registration confirmation
- Password reset links
- OTP verification
- Placement notifications

Configure your email service in the `.env` file.

## 📊 Logging

Winston logging system captures:
- Server startup and shutdown
- Database connections
- API requests and responses
- Error tracking and debugging
- Performance metrics

Logs are written to:
- `combined.log` - All log levels
- Console output in development

## 🔧 Database Configuration

### MongoDB Atlas (Primary)
- Cloud-hosted MongoDB service
- Automatic scaling and backups
- Global cluster distribution

### Local MongoDB (Fallback)
- Local development database
- Automatic fallback if Atlas fails
- Connection retry logic

## 🚦 Rate Limiting

API endpoints are protected with rate limiting:
- Default: 100 requests per 15 minutes
- Configurable per endpoint
- IP-based tracking

## 🧪 Testing

### Statistics Testing
```bash
npm run test:stats
```
Runs comprehensive tests for the statistics system.

### Database Seeding
```bash
npm run seed
```
Populates the database with sample data for development.

## 🐛 Error Handling

Comprehensive error handling includes:
- Centralized error middleware
- Structured error responses
- Logging of all errors
- Graceful degradation

## 📈 Performance

Optimizations include:
- Database connection pooling
- Efficient query design
- Response caching strategies
- Compression middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow coding standards
4. Add comprehensive tests
5. Submit a pull request

### Coding Standards
- Use consistent indentation
- Follow ESLint configuration
- Write descriptive commit messages
- Document new functions
- Add error handling

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `DB_CONNECTION_STRING` | MongoDB Atlas URI | - |
| `LOCAL_DB_CONNECTION_STRING` | Local MongoDB URI | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiration | 24h |
| `EMAIL_USER` | Email service user | - |
| `EMAIL_PASS` | Email service password | - |
| `NODE_ENV` | Environment mode | development |

## 🐳 Docker Support

Create a `Dockerfile` for containerization:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📋 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## 🔄 Database Connection Flow

1. **Primary**: Attempt MongoDB Atlas connection
2. **Fallback**: Try local MongoDB if Atlas fails
3. **Retry**: Automatic reconnection on disconnection
4. **Monitoring**: Connection status logging

## 📊 Statistics System

The stats system provides:
- Placement overview metrics
- Company-wise analytics
- Student performance data
- Trend analysis
- Real-time dashboard data

## 🛡️ Security Best Practices

- Never commit `.env` files
- Use strong JWT secrets
- Implement input validation
- Enable CORS selectively
- Monitor for security vulnerabilities
- Regular dependency updates

## 📞 Support

For backend-related issues:
1. Check server logs in `combined.log`
2. Verify environment configuration
3. Test database connectivity
4. Review API documentation
5. Contact the development team

---

**Built with ❤️ for efficient placement management**
