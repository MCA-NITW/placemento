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

	const verifyButtonRenderer = (params) => {
		return (
			<button className={`verify-button ${params.data.isVerified ? 'verified' : 'unverified'}`} onClick={() => handleVerifyButtonClick(params.data)}>
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
			<select className="render-dropdown" value={params.data.role} onChange={(event) => handleChange(event, params.data, updateUserRole)}>
				<option value="student">Student</option>
				<option value="placementCoordinator">PC</option>
				<option value="admin">Admin</option>
			</select>
		);
	};

	const companyDropdownRenderer = (params) => {
		return (
			<select
				className="render-dropdown"
				value={params.data.placedAt.companyId}
				onChange={(event) => handleChange(event, params.data, updateStudentCompany)}
			>
				<option value="np">Not Placed</option>
				{companies.map((company) => (
					<option value={company.id} key={company.id}>
						{company.name}
					</option>
				))}
			</select>
		);
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

	const valueToFixed = (params) => params.value.toFixed(2);

	const academicColumn = [
		generateNestedColumn('Grades', [
			generateNestedColumn('PG', [
				generateColumn('pg.cgpa', 'CGPA', 85, null, true, false, valueToFixed),
				generateColumn('pg.percentage', '%', 85, null, true, false, valueToFixed)
			]),
			generateNestedColumn('UG', [
				generateColumn('ug.cgpa', 'CGPA', 85, null, true, false, valueToFixed),
				generateColumn('ug.percentage', '%', 85, null, true, false, valueToFixed)
			]),
			generateNestedColumn('HSC', [
				generateColumn('hsc.cgpa', 'CGPA', 85, null, true, false, valueToFixed),
				generateColumn('hsc.percentage', '%', 85, null, true, false, valueToFixed)
			]),
			generateNestedColumn('SSC', [
				generateColumn('ssc.cgpa', 'CGPA', 85, null, true, false, valueToFixed),
				generateColumn('ssc.percentage', '%', 85, null, true, false, valueToFixed)
			])
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
