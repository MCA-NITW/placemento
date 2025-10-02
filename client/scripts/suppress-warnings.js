/**
 * Suppress Deprecation Warnings Script
 *
 * This script suppresses known deprecation warnings from dependencies
 * that we cannot control (e.g., react-scripts using older webpack-dev-server APIs)
 *
 * Usage: node scripts/suppress-warnings.js
 */

const originalEmitWarning = process.emitWarning;

const suppressedWarnings = [
	'DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE',
	'DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE',
];

process.emitWarning = (warning, type, code, ...args) => {
	// Suppress known deprecation warnings from dependencies
	if (suppressedWarnings.includes(code)) {
		return;
	}

	// Emit all other warnings normally
	return originalEmitWarning.call(process, warning, type, code, ...args);
};

console.log('✅ Deprecation warning suppression enabled');

// Now start react-scripts
require('react-scripts/scripts/start');
