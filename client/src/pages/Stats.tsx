import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getCompanyStats, getCtcStats, getStudentStats } from '../api/statsApi';
import type { CompanyStats, CtcStats, StudentStats } from '../types';

const g = 'glass';
const row: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	padding: '.4rem 0',
	borderBottom: '1px solid var(--border)',
	fontSize: '.88rem'
};

const Stats = () => {
	const [ctc, setCtc] = useState<CtcStats | null>(null);
	const [comp, setComp] = useState<CompanyStats | null>(null);
	const [stu, setStu] = useState<StudentStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const [c, co, s] = await Promise.all([getCtcStats(), getCompanyStats(), getStudentStats()]);
				setCtc(c.data);
				setComp(co.data);
				setStu(s.data);
			} catch {
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--dim)' }}>Loading...</div>;
	if (!ctc || !comp || !stu) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--dim)' }}>Sign in to view statistics</div>;

	const pieData = [
		{ name: 'Placed', value: stu.totalPlacedStudents, fill: '#8b5cf6' },
		{ name: 'Unplaced', value: stu.totalEligibleStudents - stu.totalPlacedStudents, fill: '#1c1c3a' }
	];
	const barData = [
		{ name: 'Software', count: comp.totalSoftwareCompanies },
		{ name: 'Analyst', count: comp.totalAnalystCompanies },
		{ name: 'Others', count: comp.totalOthersCompanies }
	];

	return (
		<div style={{ maxWidth: 960, margin: '0 auto', animation: 'fadeIn .4s ease' }}>
			<h2 style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '.8rem' }}>Placement Statistics</h2>

			{/* Summary */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '.6rem', marginBottom: '1.2rem' }}>
				{[
					{ v: stu.placementPercentage + '%', l: 'Placement Rate', c: 'var(--success)' },
					{ v: ctc.highestCTCOffered + 'L', l: 'Highest CTC', c: 'var(--primary)' },
					{ v: Number(ctc.avgCTC).toFixed(1) + 'L', l: 'Average CTC', c: 'var(--accent)' },
					{ v: String(comp.totalCompanies), l: 'Total Companies', c: 'var(--warn)' }
				].map((s) => (
					<div key={s.l} className={g} style={{ padding: '1.2rem' }}>
						<div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.c }}>{s.v}</div>
						<div style={{ fontSize: '.82rem', color: 'var(--dim)', marginTop: 2 }}>{s.l}</div>
					</div>
				))}
			</div>

			{/* Charts */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '.6rem', marginBottom: '1.2rem' }}>
				<div className={g} style={{ padding: '1.2rem' }}>
					<h4 style={{ color: 'var(--text)', fontSize: '.9rem', marginBottom: '.5rem' }}>Placement Distribution</h4>
					<ResponsiveContainer width="100%" height={220}>
						<PieChart>
							<Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
								{pieData.map((e, i) => (
									<Cell key={i} fill={e.fill} />
								))}
							</Pie>
							<Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
						</PieChart>
					</ResponsiveContainer>
					<div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '.8rem' }}>
						<span>
							<span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#8b5cf6', marginRight: 4 }} />
							Placed ({stu.totalPlacedStudents})
						</span>
						<span>
							<span
								style={{
									display: 'inline-block',
									width: 10,
									height: 10,
									borderRadius: 2,
									background: '#1c1c3a',
									border: '1px solid var(--border)',
									marginRight: 4
								}}
							/>
							Unplaced ({stu.totalEligibleStudents - stu.totalPlacedStudents})
						</span>
					</div>
				</div>
				<div className={g} style={{ padding: '1.2rem' }}>
					<h4 style={{ color: 'var(--text)', fontSize: '.9rem', marginBottom: '.5rem' }}>Companies by Category</h4>
					<ResponsiveContainer width="100%" height={220}>
						<BarChart data={barData}>
							<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
							<XAxis dataKey="name" tick={{ fill: 'var(--dim)', fontSize: 12 }} />
							<YAxis tick={{ fill: 'var(--dim)', fontSize: 12 }} />
							<Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
							<Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Detail sections */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '.6rem' }}>
				<div className={g} style={{ padding: '1.2rem' }}>
					<h4 style={{ color: 'var(--primary)', marginBottom: '.6rem', fontSize: '.9rem' }}>CTC Details</h4>
					{[
						['Highest Offered', ctc.highestCTCOffered + 'L'],
						['Company', ctc.highestCTCOfferedCompany],
						['Highest Placed', ctc.highestCTCPlaced + 'L'],
						['Average', Number(ctc.avgCTC).toFixed(2) + 'L']
					].map(([l, v]) => (
						<div key={String(l)} style={row}>
							<span style={{ color: 'var(--dim)' }}>{l}</span>
							<span style={{ fontWeight: 600 }}>{v}</span>
						</div>
					))}
				</div>
				<div className={g} style={{ padding: '1.2rem' }}>
					<h4 style={{ color: 'var(--primary)', marginBottom: '.6rem', fontSize: '.9rem' }}>Company Breakdown</h4>
					{[
						['Total', comp.totalCompanies],
						['Completed', comp.totalCompletedCompanies],
						['PPO', comp.totalPPOs],
						['FTE', comp.totalFTEs],
						['6M+FTE', comp.total6MFTEs],
						['Intern', comp.totalInterns]
					].map(([l, v]) => (
						<div key={String(l)} style={row}>
							<span style={{ color: 'var(--dim)' }}>{l}</span>
							<span style={{ fontWeight: 600 }}>{v}</span>
						</div>
					))}
				</div>
				<div className={g} style={{ padding: '1.2rem' }}>
					<h4 style={{ color: 'var(--primary)', marginBottom: '.6rem', fontSize: '.9rem' }}>Student Overview</h4>
					{[
						['Total', stu.totalStudents],
						['Eligible', stu.totalEligibleStudents],
						['Placed', stu.totalPlacedStudents],
						['Verified', stu.totalVerifiedStudents],
						['Unverified', stu.totalUnverifiedStudents]
					].map(([l, v]) => (
						<div key={String(l)} style={row}>
							<span style={{ color: 'var(--dim)' }}>{l}</span>
							<span style={{ fontWeight: 600 }}>{v}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Stats;
