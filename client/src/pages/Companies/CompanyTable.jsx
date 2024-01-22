import React, { useState, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { getCompanies, deleteCompany, updateCompany, addCompany, getCompany } from '../../api/companyApi';
import { MdDelete, MdEdit } from 'react-icons/md';
import userRole from '../../utils/role';
import CompanyForm from './CompanyForm';

const CompanyTable = () => {
	const [companies, setCompanies] = useState([]);
	const [companyData, setCompanyData] = useState(null);
	const [isFormOpen, setFormOpen] = useState(false);
	const [isAdd, setAdd] = useState(false);
	const [tableKey, setTableKey] = useState(0);

	const fetchData = useCallback(async () => {
		try {
			const response = await getCompanies();
			setCompanies(response.data);
		} catch (error) {
			console.error('Error fetching companies:', error);
		}
	}, []);

	const handleDeleteButtonClick = async id => {
		await deleteCompany(id);
	};

	const handleEditButtonClick = async id => {
		setAdd(false);
		const response = await getCompany(id);
		setCompanyData(response.data);
		setFormOpen(true);
	};

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

	const deleteButtonRenderer = params => {
		return (
			<div className="btn--icon--del" onClick={() => handleDeleteButtonClick(params.data.id)}>
				<MdDelete />
			</div>
		);
	};

	const editButtonRenderer = params => {
		return (
			<div className="btn--icon--edit" onClick={() => handleEditButtonClick(params.data.id)}>
				<MdEdit />
			</div>
		);
	};

	const deleteColumn = () => {
		return {
			headerName: '🗑️',
			pinned: 'left',
			width: 50,
			resizable: false,
			sortable: false,
			cellRenderer: deleteButtonRenderer,
			...(userRole !== 'admin' && userRole !== 'placementCoordinator' && { initialHide: true }),
		};
	};

	const editColumn = () => {
		return {
			headerName: '✏️',
			pinned: 'left',
			width: 50,
			resizable: false,
			sortable: false,
			cellRenderer: editButtonRenderer,
			...(userRole !== 'admin' && userRole !== 'placementCoordinator' && { initialHide: true }),
		};
	};

	const columnDefinitions = [
		generateNestedColumn('Actions', [deleteColumn(), editColumn()]),
		generateColumn('name', 'Name', 150, true, true, 'left'),
		generateColumn('status', 'Status', 100, false, true),
		generateColumn('typeOfOffer', 'Offer', 90, true, true),
		generateColumn('profile', 'Profile', 150),
		generateColumn('interviewShortlist', 'Shortlists', 120, true, true),
		generateColumn('selectedStudents', 'Selects', 100, true, true),
		generateDateColumn('dateOfOffer', 'Offer Date', 125, true, true),
		generateColumn('locations', 'Locations', 130, true, true),
		generateNestedColumn('CTC (LPA)', [
			generateColumn('ctc', 'CTC', 80, true, false),
			generateColumn('ctcBase', 'Base', 85, true, false),
		]),
		generateNestedColumn('Cutoffs', [
			generateColumn('cutoff_pg', 'PG', 80, false, false),
			generateColumn('cutoff_ug', 'UG', 80, false, false),
			generateColumn('cutoff_12', '12', 80, false, false),
			generateColumn('cutoff_10', '10', 80, false, false),
		]),
		generateColumn('bond', 'Bond', 60, false, true),
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
		id: company._id,
		name: company.name,
		status: company.status,
		interviewShortlist: company.interviewShortlist,
		selectedStudents: company.selectedStudentsRollNo.length,
		dateOfOffer: company.dateOfOffer,
		locations: company.locations,
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

	const handleAddCompanyClick = () => {
		setAdd(true);
		setCompanyData(null);
		setFormOpen(true);
	};

	const handleCloseForm = () => {
		setFormOpen(false);
		setTableKey(prevKey => prevKey + 1);
	};

	return (
		<>
			<h1 className="page-heading">Companies</h1>
			<button className="btn-primary" onClick={handleAddCompanyClick}>
				Add Company
			</button>
			{isFormOpen && (
				<CompanyForm
					actionFunc={isAdd ? addCompany : updateCompany}
					initialData={isAdd ? null : companyData}
					handleFormClose={handleCloseForm}
					isAdd={isAdd}
				/>
			)}
			<div className="ag-theme-quartz" key={tableKey}>
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
		</>
	);
};

export default CompanyTable;
