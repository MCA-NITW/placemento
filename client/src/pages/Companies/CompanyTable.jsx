import React, { useState, useCallback, useMemo, memo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { getCompanies } from '../../api/companyApi';
import { MdEdit } from 'react-icons/md';

const CompanyTable = () => {
	const [companies, setCompanies] = useState([]);

	const onGridReady = useCallback(async () => {
		const res = await getCompanies();
		setCompanies(res.data);
	}, []);

	const generateColumn = (field, headerName, width, sortable = true, resizable = true, pinned = null) => ({
		field,
		headerName,
		width,
		sortable,
		resizable,
		pinned,
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

	const editButtonRenderer = () => {
		return {
			component: <MdEdit />,
		};
	};

	const handleEditClick = () => {
		console.log('Edit button clicked');
	};

	const colDefs = [
		{
			headerName: 'Edit',
			pinned: 'left',
			width: 70,
			cellRenderer: '<MdEdit/>', // Corrected property name
			cellRendererParams: {
				onClick: handleEditClick,
			},
		},
		generateColumn('name', 'Name', 150, true, true, true, 'left'),
		generateColumn('status', 'Status', 115, false, true),
		generateColumn('typeOfOffer', 'Offer', 90, true, true),
		generateColumn('profile', 'Profile', 170),
		generateColumn('interviewShortlist', 'Shortlists', 130, true, true),
		generateColumn('selectedStudents', 'Selects', 110, true, true),
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

	const frameworkComponents = {
		editButtonRenderer: memo(editButtonRenderer),
	};

	const mapCompanyData = company => ({
		edit: !!false,
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
		<AgGridReact
			rowData={rowData}
			columnDefs={colDefs}
			rowHeight={40}
			headerHeight={40}
			rowSelection="multiple"
			dataTypeDefinitions={dataTypeDefinitions}
			onGridReady={onGridReady}
			frameworkComponents={frameworkComponents}
		/>
	);
};

export default CompanyTable;
