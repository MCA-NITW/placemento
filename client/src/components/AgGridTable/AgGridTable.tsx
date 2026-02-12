import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';
import type { AgGridTableProps } from '../../types';
import './AgGridTable.css';

const AgGridTable = ({ rowData, columnDefinitions, fetchData, isExternalFilterPresent, doesExternalFilterPass }: AgGridTableProps) => {
	const dataTypeDefinitions = useMemo(() => {
		return {
			object: {
				baseDataType: 'object' as const,
				extendsDataType: 'object' as const,
				valueParser: (params: { newValue: string }) => ({ name: params.newValue }),
				valueFormatter: (params: { value: { name: string } | null }) => (params.value == null ? '' : params.value.name)
			}
		};
	}, []);

	return (
		<div className="ag-grid-wrapper">
			<AgGridReact
				rowData={rowData}
				columnDefs={columnDefinitions as any}
				rowHeight={30}
				headerHeight={30}
				rowSelection="multiple"
				dataTypeDefinitions={dataTypeDefinitions}
				onGridReady={fetchData}
				suppressClickEdit={true}
				className="ag-theme-quartz"
				isExternalFilterPresent={isExternalFilterPresent}
				doesExternalFilterPass={doesExternalFilterPass as any}
			/>
		</div>
	);
};

export default AgGridTable;
