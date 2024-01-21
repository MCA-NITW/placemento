import React, { useState, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { getCompanies, deleteCompany, updateCompany } from '../../api/companyApi';
import { MdDelete } from 'react-icons/md';
import userRole from '../../utils/role';
import { MdEdit } from 'react-icons/md';
function cellRenderer(props) {
	const handleClick = () => {
		props.api.startEditingCell({
			rowIndex: props.node.rowIndex,
			colKey: props.column.getId(),
		});
	};
	return (
		<span style={{ display: 'flex', alignItems: 'center' }}>
			<button onClick={handleClick} className="btn--icon--edit">
				<MdEdit />
			</button>
			<span style={{ paddingLeft: '4px' }}>{props.value}</span>
		</span>
	);
}

const CompanyTable = () => {
	const [companies, setCompanies] = useState([]);
	const [changes, setChanges] = useState([]);

	const onGridReady = useCallback(async () => {
		try {
			const res = await getCompanies();
			console.log(res.data);
			setCompanies(res.data);
		} catch (error) {
			console.error('Error fetching companies:', error);
		}
	}, []);

	const delButtonHandler = async id => {
		await deleteCompany(id);
	};

	const delButtonRenderer = params => {
		return (
			<div className="btn--icon--del" onClick={() => delButtonHandler(params.data.id)}>
				<MdDelete />
			</div>
		);
	};

	const updateChanges = async () => {
		for (const change of changes) {
			await updateCompany(change.companyId, change.fieldName, change.newValue);
		}
		setChanges([]);
	};

	const generateColumn = (
		field,
		headerName,
		width,
		sortable = true,
		resizable = true,
		pinned = null,
		editable = () => userRole === 'admin' || userRole === 'placementCoordinator',
		// cellRenderer = null
	) => ({
		field,
		headerName,
		width,
		sortable,
		resizable,
		pinned,
		editable,
		cellRenderer,
		valueParser: params => {
			console.log(params);

			if (params.oldValue === params.newValue) return params.oldValue;

			// Check if same change already Exist in changes
			const changeIndex = changes.findIndex(
				change =>
					change.companyId === params.data.id && change.fieldName === field && change.newValue === params.newValue,
			);

			if (changeIndex !== -1) {
				setChanges(prevChanges => {
					const newChanges = [...prevChanges];
					newChanges.splice(changeIndex, 1);
					return newChanges;
				});
				return params.oldValue;
			}

			setChanges(prevChanges => [
				...prevChanges,
				{
					companyName: params.data.name,
					companyId: params.data.id,
					fieldName: field,
					oldValue: params.oldValue,
					newValue: params.newValue,
				},
			]);

			setCompanies(prevCompanies => {
				const newCompanies = [...prevCompanies];
				const companyIndex = newCompanies.findIndex(company => company._id === params.data.id);
				newCompanies[companyIndex][field] = params.newValue;
				return newCompanies;
			});

			return params.newValue;
		},
	});

	const generateNestedColumn = (headerName, children) => ({
		headerName,
		children,
	});

	const generateDateColumn = (field, headerName, width, sortable = true, resizable = true) => ({
		...generateColumn(field, headerName, width, sortable, resizable),
		valueFormatter: params =>
			params.value
				? new Date(params.value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
				: '',
	});

	const formatCutoff = cutoff => (cutoff.cgpa ? `${cutoff.cgpa} CGPA` : `${cutoff.percentage}%`);

	const delColumn = () => {
		if (userRole === 'admin' || userRole === 'placementCoordinator') {
			return {
				headerName: '',
				pinned: 'left',
				width: 50,
				resizable: false,
				sortable: false,
				cellRenderer: delButtonRenderer,
			};
		} else
			return {
				initialHide: true,
			};
	};

	const colDefs = [
		delColumn(),
		generateColumn('name', 'Name', 150, true, true, 'left', true),
		generateColumn('status', 'Status', 115, false, true),
		generateColumn('typeOfOffer', 'Offer', 90, true, true),
		generateColumn('profile', 'Profile', 170),
		generateColumn('interviewShortlist', 'Shortlists', 130, true, true),
		generateColumn('selectedStudents', 'Selects', 110, true, true, null, false, null),
		generateDateColumn('dateOfOffer', 'Offer Date', 140, true, true),
		generateColumn('locations', 'Locations', 140, true, true),
		generateNestedColumn('Cutoffs', [
			generateColumn('cutoff_pg', 'PG', 80, false, true),
			generateColumn('cutoff_ug', 'UG', 80, false, true),
			generateColumn('cutoff_12', '12', 80, false, true),
			generateColumn('cutoff_10', '10', 80, false, true),
		]),
		generateNestedColumn('CTC (LPA)', [
			generateColumn('ctc', 'CTC', 90, true, true),
			generateColumn('ctcBase', 'Base', 95, true, true),
		]),
		generateColumn('bond', 'Bond', 70, false, true),
	];

	const dataTypeDefinitions = useMemo(() => {
		return {
			object: {
				baseDataType: 'object',
				extendsDataType: 'object',
				valueParser: params => ({ name: params.newValue }),
				valueFormatter: params => (params.value == null ? '' : params.value.name),
			},
		};
	}, []);

	const mapCompanyData = company => ({
		del: '',
		id: company._id,
		name: company.name,
		status: company.status,
		interviewShortlist: company.interviewShortlist,
		selectedStudents:
			company.selectedStudentsRollNo.toString() === ''
				? 0
				: company.selectedStudentsRollNo.toString().split(',').length,
		dateOfOffer: company.dateOfOffer,
		locations: company.locations.toString() === '' ? [] : company.locations.toString().split(','),
		cutoff_pg: formatCutoff(company.cutoffs.pg),
		cutoff_ug: formatCutoff(company.cutoffs.ug),
		cutoff_12: formatCutoff(company.cutoffs.twelth),
		cutoff_10: formatCutoff(company.cutoffs.tenth),
		typeOfOffer: company.typeOfOffer,
		profile: company.profile,
		ctc: company.ctc,
		ctcBase: company.ctcBreakup.base,
		bond: company.bond,
	});

	const rowData = companies.map(mapCompanyData);

	return (
		<>
			<div className="ag-theme-quartz">
				<AgGridReact
					rowData={rowData}
					columnDefs={colDefs}
					rowHeight={40}
					headerHeight={40}
					rowSelection="multiple"
					dataTypeDefinitions={dataTypeDefinitions}
					onGridReady={onGridReady}
					suppressClickEdit={true}
				/>
			</div>
			{changes.length > 0 && (
				<div className="ag-theme-quartz" style={{ 'min-height': '300px', 'margin-bottom': '100px' }}>
					<h1>Changes</h1>

					<AgGridReact
						rowData={changes}
						columnDefs={[
							{
								field: 'companyName',
								headerName: 'Company Name',
								width: 'fit-content',
								sortable: true,
								resizable: true,
								pinned: 'left',
							},
							{
								field: 'companyId',
								headerName: 'Company Id',
								width: 'fit-content',
								sortable: true,
								resizable: true,
								pinned: 'left',
							},
							{
								field: 'fieldName',
								headerName: 'Field Name',
								width: 'fit-content',
								sortable: true,
								resizable: true,
							},
							{
								field: 'oldValue',
								headerName: 'Old Value',
								width: 'fit-content',
								sortable: true,
								resizable: true,
							},
							{
								field: 'newValue',
								headerName: 'New Value',
								width: 'fit-content',
								sortable: true,
								resizable: true,
							},
						]}
						rowHeight={40}
						headerHeight={40}
						suppressCellSelection={true}
						suppressRowClickSelection={true}
					></AgGridReact>
					<div className="changes__buttons">
						<button onClick={updateChanges} className="btn--update">
							Update All Changes
						</button>
						<button
							onClick={() => {
								setCompanies(prevCompanies => {
									const newCompanies = [...prevCompanies];
									for (const change of changes) {
										const companyIndex = newCompanies.findIndex(company => company._id === change.companyId);
										newCompanies[companyIndex][change.fieldName] = change.oldValue;
									}
									return newCompanies;
								});
								setChanges([]);
							}}
							className="btn--update"
						>
							Clear All Changes
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default CompanyTable;
