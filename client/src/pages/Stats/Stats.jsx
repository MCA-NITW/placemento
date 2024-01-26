import { useCallback, useEffect, useState } from 'react';
import { getCompanyStats, getCtcStats, getStudentStats } from '../../api/statsApi';
import './Stats.css';

const Stats = () => {
	const [ctcStats, setCtcStats] = useState({});
	const [companyStats, setCompanyStats] = useState({});
	const [studentStats, setStudentStats] = useState({});

	const getCtcStatsData = useCallback(async () => {
		try {
			const response = await getCtcStats();
			response.data.highestCTCOffered = response.data.highestCTCOffered.toFixed(2);
			response.data.highestCTCPlaced = response.data.highestCTCPlaced.toFixed(2);
			response.data.avgCTC = response.data.avgCTC.toFixed(2);
			response.data.totalPlacedStudentsCTC = response.data.totalPlacedStudentsCTC.toFixed(2);
			setCtcStats(response.data);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	}, []);

	const getCompanyStatsData = useCallback(async () => {
		try {
			const response = await getCompanyStats();
			setCompanyStats(response.data);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	}, []);

	const getStudentStatsData = useCallback(async () => {
		try {
			const response = await getStudentStats();
			response.data.placementPercentage = (
				(studentStats.totalPlacedStudents * 100) /
				studentStats.totalEligibleStudents
			).toFixed(2);
			setStudentStats(response.data);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	}, [studentStats.totalEligibleStudents, studentStats.totalPlacedStudents]);

	useEffect(() => {
		getCtcStatsData();
		getCompanyStatsData();
		getStudentStatsData();
	}, [getCtcStatsData, getCompanyStatsData, getStudentStatsData]);

	return (
		<div className="container">
			<h1>Stats</h1>
			<div className="stats">
				<div className="stats-section">
					<h2>CTC Stats</h2>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Highest CTC Offering Company : </div>
						<div className="stats-section-item-right">
							<div className="stats-section-item-right-header">{ctcStats.highestCTCOfferedCompany}</div>
							<div className="stats-section-item-right-child">( {ctcStats.highestCTCOffered} LPA )</div>
						</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Student With Highest CTC : </div>
						<div className="stats-section-item-right">
							<div className="stats-section-item-right-header">{ctcStats.highestCTCPlacedStudent}</div>
							<div className="stats-section-item-right-child">{ctcStats.highestCTCPlacedCompany}</div>
							<div className="stats-section-item-right-child">( {ctcStats.highestCTCPlaced} LPA )</div>
						</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">
							<div className="stats-section-item-left-header">Sum of all placed students CTCs : </div>
						</div>
						<div className="stats-section-item-right">{ctcStats.totalPlacedStudentsCTC} Lakhs</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">
							<div className="stats-section-item-left-header">Average of all placed students CTC : </div>
						</div>
						<div className="stats-section-item-right">
							<div className="stats-section-item-right-header">{ctcStats.avgCTC} LPA</div>
							<div className="stats-section-item-right-child">( {studentStats.totalPlacedStudents} Students )</div>
						</div>
					</div>
				</div>

				<div className="stats-section">
					<h2>Company Stats</h2>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Companies Visited: </div>
						<div className="stats-section-item-right">{companyStats.totalCompanies}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Ongoing Companies: </div>
						<div className="stats-section-item-right">{companyStats.totalOngoingCompanies}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Successfully Completed Companies: </div>
						<div className="stats-section-item-right">{companyStats.totalCompletedCompanies}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total PPOs Offering Companies: </div>
						<div className="stats-section-item-right">{companyStats.totalPPOs}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total FTEs Offering Companies: </div>
						<div className="stats-section-item-right">{companyStats.totalFTEs}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Intern Offering Companies: </div>
						<div className="stats-section-item-right">{companyStats.totalInterns}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total 6M + FTEs Offering Companies: </div>
						<div className="stats-section-item-right">{companyStats.total6MFTEs}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Software Role Companies: </div>
						<div className="stats-section-item-right">{companyStats.totalSoftwareCompanies}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Analyst Role Companies: </div>
						<div className="stats-section-item-right">{companyStats.totalAnalystCompanies}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Other Roles Companies: </div>
						<div className="stats-section-item-right">{companyStats.totalOthersCompanies}</div>
					</div>
				</div>

				<div className="stats-section">
					<h2>Student Stats</h2>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Registered Students: </div>
						<div className="stats-section-item-right">{studentStats.totalStudents}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Eligible Students: </div>
						<div className="stats-section-item-right">{studentStats.totalEligibleStudents}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Placed Students: </div>
						<div className="stats-section-item-right">{studentStats.totalPlacedStudents}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Placement Percentage (Eligible): </div>
						<div className="stats-section-item-right">{studentStats.placementPercentage} %</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Verified Students: </div>
						<div className="stats-section-item-right">{studentStats.totalVerifiedStudents}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Unverified Students: </div>
						<div className="stats-section-item-right">{studentStats.totalUnverifiedStudents}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Admins: </div>
						<div className="stats-section-item-right">{studentStats.totalAdmins}</div>
					</div>
					<div className="stats-section-item">
						<div className="stats-section-item-left">Total Placement Coordinators: </div>
						<div className="stats-section-item-right">{studentStats.totalPlacementCoordinators}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Stats;
