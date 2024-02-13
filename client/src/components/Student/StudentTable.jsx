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
import StudentFilters from './StudentFilters.jsx';
import './StudentTable.css';

const StudentTable = () => {
	const [students, setStudents] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [companies, setCompanies] = useState([]);
	const [user, setUser] = useState({});
	const [isDelete, setIsDelete] = useState(false);
	const [message, setMessage] = useState('');
	const [buttonTitle, setButtonTitle] = useState('');

	const fetchData = useCallback(async () => {
		try {
			const response = await Promise.all([getStudents(), getCompanies(), getUser()]);
			const studentsResponse = response[0].data.users;
			const companiesResponse = response[1].data;

			studentsResponse.forEach((student) => (student.id = student._id));
			companiesResponse.forEach((company) => (company.id = company._id));

			setUser(response[2]);
			setStudents(studentsResponse);
			setCompanies(companiesResponse);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}, []);

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedStudent(null);
	};

	const handleVerifyButtonClick = (student) => {
		setSelectedStudent(student);
		setMessage(`Are you sure you want to ${student.isVerified ? 'unverify' : 'verify'} ${student.name}?`);
		setButtonTitle(student.isVerified ? 'Unverify' : 'Verify');
		setIsDelete(false);
		setIsModalOpen(true);
	};

	const handleDeleteButtonClick = (student) => {
		setSelectedStudent(student);
		setMessage(`Are you sure you want to delete ${student.name}?`);
		setButtonTitle('Delete');
		setIsDelete(true);
		setIsModalOpen(true);
	};

	const onConfirmClick = async () => {
		try {
			const res = await (isDelete ? deleteStudent(selectedStudent.id) : updateVerificationStatus(selectedStudent.id));
			toast.success(<ToastContent res="success" messages={[res.data.message]} />);
			setIsModalOpen(false);
			setSelectedStudent(null);
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
			if (!node.data) return true;

			const { data } = node;

			const checkIncludes = (value, data) => value.length === 0 || value.includes(data);
			const checkCTC = () => {
				if (ctc.length === 0) return true;
				if (ctc.includes(10)) return data.placedAt.ctc < 10;
				if (ctc.includes(20)) return data.placedAt.ctc >= 10 && data.placedAt.ctc < 20;
				if (ctc.includes(30)) return data.placedAt.ctc >= 20 && data.placedAt.ctc < 30;
				if (ctc.includes(31)) return data.placedAt.ctc >= 30;
			};

			const checkBase = () => {
				if (base.length === 0) return true;
				if (base.includes(5)) return data.placedAt.ctcBase < 5;
				if (base.includes(10)) return data.placedAt.ctcBase >= 5 && data.placedAt.ctcBase < 10;
				if (base.includes(15)) return data.placedAt.ctcBase >= 10 && data.placedAt.ctcBase < 15;
				if (base.includes(16)) return data.placedAt.ctcBase >= 15;
			};

			const checkOverAllCgpa = () => {
				if (overAllcgpa.length === 0) return true;
				if (overAllcgpa.includes(6.5)) return Math.min(data.pg.cgpa, data.ug.cgpa, data.hsc.cgpa, data.ssc.cgpa) < 6.5;
				if (overAllcgpa.includes(7)) return Math.min(data.pg.cgpa, data.ug.cgpa, data.hsc.cgpa, data.ssc.cgpa) >= 6.5;
				if (overAllcgpa.includes(7.5)) return Math.min(data.pg.cgpa, data.ug.cgpa, data.hsc.cgpa, data.ssc.cgpa) >= 7;
				if (overAllcgpa.includes(8)) return Math.min(data.pg.cgpa, data.ug.cgpa, data.hsc.cgpa, data.ssc.cgpa) >= 7.5;
				if (overAllcgpa.includes(9)) return Math.min(data.pg.cgpa, data.ug.cgpa, data.hsc.cgpa, data.ssc.cgpa) >= 8;
			};

			const checkPgCgpa = () => {
				if (pgcgpa.length === 0) return true;
				if (pgcgpa.includes(6.5)) return data.pg.cgpa < 6.5;
				if (pgcgpa.includes(7)) return data.pg.cgpa >= 6.5 && data.pg.cgpa < 7;
				if (pgcgpa.includes(7.5)) return data.pg.cgpa >= 7 && data.pg.cgpa < 7.5;
				if (pgcgpa.includes(8)) return data.pg.cgpa >= 7.5 && data.pg.cgpa < 8;
				if (pgcgpa.includes(9)) return data.pg.cgpa >= 8;
			};

			return (
				checkIncludes(role, data.role) &&
				checkIncludes(verification, data.isVerified ? 'verified' : 'unverified') &&
				checkIncludes(batch, data.batch) &&
				checkIncludes(placement, data.placed ? 'placed' : 'notPlaced') &&
				checkIncludes(location, data.placedAt?.location) &&
				checkCTC() &&
				checkBase() &&
				checkIncludes(gap, data.totalGapInAcademics) &&
				checkIncludes(backlogs, data.backlogs) &&
				checkOverAllCgpa() &&
				checkPgCgpa()
			);
		},
		[role, verification, batch, placement, location, ctc, base, gap, backlogs, pgcgpa, overAllcgpa]
	);

	const optionClickHandler = (head, value) => {
		setIsFiltered(true);
		const element = document.getElementById(`${head.toLowerCase()}-${value}`);
		element.classList.add('active');

		const stateUpdater = {
			Role: setRole,
			Verification: setVerification,
			Batch: setBatch,
			Placement: setPlacement,
			Location: setLocation,
			CTC: setCtc,
			Base: setBase,
			Gap: setGap,
			Backlogs: setBacklogs,
			'PG CGPA': setPgcgpa,
			'Overall CGPA': setOverAllcgpa
		};

		stateUpdater[head]((prevState) => {
			const isValueIncluded = prevState.includes(value);
			if (isValueIncluded) {
				element.classList.remove('active');
				return prevState.filter((option) => option !== value);
			}
			return [...prevState, value];
		});
	};

	return (
		<div className="students-container">
			<div className="students-left">{user.role && <StudentFilters optionClickHandler={optionClickHandler} role={user.role} />}</div>
			<div className="students-right">
				<AgGridTable
					rowData={students}
					columnDefinitions={columnDefinitions}
					fetchData={fetchData}
					doesExternalFilterPass={doesExternalFilterPass}
					isExternalFilterPresent={isExternalFilterPresent}
				/>
				{selectedStudent && (
					<Modal isOpen={isModalOpen} onClose={() => closeModal()} onConfirm={() => onConfirmClick()} message={message} buttonTitle={buttonTitle} />
				)}
			</div>
		</div>
	);
};

export default StudentTable;
