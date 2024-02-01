import { useCallback, useState } from 'react';
import { GrValidate } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getCompanies } from '../../api/companyApi.jsx';
import { deleteStudent, getStudents, updateStudentCompany, updateUserRole, updateVerificationStatus } from '../../api/studentApi.jsx';
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
	const user = getUser();

	const fetchData = useCallback(async () => {
		try {
			const response = await Promise.all([getStudents(), getCompanies()]);
			const studentsResponse = response[0];
			const companiesResponse = response[1];

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
		const options = companies.map((company) => ({ value: company.id, label: company.name }));
		options.unshift({ value: 'np', label: 'Not Placed' });
		return dropdownRenderer(params, options, updateStudentCompany, params.data.placedAt?.companyId);
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
		generateColumn(null, 'Delete', 55, 'left', false, false, deleteButtonRenderer),
		generateColumn(null, 'Verify', 55, 'left', false, false, verifyButtonRenderer)
	]);

	const gradesColumn = (head, cgpa, percentage) =>
		generateNestedColumn(head, [
			generateColumn(cgpa, 'CGPA', 85, null, true, false, (params) => params.value.toFixed(2)),
			generateColumn(percentage, '%', 85, null, true, false, (params) => params.value.toFixed(2))
		]);

	const academicColumn = [
		generateNestedColumn('Grades', [
			gradesColumn('PG', 'pg.cgpa', 'pg.percentage'),
			gradesColumn('UG', 'ug.cgpa', 'ug.percentage'),
			gradesColumn('12th', 'hsc.cgpa', 'hsc.percentage'),
			gradesColumn('10th', 'ssc.cgpa', 'ssc.percentage')
		]),
		generateColumn('totalGapInAcademics', 'Gap', 75),
		generateColumn('backlogs', 'Backlogs', 85)
	];

	const placementColumn = generateNestedColumn('Placement Details', [
		generateColumn(
			'placedAt.companyName',
			'Company',
			275,
			null,
			true,
			true,
			user.role === 'admin' || user.role === 'placementCoordinator' ? companyDropdownRenderer : null
		),
		generateNestedColumn('CTC (LPA)', [
			generateColumn('placedAt.ctc', 'CTC', 80, null, true, false, (params) => params.value.toFixed(2)),
			generateColumn('placedAt.ctcBase', 'Base', 80, null, true, false, (params) => params.value.toFixed(2))
		]),
		generateColumn('placedAt.location', 'Location', 100, null, true, false)
	]);

	const columnDefinitions = [
		...(user.role === 'admin' || user.role === 'placementCoordinator' ? [actionsColumn] : []),
		generateColumn('role', 'Role', 100, 'left', false, false, user.role === 'admin' ? roleDropdownRenderer : roleFormatter),
		generateColumn('name', 'Name', 130, 'left'),
		generateColumn('rollNo', 'Roll No', 100),
		generateColumn('email', 'Email', 225),
		placementColumn,
		...(user.role === 'admin' || user.role === 'placementCoordinator' ? academicColumn : [])
	];

	return (
		<>
			<AgGridTable rowData={students} columnDefinitions={columnDefinitions} fetchData={fetchData} />
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
		</>
	);
};

export default StudentTable;
