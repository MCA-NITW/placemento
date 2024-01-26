import { useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { addCompany, deleteCompany, getCompanies, getCompany, updateCompany } from '../../api/companyApi.jsx';
import getUserRole from '../../utils/role.js';
import AgGridTable from '../AgGridTable/AgGridTable.jsx';
import Modal from '../Modal/Modal.jsx';
import CompanyForm from './CompanyForm';
import './CompanyTable.css';

const CompanyTable = () => {
	const [companies, setCompanies] = useState([]);
	const [companyData, setCompanyData] = useState(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isAdd, setIsAdd] = useState(false);
	const userRole = getUserRole();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [idToDelete, setIdToDelete] = useState(null);
	const closeModal = () => setIsModalOpen(false);

	const fetchData = useCallback(async () => {
		try {
			const response = await getCompanies();
			setCompanies(response.data);
		} catch (error) {
			console.error('Error fetching companies:', error);
		}
	}, []);

	const handleDeleteButtonClick = (id) => {
		setIsModalOpen(true);
		setIdToDelete(id);
	};

	const onConfirmDelete = async () => {
		try {
			await deleteCompany(idToDelete);
			setIsModalOpen(false);
			fetchData();
		} catch (error) {
			console.error('Error deleting company:', error);
		}
	};

	const handleEditButtonClick = async (id) => {
		setIsAdd(false);
		const response = await getCompany(id);

		setCompanyData(response.data);
		setIsFormOpen(true);
	};

	const generateColumn = (field, headerName, width, sortable = true, resizable = true) => ({
		field,
		headerName,
		width,
		sortable,
		resizable,
	});

	const generateNestedColumn = (headerName, children) => ({
		headerName,
		children,
	});

	const generateDateColumn = (field, headerName, width, sortable = true, resizable = true) => ({
		...generateColumn(field, headerName, width, sortable, resizable),
		valueFormatter: (params) =>
			params.value
				? new Date(params.value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
				: '',
	});

	const formatCutoff = (cutoff) => (cutoff.cgpa ? `${cutoff.cgpa} CGPA` : `${cutoff.percentage}%`);

	const deleteButtonRenderer = (params) => {
		return (
			<button className="btn--icon--del" onClick={() => handleDeleteButtonClick(params.data.id)}>
				<MdDelete />
			</button>
		);
	};

	const editButtonRenderer = (params) => {
		return (
			<button className="btn--icon--edit" onClick={() => handleEditButtonClick(params.data.id)}>
				<MdEdit />
			</button>
		);
	};

	const actionColumn = (actionName, actionButtonRenderer) => {
		return {
			...generateColumn(null, actionName, 55, false, false),
			pinned: 'left',
			cellRenderer: actionButtonRenderer,
			...(userRole !== 'admin' && userRole !== 'placementCoordinator' && { initialHide: true }),
		};
	};

	const deleteColumn = () => {
		return actionColumn('Del', deleteButtonRenderer);
	};

	const editColumn = () => {
		return actionColumn('Edit', editButtonRenderer);
	};

	const columnDefinitions = [
		generateNestedColumn('Actions', [deleteColumn(), editColumn()]),
		{
			...generateColumn('name', 'Name', 150),
			pinned: 'left',
		},
		generateColumn('status', 'Status', 100, false),
		generateColumn('typeOfOffer', 'Offer', 90),
		generateColumn('profile', 'Profile', 150),
		generateColumn('profileCategory', 'Category', 100),
		generateColumn('interviewShortlist', 'Shortlists', 120),
		generateColumn('selectedStudents', 'Selects', 100),
		generateDateColumn('dateOfOffer', 'Offer Date', 125),
		generateColumn('locations', 'Locations', 130),
		generateNestedColumn('CTC (LPA)', [
			{
				...generateColumn('ctc', 'CTC', 80, true, false),
				valueFormatter: (params) => params.value.toFixed(2),
			},
			{
				...generateColumn('ctcBase', 'Base', 80, true, false),
				valueFormatter: (params) => params.value.toFixed(2),
			},
		]),
		generateNestedColumn('Cutoffs', [
			generateColumn('cutoff_pg', 'PG', 80, false, false),
			generateColumn('cutoff_ug', 'UG', 80, false, false),
			generateColumn('cutoff_12', '12', 80, false, false),
			generateColumn('cutoff_10', '10', 80, false, false),
		]),
		generateColumn('bond', 'Bond', 60, false, false),
	];

	const dataTypeDefinitions = useMemo(() => {
		return {
			object: {
				baseDataType: 'object',
				extendsDataType: 'object',
				valueParser: (params) => ({ name: params.newValue }),
				valueFormatter: (params) => (params.value == null ? '' : params.value.name),
			},
		};
	}, []);

	const mapCompanyData = (company) => ({
		...company,
		id: company._id,
		selectedStudents: company.selectedStudentsRollNo.length,
		cutoff_pg: formatCutoff(company.cutoffs.pg),
		cutoff_ug: formatCutoff(company.cutoffs.ug),
		cutoff_12: formatCutoff(company.cutoffs.twelth),
		cutoff_10: formatCutoff(company.cutoffs.tenth),
		ctcBase: company.ctcBreakup.base,
	});

	const rowData = companies.map(mapCompanyData);

	const handleAddCompanyClick = () => {
		setIsAdd(true);
		setCompanyData(null);
		setIsFormOpen(true);
	};

	const handleCloseForm = (fetch) => {
		setIsFormOpen(false);
		if (fetch) fetchData();
	};

	const renderCompanyForm = () => {
		if (!isFormOpen) return null;
		const modalRoot = document.getElementById('form-root');
		return ReactDOM.createPortal(
			<div className="modal" id="companyFormModal">
				<div className="modal-dialog">
					<CompanyForm
						actionFunc={isAdd ? addCompany : updateCompany}
						initialData={companyData}
						handleFormClose={handleCloseForm}
						isAdd={isAdd}
					/>
				</div>
			</div>,
			modalRoot,
		);
	};

	return (
		<>
			<button className="btn btn-primary" onClick={handleAddCompanyClick}>
				Add Company
			</button>
			{renderCompanyForm()}
			<AgGridTable
				rowData={rowData}
				columnDefinitions={columnDefinitions}
				dataTypeDefinitions={dataTypeDefinitions}
				fetchData={fetchData}
			/>
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				onConfirm={onConfirmDelete}
				message="Are you sure you want to delete this company?"
				buttonTitle="Delete"
			/>
		</>
	);
};

export default CompanyTable;
