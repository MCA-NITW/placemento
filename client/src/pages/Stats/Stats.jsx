import porptypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { getCompanyStats, getCtcStats, getStudentStats } from '../../api/statsApi';
import './Stats.css';

const StatsSectionItem = ({ left, right }) => (
	<div className="stats-section-item">
		<div className="stats-section-item-left">{left}</div>
		<div className="stats-section-item-right">{right}</div>
	</div>
);

StatsSectionItem.propTypes = {
	left: porptypes.string.isRequired,
	right: porptypes.node.isRequired,
};

const Stats = () => {
	const [ctcStats, setCtcStats] = useState({});
	const [companyStats, setCompanyStats] = useState({});
	const [studentStats, setStudentStats] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = useCallback(async () => {
		try {
			const [ctcResponse, companyResponse, studentResponse] = await Promise.all([
				getCtcStats(),
				getCompanyStats(),
				getStudentStats(),
			]);

			const ctcData = ctcResponse.data;
			ctcData.highestCTCOffered = ctcData.highestCTCOffered.toFixed(2);
			ctcData.highestCTCPlaced = ctcData.highestCTCPlaced.toFixed(2);
			ctcData.avgCTC = ctcData.avgCTC.toFixed(2);
			ctcData.totalPlacedStudentsCTC = ctcData.totalPlacedStudentsCTC.toFixed(2);

			const studentData = studentResponse.data;
			studentData.placementPercentage = (
				(studentData.totalPlacedStudents * 100) /
				studentData.totalEligibleStudents
			).toFixed(2);

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

	return (
		<div className="container">
			<h1>Stats</h1>
			{isLoading ? (
				<div className="loading">
					<div className="loading-spinner"></div>
				</div>
			) : (
				<div className="stats">
					<div className="stats-section">
						<h2>CTC Stats</h2>
						<StatsSectionItem
							left="Highest CTC Offering Company :"
							right={
								<>
									<div className="stats-section-item-right-header">{ctcStats.highestCTCOfferedCompany}</div>
									<div className="stats-section-item-right-child">( {ctcStats.highestCTCOffered} LPA )</div>
								</>
							}
						/>
						<StatsSectionItem
							left="Student With Highest CTC :"
							right={
								<>
									<div className="stats-section-item-right-header">{ctcStats.highestCTCPlacedStudent}</div>
									<div className="stats-section-item-right-child">{ctcStats.highestCTCPlacedCompany}</div>
									<div className="stats-section-item-right-child">( {ctcStats.highestCTCPlaced} LPA )</div>
								</>
							}
						/>
						<StatsSectionItem
							left="Sum of all placed students CTCs :"
							right={<>{ctcStats.totalPlacedStudentsCTC} Lakhs</>}
						/>
						<StatsSectionItem
							left="Average of all placed students CTC :"
							right={
								<>
									{ctcStats.avgCTC} LPA ({studentStats.totalPlacedStudents} Students)
								</>
							}
						/>
					</div>

					<div className="stats-section">
						<h2>Company Stats</h2>
						<StatsSectionItem left="Total Companies Visited:" right={companyStats.totalCompanies} />
						<StatsSectionItem left="Total Ongoing Companies:" right={companyStats.totalOngoingCompanies} />
						<StatsSectionItem
							left="Total Successfully Completed Companies:"
							right={companyStats.totalCompletedCompanies}
						/>
						<StatsSectionItem left="Total PPOs Offering Companies:" right={companyStats.totalPPOs} />
						<StatsSectionItem left="Total FTEs Offering Companies:" right={companyStats.totalFTEs} />
						<StatsSectionItem left="Total Intern Offering Companies:" right={companyStats.totalInterns} />
						<StatsSectionItem left="Total 6M + FTEs Offering Companies:" right={companyStats.total6MFTEs} />
						<StatsSectionItem left="Total Software Role Companies:" right={companyStats.totalSoftwareCompanies} />
						<StatsSectionItem left="Total Analyst Role Companies:" right={companyStats.totalAnalystCompanies} />
						<StatsSectionItem left="Total Other Roles Companies:" right={companyStats.totalOthersCompanies} />
					</div>

					<div className="stats-section">
						<h2>Student Stats</h2>
						<StatsSectionItem left="Total Registered Students:" right={studentStats.totalStudents} />
						<StatsSectionItem left="Total Eligible Students:" right={studentStats.totalEligibleStudents} />
						<StatsSectionItem left="Total Placed Students:" right={studentStats.totalPlacedStudents} />
						<StatsSectionItem
							left="Total Placement Percentage (Eligible):"
							right={<>{studentStats.placementPercentage} %</>}
						/>
						<StatsSectionItem left="Total Verified Students:" right={studentStats.totalVerifiedStudents} />
						<StatsSectionItem left="Total Unverified Students:" right={studentStats.totalUnverifiedStudents} />
						<StatsSectionItem left="Total Admins:" right={studentStats.totalAdmins} />
						<StatsSectionItem left="Total Placement Coordinators:" right={studentStats.totalPlacementCoordinators} />
					</div>
				</div>
			)}
		</div>
	);
};

export default Stats;
