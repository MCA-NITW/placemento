import { useCallback, useState } from 'react';
import { GrValidate } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { deleteStudent, getStudents, updateUserRole, updateVerificationStatus } from '../../api/studentAPI.jsx';
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
	const user = getUser();

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
			const res = await updateVerificationStatus(selectedStudent.id, !selectedStudent.isVerified);
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
			setSelectedStudentDelete(null);
			setIsModalOpen(false);
			fetchData();
		} catch (error) {
			toast.error(<ToastContent res="error" messages={[error.response.data.message]} />);
		}
	};

	const handleRoleChange = async (event, params) => {
		try {
			const res = await updateUserRole(params.id, event.target.value);
			toast.success(<ToastContent res="success" messages={[res.data.message]} />);
			fetchData();
		} catch (error) {
			toast.error(<ToastContent res="error" messages={[error.response.data.message]} />);
		}
	};

	const verifyButtonRenderer = (params) => {
		return (
			<button
				className={`verify-button ${params.data.isVerified ? 'verified' : 'unverified'}`}
				onClick={() => handleVerifyButtonClick(params.data)}
			>
				<GrValidate />
			</button>
		);
	};

	const deleteButtonRenderer = (params) => {
		return (
			<button className="btn--icon--del" onClick={() => handleDeleteButtonClick(params.data)}>
				<MdDelete />
			</button>
		);
	};

	const roleDropdownRenderer = (params) => {
		return (
			<select
				className="role-dropdown"
				value={params.data.role}
				onChange={(event) => handleRoleChange(event, params.data)}
				disabled={user.id === params.data.id}
			>
				<option value="student">Student</option>
				<option value="placementCoordinator">PC</option>
				<option value="admin">Admin</option>
			</select>
		);
	};

	const modelRenderer = (isModalOpen, closeModal, onConfirm, message, buttonTitle) => {
		return (
			<Modal
				isOpen={isModalOpen}
				onClose={() => closeModal()}
				onConfirm={onConfirm}
				message={message}
				buttonTitle={buttonTitle}
			/>
		);
	};

	const fetchData = useCallback(async () => {
		try {
			const response = await getStudents();
			setStudents(response.data.users);
		} catch (error) {
			console.error('Error fetching students:', error);
		}
	}, []);

	const generateColumn = (
		field,
		headerName,
		width,
		pinned = null,
		sortable = true,
		resizable = true,
		cellRenderer = null
	) => ({
		field,
		headerName,
		width,
		sortable,
		resizable,
		pinned,
		cellRenderer
	});

	const generateNestedColumn = (headerName, children) => ({
		headerName,
		children
	});

	const actionsColumn = generateNestedColumn('Actions', [
		generateColumn(null, 'Delete', 55, 'left', false, false, deleteButtonRenderer),
		generateColumn(null, 'Verify', 55, 'left', false, false, verifyButtonRenderer)
	]);

	const roleColumn = generateColumn(
		'role',
		'Role',
		100,
		'left',
		false,
		false,
		user.role === 'admin' ? roleDropdownRenderer : null
	);

	const academicColumn = [
		generateNestedColumn('Grades', [
			generateNestedColumn('PG', [generateColumn('pg.cgpa', 'CGPA', 85), generateColumn('pg.percentage', '%', 85)]),
			generateNestedColumn('UG', [generateColumn('ug.cgpa', 'CGPA', 85), generateColumn('ug.percentage', '%', 85)]),
			generateNestedColumn('HSC', [generateColumn('hsc.cgpa', 'CGPA', 85), generateColumn('hsc.percentage', '%', 85)]),
			generateNestedColumn('SSC', [generateColumn('ssc.cgpa', 'CGPA', 85), generateColumn('ssc.percentage', '%', 85)])
		]),
		generateColumn('totalGapInAcademics', 'Gap', 75),
		generateColumn('backlogs', 'Backlogs', 85)
	];

	const columnDefinitions = [
		...(user.role === 'admin' || user.role === 'placementCoordinator' ? [actionsColumn] : []),
		...(user.role === 'admin' ? [roleColumn] : []),
		generateColumn('rollNo', 'Roll No', 100, 'left'),
		generateColumn('name', 'Name', 130, 'left'),
		generateColumn('email', 'Email', 250),
		generateColumn('placed', 'Placed?', 80),
		...(user.role === 'admin' || user.role === 'placementCoordinator' ? academicColumn : [])
	];

	const mapStudentData = (student) => {
		return {
			...student,
			id: student._id
		};
	};

	const rowData = students.map(mapStudentData);

	return (
		<>
			<AgGridTable rowData={rowData} columnDefinitions={columnDefinitions} fetchData={fetchData} />
			{selectedStudent &&
				modelRenderer(
					isModalOpen,
					closeModal,
					onConfirmVerifyStudent,
					`Are you sure you want to ${selectedStudent.isVerified ? 'unverify' : 'verify'} ${selectedStudent.name}?`,
					selectedStudent.isVerified ? 'Unverify' : 'Verify'
				)}
			{selectedStudentDelete &&
				modelRenderer(
					isModalOpen,
					closeModal,
					onConfirmDeleteStudent,
					`Are you sure you want to delete ${selectedStudentDelete.name}?`,
					'Delete'
				)}
		</>
	);
};

export default StudentTable;
