import { type FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import type { ApiError, CompanyFormProps } from '../types';
import ToastContent from './ToastContent';

const inp: React.CSSProperties = {
	width: '100%',
	padding: '.55rem',
	background: 'var(--bg1)',
	border: '1px solid transparent',
	borderRadius: 'var(--r1)',
	color: 'var(--text)',
	fontSize: '.85rem',
	outline: 'none'
};
const lbl: React.CSSProperties = { fontSize: '.75rem', fontWeight: 500, color: 'var(--dim)', marginBottom: 2 };

const CompanyForm = ({ actionFunc, handleFormClose, initialData: d, isAdd }: CompanyFormProps) => {
	const [f, setF] = useState({
		name: d?.name || '',
		status: d?.status || 'upcoming',
		profile: d?.profile || '',
		profileCategory: d?.profileCategory || 'Others',
		typeOfOffer: d?.typeOfOffer || 'FTE',
		ctc: d?.ctc || 0,
		base: d?.ctcBreakup?.base || 0,
		bond: d?.bond || 0,
		interviewShortlist: d?.interviewShortlist || 0,
		selected: d?.selected || 0,
		dateOfOffer: d?.dateOfOffer ? new Date(d.dateOfOffer).toISOString().split('T')[0] : '',
		rollNos: d?.selectedStudentsRollNo?.join(', ') || '',
		locations: d?.locations?.join(', ') || '',
		pgC: d?.cutoffs?.pg?.cgpa || 0,
		pgP: d?.cutoffs?.pg?.percentage || 0,
		ugC: d?.cutoffs?.ug?.cgpa || 0,
		ugP: d?.cutoffs?.ug?.percentage || 0,
		twC: d?.cutoffs?.twelth?.cgpa || 0,
		twP: d?.cutoffs?.twelth?.percentage || 0,
		teC: d?.cutoffs?.tenth?.cgpa || 0,
		teP: d?.cutoffs?.tenth?.percentage || 0
	});
	const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		const pc = (c: number, p: number) => ({ cgpa: c <= 10 ? c : 0, percentage: p > 0 ? p : c > 10 ? c : 0 });
		const data: any = {
			name: f.name,
			status: f.status,
			profile: f.profile,
			profileCategory: f.profileCategory,
			typeOfOffer: f.typeOfOffer,
			ctc: Number(f.ctc),
			ctcBreakup: { base: Number(f.base), other: Number(f.ctc) - Number(f.base) },
			bond: Number(f.bond),
			interviewShortlist: Number(f.interviewShortlist),
			selected: Number(f.selected),
			dateOfOffer: f.dateOfOffer || new Date().toISOString(),
			selectedStudentsRollNo: f.rollNos
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean),
			locations: f.locations
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean),
			cutoffs: { pg: pc(f.pgC, f.pgP), ug: pc(f.ugC, f.ugP), twelth: pc(f.twC, f.twP), tenth: pc(f.teC, f.teP) }
		};
		try {
			if (isAdd) await actionFunc(data);
			else await actionFunc(d!._id, data);
			toast.success(<ToastContent res="Success" messages={[`Company ${isAdd ? 'added' : 'updated'}`]} />);
			handleFormClose(true);
		} catch (err) {
			toast.error(<ToastContent res="Error" messages={(err as ApiError).response?.data?.errors || ['Failed']} />);
		}
	};

	const field = (label: string, key: string, type = 'text') => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<label style={lbl}>{label}</label>
			<input style={inp} type={type} value={(f as any)[key]} onChange={(e) => set(key, e.target.value)} />
		</div>
	);
	const sel = (label: string, key: string, opts: string[]) => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<label style={lbl}>{label}</label>
			<select style={inp} value={(f as any)[key]} onChange={(e) => set(key, e.target.value)}>
				{opts.map((o) => (
					<option key={o} value={o}>
						{o}
					</option>
				))}
			</select>
		</div>
	);

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				background: 'rgba(0,0,0,.55)',
				backdropFilter: 'blur(10px)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 100
			}}
			onClick={() => handleFormClose(false)}
		>
			<form
				onSubmit={submit}
				onClick={(e) => e.stopPropagation()}
				style={{
					background: 'var(--bg2)',
					border: '1px solid var(--border)',
					borderRadius: 'var(--r3)',
					padding: '1.5rem',
					width: '100%',
					maxWidth: 540,
					maxHeight: '85vh',
					overflowY: 'auto'
				}}
			>
				<h3 style={{ color: 'var(--primary)', marginBottom: '1rem', textAlign: 'center' }}>{isAdd ? 'Add Company' : 'Edit Company'}</h3>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
					{field('Name', 'name')}
					{sel('Status', 'status', ['upcoming', 'ongoing', 'completed', 'cancelled'])}
					{field('Profile', 'profile')}
					{sel('Category', 'profileCategory', ['Software', 'Analyst', 'Others'])}
					{sel('Offer', 'typeOfOffer', ['PPO', 'FTE', '6M+FTE', 'Intern'])}
					{field('CTC', 'ctc', 'number')}
					{field('Base', 'base', 'number')}
					{field('Bond', 'bond', 'number')}
					{field('Shortlisted', 'interviewShortlist', 'number')}
					{field('Selected', 'selected', 'number')}
					{field('Date', 'dateOfOffer', 'date')}
				</div>
				<div style={{ marginTop: '.65rem', display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
					{field('Roll Nos (comma sep)', 'rollNos')}
					{field('Locations (comma sep)', 'locations')}
					<div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--primary)', marginTop: '.3rem' }}>Cutoffs</div>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '.4rem' }}>
						{field('PG C', 'pgC', 'number')}
						{field('PG %', 'pgP', 'number')}
						{field('UG C', 'ugC', 'number')}
						{field('UG %', 'ugP', 'number')}
						{field('12 C', 'twC', 'number')}
						{field('12 %', 'twP', 'number')}
						{field('10 C', 'teC', 'number')}
						{field('10 %', 'teP', 'number')}
					</div>
				</div>
				<div style={{ display: 'flex', gap: '.6rem', justifyContent: 'flex-end', marginTop: '1.2rem' }}>
					<button
						type="submit"
						style={{
							padding: '.55rem 1.4rem',
							background: 'var(--primary)',
							color: '#fff',
							border: 'none',
							borderRadius: 'var(--r1)',
							fontWeight: 600,
							cursor: 'pointer'
						}}
					>
						{isAdd ? 'Add' : 'Update'}
					</button>
					<button
						type="button"
						onClick={() => handleFormClose(false)}
						style={{
							padding: '.55rem 1.4rem',
							background: 'var(--bg3)',
							color: 'var(--dim)',
							border: 'none',
							borderRadius: 'var(--r1)',
							fontWeight: 600,
							cursor: 'pointer'
						}}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default CompanyForm;
