/**
 * AG Grid Configuration
 * Centralized configuration for all AG Grid instances
 * Eliminates duplicate configuration across components
 *
 * Usage:
 * import { defaultColDef, defaultGridOptions, createColumn, columnTypes } from '@/config/agGridConfig';
 *
 * const columnDefs = [
 *   createColumn('name', 'Student Name'),
 *   createColumn('email', 'Email'),
 *   createColumn('batch', 'Batch', { filter: 'agNumberColumnFilter' })
 * ];
 */

/**
 * Default column definition
 * Applied to all columns unless overridden
 */
export const defaultColDef = {
	sortable: true,
	filter: true,
	resizable: true,
	floatingFilter: true,
	flex: 1,
	minWidth: 100,
	suppressMenu: false,
	enableCellTextSelection: true,
	autoHeight: false,
};

/**
 * Default grid options
 * Applied to all grid instances
 */
export const defaultGridOptions = {
	pagination: true,
	paginationPageSize: 20,
	paginationPageSizeSelector: [10, 20, 50, 100],
	animateRows: true,
	enableCellTextSelection: true,
	suppressMovableColumns: false,
	rowSelection: 'multiple',
	suppressRowClickSelection: true,
	enableRangeSelection: true,
	suppressCellFocus: false,
	ensureDomOrder: true,
	suppressColumnVirtualisation: false,
};

/**
 * Helper function to create column definitions easily
 *
 * @param {string} field - The field name in the data
 * @param {string} headerName - Display name for the column (optional, auto-generated if not provided)
 * @param {object} options - Additional column options
 * @returns {object} Column definition
 */
export const createColumn = (field, headerName, options = {}) => {
	// Auto-generate header name from field if not provided
	const autoHeaderName =
		headerName ||
		field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');

	return {
		field,
		headerName: autoHeaderName,
		...options,
	};
};

/**
 * Common column types for reuse
 * Can be applied via type property in column definition
 */
export const columnTypes = {
	// Date column with formatted display
	dateColumn: {
		filter: 'agDateColumnFilter',
		valueFormatter: (params) => {
			if (!params.value) return '';
			const date = new Date(params.value);
			return date.toLocaleDateString('en-IN', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
		},
	},

	// Number column with proper formatting
	numberColumn: {
		filter: 'agNumberColumnFilter',
		type: 'numericColumn',
		valueFormatter: (params) => {
			if (params.value === null || params.value === undefined) return '';
			return params.value.toLocaleString();
		},
	},

	// Currency column (for CTC, salary, etc.)
	currencyColumn: {
		filter: 'agNumberColumnFilter',
		type: 'numericColumn',
		valueFormatter: (params) => {
			if (params.value === null || params.value === undefined) return '';
			return `₹${params.value.toLocaleString()} LPA`;
		},
	},

	// Email column with clickable link
	emailColumn: {
		cellRenderer: (params) => {
			if (!params.value) return '';
			return `<a href="mailto:${params.value}" style="color: #1976d2; text-decoration: none;">${params.value}</a>`;
		},
		autoHeight: true,
	},

	// Boolean column with checkmark/cross
	booleanColumn: {
		cellRenderer: (params) => {
			if (params.value === null || params.value === undefined) return '';
			return params.value
				? '<span style="color: green; font-size: 18px;">✓</span>'
				: '<span style="color: red; font-size: 18px;">✗</span>';
		},
		filter: 'agSetColumnFilter',
		cellStyle: { textAlign: 'center' },
	},

	// Percentage column
	percentageColumn: {
		filter: 'agNumberColumnFilter',
		type: 'numericColumn',
		valueFormatter: (params) => {
			if (params.value === null || params.value === undefined) return '';
			return `${params.value.toFixed(2)}%`;
		},
	},

	// CGPA column (0-10 scale)
	cgpaColumn: {
		filter: 'agNumberColumnFilter',
		type: 'numericColumn',
		valueFormatter: (params) => {
			if (
				params.value === null ||
				params.value === undefined ||
				params.value === 0
			)
				return 'N/A';
			return params.value.toFixed(2);
		},
	},

	// Status column with colored badges
	statusColumn: {
		cellRenderer: (params) => {
			if (!params.value) return '';

			const statusColors = {
				ongoing: { bg: '#e3f2fd', color: '#1976d2' },
				upcoming: { bg: '#fff3e0', color: '#f57c00' },
				completed: { bg: '#e8f5e9', color: '#388e3c' },
				cancelled: { bg: '#ffebee', color: '#d32f2f' },
				active: { bg: '#e8f5e9', color: '#388e3c' },
				inactive: { bg: '#f5f5f5', color: '#757575' },
				verified: { bg: '#e8f5e9', color: '#388e3c' },
				pending: { bg: '#fff3e0', color: '#f57c00' },
			};

			const style = statusColors[params.value.toLowerCase()] || {
				bg: '#f5f5f5',
				color: '#000',
			};

			return `<span style="
				padding: 4px 12px;
				border-radius: 12px;
				background-color: ${style.bg};
				color: ${style.color};
				font-weight: 500;
				font-size: 12px;
				display: inline-block;
			">${params.value}</span>`;
		},
		filter: 'agSetColumnFilter',
	},
};

/**
 * Quick column creation helpers
 */
export const quickColumns = {
	name: () => createColumn('name', 'Name', { minWidth: 150, pinned: 'left' }),
	email: () =>
		createColumn('email', 'Email', {
			...columnTypes.emailColumn,
			minWidth: 200,
		}),
	rollNo: () => createColumn('rollNo', 'Roll Number', { minWidth: 120 }),
	batch: () =>
		createColumn('batch', 'Batch', {
			...columnTypes.numberColumn,
			minWidth: 100,
		}),
	cgpa: (field = 'cgpa', headerName = 'CGPA') =>
		createColumn(field, headerName, {
			...columnTypes.cgpaColumn,
			minWidth: 100,
		}),
	percentage: (field = 'percentage', headerName = 'Percentage') =>
		createColumn(field, headerName, {
			...columnTypes.percentageColumn,
			minWidth: 120,
		}),
	status: () =>
		createColumn('status', 'Status', {
			...columnTypes.statusColumn,
			minWidth: 120,
		}),
	date: (field = 'date', headerName = 'Date') =>
		createColumn(field, headerName, {
			...columnTypes.dateColumn,
			minWidth: 130,
		}),
	actions: (cellRenderer) =>
		createColumn('actions', 'Actions', {
			cellRenderer,
			sortable: false,
			filter: false,
			pinned: 'right',
			minWidth: 150,
		}),
};

export default {
	defaultColDef,
	defaultGridOptions,
	createColumn,
	columnTypes,
	quickColumns,
};
