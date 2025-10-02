/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the entire app.
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourApp />
 * </ErrorBoundary>
 */

import { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null
		};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// Log error details for debugging
		console.error('Error caught by ErrorBoundary:', error, errorInfo);
		
		// You can also log to an error reporting service here
		// Example: logErrorToService(error, errorInfo);
		
		this.setState({
			error,
			errorInfo
		});
	}

	handleReset = () => {
		// Reset the error boundary and try to recover
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null
		});
	};

	handleReload = () => {
		// Reload the entire page
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="error-boundary">
					<div className="error-boundary-content">
						<div className="error-icon">⚠️</div>
						<h1 className="error-title">Oops! Something went wrong</h1>
						<p className="error-message">
							We're sorry, but something unexpected happened. The error has been logged and we'll look into it.
						</p>
						
						{process.env.NODE_ENV === 'development' && this.state.error && (
							<details className="error-details">
								<summary>Error Details (Development Only)</summary>
								<div className="error-stack">
									<strong>Error:</strong> {this.state.error.toString()}
									<br />
									<br />
									<strong>Stack Trace:</strong>
									<pre>{this.state.errorInfo?.componentStack}</pre>
								</div>
							</details>
						)}
						
						<div className="error-actions">
							<button onClick={this.handleReset} className="btn-reset">
								Try Again
							</button>
							<button onClick={this.handleReload} className="btn-reload">
								Reload Page
							</button>
							<a href="/" className="btn-home">
								Go to Home
							</a>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
