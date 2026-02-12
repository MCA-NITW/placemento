import { AgCharts } from 'ag-charts-react';
import { useCallback, useEffect, useState } from 'react';
import { getCompanyStats, getCtcStats, getStudentStats } from '../../api/statsApi';
import type { CompanyStats, CtcStats, StatsSectionItemProps, StatsCardProps, StudentStats } from '../../types';
import './Stats.css';

const StatsSectionItem = ({ left, right, icon }: StatsSectionItemProps) => (
	<div className="stats-section-item">
		<div className="stats-section-item-left">
			{icon && <span className="stats-icon">{icon}</span>}
			{left}
		</div>
		<div className="stats-section-item-right">{right}</div>
	</div>
);

const StatsCard = ({ title, value, subtitle, icon, trend, color = 'primary' }: StatsCardProps) => (
	<div className={`stats-card stats-card-${color}`}>
		<div className="stats-card-icon">{icon}</div>
		<div className="stats-card-content">
			<h3 className="stats-card-value">{value}</h3>
			<p className="stats-card-title">{title}</p>
			{subtitle && <span className="stats-card-subtitle">{subtitle}</span>}
			{trend && (
				<div className={`stats-card-trend ${trend > 0 ? 'positive' : 'negative'}`}>
					{trend > 0 ? '\u2197' : '\u2198'} {Math.abs(trend)}%
				</div>
			)}
		</div>
	</div>
);

