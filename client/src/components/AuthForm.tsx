import { type FormEvent, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signin, signup } from '../api/authApi';
import type { ApiError } from '../types';
import ForgetPassword from './ForgetPassword';
import ToastContent from './ToastContent';

const inp: React.CSSProperties = {
	width: '100%',
	padding: '.65rem .8rem',
	background: 'var(--bg1)',
	border: '1px solid transparent',
	borderRadius: 'var(--r1)',
	color: 'var(--text)',
	fontSize: '.9rem',
	outline: 'none',
	transition: 'border .2s'
};
const lbl: React.CSSProperties = { fontSize: '.8rem', fontWeight: 500, color: 'var(--dim)', marginBottom: 3 };
const submitBtn: React.CSSProperties = {
	width: '100%',
	padding: '.7rem',
	background: 'var(--primary)',
	color: '#fff',
	border: 'none',
	borderRadius: 'var(--r1)',
	fontWeight: 600,
	fontSize: '1rem',
	cursor: 'pointer',
	transition: 'opacity .2s'
};
const row: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 3 };

const AuthForm = () => {
	const [name, setName] = useState('');
	const [rollNo, setRollNo] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [pgCgpa, setPgCgpa] = useState('0');
	const [pgPct, setPgPct] = useState('0');
	const [ugCgpa, setUgCgpa] = useState('0');
	const [ugPct, setUgPct] = useState('0');
	const [hscCgpa, setHscCgpa] = useState('0');
	const [hscPct, setHscPct] = useState('0');
	const [sscCgpa, setSscCgpa] = useState('0');
	const [sscPct, setSscPct] = useState('0');
	const [gap, setGap] = useState('0');
	const [backlogs, setBacklogs] = useState('0');
	const [step, setStep] = useState(1);
	const [showPw, setShowPw] = useState(false);
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const isSignIn = params.get('mode') === 'signin';

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const fmt = name
			.split(' ')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join(' ');
		const fullEmail = email.trim().toLowerCase() + '@student.nitw.ac.in';
		const user = isSignIn
			? { email: fullEmail, password }
			: {
					name: fmt,
					rollNo,
					email: fullEmail,
					password,
					pg: { cgpa: pgCgpa, percentage: pgPct },
					ug: { cgpa: ugCgpa, percentage: ugPct },
					hsc: { cgpa: hscCgpa, percentage: hscPct },
					ssc: { cgpa: sscCgpa, percentage: sscPct },
					totalGapInAcademics: gap,
					backlogs: Number(backlogs)
				};
		try {
			const res = await (isSignIn ? signin(user as any) : signup(user));
			toast.success(<ToastContent res={isSignIn ? 'Signed In' : 'Signed Up'} messages={res.data.messages || ['Success']} />);
			if (isSignIn) {
				localStorage.setItem('token', res.data.data.token);
				navigate('/');
			} else navigate('/auth?mode=signin');
		} catch (err) {
			toast.error(<ToastContent res="Error" messages={(err as ApiError).response?.data?.errors || ['An error occurred']} />);
		}
	};

	const emailField = (
		<div style={row}>
			<label style={lbl}>Email</label>
			<div style={{ display: 'flex' }}>
				<input
					style={{ ...inp, borderRadius: 'var(--r1) 0 0 var(--r1)' }}
					placeholder="your.id"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
					onBlur={(e) => (e.target.style.borderColor = 'transparent')}
				/>
				<span
					style={{
						padding: '.65rem .7rem',
						background: 'var(--bg3)',
						borderRadius: '0 var(--r1) var(--r1) 0',
						fontSize: '.75rem',
						color: 'var(--dim)',
						whiteSpace: 'nowrap'
					}}
				>
					@student.nitw.ac.in
				</span>
			</div>
		</div>
	);
	const passwordField = (
		<div style={row}>
			<label style={lbl}>Password</label>
			<div style={{ position: 'relative' }}>
				<input
					style={inp}
					type={showPw ? 'text' : 'password'}
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
					onBlur={(e) => (e.target.style.borderColor = 'transparent')}
				/>
				<button
					type="button"
					onClick={() => setShowPw(!showPw)}
					style={{
						position: 'absolute',
						right: 10,
						top: '50%',
						transform: 'translateY(-50%)',
						background: 'none',
						border: 'none',
						color: 'var(--dim)',
						cursor: 'pointer'
					}}
				>
					{showPw ? <FaEyeSlash /> : <FaEye />}
				</button>
			</div>
		</div>
	);
	const acadField = (label: string, cgpa: string, setCgpa: (v: string) => void, pct: string, setPct: (v: string) => void, auto = false) => (
		<div style={row}>
			<label style={lbl}>{label}</label>
			<div style={{ display: 'flex', gap: '.4rem' }}>
				<div style={{ flex: 1, display: 'flex' }}>
					<input
						style={{ ...inp, borderRadius: 'var(--r1) 0 0 var(--r1)' }}
						placeholder="CGPA"
						value={cgpa}
						onChange={(e) => {
							setCgpa(e.target.value);
							if (auto) setPct((Number(e.target.value) * 9.5).toFixed(2));
						}}
					/>
					<span
						style={{
							padding: '.65rem .4rem',
							background: 'var(--bg3)',
							borderRadius: '0 var(--r1) var(--r1) 0',
							fontSize: '.7rem',
							color: 'var(--dim)'
						}}
					>
						CGPA
					</span>
				</div>
				<div style={{ flex: 1, display: 'flex' }}>
					<input
						style={{ ...inp, borderRadius: 'var(--r1) 0 0 var(--r1)' }}
						placeholder="%"
						value={pct}
						onChange={(e) => setPct(e.target.value)}
						disabled={auto}
					/>
					<span
						style={{
							padding: '.65rem .4rem',
							background: 'var(--bg3)',
							borderRadius: '0 var(--r1) var(--r1) 0',
							fontSize: '.7rem',
							color: 'var(--dim)'
						}}
					>
						%
					</span>
				</div>
			</div>
		</div>
	);

	return (
		<div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
			<div className="glass" style={{ padding: '2rem', animation: 'fadeIn .4s ease' }}>
				<h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 700 }}>
					{isSignIn ? 'Sign In' : 'Sign Up'}
				</h2>
				<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
					{isSignIn ? (
						<>
							{emailField}
							{passwordField}
							<button type="submit" style={submitBtn}>
								Sign In
							</button>
							<ForgetPassword />
						</>
					) : step === 1 ? (
						<>
							<p style={{ textAlign: 'center', color: 'var(--dim)', fontSize: '.85rem' }}>Personal Details</p>
							{emailField}
							{passwordField}
							<div style={row}>
								<label style={lbl}>Name</label>
								<input style={inp} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
							</div>
							<div style={row}>
								<label style={lbl}>Roll No</label>
								<input style={inp} placeholder="e.g. 21MCF1R01" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
							</div>
							<button type="button" onClick={() => setStep(2)} style={submitBtn}>
								Next
							</button>
						</>
					) : (
						<>
							<p style={{ textAlign: 'center', color: 'var(--dim)', fontSize: '.85rem' }}>Academic Details</p>
							{acadField('PG', pgCgpa, setPgCgpa, pgPct, setPgPct, true)}
							{acadField('UG', ugCgpa, setUgCgpa, ugPct, setUgPct)}
							{acadField('12th', hscCgpa, setHscCgpa, hscPct, setHscPct)}
							{acadField('10th', sscCgpa, setSscCgpa, sscPct, setSscPct)}
							<div style={{ display: 'flex', gap: '.6rem' }}>
								<div style={{ ...row, flex: 1 }}>
									<label style={lbl}>Gap (Years)</label>
									<input style={inp} type="number" value={gap} onChange={(e) => setGap(e.target.value)} />
								</div>
								<div style={{ ...row, flex: 1 }}>
									<label style={lbl}>Backlogs</label>
									<input style={inp} type="number" value={backlogs} onChange={(e) => setBacklogs(e.target.value)} />
								</div>
							</div>
							<div style={{ display: 'flex', gap: '.6rem' }}>
								<button type="button" onClick={() => setStep(1)} style={{ ...submitBtn, background: 'var(--bg3)', color: 'var(--dim)' }}>
									Back
								</button>
								<button type="submit" style={submitBtn}>
									Sign Up
								</button>
							</div>
						</>
					)}
				</form>
				<div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.85rem', color: 'var(--dim)' }}>
					{isSignIn ? "Don't have an account? " : 'Have an account? '}
					<a href={isSignIn ? '/auth?mode=signup' : '/auth?mode=signin'} style={{ color: 'var(--primary)', fontWeight: 500 }}>
						{isSignIn ? 'Sign Up' : 'Sign In'}
					</a>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
