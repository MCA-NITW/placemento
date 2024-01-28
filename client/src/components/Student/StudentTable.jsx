import { useCallback, useState } from 'react';
import { GrValidate } from 'react-icons/gr';
import { toast } from 'react-toastify';
import { getStudents, updateUserRole, updateVerificationStatus } from '../../api/studentAPI.jsx';
import getUser from '../../utils/user.js';
import AgGridTable from '../AgGridTable/AgGridTable.jsx';
import Modal from '../Modal/Modal.jsx';
import ToastContent from '../ToastContent/ToastContent.jsx';
import './StudentTable.css';

const StudentTable = () => {
	const [students, setStudents] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const closeModal = () => setIsModalOpen(false);
	const user = getUser();

	const handleVerifyButtonClick = (student) => {
		setIsModalOpen(true);
		setSelectedStudent(student);
	};

	const onConfirmVerifyStudent = async () => {
		try {
			if (user.id === selectedStudent.id && selectedStudent.isVerified) {
				toast.error(<ToastContent res="error" messages={['You cannot Unverify yourself.']} />);
				setIsModalOpen(false);
				return;
			}
			await updateVerificationStatus(selectedStudent.id, !selectedStudent.isVerified);
			toast.success(
				<ToastContent
					res="success"
					messages={[
						`Student ${selectedStudent.name} ${selectedStudent.isVerified ? 'unverified' : 'verified'} successfully.`,
					]}
				/>,
			);
			setIsModalOpen(false);
			fetchData();
		} catch (error) {
			console.error('Error validating student:', error);
		}
	};

	const handleRoleChange = async (event, params) => {
		try {
			if (user.id === params.id) {
				toast.error(<ToastContent res="error" messages={['You cannot change your own role.']} />);
				return;
			}
			await updateUserRole(params.id, event.target.value);
			toast.success(<ToastContent res="success" messages={[`Student ${params.name} role updated successfully.`]} />);
			fetchData();
		} catch (error) {
			console.error('Error updating student role:', error);
		}
	};

	const verifyButtonRenderer = (params) => {
		const onClick = () => handleVerifyButtonClick(params.data);
		return (
			<button className={`verify-button ${params.data.isVerified ? 'verified' : 'unverified'}`} onClick={onClick}>
				<GrValidate />
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

	const fetchData = useCallback(async () => {
		try {
			const response = await getStudents();
			setStudents(response.data.users);
		} catch (error) {
			console.error('Error fetching students:', error);
		}
	}, []);

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

	const actionColumn = (actionName, actionButtonRenderer) => {
		return {
			...generateColumn(null, actionName, 55, false, false),
			pinned: 'left',
			cellRenderer: actionButtonRenderer,
			...(user.role !== 'admin' && user.role !== 'placementCoordinator' && { initialHide: true }),
		};
	};

	const roleDropdownColumn = () => {
		return {
			...generateColumn('role', 'Role', 100),
			pinned: 'left',
			cellRenderer: roleDropdownRenderer,
			...(user.role !== 'admin' && { initialHide: true }),
		};
	};

	const columnDefinitions = [
		generateNestedColumn('Actions', [actionColumn('Ver', verifyButtonRenderer)]),
		roleDropdownColumn(),
		{
			...generateColumn('rollNo', 'Roll No', 100),
			pinned: 'left',
		},
		{
			...generateColumn('name', 'Name', 130),
			pinned: 'left',
		},
		generateColumn('email', 'Email', 250),
		generateColumn('placed', 'Placed?', 80),
		generateNestedColumn('Grades', [
			generateNestedColumn('PG', [generateColumn('pg.cgpa', 'CGPA', 85), generateColumn('pg.percentage', '%', 85)]),
			generateNestedColumn('UG', [generateColumn('ug.cgpa', 'CGPA', 85), generateColumn('ug.percentage', '%', 85)]),
			generateNestedColumn('HSC', [generateColumn('hsc.cgpa', 'CGPA', 85), generateColumn('hsc.percentage', '%', 85)]),
			generateNestedColumn('SSC', [generateColumn('ssc.cgpa', 'CGPA', 85), generateColumn('ssc.percentage', '%', 85)]),
		]),
		generateColumn('totalGapInAcademics', 'Gap', 75),
		generateColumn('backlogs', 'Backlogs', 85),
	];

	const mapStudentData = (student) => {
		return {
			...student,
			id: student._id,
		};
	};

	const rowData = students.map(mapStudentData);

	const modelRenderer = () => {
		return (
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				onConfirm={onConfirmVerifyStudent}
				message={`Are you sure you want to ${selectedStudent.isVerified ? 'unverify' : 'verify'} ${selectedStudent.name}?`}
				buttonTitle={selectedStudent.isVerified ? 'Unverify' : 'Verify'}
			/>
		);
	};

	return (
		<>
			<AgGridTable rowData={rowData} columnDefinitions={columnDefinitions} fetchData={fetchData} />
			{selectedStudent && modelRenderer()}
		</>
	);
};

export default StudentTable;
