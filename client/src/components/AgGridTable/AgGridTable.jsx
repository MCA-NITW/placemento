import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import './AgGridTable.css';

const AgGridTable = ({ rowData, columnDefinitions, fetchData, isExternalFilterPresent, doesExternalFilterPass }) => {
	const dataTypeDefinitions = useMemo(() => {
		return {
			object: {
				baseDataType: 'object',
				extendsDataType: 'object',
				valueParser: (params) => ({ name: params.newValue }),
				valueFormatter: (params) => (params.value == null ? '' : params.value.name)
			}
		};
	}, []);

	return (
		<AgGridReact
			rowData={rowData}
			columnDefs={columnDefinitions}
			rowHeight={30}
			headerHeight={30}
			rowSelection="multiple"
			dataTypeDefinitions={dataTypeDefinitions}
			onGridReady={fetchData}
			suppressClickEdit={true}
			className="ag-theme-quartz"
			isExternalFilterPresent={isExternalFilterPresent}
			doesExternalFilterPass={doesExternalFilterPass}
		/>
	);
};

AgGridTable.propTypes = {
	rowData: PropTypes.array.isRequired,
	columnDefinitions: PropTypes.array.isRequired,
	fetchData: PropTypes.func.isRequired,
	isExternalFilterPresent: PropTypes.func,
	doesExternalFilterPass: PropTypes.func
};

export default AgGridTable;
