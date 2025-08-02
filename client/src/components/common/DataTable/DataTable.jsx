import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import AgGridTable from '../AgGridTable/AgGridTable';
import { IconButton } from '../Button/Button';

// Reusable column generator functions
export const generateColumn = (field, headerName, width, options = {}) => {
	const { pinned = null, sortable = true, resizable = true, cellRenderer = null, valueFormatter = null } = options;

	return {
		field,
		headerName,
		width,
		pinned,
		sortable,
		resizable,
		cellRenderer,
		valueFormatter
	};
};

export const generateNestedColumn = (headerName, children) => ({
	headerName,
	children
});

// Reusable button renderer for tables
export const createButtonRenderer = (icon, className, onClick, condition = null) => {
	return (params) => {
		if (condition && !condition(params.data)) {
			return null;
		}

		return <IconButton icon={icon} className={className} onClick={() => onClick(params.data)} size="small" variant="icon" />;
	};
};

// Reusable dropdown renderer for tables
export const createDropdownRenderer = (options, updateAction, valueGetter = null) => {
	return (params) => {
		const value = valueGetter ? valueGetter(params.data) : params.value;

		return (
			<select className="render-dropdown" value={value} onChange={(event) => updateAction(params.data.id || params.data._id, event.target.value)}>
				{options.map((option) => (
					<option value={option.value} key={option.value}>
						{option.label}
					</option>
				))}
			</select>
		);
	};
};

// Reusable grade columns generator
export const createGradeColumns = (head, cgpaField, percentageField) => {
	return generateNestedColumn(head, [
		generateColumn(cgpaField, 'CGPA', 75, {
			pinned: null,
			sortable: true,
			resizable: false,
			cellRenderer: (params) => (params.value ? params.value.toFixed(2) : '0.00')
		}),
		generateColumn(percentageField, '%', 75, {
			pinned: null,
			sortable: true,
			resizable: false,
			cellRenderer: (params) => (params.value ? params.value.toFixed(2) : '0.00')
		})
	]);
};

// Enhanced Table Component with common functionality
const DataTable = ({
	rowData,
	columnDefinitions,
	fetchData,
	isExternalFilterPresent,
	doesExternalFilterPass,
	onRowClick,
	className = '',
	height = '500px',
	...props
}) => {
	const memoizedColumns = useMemo(() => columnDefinitions, [columnDefinitions]);

	const handleRowClick = useCallback(
		(event) => {
			if (onRowClick) {
				onRowClick(event.data);
			}
		},
		[onRowClick]
	);

	return (
		<div className={`data-table ${className}`} style={{ height }}>
			<AgGridTable
				rowData={rowData}
				columnDefinitions={memoizedColumns}
				fetchData={fetchData}
				isExternalFilterPresent={isExternalFilterPresent}
				doesExternalFilterPass={doesExternalFilterPass}
				onRowClick={handleRowClick}
				{...props}
			/>
		</div>
	);
};

DataTable.propTypes = {
	rowData: PropTypes.array.isRequired,
	columnDefinitions: PropTypes.array.isRequired,
	fetchData: PropTypes.func,
	isExternalFilterPresent: PropTypes.func,
	doesExternalFilterPass: PropTypes.func,
	onRowClick: PropTypes.func,
	className: PropTypes.string,
	height: PropTypes.string
};

export default DataTable;
