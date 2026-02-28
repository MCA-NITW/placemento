import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import { addCompany, deleteCompany, getCompanies, updateCompany } from '../api/companyApi';
import CompanyForm from '../components/CompanyForm';
import DataTable, { type Column } from '../components/DataTable';
import Modal from '../components/Modal';
import ToastContent from '../components/ToastContent';
import type { ApiError, Company } from '../types';
import getUser from '../utils/user';

const badge = (t: string, c: string) => (
	<span
		style={{ padding: '2px 8px', borderRadius: 12, fontSize: '.72rem', fontWeight: 600, background: c + '22', color: c, border: `1px solid ${c}44` }}
	>
		{t}
	</span>
);
const statusColor: Record<string, string> = {
	completed: 'var(--success)',
	ongoing: 'var(--accent)',
	upcoming: 'var(--warn)',
	cancelled: 'var(--danger)'
};

const Companies = () => {
	const [rows, setRows] = useState<Company[]>([]);
	const [role, setRole] = useState('');
	const [formOpen, setFormOpen] = useState(false);
	const [editData, setEditData] = useState<Company | null>(null);
	const [isAdd, setIsAdd] = useState(true);
	const [delId, setDelId] = useState('');
	const [modal, setModal] = useState(false);

	const fetch = useCallback(async () => {
		try {
			const [res, u] = await Promise.all([getCompanies(), getUser()]);
			setRows(res.data.companies || []);
			setRole(u.role);
		} catch {}
	}, []);

	useEffect(() => {
		fetch();
	}, [fetch]);

	const isAdmin = role === 'admin' || role === 'placementCoordinator';

	const handleDelete = async () => {
		try {
			await deleteCompany(delId);
			toast.success(<ToastContent res="Deleted" messages={['Company removed']} />);
			setModal(false);
			fetch();
		} catch (e) {
			toast.error(<ToastContent res="Error" messages={(e as ApiError).response?.data?.errors || ['Failed']} />);
		}
	};

	const cols: Column<Company>[] = [
		{ key: 'name', label: 'Company', width: 170 },
		{ key: 'status', label: 'Status', width: 90, render: (r) => badge(r.status, statusColor[r.status] || 'var(--dim)') },
		{ key: 'profile', label: 'Profile', width: 150 },
		{
			key: 'profileCategory',
			label: 'Category',
			width: 90,
			render: (r) =>
				badge(r.profileCategory, r.profileCategory === 'Software' ? 'var(--accent)' : r.profileCategory === 'Analyst' ? 'var(--warn)' : 'var(--dim)')
		},
		{ key: 'ctc', label: 'CTC', width: 70, render: (r) => <>{r.ctc ? r.ctc + 'L' : '—'}</> },
		{ key: 'ctcBreakup.base', label: 'Base', width: 70, render: (r) => <>{r.ctcBreakup?.base ? r.ctcBreakup.base + 'L' : '—'}</> },
		{ key: 'typeOfOffer', label: 'Offer', width: 80 },
		{ key: 'interviewShortlist', label: 'Shortlisted', width: 85 },
		{ key: 'selected', label: 'Selected', width: 75 },
		{ key: 'locations', label: 'Locations', width: 140, render: (r) => <>{r.locations?.join(', ') || '—'}</> },
		{ key: 'dateOfOffer', label: 'Date', width: 95, render: (r) => <>{r.dateOfOffer ? new Date(r.dateOfOffer).toLocaleDateString() : '—'}</> },
		...(isAdmin
			? [
					{
						key: '_actions',
						label: 'Actions',
						width: 120,
						sortable: false,
						render: (r: Company) => (
							<div style={{ display: 'flex', gap: 4 }}>
								<button
									onClick={(e) => {
										e.stopPropagation();
										setEditData(r);
										setIsAdd(false);
										setFormOpen(true);
									}}
									style={{
										padding: '2px 8px',
										background: 'var(--primary)',
										color: '#fff',
										border: 'none',
										borderRadius: 4,
										fontSize: '.7rem',
										fontWeight: 600,
										cursor: 'pointer'
									}}
								>
									Edit
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										setDelId(r._id);
										setModal(true);
									}}
									style={{
										padding: '2px 8px',
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
					} satisfies Column<Company>
				]
			: [])
	];

	return (
		<div style={{ height: 'calc(100vh - 6rem)', display: 'flex', flexDirection: 'column', animation: 'fadeIn .4s ease' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
				<h2 style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 700 }}>Company Directory</h2>
				{isAdmin && (
					<button
						onClick={() => {
							setIsAdd(true);
							setEditData(null);
							setFormOpen(true);
						}}
						style={{
							padding: '.4rem 1rem',
							background: 'var(--primary)',
							color: '#fff',
							border: 'none',
							borderRadius: 'var(--r1)',
							fontWeight: 600,
							fontSize: '.82rem',
							cursor: 'pointer'
						}}
					>
						+ Add Company
					</button>
				)}
			</div>
			<div style={{ flex: 1, minHeight: 0 }}>
				<DataTable data={rows} columns={cols} searchKeys={['name', 'profile', 'locations']} />
			</div>
			{formOpen &&
				ReactDOM.createPortal(
					<CompanyForm
						actionFunc={isAdd ? addCompany : updateCompany}
						handleFormClose={(f) => {
							setFormOpen(false);
							if (f) fetch();
						}}
						initialData={editData}
						isAdd={isAdd}
					/>,
					document.getElementById('modal-root')!
				)}
			<Modal open={modal} onClose={() => setModal(false)} onConfirm={handleDelete} message="Delete this company?" confirmText="Delete" />
		</div>
	);
};

export default Companies;
