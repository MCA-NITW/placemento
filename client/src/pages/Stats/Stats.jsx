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
			setCtcStats(response.data);
		} catch (error) {
			console.log(error);
		}
	}, []);

	const getCompanyStatsData = useCallback(async () => {
		try {
			const response = await getCompanyStats();
			setCompanyStats(response.data);
		} catch (error) {
			console.log(error);
		}
	}, []);

	const getStudentStatsData = useCallback(async () => {
		try {
			const response = await getStudentStats();
			response.data.avgCTC = response.data.avgCTC.toFixed(2);
			response.data.totalPlacedStudentsCTC = response.data.totalPlacedStudentsCTC.toFixed(2);
			response.data.placementPercentage = (
				(studentStats.totalPlacedStudents * 100) /
				studentStats.totalEligibleStudents
			).toFixed(2);
			setStudentStats(response.data);
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
						<div className="stats-section-item-left">Highest CTC Offering Company: </div>
						<div className="stats-section-item-right">
							<div>{ctcStats.highestCTCOfferedCompany}</div>
							<div>{ctcStats.highestCTCOffered} LPA </div>
						</div>
					</div>
					<div className="stats-section-item">
						<div>Student With Highest CTC: </div>
						<div>{ctcStats.highestCTCPlacedStudent}</div>
					</div>
					<div className="stats-section-item">
						<div>Student With Highest CTC Company: </div>
						<div>{ctcStats.highestCTCPlacedCompany}</div>
					</div>
					<div className="stats-section-item">
						<div>Highest CTC Placed: </div>
						<div>{ctcStats.highestCTCPlaced} LPA</div>
					</div>
				</div>
				<div className="stats-section">
					<h2>Company Stats</h2>
					<div className="stats-section-item">
						<div>Total Companies: </div>
						<div>{companyStats.totalCompanies}</div>
					</div>
					<div className="stats-section-item">
						<div>Total Ongoing Companies: </div>
						<div>{companyStats.totalOngoingCompanies}</div>
					</div>
					<div className="stats-section-item">
						<div>Total Completed Companies: </div>
						<div>{companyStats.totalCompletedCompanies}</div>
					</div>
					<div className="stats-section-item">
						<div>Total PPOs: </div>
						<div>{companyStats.totalPPOs}</div>
					</div>
					<div className="stats-section-item">
						<div>Total FTEs: </div>
						<div>{companyStats.totalFTEs}</div>
					</div>
					<div className="stats-section-item">
						<div>Total Interns: </div>
						<div>{companyStats.totalInterns}</div>
					</div>
					<div className="stats-section-item">
						<div>Total 6M FTEs: </div>
						<div>{companyStats.total6MFTEs}</div>
					</div>
					<div className="stats-section-item">
						<div>Total Software Companies: </div>
						<div>{companyStats.totalSoftwareCompanies}</div>
					</div>
					<div className="stats-section-item">
						<div>Total Analyst Companies: </div>
						<div>{companyStats.totalAnalystCompanies}</div>
					</div>
					<div className="stats-section-item">
						<div>Total Others Companies: </div>
						<div>{companyStats.totalOthersCompanies}</div>
					</div>
				</div>

				<div className="stats-section">
					<h2>Student Stats</h2>
					<div className="stats-section-item">
						<div>Total Students: </div>
						<div>{studentStats.totalStudents}</div>
					</div>
					<div className="stats-section-item">
						<div>Total Eligible Students: </div>
						<div>{studentStats.totalEligibleStudents}</div>
					</div>
					<div className="stats-section-item">
						<div>Total Placed Students: </div>
						<div>{studentStats.totalPlacedStudents}</div>
					</div>
					<div className="stats-section-item">
						<div>Total Placement Percentage (Eligible): </div>
						<div>{studentStats.placementPercentage} %</div>
					</div>
					<div className="stats-section-item">
						<div>Total Placed Students CTC: </div>
						<div>{studentStats.totalPlacedStudentsCTC} Lakhs</div>
					</div>
					<div className="stats-section-item">
						<div>Average CTC: </div>
						<div>{studentStats.avgCTC} LPA</div>
					</div>
					<div className="stats-section-item">
						<div>Total Verified Students: </div>
						<div>{studentStats.totalVerifiedStudents}</div>
					</div>
					<div className="stats-section-item">
						<div>Total Unverified Students: </div>
						<div>{studentStats.totalUnverifiedStudents}</div>
					</div>
					<div className="stats-section-item">
						<div>Total Admins: </div>
						<div>{studentStats.totalAdmins}</div>
					</div>
					<div>
						<div>Total Placement Coordinators: </div>
						<div>{studentStats.totalPlacementCoordinators}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Stats;
