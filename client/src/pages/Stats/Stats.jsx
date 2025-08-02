import { AgCharts } from 'ag-charts-react';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { getCompanyStats, getCtcStats, getStudentStats } from '../../api/statsApi';
import './Stats.css';

const StatsSectionItem = ({ left, right, icon }) => (
	<div className="stats-section-item">
		<div className="stats-section-item-left">
			{icon && <span className="stats-icon">{icon}</span>}
			{left}
		</div>
		<div className="stats-section-item-right">{right}</div>
	</div>
);

StatsSectionItem.propTypes = {
	left: PropTypes.string.isRequired,
	right: PropTypes.node.isRequired,
	icon: PropTypes.string
};

const StatsCard = ({ title, value, subtitle, icon, trend, color = 'primary' }) => (
	<div className={`stats-card stats-card-${color}`}>
		<div className="stats-card-icon">{icon}</div>
		<div className="stats-card-content">
			<h3 className="stats-card-value">{value}</h3>
			<p className="stats-card-title">{title}</p>
			{subtitle && <span className="stats-card-subtitle">{subtitle}</span>}
			{trend && (
				<div className={`stats-card-trend ${trend > 0 ? 'positive' : 'negative'}`}>
					{trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
				</div>
			)}
		</div>
	</div>
);

StatsCard.propTypes = {
	title: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	subtitle: PropTypes.string,
	icon: PropTypes.string.isRequired,
	trend: PropTypes.number,
	color: PropTypes.string
};

const Stats = () => {
	const [ctcStats, setCtcStats] = useState({});
	const [companyStats, setCompanyStats] = useState({});
	const [studentStats, setStudentStats] = useState({});
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

	// Chart configurations
	const placementPieChartOptions = {
		data: [
			{ category: 'Placed Students', value: parseInt(studentStats.totalPlacedStudents) || 0 },
			{
				category: 'Unplaced Students',
				value: (parseInt(studentStats.totalEligibleStudents) || 0) - (parseInt(studentStats.totalPlacedStudents) || 0)
			}
		],
		series: [
			{
				type: 'pie',
				angleKey: 'value',
				labelKey: 'category',
				fills: ['#ffcc66', '#ff6666'],
				strokes: ['#ffcc66', '#ff6666'],
				calloutColors: ['#ffcc66', '#ff6666'],
				sectorLabelKey: 'value',
				calloutLabelKey: 'category'
			}
		],
		background: {
			fill: 'transparent'
		},
		title: {
			text: 'Student Placement Overview',
			color: '#ffcc66',
			fontSize: 18,
			fontWeight: 'bold'
		},
		legend: {
			position: 'bottom',
			item: {
				label: {
					color: '#fff'
				}
			}
		}
	};

	const companyTypeBarChartOptions = {
		data: [
			{ type: 'Software', count: parseInt(companyStats.totalSoftwareCompanies) || 0 },
			{ type: 'Analyst', count: parseInt(companyStats.totalAnalystCompanies) || 0 },
			{ type: 'Others', count: parseInt(companyStats.totalOthersCompanies) || 0 }
		],
		series: [
			{
				type: 'bar',
				xKey: 'type',
				yKey: 'count',
				fill: '#ffcc66',
				stroke: '#ffcc66'
			}
		],
		axes: [
			{
				type: 'category',
				position: 'bottom',
				label: {
					color: '#fff'
				},
				line: {
					color: '#ffcc66'
				}
			},
			{
				type: 'number',
				position: 'left',
				label: {
					color: '#fff'
				},
				line: {
					color: '#ffcc66'
				}
			}
		],
		background: {
			fill: 'transparent'
		},
		title: {
			text: 'Company Types Distribution',
			color: '#ffcc66',
			fontSize: 18,
			fontWeight: 'bold'
		}
	};

	const ctcLineChartOptions = {
		data: [
			{ metric: 'Highest CTC Offered', value: parseFloat(ctcStats.highestCTCOffered) || 0 },
			{ metric: 'Highest CTC Placed', value: parseFloat(ctcStats.highestCTCPlaced) || 0 },
			{ metric: 'Average CTC', value: parseFloat(ctcStats.avgCTC) || 0 },
			{ metric: 'Total Placed CTC', value: parseFloat(ctcStats.totalPlacedStudentsCTC) || 0 }
		],
		series: [
			{
				type: 'line',
				xKey: 'metric',
				yKey: 'value',
				stroke: '#ffcc66',
				marker: {
					fill: '#ffcc66',
					stroke: '#ffcc66',
					size: 8
				}
			}
		],
		axes: [
			{
				type: 'category',
				position: 'bottom',
				label: {
					color: '#fff',
					rotation: -45
				},
				line: {
					color: '#ffcc66'
				}
			},
			{
				type: 'number',
				position: 'left',
				label: {
					color: '#fff',
					formatter: ({ value }) => `₹${value}L`
				},
				line: {
					color: '#ffcc66'
				}
			}
		],
		background: {
			fill: 'transparent'
		},
		title: {
			text: 'CTC Statistics Overview',
			color: '#ffcc66',
			fontSize: 18,
			fontWeight: 'bold'
		}
	};

	return (
		<div className="container">
			<div className="stats-header">
				<h1>📊 Placement Statistics Dashboard</h1>
				<p>Comprehensive overview of placement data and analytics</p>
			</div>

			{isLoading ? (
				<div className="loading">
					<div className="loading-spinner"></div>
					<p>Loading statistics...</p>
				</div>
			) : (
				<div className="stats-main-content">
					{/* Key Metrics Cards */}
					<div className="stats-cards-grid">
						<StatsCard
							title="Placement Rate"
							value={`${studentStats.placementPercentage}%`}
							subtitle={`${studentStats.totalPlacedStudents} out of ${studentStats.totalEligibleStudents} students`}
							icon="🎯"
							trend={5.2}
							color="success"
						/>
						<StatsCard
							title="Highest CTC"
							value={`₹${ctcStats.highestCTCOffered}L`}
							subtitle={ctcStats.highestCTCOfferedCompany}
							icon="💰"
							trend={12.8}
							color="primary"
						/>
						<StatsCard title="Average CTC" value={`₹${ctcStats.avgCTC}L`} subtitle="All placed students" icon="📈" trend={8.4} color="info" />
						<StatsCard
							title="Total Companies"
							value={companyStats.totalCompanies}
							subtitle={`${companyStats.totalCompletedCompanies} completed`}
							icon="🏢"
							trend={15.6}
							color="warning"
						/>
					</div>

					{/* Charts Section */}
					<div className="stats-charts-section">
						<div className="stats-chart-container">
							<h3>📊 Placement Distribution</h3>
							<div className="chart-wrapper">
								<AgCharts options={placementPieChartOptions} />
							</div>
						</div>

						<div className="stats-chart-container">
							<h3>🏢 Company Types</h3>
							<div className="chart-wrapper">
								<AgCharts options={companyTypeBarChartOptions} />
							</div>
						</div>

						<div className="stats-chart-container full-width">
							<h3>💹 CTC Statistics Overview</h3>
							<div className="chart-wrapper">
								<AgCharts options={ctcLineChartOptions} />
							</div>
						</div>
					</div>

					{/* Detailed Stats Sections */}
					<div className="stats-detailed-sections">
						<div className="stats-section enhanced">
							<div className="stats-section-header">
								<h2>💰 CTC Statistics</h2>
								<div className="stats-section-icon">📊</div>
							</div>
							<div className="stats-section-content">
								<StatsSectionItem
									left="Highest CTC Offering Company"
									right={
										<div className="stats-value-group">
											<div className="stats-value-main">{ctcStats.highestCTCOfferedCompany}</div>
											<div className="stats-value-sub">₹{ctcStats.highestCTCOffered} LPA</div>
										</div>
									}
									icon="🏆"
								/>
								<StatsSectionItem
									left="Student With Highest CTC"
									right={
										<div className="stats-value-group">
											<div className="stats-value-main">{ctcStats.highestCTCPlacedStudent}</div>
											<div className="stats-value-sub">{ctcStats.highestCTCPlacedCompany}</div>
											<div className="stats-value-sub">₹{ctcStats.highestCTCPlaced} LPA</div>
										</div>
									}
									icon="🎓"
								/>
								<StatsSectionItem left="Total Placed Students CTC" right={`₹${ctcStats.totalPlacedStudentsCTC} Lakhs`} icon="💼" />
								<StatsSectionItem left="Average CTC" right={`₹${ctcStats.avgCTC} LPA (${studentStats.totalPlacedStudents} Students)`} icon="📊" />
							</div>
						</div>

						<div className="stats-section enhanced">
							<div className="stats-section-header">
								<h2>🏢 Company Statistics</h2>
								<div className="stats-section-icon">🏭</div>
							</div>
							<div className="stats-section-content">
								<StatsSectionItem left="Total Companies Visited" right={companyStats.totalCompanies} icon="🏢" />
								<StatsSectionItem left="Ongoing Companies" right={companyStats.totalOngoingCompanies} icon="⏳" />
								<StatsSectionItem left="Successfully Completed" right={companyStats.totalCompletedCompanies} icon="✅" />
								<StatsSectionItem left="PPO Offerings" right={companyStats.totalPPOs} icon="🎯" />
								<StatsSectionItem left="FTE Offerings" right={companyStats.totalFTEs} icon="💼" />
								<StatsSectionItem left="Internship Offerings" right={companyStats.totalInterns} icon="📚" />
								<StatsSectionItem left="6M+ FTE Offerings" right={companyStats.total6MFTEs} icon="💰" />
								<StatsSectionItem left="Software Companies" right={companyStats.totalSoftwareCompanies} icon="💻" />
								<StatsSectionItem left="Analyst Companies" right={companyStats.totalAnalystCompanies} icon="📈" />
								<StatsSectionItem left="Other Role Companies" right={companyStats.totalOthersCompanies} icon="🔧" />
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
									icon="📍"
								/>
							</div>
						</div>

						<div className="stats-section enhanced">
							<div className="stats-section-header">
								<h2>🎓 Student Statistics</h2>
								<div className="stats-section-icon">👥</div>
							</div>
							<div className="stats-section-content">
								<StatsSectionItem left="Total Registered Students" right={studentStats.totalStudents} icon="📝" />
								<StatsSectionItem left="Eligible Students" right={studentStats.totalEligibleStudents} icon="✅" />
								<StatsSectionItem left="Placed Students" right={studentStats.totalPlacedStudents} icon="🎯" />
								<StatsSectionItem left="Placement Percentage" right={`${studentStats.placementPercentage}%`} icon="📊" />
								<StatsSectionItem left="Verified Students" right={studentStats.totalVerifiedStudents} icon="✅" />
								<StatsSectionItem left="Unverified Students" right={studentStats.totalUnverifiedStudents} icon="⏳" />
								<StatsSectionItem left="Total Admins" right={studentStats.totalAdmins} icon="👑" />
								<StatsSectionItem left="Placement Coordinators" right={studentStats.totalPlacementCoordinators} icon="🤝" />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Stats;
