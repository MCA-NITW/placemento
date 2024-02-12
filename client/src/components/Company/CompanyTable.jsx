import { useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { toast } from 'react-toastify';
import { addCompany, deleteCompany, getCompanies, getCompany, updateCompany } from '../../api/companyApi.jsx';
import getUser from '../../utils/user.js';
import AgGridTable from '../AgGridTable/AgGridTable.jsx';
import Modal from '../Modal/Modal.jsx';
import ToastContent from '../ToastContent/ToastContent.jsx';
import CompanyForm from './CompanyForm';
import './CompanyTable.css';

const CompanyTable = () => {
	const [companies, setCompanies] = useState([]);
	const [companyData, setCompanyData] = useState(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isAdd, setIsAdd] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [companyToDelete, setCompanyToDelete] = useState(null);
	const closeModal = () => setIsModalOpen(false);
	const [isFiltered, setIsFiltered] = useState(false);

	const [user, setUser] = useState({});

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

	const buttonRenderer = useMemo(
		() => (params, className, icon, onClick) => {
			return (
				<button className={className} onClick={() => onClick(params.data)}>
					{icon}
				</button>
			);
		},
		[]
	);

	const actionsColumn = useMemo(
		() =>
			generateNestedColumn('Actions', [
				generateColumn(null, 'Del', 45, 'left', false, false, (params) =>
					buttonRenderer(params, 'btn--icon--del', <MdDelete />, handleDeleteButtonClick)
				),
				generateColumn(null, 'Edit', 45, 'left', false, false, (params) =>
					buttonRenderer(params, 'btn--icon--edit', <MdEdit />, handleEditButtonClick)
				)
			]),
		[buttonRenderer]
	);

	const columnDefinitions = useMemo(
		() => [
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
		],
		[actionsColumn, user.role]
	);

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

	const [Status, setStatus] = useState([]);
	const [ProfileCategory, setProfileCategory] = useState([]);
	const [Shortlists, setShortlists] = useState([]);
	const [Selects, setSelects] = useState([]);
	const [CTC, setCTC] = useState([]);
	const [Base, setBase] = useState([]);
	const [Locations, setLocations] = useState([]);
	const [Offer, setOffer] = useState([]);

	const doesExternalFilterPass = useCallback(
		(node) => {
			if (node.data) {
				if (Status.length > 0 && !Status.includes(node.data.status.toLowerCase())) {
					return false;
				}
				if (Offer.length > 0 && !Offer.includes(node.data.typeOfOffer)) {
					return false;
				}
				if (ProfileCategory.length > 0 && !ProfileCategory.includes(node.data.profileCategory)) {
					return false;
				}
				if (Shortlists.length > 0 && !Shortlists.includes(node.data.interviewShortlist)) {
					if (Shortlists.includes(4) && node.data.interviewShortlist >= 4) return true;
					return false;
				}
				if (Selects.length > 0 && !Selects.includes(node.data.selectedStudents)) {
					if (Selects.includes(4) && node.data.selectedStudents >= 4) return true;
					return false;
				}
				if (CTC.length > 0) {
					if (CTC.includes(10) && node.data.ctc < 10) return true;
					if (CTC.includes(20) && node.data.ctc >= 10 && node.data.ctc < 20) return true;
					if (CTC.includes(30) && node.data.ctc >= 20 && node.data.ctc < 30) return true;
					if (CTC.includes(31) && node.data.ctc >= 31) return true;
					return false;
				}
				if (Base.length > 0) {
					if (Base.includes(5) && node.data.ctcBase < 5) return true;
					if (Base.includes(10) && node.data.ctcBase >= 5 && node.data.ctcBase < 10) return true;
					if (Base.includes(15) && node.data.ctcBase >= 10 && node.data.ctcBase < 15) return true;
					if (Base.includes(16) && node.data.ctcBase >= 16) return true;
					return false;
				}
				if (Locations.length > 0) {
					return !(Locations.filter((value) => node.data.locations.includes(value)).length === 0);
				}
			}
			return true;
		},
		[Status, ProfileCategory, Shortlists, Selects, CTC, Base, Locations, Offer]
	);

	const optionClickHandler = (head, value) => {
		setIsFiltered(true);
		const element = document.getElementById(`${head.toLowerCase()}-${value}`);
		element.classList.add('active');
		if (head === 'Status') {
			setStatus((prevStatus) => {
				if (prevStatus.includes(value)) {
					element.classList.remove('active');
					return prevStatus.filter((status) => status !== value);
				}
				return [...prevStatus, value];
			});
		} else if (head === 'Offer') {
			setOffer((prevOffer) => {
				if (prevOffer.includes(value)) {
					element.classList.remove('active');
					return prevOffer.filter((offer) => offer !== value);
				}
				return [...prevOffer, value];
			});
		} else if (head === 'Profile Category') {
			setProfileCategory((prevProfileCategory) => {
				if (prevProfileCategory.includes(value)) {
					element.classList.remove('active');
					return prevProfileCategory.filter((profileCategory) => profileCategory !== value);
				}
				return [...prevProfileCategory, value];
			});
		} else if (head === 'Shortlists') {
			setShortlists((prevShortlists) => {
				if (prevShortlists.includes(value)) {
					element.classList.remove('active');
					return prevShortlists.filter((shortlist) => shortlist !== value);
				}
				return [...prevShortlists, value];
			});
		} else if (head === 'Selects') {
			setSelects((prevSelects) => {
				if (prevSelects.includes(value)) {
					element.classList.remove('active');
					return prevSelects.filter((select) => select !== value);
				}
				return [...prevSelects, value];
			});
		} else if (head === 'CTC') {
			setCTC((prevCTC) => {
				if (prevCTC.includes(value)) {
					element.classList.remove('active');
					return prevCTC.filter((ctc) => ctc !== value);
				}
				return [...prevCTC, value];
			});
		} else if (head === 'Base') {
			setBase((prevBase) => {
				if (prevBase.includes(value)) {
					element.classList.remove('active');
					return prevBase.filter((base) => base !== value);
				}
				return [...prevBase, value];
			});
		} else if (head === 'Locations') {
			setLocations((prevLocations) => {
				if (prevLocations.includes(value)) {
					element.classList.remove('active');
					return prevLocations.filter((location) => location !== value);
				}
				return [...prevLocations, value];
			});
		}
	};

	const optionsRenderer = (head, options) => {
		return (
			<div className="companies-filter__item">
				<div className="companies-filter__item__label">{head}</div>
				<div className="companies-filter__item__values">
					{options.map((option) => (
						<div
							key={option.value}
							id={`${head.toLowerCase()}-${option.value}`}
							className="companies-filter__item__value"
							onClick={() => optionClickHandler(head, option.value)}
						>
							{option.label}
						</div>
					))}
				</div>
			</div>
		);
	};

	const statusOptions = [
		{ label: 'Completed', value: 'completed' },
		{ label: 'Ongoing', value: 'ongoing' },
		{ label: 'Cancelled', value: 'cancelled' }
	];

	const offerOptions = [
		{ label: 'PPO', value: 'PPO' },
		{ label: 'FTE', value: 'FTE' },
		{ label: '6M+FTE', value: '6M+FTE' },
		{ label: 'Intern', value: 'Intern' }
	];

	const profileCategoryOptions = [
		{ label: 'Software', value: 'Software' },
		{ label: 'Analyst', value: 'Analyst' },
		{ label: 'Others', value: 'Others' }
	];

	const shortlistOptions = [
		{ label: '0', value: 0 },
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: '3', value: 3 },
		{ label: '>3', value: 4 }
	];

	const selectOptions = [
		{ label: '0', value: 0 },
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: '3', value: 3 },
		{ label: '>3', value: 4 }
	];

	const ctcOptions = [
		{ label: 'Less than 10LPA', value: 10 },
		{ label: '10-20LPA', value: 20 },
		{ label: '20-30LPA', value: 30 },
		{ label: 'More than 30LPA', value: 31 }
	];

	const baseOptions = [
		{ label: 'Less than 5LPA', value: 5 },
		{ label: '5-10LPA', value: 10 },
		{ label: '10-15LPA', value: 15 },
		{ label: 'More than 15LPA', value: 16 }
	];

	const locationOptions = [
		{ label: 'Bangalore', value: 'Bangalore' },
		{ label: 'Chennai', value: 'Chennai' },
		{ label: 'Hyderabad', value: 'Hyderabad' },
		{ label: 'Mumbai', value: 'Mumbai' },
		{ label: 'Pune', value: 'Pune' },
		{ label: 'Delhi', value: 'Delhi' },
		{ label: 'Kolkata', value: 'Kolkata' },
		{ label: 'Ahmedabad', value: 'Ahmedabad' },
		{ label: 'Other', value: 'Other' }
	];

	return (
		<div className="companies-container">
			{renderCompanyForm()}
			<div className="companies-left">
				{(user.role === 'admin' || user.role === 'placementCoordinator') && (
					<button className="btn btn-primary" onClick={handleAddCompanyClick}>
						Add Company
					</button>
				)}
				<div className="companies-filter">
					<h3>Filters</h3>
					{optionsRenderer('Status', statusOptions)}
					{optionsRenderer('Offer', offerOptions)}
					{optionsRenderer('Profile Category', profileCategoryOptions)}
					{optionsRenderer('Shortlists', shortlistOptions)}
					{optionsRenderer('Selects', selectOptions)}
					{optionsRenderer('CTC', ctcOptions)}
					{optionsRenderer('Base', baseOptions)}
					{optionsRenderer('Locations', locationOptions)}
				</div>
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
					onClose={closeModal}
					onConfirm={onConfirmDelete}
					message="Are you sure you want to delete this company?"
					buttonTitle="Delete"
				/>
			</div>
		</div>
	);
};

export default CompanyTable;
