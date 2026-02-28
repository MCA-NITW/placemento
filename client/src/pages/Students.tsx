import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteStudent, getStudents, updateUserRole, updateVerificationStatus } from '../api/studentApi';
import DataTable, { type Column } from '../components/DataTable';
import Modal from '../components/Modal';
import ToastContent from '../components/ToastContent';
import type { ApiError, User } from '../types';
import getUser from '../utils/user';

const badge = (text: string, color: string): React.ReactNode => (
	<span
		style={{
			padding: '2px 8px',
			borderRadius: 12,
			fontSize: '.72rem',
			fontWeight: 600,
			background: color + '22',
			color,
			border: `1px solid ${color}44`
		}}
	>
		{text}
	</span>
);

const Students = () => {
	const [rows, setRows] = useState<User[]>([]);
	const [role, setRole] = useState('');
	const [delId, setDelId] = useState('');
	const [modal, setModal] = useState(false);

	const fetch = useCallback(async () => {
		try {
			const [res, u] = await Promise.all([getStudents(), getUser()]);
			setRows(res.data.users || []);
			setRole(u.role);
		} catch {}
	}, []);

	useEffect(() => {
		fetch();
	}, [fetch]);

	const isAdmin = role === 'admin' || role === 'placementCoordinator';

	const handleVerify = async (id: string) => {
		try {
			await updateVerificationStatus(id);
			toast.success(<ToastContent res="Success" messages={['Toggled']} />);
			fetch();
		} catch (e) {
			toast.error(<ToastContent res="Error" messages={(e as ApiError).response?.data?.errors || ['Failed']} />);
		}
	};
	const handleRole = async (id: string, r: string) => {
		try {
			await updateUserRole(id, r);
			toast.success(<ToastContent res="Success" messages={['Role updated']} />);
			fetch();
		} catch (e) {
			toast.error(<ToastContent res="Error" messages={(e as ApiError).response?.data?.errors || ['Failed']} />);
		}
	};
	const handleDelete = async () => {
		try {
			await deleteStudent(delId);
			toast.success(<ToastContent res="Deleted" messages={['Removed']} />);
			setModal(false);
			fetch();
		} catch (e) {
			toast.error(<ToastContent res="Error" messages={(e as ApiError).response?.data?.errors || ['Failed']} />);
		}
	};

	const cols: Column<User>[] = [
		{ key: 'name', label: 'Name', width: 150 },
		{ key: 'rollNo', label: 'Roll No', width: 110 },
		{ key: 'batch', label: 'Batch', width: 70 },
		{ key: 'pg.cgpa', label: 'PG', width: 60, render: (r) => <>{r.pg?.cgpa || '—'}</> },
		{ key: 'ug.cgpa', label: 'UG', width: 60, render: (r) => <>{r.ug?.cgpa || '—'}</> },
		{ key: 'backlogs', label: 'Backlogs', width: 70 },
		{ key: 'placed', label: 'Placed', width: 70, render: (r) => (r.placed ? badge('Yes', 'var(--success)') : badge('No', 'var(--dim)')) },
		{ key: 'placedAt.companyName', label: 'Company', width: 140, render: (r) => <>{r.placedAt?.companyName || '—'}</> },
		{ key: 'placedAt.ctc', label: 'CTC', width: 70, render: (r) => <>{r.placedAt?.ctc ? r.placedAt.ctc + 'L' : '—'}</> },
		{ key: 'placedAt.profile', label: 'Profile', width: 120, render: (r) => <>{r.placedAt?.profile || '—'}</> },
		{ key: 'placedAt.location', label: 'Location', width: 100, render: (r) => <>{r.placedAt?.location || '—'}</> },
		{ key: 'isVerified', label: 'Verified', width: 80, render: (r) => (r.isVerified ? badge('Yes', 'var(--success)') : badge('No', 'var(--warn)')) },
		...(isAdmin
			? [
					{
						key: '_actions',
						label: 'Actions',
						width: 180,
						sortable: false,
						render: (r: User) => (
							<div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleVerify(r._id);
									}}
									style={{
										padding: '2px 7px',
										background: r.isVerified ? 'var(--warn)' : 'var(--success)',
										color: '#fff',
										border: 'none',
										borderRadius: 4,
										fontSize: '.7rem',
										fontWeight: 600,
										cursor: 'pointer'
									}}
								>
									{r.isVerified ? 'Unverify' : 'Verify'}
								</button>
								{role === 'admin' && (
									<select
										value={r.role}
										onClick={(e) => e.stopPropagation()}
										onChange={(e) => handleRole(r._id, e.target.value)}
										style={{ padding: '2px 3px', background: 'var(--bg3)', color: 'var(--text)', border: 'none', borderRadius: 4, fontSize: '.7rem' }}
									>
										<option value="student">Student</option>
										<option value="placementCoordinator">PC</option>
										<option value="admin">Admin</option>
									</select>
								)}
								<button
									onClick={(e) => {
										e.stopPropagation();
										setDelId(r._id);
										setModal(true);
									}}
									style={{
										padding: '2px 7px',
										background: 'var(--danger)',
										color: '#fff',
										border: 'none',
										borderRadius: 4,
										fontSize: '.7rem',
										fontWeight: 600,
										cursor: 'pointer'
									}}
								>
									Del
								</button>
							</div>
						)
					} satisfies Column<User>
				]
			: [])
	];

	return (
		<div style={{ height: 'calc(100vh - 6rem)', display: 'flex', flexDirection: 'column', animation: 'fadeIn .4s ease' }}>
			<h2 style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '.6rem' }}>Student Directory</h2>
			<div style={{ flex: 1, minHeight: 0 }}>
				<DataTable data={rows} columns={cols} searchKeys={['name', 'rollNo', 'placedAt.companyName']} />
			</div>
			<Modal open={modal} onClose={() => setModal(false)} onConfirm={handleDelete} message="Delete this student?" confirmText="Delete" />
		</div>
	);
};

export default Students;
