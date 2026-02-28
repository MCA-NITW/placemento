# Contributing to Placemento

We welcome contributions to Placemento! This guide will help you understand how to contribute effectively to our placement management system.

## 🤝 How to Contribute

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

## 📋 Development Setup

### Prerequisites

- Node.js v20.0.0 or higher
- npm v10.0.0 or higher
- MongoDB (local installation or MongoDB Atlas account)
- Git for version control

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/MCA-NITW/placemento.git
   cd placemento
   ```

2. **Install dependencies**:

   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**: Create `.env` file in the server directory with required variables

4. **Start development servers**:
   ```bash
   npm run start
   ```

## 🎯 Coding Standards

### General Guidelines

- **Code Formatting**: Use Prettier for consistent code formatting

  ```bash
  npm run format
  ```

- **Commit Messages**: Write clear, descriptive commit messages

  ```
  feat: add student profile management
  fix: resolve authentication bug
  docs: update API documentation
  style: improve button hover effects
  ```

- **Documentation**: Add comments for complex logic and update README files

### Frontend Guidelines (React)

- **Component Structure**: Use functional components with hooks
- **File Naming**: Use PascalCase for components, camelCase for utilities
- **CSS**: Use CSS modules or styled-components for component styling
- **State Management**: Use React hooks for local state, Context API for global state
- **Props Validation**: Always use PropTypes for component props

Example component structure:

```jsx
import PropTypes from 'prop-types';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
	// Component logic here

	return <div className="component-name">{/* JSX content */}</div>;
};

ComponentName.propTypes = {
	prop1: PropTypes.string.isRequired,
	prop2: PropTypes.number
};

export default ComponentName;
```

### Backend Guidelines (Node.js)

- **API Design**: Follow RESTful conventions
- **Error Handling**: Implement comprehensive error handling with proper status codes
- **Security**: Always validate inputs and use proper authentication
- **Database**: Use Mongoose for MongoDB operations with proper schema validation
- **Logging**: Use Winston for structured logging

Example API endpoint:

```javascript
const methodName = async (req, res) => {
	try {
		// Validate inputs
		const { error } = validateSchema(req.body);
		if (error) return res.status(400).json({ message: error.details[0].message });

		// Business logic
		const result = await Model.findOne({ _id: req.params.id });

		// Response
		res.status(200).json({ data: result });
	} catch (error) {
		logger.error('Error in methodName:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
```

## 🧪 Testing Guidelines

### Frontend Testing

- **Component Testing**: Test component rendering and interactions
- **Unit Testing**: Test utility functions and hooks
- **Integration Testing**: Test API integration and data flow

### Backend Testing

- **Unit Testing**: Test individual functions and methods
- **Integration Testing**: Test API endpoints and database operations
- **Security Testing**: Test authentication and authorization

### Running Tests

```bash
# Frontend tests
cd client && npm test

# Backend tests
cd server && npm test
```

## 📁 Project Structure

### Frontend Structure

```
client/src/
├── api/              # API service layer
├── components/       # Reusable React components
├── pages/            # Main application pages
├── utils/            # Utility functions
└── App.jsx           # Main App component
```

### Backend Structure

```
server/
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # MongoDB data models
├── routes/          # API route definitions
├── utils/           # Backend utilities
└── index.js         # Server entry point
```

## 🔍 Code Review Process

### Before Submitting a PR

1. **Self Review**: Review your own code for obvious issues
2. **Testing**: Ensure all tests pass and functionality works
3. **Documentation**: Update relevant documentation
4. **Formatting**: Run prettier to format code consistently

### PR Requirements

- **Clear Title**: Descriptive title explaining the change
- **Detailed Description**: Explain what was changed and why
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how the changes were tested
- **Breaking Changes**: Highlight any breaking changes

### Review Guidelines

- Be constructive and respectful in feedback
- Focus on code quality, performance, and maintainability
- Suggest improvements rather than just pointing out problems
- Test the changes locally when possible

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear Description**: What happened vs. what was expected
2. **Steps to Reproduce**: Detailed steps to recreate the issue
3. **Environment**: Browser, OS, Node.js version, etc.
4. **Screenshots**: Visual evidence of the problem
5. **Error Messages**: Any console errors or logs

## ✨ Feature Requests

For new features, please provide:

1. **Use Case**: Why is this feature needed?
2. **Description**: Detailed explanation of the feature
3. **Mockups**: Visual representation if applicable
4. **Implementation Ideas**: Technical approach if you have suggestions

## 📚 Resources

### Learning Resources

- [React Documentation](https://reactjs.org/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MongoDB University](https://university.mongodb.com/)
- [AG Grid Documentation](https://www.ag-grid.com/documentation)

### Development Tools

- [Visual Studio Code](https://code.visualstudio.com/) - Recommended IDE
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI

## 🎉 Recognition

Contributors will be recognized in:

- Project README.md
- Release notes for significant contributions
- GitHub contributor list
- Project documentation

## 📞 Getting Help

If you need help:

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Review**: For feedback on your contributions

## 📄 License

By contributing to Placemento, you agree that your contributions will be licensed under the GPL-3.0 License.

---

**Thank you for contributing to Placemento! 🚀**

### Made with ❤️ by MCA Students of NIT Warangal
