import { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { toast } from 'react-toastify';
import { addCompany, deleteCompany, getCompanies, getCompany, updateCompany } from '../../api/companyApi.jsx';
import getUser from '../../utils/user.js';
import AgGridTable from '../AgGridTable/AgGridTable.jsx';
import Modal from '../Modal/Modal.jsx';
import ToastContent from '../ToastContent/ToastContent.jsx';
import CompanyFilters from './CompanyFilters';
import CompanyForm from './CompanyForm';
import './CompanyTable.css';

const CompanyTable = () => {
	const [companies, setCompanies] = useState([]);
	const [companyData, setCompanyData] = useState(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isAdd, setIsAdd] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [companyToDelete, setCompanyToDelete] = useState(null);

	const [user, setUser] = useState({});
	const [isFiltered, setIsFiltered] = useState(false);
	const [Status, setStatus] = useState([]);
	const [ProfileCategory, setProfileCategory] = useState([]);
	const [Shortlists, setShortlists] = useState([]);
	const [Selects, setSelects] = useState([]);
	const [CTC, setCTC] = useState([]);
	const [Base, setBase] = useState([]);
	const [Locations, setLocations] = useState([]);
	const [Offer, setOffer] = useState([]);

	const fetchData = useCallback(async () => {
		try {
			const response = await Promise.all([getCompanies(), getUser()]);
			const companiesResponse = response[0];
			setUser(response[1]);
			companiesResponse.data.forEach((company) => {
				company.id = company._id;
				company.selectedStudents = company.selectedStudentsRollNo.length;
				company.cutoff_pg = formatCutoff(company.cutoffs.pg);
				company.cutoff_ug = formatCutoff(company.cutoffs.ug);
				company.cutoff_12 = formatCutoff(company.cutoffs.twelth);
				company.cutoff_10 = formatCutoff(company.cutoffs.tenth);
				company.ctcBase = company.ctcBreakup.base;
			});
			setCompanies(companiesResponse.data);
		} catch (error) {
			console.error('Error fetching companies:', error);
			toast.error(<ToastContent res="error" messages={['Error fetching companies.']} />);
		}
	}, []);

	const handleDeleteButtonClick = (company) => {
		setIsModalOpen(true);
		setCompanyToDelete(company);
	};

	const onConfirmDelete = async () => {
		try {
			await deleteCompany(companyToDelete.id);
			toast.success(<ToastContent res="success" messages={[`Company ${companyToDelete.name} deleted successfully.`]} />);
			setIsModalOpen(false);
			setCompanies((prevCompanies) => prevCompanies.filter((company) => company.id !== companyToDelete.id));
		} catch (error) {
			console.error('Error deleting company:', error);
			toast.error(<ToastContent res="error" messages={[`Error deleting company ${companyToDelete.name}.`]} />);
		}
	};

	const handleEditButtonClick = async (company) => {
		try {
			const response = await getCompany(company.id);
			setCompanyData(response.data);
			setIsAdd(false);
			setIsFormOpen(true);
		} catch (error) {
			console.error('Error fetching company:', error);
			toast.error(<ToastContent res="error" messages={[`Error fetching company ${company.name}.`]} />);
		}
	};

	const generateColumn = (field, headerName, width, pinned = null, sortable = true, resizable = true, cellRenderer = null) => ({
		field,
		headerName,
		width,
		pinned,
		sortable,
		resizable,
		cellRenderer
	});

	const generateNestedColumn = (headerName, children) => ({
		headerName,
		children
	});

	const formatCutoff = (cutoff) => (cutoff.cgpa ? `${cutoff.cgpa} CGPA` : `${cutoff.percentage}%`);

	const buttonRenderer = (params, className, icon, onClick) => {
		return (
			<button className={className} onClick={() => onClick(params.data)}>
				{icon}
			</button>
		);
	};

	const actionsColumn = generateNestedColumn('Actions', [
		generateColumn(null, 'Del', 45, 'left', false, false, (params) =>
			buttonRenderer(params, 'btn--icon--del', <MdDelete />, handleDeleteButtonClick)
		),
		generateColumn(null, 'Edit', 45, 'left', false, false, (params) => buttonRenderer(params, 'btn--icon--edit', <MdEdit />, handleEditButtonClick))
	]);

	const columnDefinitions = [
		...(user.role === 'admin' || user.role === 'placementCoordinator' ? [actionsColumn] : []),
		generateColumn('name', 'Name', 150, 'left'),
		generateColumn('status', 'Status', 90, null, false),
		generateColumn('typeOfOffer', 'Offer', 80, null, false, false),
		generateColumn('profile', 'Profile', 130),
		generateColumn('profileCategory', 'Category', 85, null, false, false),
		generateColumn('interviewShortlist', 'Shortlists', 105, null, true, false),
		generateColumn('selectedStudents', 'Selects', 95, null, true, false),
		generateColumn('dateOfOffer', 'Offer Date', 115, null, true, false, (params) =>
			params.value
				? new Date(params.value).toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'short',
						year: 'numeric'
					})
				: ''
		),
		generateColumn('locations', 'Locations', 130, null, false, true),
		generateNestedColumn('CTC (LPA)', [
			generateColumn('ctc', 'CTC', 75, null, true, false, (params) => params.value.toFixed(2)),
			generateColumn('ctcBase', 'Base', 75, null, true, false, (params) => params.value.toFixed(2))
		]),
		generateNestedColumn('Cutoffs', [
			generateColumn('cutoff_pg', 'PG', 80, null, false, false),
			generateColumn('cutoff_ug', 'UG', 80, null, false, false),
			generateColumn('cutoff_12', '12', 80, null, false, false),
			generateColumn('cutoff_10', '10', 80, null, false, false)
		]),
		generateColumn('bond', 'Bond', 60, null, false, false)
	];

	const handleAddCompanyClick = () => {
		setIsAdd(true);
		setCompanyData(null);
		setIsFormOpen(true);
	};

	const handleCloseForm = useCallback(
		(fetch) => {
			setIsFormOpen(false);
			if (fetch) fetchData();
		},
		[fetchData]
	);

	const renderCompanyForm = () => {
		if (!isFormOpen) return null;
		return ReactDOM.createPortal(
			<CompanyForm actionFunc={isAdd ? addCompany : updateCompany} initialData={companyData} handleFormClose={handleCloseForm} isAdd={isAdd} />,
			document.getElementById('form-root')
		);
	};

	const isExternalFilterPresent = useCallback(() => {
		return isFiltered;
	}, [isFiltered]);

	const doesExternalFilterPass = useCallback(
		(node) => {
			if (!node.data) return true;

			const { data } = node;

			const checkStatus = () => Status.length === 0 || Status.includes(data.status.toLowerCase());
			const checkOffer = () => Offer.length === 0 || Offer.includes(data.typeOfOffer);
			const checkProfileCategory = () => ProfileCategory.length === 0 || ProfileCategory.includes(data.profileCategory);
			const checkShortlists = () =>
				Shortlists.length === 0 || Shortlists.includes(data.interviewShortlist) || (Shortlists.includes(4) && data.interviewShortlist >= 4);
			const checkSelects = () =>
				Selects.length === 0 || Selects.includes(data.selectedStudents) || (Selects.includes(4) && data.selectedStudents >= 4);
			const checkCTC = () => {
				return (
					CTC.length === 0 ||
					CTC.some((val) => (val === 31 ? data.ctc >= val : data.ctc < val)) ||
					(CTC.includes(10) && data.ctc < 10) ||
					(CTC.includes(20) && data.ctc >= 10 && data.ctc < 20) ||
					(CTC.includes(30) && data.ctc >= 20 && data.ctc < 30)
				);
			};
			const checkBase = () => {
				return (
					Base.length === 0 ||
					Base.some((val) => (val === 16 ? data.ctcBase >= val : data.ctcBase < val)) ||
					(Base.includes(5) && data.ctcBase < 5) ||
					(Base.includes(10) && data.ctcBase >= 5 && data.ctcBase < 10) ||
					(Base.includes(15) && data.ctcBase >= 10 && data.ctcBase < 15)
				);
			};
			const checkLocations = () => Locations.length === 0 || Locations.some((value) => data.locations.includes(value));

			return (
				checkStatus() &&
				checkOffer() &&
				checkProfileCategory() &&
				checkShortlists() &&
				checkSelects() &&
				checkCTC() &&
				checkBase() &&
				checkLocations()
			);
		},
		[Status, ProfileCategory, Shortlists, Selects, CTC, Base, Locations, Offer]
	);

	const optionClickHandler = (head, value) => {
		setIsFiltered(true);
		const element = document.getElementById(`${head.toLowerCase()}-${value}`);
		element.classList.add('active');

		const setStateFunction = {
			Status: setStatus,
			Offer: setOffer,
			'Profile Category': setProfileCategory,
			Shortlists: setShortlists,
			Selects: setSelects,
			CTC: setCTC,
			Base: setBase,
			Locations: setLocations
		};

		setStateFunction[head]((prevState) => {
			const isValueIncluded = prevState.includes(value);
			if (isValueIncluded) {
				element.classList.remove('active');
				return prevState.filter((option) => option !== value);
			}
			return [...prevState, value];
		});
	};

	return (
		<div className="companies-container">
			{renderCompanyForm()}
			<div className="companies-left">
				{(user.role === 'admin' || user.role === 'placementCoordinator') && (
					<button className="btn btn-primary" onClick={handleAddCompanyClick}>
						Add Company
					</button>
				)}
				<CompanyFilters optionClickHandler={optionClickHandler} />
			</div>
			<div className="companies-right">
				<AgGridTable
					rowData={companies}
					columnDefinitions={columnDefinitions}
					fetchData={fetchData}
					isExternalFilterPresent={isExternalFilterPresent}
					doesExternalFilterPass={doesExternalFilterPass}
				/>
				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onConfirm={onConfirmDelete}
					message="Are you sure you want to delete this company?"
					buttonTitle="Delete"
				/>
			</div>
		</div>
	);
};

export default CompanyTable;
