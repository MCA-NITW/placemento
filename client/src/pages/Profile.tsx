import { type FormEvent, useEffect, useState } from 'react';
import { MdOutlineModeEdit } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import { getCompany } from '../api/companyApi';
import { updateStudent } from '../api/studentApi';
import ToastContent from '../components/ToastContent';
import type { ApiError, User } from '../types';
import getUser from '../utils/user';

const g = 'glass';
const inp: React.CSSProperties = {
	padding: '.45rem .6rem',
	background: 'var(--bg1)',
	border: '1px solid transparent',
	borderRadius: 'var(--r1)',
	color: 'var(--text)',
	fontSize: '.88rem',
	outline: 'none',
	width: '100%',
	transition: 'border .2s'
};

const Profile = () => {
	const [user, setUser] = useState<Partial<User>>({});
	const [prev, setPrev] = useState<Partial<User>>({});
	const [editing, setEditing] = useState('');
	const [edited, setEdited] = useState(false);
	const [company, setCompany] = useState<any>(null);

	useEffect(() => {
		(async () => {
			try {
				const u = await getUser();
				setUser(u);
				setPrev(u);
			} catch {}
		})();
	}, []);

	const companyId = user.placed ? user.placedAt?.companyId : undefined;
	useEffect(() => {
		if (!companyId) return;
		(async () => {
			try {
				const r = await getCompany(companyId);
				r.data.locations.unshift('N/A');
				setCompany(r.data);
			} catch {}
		})();
	}, [companyId]);

	const handleChange = (name: string, value: string) => {
		setUser((p) => {
			if (name.includes('.')) {
				const [par, ch] = name.split('.');
				return { ...p, [par]: { ...(p as any)[par], [ch]: value } };
			}
			return { ...p, [name]: value };
		});
		setEdited(true);
	};

	const save = async (e: FormEvent) => {
		e.preventDefault();
		try {
			await updateStudent(user.id!, user as Record<string, unknown>);
			toast.success(<ToastContent res="Saved" messages={['Profile updated']} />);
			setEdited(false);
			setPrev(user);
			setEditing('');
		} catch (err) {
			toast.error(<ToastContent res="Error" messages={[(err as ApiError).response?.data?.message || 'Failed']} />);
		}
	};

	const field = (label: string, name: string, value: unknown, editable = false) => (
		<div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.4rem' }}>
			<div style={{ minWidth: 65, fontSize: '.8rem', fontWeight: 500, color: 'var(--dim)' }}>{label}</div>
			<input
				style={{ ...inp, opacity: editable && editing === name ? 1 : 0.65 }}
				value={String(value ?? '')}
				onChange={(e) => handleChange(name, e.target.value)}
				disabled={editing !== name || !editable}
				onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
				onBlur={(e) => (e.target.style.borderColor = 'transparent')}
			/>
			{editable && (
				<button
					onClick={() => setEditing(editing === name ? '' : name)}
					style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}
				>
					{editing === name ? <RxCross1 /> : <MdOutlineModeEdit />}
				</button>
			)}
		</div>
	);

	if (!user.name) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--dim)' }}>Loading...</div>;

	return (
		<div style={{ maxWidth: 580, margin: '0 auto', animation: 'fadeIn .4s ease' }}>
			<h2 style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '.8rem' }}>My Profile</h2>
			<div className={g} style={{ padding: '1.3rem', marginBottom: '.75rem' }}>
				<h4 style={{ color: 'var(--primary)', marginBottom: '.6rem', fontSize: '.9rem' }}>Personal</h4>
				{field('Name', 'name', user.name)}
				{field('Email', 'email', user.email)}
				{field('Roll No', 'rollNo', user.rollNo)}
				{field('Role', 'role', user.role === 'placementCoordinator' ? 'Placement Coordinator' : user.role)}
			</div>
			{user.placed && (
				<div className={g} style={{ padding: '1.3rem', marginBottom: '.75rem' }}>
					<h4 style={{ color: 'var(--primary)', marginBottom: '.6rem', fontSize: '.9rem' }}>Company</h4>
					{field('Company', 'company', user.placedAt?.companyName)}
					{field('CTC', 'ctc', user.placedAt?.ctc)}
					{field('Base', 'base', user.placedAt?.ctcBase)}
					{field('Profile', 'profile', user.placedAt?.profile)}
					{field('Offer', 'offer', user.placedAt?.offer)}
					<div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.4rem' }}>
						<div style={{ minWidth: 65, fontSize: '.8rem', fontWeight: 500, color: 'var(--dim)' }}>Location</div>
						<select
							style={inp}
							value={user.placedAt?.location || ''}
							disabled={editing !== 'location'}
							onChange={(e) => handleChange('placedAt.location', e.target.value)}
						>
							{(company?.locations || []).map((l: string) => (
								<option key={l} value={l}>
									{l}
								</option>
							))}
						</select>
						<button
							onClick={() => setEditing(editing === 'location' ? '' : 'location')}
							style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}
						>
							{editing === 'location' ? <RxCross1 /> : <MdOutlineModeEdit />}
						</button>
					</div>
				</div>
			)}
			<div className={g} style={{ padding: '1.3rem', marginBottom: '.75rem' }}>
				<h4 style={{ color: 'var(--primary)', marginBottom: '.6rem', fontSize: '.9rem' }}>Academic</h4>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 .8rem' }}>
					{field('PG CGPA', 'pg.cgpa', user.pg?.cgpa, true)}
					{field('PG %', 'pg.percentage', user.pg?.percentage, true)}
					{field('UG CGPA', 'ug.cgpa', user.ug?.cgpa, true)}
					{field('UG %', 'ug.percentage', user.ug?.percentage, true)}
					{field('12th C', 'hsc.cgpa', user.hsc?.cgpa, true)}
					{field('12th %', 'hsc.percentage', user.hsc?.percentage, true)}
					{field('10th C', 'ssc.cgpa', user.ssc?.cgpa, true)}
					{field('10th %', 'ssc.percentage', user.ssc?.percentage, true)}
				</div>
				{field('Backlogs', 'backlogs', user.backlogs, true)}
				{field('Gap', 'totalGapInAcademics', user.totalGapInAcademics, true)}
			</div>
			{edited && (
				<div style={{ display: 'flex', gap: '.6rem' }}>
					<button
						onClick={save}
						style={{
							flex: 1,
							padding: '.65rem',
							background: 'var(--primary)',
							color: '#fff',
							border: 'none',
							borderRadius: 'var(--r1)',
							fontWeight: 600,
							cursor: 'pointer'
						}}
					>
						Save
					</button>
					<button
						onClick={() => {
							setUser(prev);
							setEdited(false);
							setEditing('');
						}}
						style={{
							flex: 1,
							padding: '.65rem',
							background: 'var(--bg3)',
							color: 'var(--dim)',
							border: 'none',
							borderRadius: 'var(--r1)',
							fontWeight: 600,
							cursor: 'pointer'
						}}
					>
						Discard
					</button>
				</div>
			)}
		</div>
	);
};

export default Profile;