const Stats = () => {
	const [ctcStats, setCtcStats] = useState<Partial<CtcStats>>({});
	const [companyStats, setCompanyStats] = useState<Partial<CompanyStats>>({});
	const [studentStats, setStudentStats] = useState<Partial<StudentStats>>({});
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = useCallback(async () => {
		try {
			const [ctcResponse, companyResponse, studentResponse] = await Promise.all([getCtcStats(), getCompanyStats(), getStudentStats()]);

			const ctcData = ctcResponse.data;
			ctcData.highestCTCOffered = ctcData.highestCTCOffered.toFixed(2);
			ctcData.highestCTCPlaced = ctcData.highestCTCPlaced.toFixed(2);
			ctcData.avgCTC = ctcData.avgCTC.toFixed(2);
			ctcData.totalPlacedStudentsCTC = ctcData.totalPlacedStudentsCTC.toFixed(2);

			const studentData = studentResponse.data;
			studentData.placementPercentage = ((studentData.totalPlacedStudents * 100) / studentData.totalEligibleStudents).toFixed(2);

			setCtcStats(ctcData);
			setCompanyStats(companyResponse.data);
			setStudentStats(studentData);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const placementPieChartOptions = {
		data: [
			{ category: 'Placed Students', value: parseInt(String(studentStats.totalPlacedStudents)) || 0 },
			{
				category: 'Unplaced Students',
				value: (parseInt(String(studentStats.totalEligibleStudents)) || 0) - (parseInt(String(studentStats.totalPlacedStudents)) || 0)
			}
		],
		series: [
			{
				type: 'pie' as const,
				angleKey: 'value',
				labelKey: 'category',
				fills: ['#7c3aed', '#06b6d4'],
				strokes: ['#7c3aed', '#06b6d4'],
				calloutColors: ['#7c3aed', '#06b6d4'],
				sectorLabelKey: 'value',
				calloutLabelKey: 'category'
			}
		],
		background: { fill: 'transparent' },
		title: { text: 'Student Placement Overview', color: '#7c3aed', fontSize: 18, fontWeight: 'bold' as const },
		legend: { position: 'bottom' as const, item: { label: { color: '#fff' } } }
	};

	const companyTypeBarChartOptions = {
		data: [
			{ type: 'Software', count: parseInt(String(companyStats.totalSoftwareCompanies)) || 0 },
			{ type: 'Analyst', count: parseInt(String(companyStats.totalAnalystCompanies)) || 0 },
			{ type: 'Others', count: parseInt(String(companyStats.totalOthersCompanies)) || 0 }
		],
		series: [{ type: 'bar' as const, xKey: 'type', yKey: 'count', fill: '#7c3aed', stroke: '#7c3aed' }],
		axes: [
			{ type: 'category' as const, position: 'bottom' as const, label: { color: '#fff' }, line: { color: 'rgba(124, 58, 237, 0.5)' } },
			{ type: 'number' as const, position: 'left' as const, label: { color: '#fff' }, line: { color: 'rgba(124, 58, 237, 0.5)' } }
		],
		background: { fill: 'transparent' },
		title: { text: 'Company Types Distribution', color: '#7c3aed', fontSize: 18, fontWeight: 'bold' as const }
	};

	const ctcLineChartOptions = {
		data: [
			{ metric: 'Highest CTC Offered', value: parseFloat(String(ctcStats.highestCTCOffered)) || 0 },
			{ metric: 'Highest CTC Placed', value: parseFloat(String(ctcStats.highestCTCPlaced)) || 0 },
			{ metric: 'Average CTC', value: parseFloat(String(ctcStats.avgCTC)) || 0 },
			{ metric: 'Total Placed CTC', value: parseFloat(String(ctcStats.totalPlacedStudentsCTC)) || 0 }
		],
		series: [
			{
				type: 'line' as const,
				xKey: 'metric',
				yKey: 'value',
				stroke: '#7c3aed',
				marker: { fill: '#7c3aed', stroke: '#7c3aed', size: 8 }
			}
		],
		axes: [
			{ type: 'category' as const, position: 'bottom' as const, label: { color: '#fff', rotation: -45 }, line: { color: 'rgba(124, 58, 237, 0.5)' } },
			{
				type: 'number' as const,
				position: 'left' as const,
				label: { color: '#fff', formatter: ({ value }: { value: number }) => `\u20B9${value}L` },
				line: { color: 'rgba(124, 58, 237, 0.5)' }
			}
		],
		background: { fill: 'transparent' },
		title: { text: 'CTC Statistics Overview', color: '#7c3aed', fontSize: 18, fontWeight: 'bold' as const }
	};

	return (
		<div className="container">
			<div className="stats-header">
				<h1>Placement Statistics Dashboard</h1>
				<p>Comprehensive overview of placement data and analytics</p>
			</div>

			{isLoading ? (
				<div className="loading">
					<div className="loading-spinner"></div>
					<p>Loading statistics...</p>
				</div>
			) : (
				<div className="stats-main-content">
					<div className="stats-cards-grid">
						<StatsCard
							title="Placement Rate"
							value={`${studentStats.placementPercentage}%`}
							subtitle={`${studentStats.totalPlacedStudents} out of ${studentStats.totalEligibleStudents} students`}
							icon="Target"
							trend={5.2}
							color="success"
						/>
						<StatsCard
							title="Highest CTC"
							value={`Rs.${ctcStats.highestCTCOffered}L`}
							subtitle={ctcStats.highestCTCOfferedCompany}
							icon="Money"
							trend={12.8}
							color="primary"
						/>
						<StatsCard title="Average CTC" value={`Rs.${ctcStats.avgCTC}L`} subtitle="All placed students" icon="Chart" trend={8.4} color="info" />
						<StatsCard
							title="Total Companies"
							value={companyStats.totalCompanies ?? 0}
							subtitle={`${companyStats.totalCompletedCompanies} completed`}
							icon="Building"
							trend={15.6}
							color="warning"
						/>
					</div>

					<div className="stats-charts-section">
						<div className="stats-chart-container">
							<h3>Placement Distribution</h3>
							<div className="chart-wrapper">
								<AgCharts options={placementPieChartOptions as any} />
							</div>
						</div>

						<div className="stats-chart-container">
							<h3>Company Types</h3>
							<div className="chart-wrapper">
								<AgCharts options={companyTypeBarChartOptions as any} />
							</div>
						</div>

						<div className="stats-chart-container full-width">
							<h3>CTC Statistics Overview</h3>
							<div className="chart-wrapper">
								<AgCharts options={ctcLineChartOptions as any} />
							</div>
						</div>
					</div>

					<div className="stats-detailed-sections">
						<div className="stats-section enhanced">
							<div className="stats-section-header">
								<h2>CTC Statistics</h2>
								<div className="stats-section-icon">Chart</div>
							</div>
							<div className="stats-section-content">
								<StatsSectionItem
									left="Highest CTC Offering Company"
									right={
										<div className="stats-value-group">
											<div className="stats-value-main">{ctcStats.highestCTCOfferedCompany}</div>
											<div className="stats-value-sub">Rs.{ctcStats.highestCTCOffered} LPA</div>
										</div>
									}
									icon="Trophy"
								/>
								<StatsSectionItem
									left="Student With Highest CTC"
									right={
										<div className="stats-value-group">
											<div className="stats-value-main">{ctcStats.highestCTCPlacedStudent}</div>
											<div className="stats-value-sub">{ctcStats.highestCTCPlacedCompany}</div>
											<div className="stats-value-sub">Rs.{ctcStats.highestCTCPlaced} LPA</div>
										</div>
									}
									icon="Graduate"
								/>
								<StatsSectionItem left="Total Placed Students CTC" right={`Rs.${ctcStats.totalPlacedStudentsCTC} Lakhs`} icon="Briefcase" />
								<StatsSectionItem left="Average CTC" right={`Rs.${ctcStats.avgCTC} LPA (${studentStats.totalPlacedStudents} Students)`} icon="Chart" />
							</div>
						</div>

						<div className="stats-section enhanced">
							<div className="stats-section-header">
								<h2>Company Statistics</h2>
								<div className="stats-section-icon">Factory</div>
							</div>
							<div className="stats-section-content">
								<StatsSectionItem left="Total Companies Visited" right={String(companyStats.totalCompanies ?? '')} icon="Building" />
								<StatsSectionItem left="Ongoing Companies" right={String(companyStats.totalOngoingCompanies ?? '')} icon="Clock" />
								<StatsSectionItem left="Successfully Completed" right={String(companyStats.totalCompletedCompanies ?? '')} icon="Check" />
								<StatsSectionItem left="PPO Offerings" right={String(companyStats.totalPPOs ?? '')} icon="Target" />
								<StatsSectionItem left="FTE Offerings" right={String(companyStats.totalFTEs ?? '')} icon="Briefcase" />
								<StatsSectionItem left="Internship Offerings" right={String(companyStats.totalInterns ?? '')} icon="Book" />
								<StatsSectionItem left="6M+ FTE Offerings" right={String(companyStats.total6MFTEs ?? '')} icon="Money" />
								<StatsSectionItem left="Software Companies" right={String(companyStats.totalSoftwareCompanies ?? '')} icon="Computer" />
								<StatsSectionItem left="Analyst Companies" right={String(companyStats.totalAnalystCompanies ?? '')} icon="Chart" />
								<StatsSectionItem left="Other Role Companies" right={String(companyStats.totalOthersCompanies ?? '')} icon="Tool" />
								<StatsSectionItem
									left="Top Locations"
									right={
										<div className="stats-locations">
											{companyStats.topLocations?.slice(0, 5).map((location, index) => (
												<div key={location.location} className="stats-location-item">
													<span className="location-rank">#{index + 1}</span>
													<span className="location-name">{location.location}</span>
													<span className="location-count">({location.count})</span>
												</div>
											))}
										</div>
									}
									icon="Pin"
								/>
							</div>
						</div>

						<div className="stats-section enhanced">
							<div className="stats-section-header">
								<h2>Student Statistics</h2>
								<div className="stats-section-icon">People</div>
							</div>
							<div className="stats-section-content">
								<StatsSectionItem left="Total Registered Students" right={String(studentStats.totalStudents ?? '')} icon="Note" />
								<StatsSectionItem left="Eligible Students" right={String(studentStats.totalEligibleStudents ?? '')} icon="Check" />
								<StatsSectionItem left="Placed Students" right={String(studentStats.totalPlacedStudents ?? '')} icon="Target" />
								<StatsSectionItem left="Placement Percentage" right={`${studentStats.placementPercentage}%`} icon="Chart" />
								<StatsSectionItem left="Verified Students" right={String(studentStats.totalVerifiedStudents ?? '')} icon="Check" />
								<StatsSectionItem left="Unverified Students" right={String(studentStats.totalUnverifiedStudents ?? '')} icon="Clock" />
								<StatsSectionItem left="Total Admins" right={String(studentStats.totalAdmins ?? '')} icon="Crown" />
								<StatsSectionItem left="Placement Coordinators" right={String(studentStats.totalPlacementCoordinators ?? '')} icon="Handshake" />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Stats;
