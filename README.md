# Placemento 🎓

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)

**Placemento** is a comprehensive web-based placement management system designed specifically for MCA students at NIT Warangal. Built with the MERN
stack, it streamlines placement activities, student data management, and company interactions for the entire batch.

## ✨ Features

- 📊 **Student Dashboard** - Comprehensive profile management and placement status tracking
- 🏢 **Company Management** - Detailed company profiles and job posting system
- 📈 **Analytics & Statistics** - Visual insights into placement trends and data
- 👥 **User Authentication** - Secure JWT-based login with email OTP verification
- 📧 **Email Notifications** - Automated updates for placement activities
- 📱 **Responsive Design** - Optimized for desktop and mobile devices
- 🔍 **Advanced Filtering** - Powerful search and filter capabilities using AG Grid
- 💼 **Experience Sharing** - Students can share interview experiences with ratings and tips
- 👨‍💻 **Team Information** - Comprehensive developer team profiles and project details
- 🔒 **Role-based Access** - Admin and student roles with appropriate permissions

## 🏗️ Architecture

```
Placemento/
├── 📁 client/                 # React frontend application
│   ├── 📁 public/            # Static assets
│   └── 📁 src/
│       ├── 📁 api/           # API service layer
│       ├── 📁 components/    # Reusable React components
│       ├── 📁 pages/         # Main application pages
│       ├── 📁 utils/         # Utility functions
│       └── 📄 App.jsx        # Main App component
├── 📁 server/                 # Node.js backend application
│   ├── 📁 controllers/       # Route controllers
│   ├── 📁 middleware/        # Custom middleware
│   ├── 📁 models/           # MongoDB data models
│   ├── 📁 routes/           # API route definitions
│   ├── 📁 utils/            # Backend utilities
│   ├── 📄 seedDatabase.js   # Sample data seeder
│   ├── 📄 testStats.js      # API testing script
│   └── 📄 index.js          # Server entry point
├── 📄 package.json           # Root package configuration
├── 📄 DEVELOPMENT.md         # Development guide
├── 📄 setup.bat             # Windows setup script
├── 📄 setup.sh              # Unix setup script
└── 📄 README.md             # Project documentation
```

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** v20.0.0 or higher
- **npm** v10.0.0 or higher
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MCA-NITW/placemento.git
   cd placemento
   ```

2. **Install dependencies**

   ```bash
   npm run fb-install
   ```

   This command will install dependencies for both frontend and backend.

3. **Environment Setup**

   Create `.env` files in the server directory with the following variables:

   ```bash
   # server/.env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_HOST=your_email_host
   EMAIL_PORT=587
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password
   ```

4. **Start the development servers**

   ```bash
   npm run start
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

5. **Access the application**

   Open your browser and navigate to `http://localhost:3000`

## 🛠️ Available Scripts

| Command                  | Description                                         |
| ------------------------ | --------------------------------------------------- |
| `npm run start`          | Starts both frontend and backend concurrently       |
| `npm run frontend-start` | Starts only the React development server            |
| `npm run backend-start`  | Starts only the Node.js server                      |
| `npm run fb-install`     | Installs dependencies for both frontend and backend |
| `npm run frontend-build` | Creates production build of React app               |
| `npm run format`         | Formats code using Prettier                         |

## 🤝 Contributing

We welcome contributions from the community! Here's how you can get involved:

### For Organization Members

1. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test thoroughly** to ensure everything works as expected

4. **Submit a pull request** with a clear description of your changes

### For External Contributors

1. **Fork the repository** to your GitHub account

2. **Clone your fork** and create a feature branch:

   ```bash
   git clone https://github.com/your-username/placemento.git
   cd placemento
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and test them

4. **Submit a pull request** from your fork to our main repository

### Coding Standards

- Use **Prettier** for code formatting: `npm run format`
- Follow **React best practices** for frontend development
- Write **clear commit messages**
- Add **comments** for complex logic
- Ensure **responsive design** for all UI components

## 🔧 Tech Stack

### Frontend

- **React 18.2** - Modern UI library with hooks
- **React Router** - Client-side routing
- **AG Grid** - Advanced data grid with filtering and sorting
- **React Toastify** - User-friendly notifications
- **Axios** - HTTP client for API calls
- **React Icons** - Comprehensive icon library

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service integration
- **Winston** - Logging framework
- **Express Rate Limit** - API rate limiting

### Development Tools

- **Nodemon** - Development server auto-restart
- **Concurrently** - Run multiple commands simultaneously
- **Prettier** - Code formatting
- **React Scripts** - Build toolchain for React

## 📄 License

This project is licensed under the **GPL-3.0 License**. See the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Project Repository**: [MCA-NITW/placemento](https://github.com/MCA-NITW/placemento)
- **Issues & Bug Reports**: [GitHub Issues](https://github.com/MCA-NITW/placemento/issues)
- **Institution**: [NIT Warangal - MCA Department](https://www.nitw.ac.in/department/mca)

## 👥 Development Team

- **[Sagar Gupta](https://github.com/Sagargupta16)** - Lead Developer
- **[Sachin Gupta](https://github.com/sachin-gupta99)** - Full Stack Developer

## 🏫 Acknowledgments

- **NIT Warangal College** - For providing the academic environment and support
- **MCA Department** - For guidance and project requirements
- **Open Source Community** - For the amazing tools and libraries that made this project possible

## 🔗 Useful Resources

- [MERN Stack Guide](https://www.mongodb.com/mern-stack)
- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [AG Grid Documentation](https://www.ag-grid.com/documentation)

---

**Made with ❤️ by MCA Students of NIT Warangal**
