import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import './AgGridTable.css';

const AgGridTable = ({ rowData, columnDefinitions, dataTypeDefinitions, fetchData }) => {
	return (
		<div className="ag-theme-quartz">
			<AgGridReact
				rowData={rowData}
				columnDefs={columnDefinitions}
				rowHeight={40}
				headerHeight={40}
				rowSelection="multiple"
				dataTypeDefinitions={dataTypeDefinitions}
				onGridReady={fetchData}
				suppressClickEdit={true}
			/>
		</div>
	);
};

export default AgGridTable;
