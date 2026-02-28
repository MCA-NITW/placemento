import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaRegComment, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { addComment, addExperience, deleteExperience, getAllExperience, updateExperience } from '../api/experienceApi';
import Modal from '../components/Modal';
import ToastContent from '../components/ToastContent';
import type { ApiError, Experience as Exp, User } from '../types';
import getUser from '../utils/user';

const chip: React.CSSProperties = {
	padding: '3px 10px',
	borderRadius: 20,
	fontSize: '.75rem',
	fontWeight: 500,
	border: '1px solid var(--border)',
	background: 'transparent',
	color: 'var(--dim)',
	cursor: 'pointer',
	transition: 'all .15s'
};
const chipActive: React.CSSProperties = { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' };
const inp: React.CSSProperties = {
	width: '100%',
	padding: '.6rem',
	background: 'var(--bg1)',
	border: '1px solid transparent',
	borderRadius: 'var(--r1)',
	color: 'var(--text)',
	fontSize: '.88rem',
	outline: 'none',
	fontFamily: 'inherit',
	resize: 'vertical' as const
};

const Experience = () => {
	const [exps, setExps] = useState<Exp[]>([]);
	const [user, setUser] = useState<User | null>(null);
	const [tag, setTag] = useState('All');
	const [addOpen, setAddOpen] = useState(false);
	const [viewExp, setViewExp] = useState<Exp | null>(null);
	const [editExp, setEditExp] = useState<Partial<Exp> | null>(null);
	const [delId, setDelId] = useState('');
	const [comment, setComment] = useState('');

	const fetchAll = useCallback(async () => {
		try {
			const [r, u] = await Promise.all([getAllExperience(), getUser()]);
			setExps(r.data.experiences || []);
			setUser(u);
		} catch {}
	}, []);
	useEffect(() => {
		fetchAll();
	}, [fetchAll]);

	const tags = [{ t: 'All', c: exps.length }];
	const m = new Map<string, number>();
	exps.forEach((e) => e.tags.forEach((t) => m.set(t, (m.get(t) || 0) + 1)));
	m.forEach((c, t) => tags.push({ t, c }));

	const filtered = tag === 'All' ? exps : exps.filter((e) => e.tags.includes(tag));
	const diffColor = (d: string) => (d === 'Easy' ? 'var(--success)' : d === 'Hard' ? 'var(--danger)' : 'var(--warn)');

	// Form component for add/edit
	const ExperienceForm = ({ data, isAdd, onClose }: { data: Partial<Exp>; isAdd: boolean; onClose: (f: boolean) => void }) => {
		const [fd, setFd] = useState({
			companyName: data.companyName || '',
			content: data.content || '',
			tags: data.tags?.join(', ') || '',
			rating: data.rating || 5,
			interviewProcess: data.interviewProcess || '',
			tips: data.tips || '',
			difficulty: data.difficulty || 'Medium'
		});
		const [loading, setLoading] = useState(false);
		const s = (k: string, v: any) => setFd((p) => ({ ...p, [k]: v }));
		const submit = async (e: FormEvent) => {
			e.preventDefault();
			setLoading(true);
			try {
				const u = await getUser();
				const body = {
					...fd,
					tags: fd.tags
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean) || ['General'],
					studentDetails: { rollNo: u.rollNo, name: u.name, batch: u.batch }
				};
				if (isAdd) await addExperience(body);
				else await updateExperience(data._id!, body);
				toast.success(<ToastContent res="Success" messages={[`Experience ${isAdd ? 'added' : 'updated'}`]} />);
				onClose(true);
			} catch (err) {
				toast.error(<ToastContent res="Error" messages={(err as ApiError).response?.data?.errors || ['Failed']} />);
			} finally {
				setLoading(false);
			}
		};
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
					zIndex: 110
				}}
			>
				<form
					onSubmit={submit}
					style={{
						background: 'var(--bg2)',
						border: '1px solid var(--border)',
						borderRadius: 'var(--r3)',
						padding: '1.5rem',
						width: '100%',
						maxWidth: 500,
						maxHeight: '85vh',
						overflowY: 'auto'
					}}
				>
					<h3 style={{ color: 'var(--primary)', marginBottom: '1rem', textAlign: 'center' }}>{isAdd ? 'Add Experience' : 'Edit Experience'}</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
						<div>
							<label style={{ fontSize: '.8rem', color: 'var(--dim)' }}>Company *</label>
							<input style={inp} value={fd.companyName} onChange={(e) => s('companyName', e.target.value)} required />
						</div>
						<div>
							<label style={{ fontSize: '.8rem', color: 'var(--dim)' }}>Experience *</label>
							<textarea style={{ ...inp, minHeight: 90 }} value={fd.content} onChange={(e) => s('content', e.target.value)} required />
						</div>
						<div>
							<label style={{ fontSize: '.8rem', color: 'var(--dim)' }}>Tags (comma separated)</label>
							<input style={inp} value={fd.tags} onChange={(e) => s('tags', e.target.value)} />
						</div>
						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem' }}>
							<div>
								<label style={{ fontSize: '.8rem', color: 'var(--dim)' }}>Rating</label>
								<select style={inp} value={fd.rating} onChange={(e) => s('rating', +e.target.value)}>
									{[1, 2, 3, 4, 5].map((n) => (
										<option key={n} value={n}>
											{n}
										</option>
									))}
								</select>
							</div>
							<div>
								<label style={{ fontSize: '.8rem', color: 'var(--dim)' }}>Difficulty</label>
								<select style={inp} value={fd.difficulty} onChange={(e) => s('difficulty', e.target.value)}>
									{['Easy', 'Medium', 'Hard'].map((d) => (
										<option key={d}>{d}</option>
									))}
								</select>
							</div>
						</div>
						<div>
							<label style={{ fontSize: '.8rem', color: 'var(--dim)' }}>Interview Process</label>
							<textarea style={{ ...inp, minHeight: 50 }} value={fd.interviewProcess} onChange={(e) => s('interviewProcess', e.target.value)} />
						</div>
						<div>
							<label style={{ fontSize: '.8rem', color: 'var(--dim)' }}>Tips</label>
							<textarea style={{ ...inp, minHeight: 50 }} value={fd.tips} onChange={(e) => s('tips', e.target.value)} />
						</div>
					</div>
					<div style={{ display: 'flex', gap: '.6rem', justifyContent: 'flex-end', marginTop: '1.2rem' }}>
						<button
							type="submit"
							disabled={loading}
							style={{
								padding: '.55rem 1.3rem',
								background: 'var(--primary)',
								color: '#fff',
								border: 'none',
								borderRadius: 'var(--r1)',
								fontWeight: 600,
								cursor: 'pointer',
								opacity: loading ? 0.6 : 1
							}}
						>
							{loading ? 'Saving...' : isAdd ? 'Add' : 'Update'}
						</button>
						<button
							type="button"
							onClick={() => onClose(false)}
							style={{
								padding: '.55rem 1.3rem',
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

	const onAddComment = async (id: string) => {
		if (!comment.trim()) return;
		try {
			await addComment(id, comment);
			setComment('');
			toast.success(<ToastContent res="Added" messages={['Comment posted']} />);
			setViewExp(null);
			fetchAll();
		} catch (e) {
			toast.error(<ToastContent res="Error" messages={(e as ApiError).response?.data?.errors || ['Failed']} />);
		}
	};
	const onDelete = async () => {
		try {
			await deleteExperience(delId);
			toast.success(<ToastContent res="Deleted" messages={['Removed']} />);
			setDelId('');
			setViewExp(null);
			fetchAll();
		} catch (e) {
			toast.error(<ToastContent res="Error" messages={(e as ApiError).response?.data?.errors || ['Failed']} />);
		}
	};

	return (
		<div style={{ height: 'calc(100vh - 6rem)', display: 'flex', flexDirection: 'column', animation: 'fadeIn .4s ease' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem', flexWrap: 'wrap', gap: '.5rem' }}>
				<h2 style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 700 }}>Interview Experiences</h2>
				{user && (
					<button
						onClick={() => setAddOpen(true)}
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
						+ Add
					</button>
				)}
			</div>
			<div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap', marginBottom: '.6rem' }}>
				{tags.map((t) => (
					<button key={t.t} onClick={() => setTag(t.t)} style={{ ...chip, ...(tag === t.t ? chipActive : {}) }}>
						{t.t} ({t.c})
					</button>
				))}
			</div>
			<div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
				{filtered.length === 0 && <div style={{ textAlign: 'center', color: 'var(--dim)', padding: '2rem' }}>No experiences yet</div>}
				{filtered.map((exp) => (
					<div
						key={exp._id}
						onClick={() => setViewExp(exp)}
						className="glass"
						style={{ padding: '1.1rem', cursor: 'pointer', transition: 'all .15s' }}
						onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
						onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
					>
						<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.35rem' }}>
							<div>
								<span style={{ fontWeight: 600, color: 'var(--primary)' }}>{exp.companyName}</span>
								<span style={{ color: 'var(--dim)', fontSize: '.78rem', marginLeft: '.5rem' }}>
									by {exp.studentDetails.name} ({exp.studentDetails.batch})
								</span>
							</div>
							<span style={{ fontSize: '.72rem', color: 'var(--dim)' }}>{new Date(exp.createdAt).toLocaleDateString()}</span>
						</div>
						<p
							style={{
								color: 'var(--dim)',
								fontSize: '.85rem',
								lineHeight: 1.5,
								marginBottom: '.4rem',
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden'
							}}
						>
							{exp.content}
						</p>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<div style={{ display: 'flex', gap: '.25rem' }}>
								{exp.tags.slice(0, 3).map((t) => (
									<span
										key={t}
										style={{ padding: '1px 6px', borderRadius: 10, fontSize: '.68rem', background: 'var(--primary-glow)', color: 'var(--text)' }}
									>
										#{t}
									</span>
								))}
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.78rem', color: 'var(--dim)' }}>
								<span style={{ color: 'var(--warn)' }}>
									{Array(exp.rating)
										.fill(null)
										.map((_, i) => (
											<FaStar key={i} size={10} />
										))}
								</span>
								<span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
									{exp.Comments.length}
									<FaRegComment size={11} />
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* View modal */}
			{viewExp && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						background: 'rgba(0,0,0,.55)',
						backdropFilter: 'blur(10px)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 90
					}}
				>
					<div
						style={{
							background: 'var(--bg2)',
							border: '1px solid var(--border)',
							borderRadius: 'var(--r3)',
							padding: '1.5rem',
							width: '100%',
							maxWidth: 580,
							maxHeight: '85vh',
							overflowY: 'auto'
						}}
					>
						<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.6rem' }}>
							<div>
								<div style={{ fontWeight: 600 }}>{viewExp.studentDetails.name}</div>
								<div style={{ fontSize: '.78rem', color: 'var(--dim)' }}>
									Batch {viewExp.studentDetails.batch} · {new Date(viewExp.createdAt).toLocaleDateString()}
								</div>
							</div>
							<span
								style={{
									padding: '2px 8px',
									borderRadius: 12,
									fontSize: '.72rem',
									fontWeight: 600,
									background: diffColor(viewExp.difficulty) + '22',
									color: diffColor(viewExp.difficulty)
								}}
							>
								{viewExp.difficulty}
							</span>
						</div>
						<h3 style={{ color: 'var(--primary)', fontSize: '1.15rem', marginBottom: '.6rem' }}>{viewExp.companyName}</h3>
						<div style={{ color: 'var(--text)', lineHeight: 1.6, marginBottom: '.8rem', whiteSpace: 'pre-wrap' }}>{viewExp.content}</div>
						{viewExp.interviewProcess && (
							<div style={{ marginBottom: '.6rem' }}>
								<div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--accent)', marginBottom: 3 }}>Interview Process</div>
								<div style={{ color: 'var(--dim)', fontSize: '.88rem', whiteSpace: 'pre-wrap' }}>{viewExp.interviewProcess}</div>
							</div>
						)}
						{viewExp.tips && (
							<div style={{ marginBottom: '.6rem' }}>
								<div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--accent)', marginBottom: 3 }}>Tips</div>
								<div style={{ color: 'var(--dim)', fontSize: '.88rem', whiteSpace: 'pre-wrap' }}>{viewExp.tips}</div>
							</div>
						)}
						<div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap', marginBottom: '.6rem' }}>
							{viewExp.tags.map((t) => (
								<span
									key={t}
									style={{ padding: '2px 8px', borderRadius: 14, fontSize: '.72rem', background: 'var(--primary-glow)', color: 'var(--text)' }}
								>
									#{t}
								</span>
							))}
						</div>
						<div style={{ fontSize: '.82rem', color: 'var(--warn)', marginBottom: '.8rem' }}>
							{Array(viewExp.rating)
								.fill(null)
								.map((_, i) => (
									<FaStar key={i} size={12} />
								))}
						</div>
						{viewExp.Comments.length > 0 && (
							<div style={{ marginBottom: '.8rem' }}>
								<div style={{ fontSize: '.82rem', fontWeight: 600, marginBottom: '.4rem' }}>Comments</div>
								{viewExp.Comments.map((c, i) => (
									<div
										key={i}
										style={{
											padding: '.35rem .6rem',
											background: 'var(--bg1)',
											borderRadius: 'var(--r1)',
											marginBottom: '.3rem',
											fontSize: '.82rem',
											color: 'var(--dim)'
										}}
									>
										{c}
									</div>
								))}
							</div>
						)}
						<div style={{ display: 'flex', gap: '.4rem', marginBottom: '.8rem' }}>
							<input
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								placeholder="Add a comment..."
								style={{
									flex: 1,
									padding: '.45rem',
									background: 'var(--bg1)',
									border: '1px solid var(--border)',
									borderRadius: 'var(--r1)',
									color: 'var(--text)',
									outline: 'none',
									fontSize: '.85rem'
								}}
							/>
							<button
								onClick={() => onAddComment(viewExp._id)}
								style={{
									padding: '.45rem .8rem',
									background: 'var(--primary)',
									color: '#fff',
									border: 'none',
									borderRadius: 'var(--r1)',
									fontWeight: 600,
									fontSize: '.82rem',
									cursor: 'pointer'
								}}
							>
								Post
							</button>
						</div>
						<div style={{ display: 'flex', gap: '.4rem', justifyContent: 'flex-end' }}>
							{user?.rollNo === viewExp.studentDetails.rollNo && (
								<>
									<button
										onClick={() => {
											setEditExp(viewExp);
											setViewExp(null);
										}}
										style={{
											padding: '.45rem 1rem',
											background: 'var(--primary)',
											color: '#fff',
											border: 'none',
											borderRadius: 'var(--r1)',
											fontWeight: 600,
											fontSize: '.82rem',
											cursor: 'pointer'
										}}
									>
										Edit
									</button>
									<button
										onClick={() => {
											setDelId(viewExp._id);
										}}
										style={{
											padding: '.45rem 1rem',
											background: 'var(--danger)',
											color: '#fff',
											border: 'none',
											borderRadius: 'var(--r1)',
											fontWeight: 600,
											fontSize: '.82rem',
											cursor: 'pointer'
										}}
									>
										Delete
									</button>
								</>
							)}
							<button
								onClick={() => setViewExp(null)}
								style={{
									padding: '.45rem 1rem',
									background: 'var(--bg3)',
									color: 'var(--dim)',
									border: 'none',
									borderRadius: 'var(--r1)',
									fontWeight: 600,
									fontSize: '.82rem',
									cursor: 'pointer'
								}}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{addOpen &&
				ReactDOM.createPortal(
					<ExperienceForm
						data={{}}
						isAdd
						onClose={(f) => {
							setAddOpen(false);
							if (f) fetchAll();
						}}
					/>,
					document.getElementById('modal-root')!
				)}
			{editExp &&
				ReactDOM.createPortal(
					<ExperienceForm
						data={editExp}
						isAdd={false}
						onClose={(f) => {
							setEditExp(null);
							if (f) fetchAll();
						}}
					/>,
					document.getElementById('modal-root')!
				)}
			<Modal open={!!delId} onClose={() => setDelId('')} onConfirm={onDelete} message="Delete this experience?" confirmText="Delete" />
		</div>
	);
};

type FormEvent = React.FormEvent;
export default Experience;
