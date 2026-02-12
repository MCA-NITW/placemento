import { useCallback, useState } from 'react';
import { GrValidate } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getCompanies } from '../../api/companyApi';
import {
	deleteStudent,
	getStudents,
	updateStudentCompany,
	updateStudentCompanyLocation,
	updateUserRole,
	updateVerificationStatus
} from '../../api/studentApi';
import type { ApiError, Company, SelectOption, User } from '../../types';
import getUser from '../../utils/user';
import AgGridTable from '../AgGridTable/AgGridTable';
import Modal from '../Modal/Modal';
import Structure from '../Structure/Structure';
import ToastContent from '../ToastContent/ToastContent';
import StudentFilters from './StudentFilters';
import './StudentTable.css';

const StudentTable = () => {
	const [students, setStudents] = useState<any[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<any>(null);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [user, setUser] = useState<Partial<User>>({});
	const [isDelete, setIsDelete] = useState(false);
	const [message, setMessage] = useState('');
	const [buttonTitle, setButtonTitle] = useState('');
	const [pendingAction, setPendingAction] = useState<(() => Promise<any>) | null>(null);

	const fetchData = useCallback(async () => {
		try {
			const response = await Promise.all([getStudents(), getCompanies(), getUser()]);
			const studentsResponse = response[0].data.users;
			const companiesResponse = response[1].data;

			studentsResponse.forEach((student: any) => (student.id = student._id));
			companiesResponse.forEach((company: any) => (company.id = company._id));

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

	const handleVerifyButtonClick = (student: any) => {
		setSelectedStudent(student);
		setMessage(`Are you sure you want to ${student.isVerified ? 'unverify' : 'verify'} ${student.name}?`);
		setButtonTitle(student.isVerified ? 'Unverify' : 'Verify');
		setIsDelete(false);
		setIsModalOpen(true);
	};

	const handleDeleteButtonClick = (student: any) => {
		setSelectedStudent(student);
		setMessage(`Are you sure you want to delete ${student.name}?`);
		setButtonTitle('Delete');
		setIsDelete(true);
		setIsModalOpen(true);
	};

	const onConfirmClick = async () => {
		try {
			let res;
			if (pendingAction) {
				res = await pendingAction();
				setPendingAction(null);
			} else if (isDelete) {
				res = await deleteStudent(selectedStudent.id);
			} else {
				res = await updateVerificationStatus(selectedStudent.id);
			}
			toast.success(<ToastContent res="success" messages={[res.data.message]} />);
			setIsModalOpen(false);
			setSelectedStudent(null);
			fetchData();
		} catch (err) {
			const error = err as ApiError;
			toast.error(<ToastContent res="error" messages={[error.response?.data?.message || 'An error occurred']} />);
		}
	};

	const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>, params: any, updateAction: (id: string, value: string) => Promise<any>) => {
		try {
			const res = await updateAction(params.id, event.target.value);
			toast.success(<ToastContent res="success" messages={[res.data.message]} />);
			fetchData();
		} catch (err) {
			const error = err as ApiError;
			toast.error(<ToastContent res="error" messages={[error.response?.data?.message || 'An error occurred']} />);
		}
	};

	const buttonRenderer = (params: any, action: (data: any) => void, icon: React.ReactNode, className: string) => {
		return (
			<button className={className} onClick={() => action(params.data)}>
				{icon}
			</button>
		);
	};

	const verifyButtonRenderer = (params: any) => {
		return buttonRenderer(params, handleVerifyButtonClick, <GrValidate />, `verify-button ${params.data.isVerified ? 'verified' : 'unverified'}`);
	};

	const deleteButtonRenderer = (params: any) => {
		return buttonRenderer(params, handleDeleteButtonClick, <MdDelete />, 'btn--icon--del');
	};

	const dropdownRenderer = (params: any, options: SelectOption[], updateAction: (id: string, value: string) => Promise<any>, value: string) => {
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

	const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>, student: any) => {
		const newRole = event.target.value;
		if (newRole === student.role) return;
		const roleLabels: Record<string, string> = { student: 'Student', placementCoordinator: 'Placement Coordinator', admin: 'Admin' };
		setSelectedStudent(student);
		setMessage(`Are you sure you want to change ${student.name}'s role to ${roleLabels[newRole]}?`);
		setButtonTitle('Change Role');
		setIsDelete(false);
		setPendingAction(() => () => updateUserRole(student.id, newRole));
		setIsModalOpen(true);
	};

	const roleDropdownRenderer = (params: any) => {
		const options: SelectOption[] = [
			{ value: 'student', label: 'Student' },
			{ value: 'placementCoordinator', label: 'PC' },
			{ value: 'admin', label: 'Admin' }
		];
		return (
			<select className="render-dropdown" value={params.data.role} onChange={(event) => handleRoleChange(event, params.data)}>
				{options.map((option) => (
					<option value={option.value} key={option.value}>
						{option.label}
					</option>
				))}
			</select>
		);
	};

	const companyDropdownRenderer = (params: any) => {
		const options: SelectOption[] = companies.map((company) => ({
			value: company.id,
			label: company.name
		}));
		options.unshift({ value: 'np', label: 'Not Placed' });
		return dropdownRenderer(params, options, updateStudentCompany, params.data.placedAt?.companyId);
	};

	const locationDropdownRenderer = (params: any) => {
		const company = companies.find((company) => company.id === params.data.placedAt?.companyId);
		if (!company) return 'N/A';
		const options: SelectOption[] = company.locations.map((location) => ({
			value: location,
			label: location
		}));
		options.unshift({ value: 'N/A', label: 'N/A' });
		return dropdownRenderer(params, options, updateStudentCompanyLocation, params.data.placedAt?.location);
	};

	const generateColumn = (field: string | null, headerName: string, width: number, pinned: string | null = null, sortable = true, resizable = true, cellRenderer: any = null) => ({
		field,
		headerName,
		width,
		pinned,
		sortable,
		resizable,
		cellRenderer
	});

	const generateNestedColumn = (headerName: string, children: any[]) => ({
		headerName,
		children
	});

	const roleFormatter = (params: any) => {
		if (params.value === 'student') return 'Student';
		else if (params.value === 'placementCoordinator') return 'PC';
		else return 'Admin';
	};

	const actionsColumn = generateNestedColumn('Actions', [
		generateColumn(null, 'Del', 45, 'left', false, false, deleteButtonRenderer),
		generateColumn(null, 'Ver', 45, 'left', false, false, verifyButtonRenderer)
	]);

	const gradesColumn = (head: string, cgpa: string, percentage: string) =>
		generateNestedColumn(head, [
			generateColumn(cgpa, 'CGPA', 75, null, true, false, (params: any) => params.value.toFixed(2)),
			generateColumn(percentage, '%', 75, null, true, false, (params: any) => params.value.toFixed(2))
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
			generateColumn('placedAt.ctc', 'CTC', 70, null, true, false, (params: any) => params.value.toFixed(2)),
			generateColumn('placedAt.ctcBase', 'Base', 70, null, true, false, (params: any) => params.value.toFixed(2))
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
	const [role, setRole] = useState<(string | number)[]>([]);
	const [verification, setVerification] = useState<(string | number)[]>([]);
	const [batch, setBatch] = useState<(string | number)[]>([]);
	const [placement, setPlacement] = useState<(string | number)[]>([]);
	const [location, setLocation] = useState<(string | number)[]>([]);
	const [ctc, setCtc] = useState<(string | number)[]>([]);
	const [base, setBase] = useState<(string | number)[]>([]);
	const [gap, setGap] = useState<(string | number)[]>([]);
	const [backlogs, setBacklogs] = useState<(string | number)[]>([]);
	const [pgcgpa, setPgcgpa] = useState<(string | number)[]>([]);
	const [overAllcgpa, setOverAllcgpa] = useState<(string | number)[]>([]);

	const isExternalFilterPresent = useCallback(() => {
		return isFiltered;
	}, [isFiltered]);

	const checkCTC = useCallback(
		(data: any) => {
			if (ctc.length === 0) return true;
			const ctcValue = data.placedAt.ctc;
			if (ctc.includes(10)) return ctcValue < 10;
			if (ctc.includes(20)) return ctcValue >= 10 && ctcValue < 20;
			if (ctc.includes(30)) return ctcValue >= 20 && ctcValue < 30;
			if (ctc.includes(31)) return ctcValue >= 30;
		},
		[ctc]
	);

	const checkBase = useCallback(
		(data: any) => {
			if (base.length === 0) return true;
			const baseValue = data.placedAt.ctcBase;
			if (base.includes(5)) return baseValue < 5;
			if (base.includes(10)) return baseValue >= 5 && baseValue < 10;
			if (base.includes(15)) return baseValue >= 10 && baseValue < 15;
			if (base.includes(16)) return baseValue >= 15;
		},
		[base]
	);

	const checkOverAllCgpa = useCallback(
		(data: any) => {
			if (overAllcgpa.length === 0) return true;
			const minCgpa = Math.min(data.pg.cgpa, data.ug.cgpa, data.hsc.cgpa, data.ssc.cgpa);
			if (overAllcgpa.includes(6.5)) return minCgpa < 6.5;
			if (overAllcgpa.includes(7)) return minCgpa >= 6.5 && minCgpa < 7;
			if (overAllcgpa.includes(7.5)) return minCgpa >= 7 && minCgpa < 7.5;
			if (overAllcgpa.includes(8)) return minCgpa >= 7.5 && minCgpa < 8;
			if (overAllcgpa.includes(9)) return minCgpa >= 8;
		},
		[overAllcgpa]
	);

	const checkPgCgpa = useCallback(
		(data: any) => {
			if (pgcgpa.length === 0) return true;
			const pgCgpaValue = data.pg.cgpa;
			if (pgcgpa.includes(6.5)) return pgCgpaValue < 6.5;
			if (pgcgpa.includes(7)) return pgCgpaValue >= 6.5 && pgCgpaValue < 7;
			if (pgcgpa.includes(7.5)) return pgCgpaValue >= 7 && pgCgpaValue < 7.5;
			if (pgcgpa.includes(8)) return pgCgpaValue >= 7.5 && pgCgpaValue < 8;
			if (pgcgpa.includes(9)) return pgCgpaValue >= 8;
		},
		[pgcgpa]
	);

	const doesExternalFilterPass = useCallback(
		(node: any) => {
			if (!node.data) return true;

			const { data } = node;

			const checkIncludes = (value: (string | number)[], data: string | number) => value.length === 0 || value.includes(data);

			return (
				checkIncludes(role, data.role) &&
				checkIncludes(verification, data.isVerified ? 'verified' : 'unverified') &&
				checkIncludes(batch, data.batch) &&
				checkIncludes(placement, data.placed ? 'placed' : 'notPlaced') &&
				checkIncludes(location, data.placedAt?.location) &&
				checkCTC(data) &&
				checkBase(data) &&
				checkIncludes(gap, data.totalGapInAcademics) &&
				checkIncludes(backlogs, data.backlogs) &&
				checkOverAllCgpa(data) &&
				checkPgCgpa(data)
			);
		},
		[role, verification, batch, placement, location, gap, backlogs, checkCTC, checkBase, checkOverAllCgpa, checkPgCgpa]
	);

	const optionClickHandler = (head: string, value: string | number) => {
		setIsFiltered(true);
		const element = document.getElementById(`${head.toLowerCase()}-${value}`);
		element?.classList.add('active');

		const stateUpdater: Record<string, React.Dispatch<React.SetStateAction<(string | number)[]>>> = {
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
				element?.classList.remove('active');
				return prevState.filter((option) => option !== value);
			}
			return [...prevState, value];
		});
	};

	return (
		<Structure
			LeftComponent={user.role && <StudentFilters optionClickHandler={optionClickHandler} role={user.role} />}
			RightComponent={
				<AgGridTable
					rowData={students}
					columnDefinitions={columnDefinitions}
					fetchData={fetchData}
					doesExternalFilterPass={doesExternalFilterPass}
					isExternalFilterPresent={isExternalFilterPresent}
				/>
			}
			ContainerComponent={
				selectedStudent && (
					<Modal isOpen={isModalOpen} onClose={() => closeModal()} onConfirm={() => onConfirmClick()} message={message} buttonTitle={buttonTitle} />
				)
			}
		/>
	);
};

export default StudentTable;
