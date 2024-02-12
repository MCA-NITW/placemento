import { useCallback, useState } from 'react';
import { GrValidate } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getCompanies } from '../../api/companyApi.jsx';
import {
	deleteStudent,
	getStudents,
	updateStudentCompany,
	updateStudentCompanyLocation,
	updateUserRole,
	updateVerificationStatus
} from '../../api/studentApi.jsx';
import getUser from '../../utils/user.js';
import AgGridTable from '../AgGridTable/AgGridTable.jsx';
import Modal from '../Modal/Modal.jsx';
import ToastContent from '../ToastContent/ToastContent.jsx';
import './StudentTable.css';

const StudentTable = () => {
	const [students, setStudents] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [selectedStudentDelete, setSelectedStudentDelete] = useState(null);
	const [companies, setCompanies] = useState([]);
	const [user, setUser] = useState({});

	const fetchData = useCallback(async () => {
		try {
			const response = await Promise.all([getStudents(), getCompanies(), getUser()]);
			const studentsResponse = response[0];
			const companiesResponse = response[1];
			setUser(response[2]);

			studentsResponse.data.users.forEach((student) => {
				student.id = student._id;
			});
			studentsResponse.data.users.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
			setStudents(studentsResponse.data.users);

			companiesResponse.data.forEach((company) => {
				company.id = company._id;
			});
			setCompanies(companiesResponse.data);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}, []);

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedStudent(null);
		setSelectedStudentDelete(null);
	};

	const handleVerifyButtonClick = (student) => {
		setIsModalOpen(true);
		setSelectedStudent(student);
	};

	const handleDeleteButtonClick = async (student) => {
		setIsModalOpen(true);
		setSelectedStudentDelete(student);
	};

	const onConfirmVerifyStudent = async () => {
		try {
			const res = await updateVerificationStatus(selectedStudent.id);
			toast.success(<ToastContent res="success" messages={[res.data.message]} />);
			setIsModalOpen(false);
			setSelectedStudent(null);
			fetchData();
		} catch (error) {
			toast.error(<ToastContent res="error" messages={[error.response.data.message]} />);
		}
	};

	const onConfirmDeleteStudent = async () => {
		try {
			const res = await deleteStudent(selectedStudentDelete.id);
			toast.success(<ToastContent res="success" messages={[res.data.message]} />);
			setIsModalOpen(false);
			setSelectedStudentDelete(null);
			fetchData();
		} catch (error) {
			toast.error(<ToastContent res="error" messages={[error.response.data.message]} />);
		}
	};

	const handleChange = async (event, params, updateAction) => {
		try {
			const res = await updateAction(params.id, event.target.value);
			toast.success(<ToastContent res="success" messages={[res.data.message]} />);
			fetchData();
		} catch (error) {
			toast.error(<ToastContent res="error" messages={[error.response.data.message]} />);
		}
	};

	const buttonRenderer = (params, action, icon, className) => {
		return (
			<button className={className} onClick={() => action(params.data)}>
				{icon}
			</button>
		);
	};

	const verifyButtonRenderer = (params) => {
		return buttonRenderer(params, handleVerifyButtonClick, <GrValidate />, `verify-button ${params.data.isVerified ? 'verified' : 'unverified'}`);
	};

	const deleteButtonRenderer = (params) => {
		return buttonRenderer(params, handleDeleteButtonClick, <MdDelete />, 'btn--icon--del');
	};

	const dropdownRenderer = (params, options, updateAction, value) => {
		return (
			<select className="render-dropdown" value={value} onChange={(event) => handleChange(event, params.data, updateAction)}>
				{options.map((option) => (
					<option value={option.value} key={option.value}>
						{option.label}
					</option>
				))}
			</select>
		);
	};

	const roleDropdownRenderer = (params) => {
		const options = [
			{ value: 'student', label: 'Student' },
			{ value: 'placementCoordinator', label: 'PC' },
			{ value: 'admin', label: 'Admin' }
		];
		return dropdownRenderer(params, options, updateUserRole, params.data.role);
	};

	const companyDropdownRenderer = (params) => {
		const options = companies.map((company) => ({
			value: company.id,
			label: company.name
		}));
		options.unshift({ value: 'np', label: 'Not Placed' });
		return dropdownRenderer(params, options, updateStudentCompany, params.data.placedAt?.companyId);
	};

	const locationDropdownRenderer = (params) => {
		const company = companies.find((company) => company.id === params.data.placedAt?.companyId);
		if (!company) return 'N/A';
		const options = company.locations.map((location) => ({
			value: location,
			label: location
		}));
		options.unshift({ value: 'N/A', label: 'N/A' });
		return dropdownRenderer(params, options, updateStudentCompanyLocation, params.data.placedAt?.location);
	};

	const modelRenderer = (isModalOpen, closeModal, onConfirm, message, buttonTitle) => {
		return <Modal isOpen={isModalOpen} onClose={() => closeModal()} onConfirm={onConfirm} message={message} buttonTitle={buttonTitle} />;
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

	const roleFormatter = (params) => {
		if (params.value === 'student') return 'Student';
		else if (params.value === 'placementCoordinator') return 'PC';
		else return 'Admin';
	};

	const actionsColumn = generateNestedColumn('Actions', [
		generateColumn(null, 'Del', 45, 'left', false, false, deleteButtonRenderer),
		generateColumn(null, 'Ver', 45, 'left', false, false, verifyButtonRenderer)
	]);

	const gradesColumn = (head, cgpa, percentage) =>
		generateNestedColumn(head, [
			generateColumn(cgpa, 'CGPA', 75, null, true, false, (params) => params.value.toFixed(2)),
			generateColumn(percentage, '%', 75, null, true, false, (params) => params.value.toFixed(2))
		]);

	const academicColumn = [
		generateNestedColumn('Grades', [
			gradesColumn('PG', 'pg.cgpa', 'pg.percentage'),
			gradesColumn('UG', 'ug.cgpa', 'ug.percentage'),
			gradesColumn('12th', 'hsc.cgpa', 'hsc.percentage'),
			gradesColumn('10th', 'ssc.cgpa', 'ssc.percentage')
		]),
		generateColumn('totalGapInAcademics', 'Gap', 70),
		generateColumn('backlogs', 'Backlogs', 80)
	];

	const placementColumn = generateNestedColumn('Placement Details', [
		generateColumn(
			'placedAt.companyName',
			'Company',
			225,
			null,
			true,
			true,
			user.role === 'admin' || user.role === 'placementCoordinator' ? companyDropdownRenderer : null
		),
		generateNestedColumn('CTC (LPA)', [
			generateColumn('placedAt.ctc', 'CTC', 70, null, true, false, (params) => params.value.toFixed(2)),
			generateColumn('placedAt.ctcBase', 'Base', 70, null, true, false, (params) => params.value.toFixed(2))
		]),
		generateColumn('placedAt.offer', 'Offer', 75, null, false, false),
		generateColumn('placedAt.profileType', 'Profile', 100, null, true, true),
		generateColumn(
			'placedAt.location',
			'Location',
			120,
			null,
			true,
			false,
			user.role === 'admin' || user.role === 'placementCoordinator' ? locationDropdownRenderer : null
		)
	]);

	const columnDefinitions = [
		...(user.role === 'admin' || user.role === 'placementCoordinator' ? [actionsColumn] : []),
		generateColumn('role', 'Role', 110, 'left', false, false, user.role === 'admin' ? roleDropdownRenderer : roleFormatter),
		generateColumn('name', 'Name', 130, 'left'),
		generateColumn('rollNo', 'Roll No', 95),
		generateColumn('batch', 'Batch', 70, null, false, false),
		generateColumn('email', 'Email', 225),
		placementColumn,
		...(user.role === 'admin' || user.role === 'placementCoordinator' ? academicColumn : [])
	];

	const [isFiltered, setIsFiltered] = useState(false);
	const [role, setRole] = useState([]);
	const [verification, setVerification] = useState([]);
	const [batch, setBatch] = useState([]);
	const [placement, setPlacement] = useState([]);
	const [location, setLocation] = useState([]);
	const [ctc, setCtc] = useState([]);
	const [base, setBase] = useState([]);
	const [gap, setGap] = useState([]);
	const [backlogs, setBacklogs] = useState([]);
	const [pgcgpa, setPgcgpa] = useState([]);
	const [overAllcgpa, setOverAllcgpa] = useState([]);

	const isExternalFilterPresent = useCallback(() => {
		return isFiltered;
	}, [isFiltered]);

	const doesExternalFilterPass = useCallback(
		(node) => {
			if (node.data) {
				if (role.length > 0 && !role.includes(node.data.role)) {
					return false;
				}
				if (verification.length > 0 && !verification.includes(node.data.isVerified ? 'verified' : 'unverified')) {
					return false;
				}
				if (batch.length > 0 && !batch.includes(node.data.batch)) {
					return false;
				}
				if (placement.length > 0 && !placement.includes(node.data.placed ? 'placed' : 'notPlaced')) {
					return false;
				}
				if (location.length > 0 && !location.includes(node.data.placedAt?.location)) {
					return false;
				}
				if (ctc.length > 0) {
					if (ctc.includes(10) && node.data.placedAt.ctc < 10) return true;
					if (ctc.includes(20) && node.data.placedAt.ctc >= 10 && node.data.ctc < 20) return true;
					if (ctc.includes(30) && node.data.placedAt.ctc >= 20 && node.data.ctc < 30) return true;
					if (ctc.includes(31) && node.data.placedAt.ctc >= 31) return true;
					return false;
				}
				if (base.length > 0) {
					if (base.includes(5) && node.data.placedAt.ctcBase < 5) return true;
					if (base.includes(10) && node.data.placedAt.ctcBase >= 5 && node.data.ctcBase < 10) return true;
					if (base.includes(15) && node.data.placedAt.ctcBase >= 10 && node.data.ctcBase < 15) return true;
					if (base.includes(16) && node.data.placedAt.ctcBase >= 16) return true;
					return false;
				}
				if (gap.length > 0 && !gap.includes(node.data.totalGapInAcademics)) {
					if (gap.includes(3) && node.data.totalGapInAcademics > 2) return true;
					return false;
				}
				if (backlogs.length > 0 && !backlogs.includes(node.data.backlogs)) {
					if (backlogs.includes(3) && node.data.backlogs > 2) return true;
					return false;
				}
				if (overAllcgpa.length > 0) {
					if (
						overAllcgpa.includes(6.5) &&
						(node.data.pg.cgpa < 6.5 || node.data.ug.cgpa < 6.5 || node.data.hsc.cgpa < 6.5 || node.data.ssc.cgpa < 6.5)
					)
						return true;
					if (
						overAllcgpa.includes(7) &&
						node.data.pg.cgpa >= 6.5 &&
						node.data.ug.cgpa >= 6.5 &&
						node.data.hsc.cgpa >= 6.5 &&
						node.data.ssc.cgpa >= 6.5
					)
						return true;
					if (overAllcgpa.includes(7.5) && node.data.pg.cgpa >= 7 && node.data.ug.cgpa >= 7 && node.data.hsc.cgpa >= 7 && node.data.ssc.cgpa >= 7)
						return true;
					if (
						overAllcgpa.includes(8) &&
						node.data.pg.cgpa >= 7.5 &&
						node.data.ug.cgpa >= 7.5 &&
						node.data.hsc.cgpa >= 7.5 &&
						node.data.ssc.cgpa >= 7.5
					)
						return true;
					if (overAllcgpa.includes(9) && node.data.pg.cgpa >= 8 && node.data.ug.cgpa >= 8 && node.data.hsc.cgpa >= 8 && node.data.ssc.cgpa >= 8)
						return true;
					return false;
				}
				if (pgcgpa.length > 0) {
					if (pgcgpa.includes(6.5) && node.data.pg.cgpa < 6.5) return true;
					if (pgcgpa.includes(7) && node.data.pg.cgpa >= 6.5 && node.data.pg.cgpa < 7) return true;
					if (pgcgpa.includes(7.5) && node.data.pg.cgpa >= 7 && node.data.pg.cgpa < 7.5) return true;
					if (pgcgpa.includes(8) && node.data.pg.cgpa >= 7.5 && node.data.pg.cgpa < 8) return true;
					if (pgcgpa.includes(9) && node.data.pg.cgpa >= 8) return true;
					return false;
				}
			}
			return true;
		},
		[role, verification, batch, placement, location, ctc, base, gap, backlogs, pgcgpa, overAllcgpa]
	);

	const optionClickHandler = (head, value) => {
		setIsFiltered(true);
		const element = document.getElementById(`${head.toLowerCase()}-${value}`);
		element.classList.add('active');
		if (head === 'Role') {
			setRole((prevRole) => {
				if (prevRole.includes(value)) {
					element.classList.remove('active');
					return prevRole.filter((role) => role !== value);
				}
				return [...prevRole, value];
			});
		}
		if (head === 'Verification') {
			setVerification((prevVerification) => {
				if (prevVerification.includes(value)) {
					element.classList.remove('active');
					return prevVerification.filter((verification) => verification !== value);
				}
				return [...prevVerification, value];
			});
		}
		if (head === 'Batch') {
			setBatch((prevBatch) => {
				if (prevBatch.includes(value)) {
					element.classList.remove('active');
					return prevBatch.filter((batch) => batch !== value);
				}
				return [...prevBatch, value];
			});
		}
		if (head === 'Placement') {
			setPlacement((prevPlacement) => {
				if (prevPlacement.includes(value)) {
					element.classList.remove('active');
					return prevPlacement.filter((placement) => placement !== value);
				}
				return [...prevPlacement, value];
			});
		}
		if (head === 'Location') {
			setLocation((prevLocation) => {
				if (prevLocation.includes(value)) {
					element.classList.remove('active');
					return prevLocation.filter((location) => location !== value);
				}
				return [...prevLocation, value];
			});
		}
		if (head === 'CTC') {
			setCtc((prevCtc) => {
				if (prevCtc.includes(value)) {
					element.classList.remove('active');
					return prevCtc.filter((ctc) => ctc !== value);
				}
				return [...prevCtc, value];
			});
		}
		if (head === 'Base') {
			setBase((prevBase) => {
				if (prevBase.includes(value)) {
					element.classList.remove('active');
					return prevBase.filter((base) => base !== value);
				}
				return [...prevBase, value];
			});
		}
		if (head === 'Gap') {
			setGap((prevGap) => {
				if (prevGap.includes(value)) {
					element.classList.remove('active');
					return prevGap.filter((gap) => gap !== value);
				}
				return [...prevGap, value];
			});
		}
		if (head === 'Backlogs') {
			setBacklogs((prevBacklogs) => {
				if (prevBacklogs.includes(value)) {
					element.classList.remove('active');
					return prevBacklogs.filter((backlogs) => backlogs !== value);
				}
				return [...prevBacklogs, value];
			});
		}
		if (head === 'PG CGPA') {
			setPgcgpa((prevPgcgpa) => {
				if (prevPgcgpa.includes(value)) {
					element.classList.remove('active');
					return prevPgcgpa.filter((pgcgpa) => pgcgpa !== value);
				}
				return [...prevPgcgpa, value];
			});
		}
		if (head === 'Overall CGPA') {
			setOverAllcgpa((prevOverAllcgpa) => {
				if (prevOverAllcgpa.includes(value)) {
					element.classList.remove('active');
					return prevOverAllcgpa.filter((overAllcgpa) => overAllcgpa !== value);
				}
				return [...prevOverAllcgpa, value];
			});
		}
	};

	const optionsRenderer = (head, options) => {
		return (
			<div className="students-filter__item">
				<div className="students-filter__item__label">{head}</div>
				<div className="students-filter__item__values">
					{options.map((option) => (
						<div
							key={option.value}
							id={`${head.toLowerCase()}-${option.value}`}
							className="students-filter__item__value"
							onClick={() => optionClickHandler(head, option.value)}
						>
							{option.label}
						</div>
					))}
				</div>
			</div>
		);
	};

	const roleOptions = [
		{ value: 'student', label: 'Student' },
		{ value: 'placementCoordinator', label: 'PC' },
		{ value: 'admin', label: 'Admin' }
	];

	const verifyOptions = [
		{ value: 'verified', label: 'Verified' },
		{ value: 'unverified', label: 'Unverified' }
	];

	const batchOptions = [
		{ value: 2023, label: '2023' },
		{ value: 2024, label: '2024' },
		{ value: 2025, label: '2025' },
		{ value: 2026, label: '2026' }
	];

	const placedOptions = [
		{ value: 'placed', label: 'Placed' },
		{ value: 'notPlaced', label: 'Not Placed' }
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
		{ label: 'Other', value: 'Other' },
		{ label: 'N/A', value: 'N/A' }
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

	const gapOptions = [
		{ label: '0', value: 0 },
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: 'More than 2', value: 3 }
	];

	const backlogsOptions = [
		{ label: '0', value: 0 },
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: 'More than 2', value: 3 }
	];

	const pgcgpaOptions = [
		{ label: 'Less than 6.5', value: 6.5 },
		{ label: '6.5-7', value: 7 },
		{ label: '7-7.5', value: 7.5 },
		{ label: '7.5-8', value: 8 },
		{ label: 'More than 8', value: 9 }
	];

	const overAllcgpaOptions = [
		{ label: 'Less than 6.5', value: 6.5 },
		{ label: 'More than 6.5', value: 7 },
		{ label: 'More than 7', value: 7.5 },
		{ label: 'More than 7.5', value: 8 },
		{ label: 'More than 8', value: 9 }
	];

	return (
		<div className="students-container">
			<div className="students-left">
				<div className="students-filter">
					<h3>Filters</h3>
					{optionsRenderer('Role', roleOptions)}
					{optionsRenderer('Verification', verifyOptions)}
					{optionsRenderer('Batch', batchOptions)}
					{optionsRenderer('Placement', placedOptions)}
					{optionsRenderer('Location', locationOptions)}
					{optionsRenderer('CTC', ctcOptions)}
					{optionsRenderer('Base', baseOptions)}
					{(user.role === 'admin' || user.role === 'placementCoordinator') && (
						<>
							{optionsRenderer('Gap', gapOptions)}
							{optionsRenderer('Backlogs', backlogsOptions)}
							{optionsRenderer('PG CGPA', pgcgpaOptions)}
							{optionsRenderer('Overall CGPA', overAllcgpaOptions)}
						</>
					)}
				</div>
			</div>
			<div className="students-right">
				<AgGridTable
					rowData={students}
					columnDefinitions={columnDefinitions}
					fetchData={fetchData}
					doesExternalFilterPass={doesExternalFilterPass}
					isExternalFilterPresent={isExternalFilterPresent}
				/>
				{selectedStudent &&
					modelRenderer(
						isModalOpen,
						closeModal,
						onConfirmVerifyStudent,
						`Are you sure you want to ${selectedStudent.isVerified ? 'unverify' : 'verify'} ${selectedStudent.name}?`,
						selectedStudent.isVerified ? 'Unverify' : 'Verify'
					)}
				{selectedStudentDelete &&
					modelRenderer(isModalOpen, closeModal, onConfirmDeleteStudent, `Are you sure you want to delete ${selectedStudentDelete.name}?`, 'Delete')}
			</div>
		</div>
	);
};

export default StudentTable;
