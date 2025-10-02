/**
 * Custom webpack configuration override
 * Suppresses deprecation warnings from webpack-dev-server
 *
 * Note: These warnings come from react-scripts 5.x using older webpack-dev-server APIs.
 * They will be fixed in react-scripts 6.x or by migrating to Vite/Next.js
 *
 * This file suppresses the warnings without affecting functionality.
 */

const originalEmitWarning = process.emitWarning;

// Suppress specific deprecation warnings
process.emitWarning = (warning, type, code, ...args) => {
	// Suppress webpack-dev-server deprecation warnings
	if (
		code === 'DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE' ||
		code === 'DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE'
	) {
		return;
	}

	// Emit all other warnings normally
	return originalEmitWarning.call(process, warning, type, code, ...args);
};

module.exports = {};
